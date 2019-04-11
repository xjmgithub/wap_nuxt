<template>
    <div class="wrapper">
        <div class="content">
            <div class="pull_refresh">
                <div v-show="!loadHistoryState" style="padding-top:1rem;">
                    <span v-show="!historyEnd" class="refresh_text">Pull down to see more history</span>
                    <span v-show="historyEnd" class="refresh_text">No more history</span>
                </div>
                <div>
                    <img v-show="loadHistoryState" class="refresh_img" src="~assets/img/spinner.gif">
                </div>
            </div>
            <template v-for="(item,index) in renderQueue">
                <questionListTpl v-if="item.tpl=='list'" :key="index" :dtype="item.type" :list="item.contents" @ask="askQuest"/>
                <div v-if="item.tpl=='order'" :key="index" class="order-contain">
                    <orderBlockTpl :order="item.order"/>
                </div>
                <askTpl v-if="item.tpl=='ask'||item.tpl=='chatask'" :key="index" :question="item.name"/>
                <answerTpl v-if="item.tpl=='chatanswer' || item.tpl=='welcome'" :key="index" :answer="item.name"/>
                <contentTpl
                    v-if="item.tpl=='content'"
                    :key="index"
                    :noevaluate="item.noEvaluate"
                    :service-record="item.serviceRecord"
                    :question="item.questionId"
                    :content="item.content"
                    @imgloaded="refreshScroll"
                />
                <div v-if="item.tpl=='tips'" :key="index" class="tips">
                    <div>{{item.text}}</div>
                </div>
                <evaluate v-if="item.tpl=='evaluate'" :key="index" :service-record="item.serviceRecord"/>
                <msgTpl v-if="item.tpl=='message'" :key="index" :order="item" :replied="item.replied" style="padding-top:0.5rem;"/>
            </template>
        </div>
        <div v-show="showLiveChatBtn" class="live-chat">
            <div v-show="connectState==0" class="btn" @click="connectLiveChat">LIVE CHAT</div>
            <div v-show="connectState==1" class="btn">Connecting …</div>
        </div>
        <div v-show="showLiveChatBtn&&connectState==2" class="live-chat-input">
            <div class="user-control-w">
                <div class="user-edit-w">
                    <textarea v-model="chatMsg" class="form-control user-edit" placeholder="Enter your question"/>
                </div>
                <div class="user-submit-w">
                    <button type="submit" class="user-submit-btn" @click="sendChatMsg">SEND</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
import questionListTpl from '~/components/faq/questionListTpl'
import orderBlockTpl from '~/components/faq/order'
import askTpl from '~/components/faq/askTpl'
import answerTpl from '~/components/faq/answerTpl'
import contentTpl from '~/components/faq/contentTpl'
import msgTpl from '~/components/faq/message'
import evaluate from '~/components/faq/evaluate'
import autosize from 'autosize'
import { toNativePage, getFaqAnswerLabel } from '~/functions/utils'
export default {
    layout: 'base',
    components: {
        questionListTpl,
        orderBlockTpl,
        askTpl,
        answerTpl,
        contentTpl,
        msgTpl,
        evaluate
    },
    data() {
        return {
            isLogin: this.$store.state.user.type || false,
            user: this.$store.state.user,
            config_id: this.$route.query.config_id || 0,
            entrance_id: this.$route.query.entrance_id,
            categoryId: 183, // default others
            serviceRecord: null,
            renderQueue: [],
            loadHistoryState: false, // 加载历史记录状态
            bscroll: null,
            connectState: 0,
            chatMsg: '',
            chatPullTimer: null, // live chat 定时拉取客服回复定时器,
            nextPosition: 0,
            historyPage: 1,
            minHistoryId: '',
            historyEnd: false,
            chatLink: null,
            messageShowed: [] // 记录已经展示出来的
        }
    },
    asyncData({ app: { $axios }, store, query }) {
        $axios.setHeader('token', store.state.token)
        return $axios
            .get(`/ocs/v1/faqs/faqConfigByAreaId?areaId=${store.state.country.id}&entranceId=${query.entrance_id}`)
            .then(res => {
                return {
                    showLiveChatBtn: res.data.code === 200 && res.data.data.shortcuts_codes.indexOf(1) >= 0
                }
            })
            .catch(() => {
                return { showLiveChatBtn: false }
            })
    },
    mounted() {
        const serviceModuleId = sessionStorage.getItem('serviceModuleId')
        const questions = JSON.parse(sessionStorage.getItem('faq_question'))
        const morefaqs = sessionStorage.getItem('morefaqs')

        const addMsg = sessionStorage.getItem('addMsg')
        const _this = this

        this.renderFromCacheQueue()

        this.$nextTick(() => {
            const liveChatBtnHeight = document.querySelector('.live-chat').offsetHeight
            document.querySelector('.wrapper').style.height = window.innerHeight - liveChatBtnHeight + 'px'

            this.bscroll = new BScroll('.wrapper', {
                pullDownRefresh: {
                    threshold: 80,
                    stop: 40
                },
                startY: 0,
                bounce: {
                    top: true,
                    bottom: false,
                    left: false,
                    right: false
                },
                click: true,
                tap: true,
                observeDOM: false
            })
            this.bscroll.on('pullingDown', function() {
                _this.loadHistory()
            })
        })

        // 创建服务记录
        this.createServiceRecord(6, () => {
            this.getLeaveMessage()

            if (addMsg) {
                // todo check
                this.addOperate(
                    Object.assign({}, JSON.parse(addMsg), {
                        tpl: 'message',
                        replied: false
                    })
                )
                sessionStorage.removeItem('addMsg')
            } else if (questions) {
                // 单个问题
                this.askQuest(questions, 1, 1)
            } else if (morefaqs) {
                // MORE FAQS
                this.addOperate({
                    tpl: 'ask',
                    name: 'more questions'
                })

                this.renderOrder()

                this.$axios.get(`/ocs/v1/moreFaqs?serviceModuleId=${serviceModuleId}`).then(res => {
                    if (res.data.code === 200) {
                        const list = []
                        res.data.data.forEach((item, index) => {
                            list.push({
                                id: item.id,
                                name: item.thema
                            })
                        })
                        this.addOperate(
                            Object.assign({}, res.data.data, {
                                operator: 0, // 0 客服， 1 用户
                                tpl: 'list', // list , content, order
                                pId: '-99',
                                type: 1,
                                contents: list
                            })
                        )
                    }
                })
            } else {
                // 默认根目录进入
                this.addOperate({
                    tpl: 'welcome',
                    name: 'Welcome to StarTimes Online Service.'
                })

                this.$axios.get(`/ocs/v1/faqs/directory/${this.$store.state.country.id}`).then(res => {
                    if (res.data.code === 200) {
                        this.categoryId = res.data.data
                        this.getfaqDirectory(res.data.data)
                    }
                })
            }
        })
    },
    methods: {
        getLeaveMessage() {
            this.$route.path == '/hybrid/faq/customerService' &&
                setTimeout(this.getLeaveMessage, 10 * 1000) &&
                this.$axios
                    .get(`/csms-service/v1/get-standard-leaving-message-record`, {
                        headers: {
                            'x-clientType': 1,
                            'x-appVersion': '5300'
                        }
                    })
                    .then(res => {
                        if (res.data && res.data.length > 0) {
                            res.data.forEach(item => {
                                if (this.messageShowed.indexOf(item.id) < 0) {
                                    this.messageShowed.push(item.id)
                                    this.addOperate(
                                        Object.assign({}, item, {
                                            tpl: 'message',
                                            replied: true
                                        })
                                    )
                                }
                            })
                        }
                    })
        },
        getfaqDirectory(id) {
            id &&
                this.$axios.get(`/ocs/v1/faqs/category/${id}?config_id=${this.config_id}`).then(res => {
                    if (res.data.code === 200) {
                        this.addOperate(
                            Object.assign({}, res.data.data, {
                                tpl: 'list'
                            })
                        )
                    }
                })
        },
        askQuest(item, type, showOrder) {
            this.addOperate(
                Object.assign({}, item, {
                    tpl: 'ask',
                    name: item.thema || item.name
                })
            )

            showOrder && this.renderOrder()

            if (type === 1) {
                this.getAnswer(item.id)
            } else {
                this.getfaqDirectory(item.id)
            }
            this.sendEvLog({
                category: 'onlineService',
                action: `answer_${this.entrance_id || ''}_click`,
                label: getFaqAnswerLabel.call(this, item.id) + '_2',
                value: 1
            })
        },
        getAnswer(id) {
            this.$axios.get(`/ocs/v1/faqs/answer/${id}`).then(res => {
                if (res.data.code === 200) {
                    this.addOperate(
                        Object.assign({}, res.data.data, {
                            tpl: 'content',
                            serviceRecord: this.serviceRecord,
                            questionId: id
                        })
                    )
                }
            })
        },
        renderOrder() {
            const order = JSON.parse(sessionStorage.getItem('orderMsg'))
            if (order && order.order_type) {
                this.addOperate({
                    tpl: 'order',
                    order: order
                })
            }
        },
        createServiceRecord(type, callback) {
            this.$axios.post(`/css/v1/service/start?type=${type || 6}&anonymity=0`).then(res => {
                if (res.data.code === 200) {
                    this.serviceRecord = res.data.data
                    if (!this.isLogin) {
                        let cacheRecord = localStorage.getItem('serviceRecords')
                        if (cacheRecord) {
                            cacheRecord = JSON.parse(cacheRecord)
                            if (cacheRecord.indexOf(this.serviceRecord) < 0) {
                                cacheRecord.push(this.serviceRecord)
                            }
                        } else {
                            cacheRecord = [this.serviceRecord]
                        }
                        localStorage.setItem('serviceRecords', JSON.stringify(cacheRecord))
                    }
                    if (callback) callback()
                }
            })
        },
        refreshScroll() {
            this.$nextTick(() => {
                this.bscroll.refresh()
            })
        },
        addOperate(obj, send) {
            if (obj && obj.tpl) {
                this.renderQueue.push(obj)
                this.updateCacheQueue()
                this.refreshScroll()
                this.scrollToBottom()

                // 发送历史记录
                let serviceInfo = ''
                let operator = 1 // 用户发起
                if (obj.tpl === 'list') {
                    serviceInfo = 'faqlist-'
                    obj.contents.forEach(item => {
                        serviceInfo += item.name + ' | '
                    })
                } else if (obj.tpl === 'ask' || obj.tpl === 'chatask') {
                    serviceInfo = 'faqask-' + obj.name
                } else if (obj.tpl === 'order') {
                    serviceInfo = 'faqorder-' + obj.order.order_type
                } else if (obj.tpl === 'content') {
                    serviceInfo = 'faqanswer-' + obj.content
                } else if (obj.tpl === 'chatanswer' || obj.tpl === 'welcome') {
                    serviceInfo = 'chatanswer-' + obj.name
                    operator = 2 // 客服发起
                } else if (obj.tpl === 'tips') {
                    return false
                }
                this.$axios
                    .post('/css/v1/service/history', {
                        service_type: this.connectState == 2 ? 3 : 1, // TODO
                        service_group_id: this.serviceRecord,
                        service_state: 2,
                        remark: JSON.stringify(obj),
                        service_info: serviceInfo,
                        operator: operator
                    })
                    .then(res => {
                        if (res.data.code === 200) {
                            if (!this.isLogin) {
                                // 未登录状态缓存操作历史
                                let cacheHisory = JSON.parse(localStorage.getItem('historys'))
                                if (cacheHisory) {
                                    cacheHisory = JSON.parse(cacheHisory)
                                    if (cacheHisory.indexOf(res.data.data) < 0) {
                                        cacheHisory.push(res.data.data)
                                    }
                                } else {
                                    cacheHisory = [res.data.data]
                                }
                                localStorage.setItem('historys', JSON.stringify(cacheHisory))
                            }

                            // 最小historyId记录
                            if (!this.minHistoryId) {
                                this.minHistoryId = res.data.data
                            } else if (res.data.data < this.minHistoryId) {
                                this.minHistoryId = res.data.data
                            }

                            // 如果是回答则重新创建一条服务记录
                            if (obj.tpl === 'content') {
                                this.createServiceRecord()
                            }
                        }
                    })
            }
        },
        updateCacheQueue() {
            !this.isLogin && localStorage.setItem('renderQueue', JSON.stringify(this.renderQueue))
        },
        renderFromCacheQueue() {
            const renderQueue = JSON.parse(localStorage.getItem('renderQueue'))
            const historys = JSON.parse(localStorage.getItem('historys'))
            const serviceIds = JSON.parse(localStorage.getItem('serviceRecords'))
            if (
                !this.isLogin ||
                !renderQueue ||
                !historys ||
                !serviceIds ||
                renderQueue.length <= 0 ||
                historys.length <= 0 ||
                serviceIds.length <= 0
            ) {
                return false
            }

            historys.forEach(item => {
                if (this.minHistoryId) {
                    if (item < this.minHistoryId) {
                        this.minHistoryId = item
                    }
                } else {
                    this.minHistoryId = item
                }
            })

            this.$axios.post(`/css/v1/history/updateUserId?historyIds=${historys.join(',')}&serviceIds=${serviceIds.join(',')}`).then(res => {
                if (res.data.code === 200) {
                    localStorage.removeItem('renderQueue')
                    localStorage.removeItem('serviceRecords')
                    localStorage.removeItem('historys')
                }
            })
        },
        loadHistory() {
            if (this.historyEnd) return
            this.loadHistoryState = true
            const minHistoryId = this.minHistoryId || 999999999
            this.$axios.get(`/css/v1/history/app?pageSize=10&pageNum=${this.historyPage}&minId=${minHistoryId}`).then(res => {
                if (res.data.code === 200 && res.data.data.rows.length > 0) {
                    this.historyPage++
                    const rows = res.data.data.rows.sort((a, b) => {
                        return a.id - b.id
                    })
                    rows.reverse().forEach(item => {
                        const data = JSON.parse(item.remark)

                        // 历史记录里的答案不可评价
                        if (data.tpl === 'content') {
                            data.noEvaluate = true
                        }
                        this.renderQueue.unshift(data)
                    })
                } else {
                    this.historyEnd = true
                }

                this.loadHistoryState = false
                this.bscroll.finishPullDown()
                this.$nextTick(() => {
                    this.bscroll.refresh()
                })
            })
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const h1 = document.querySelector('.wrapper').offsetHeight
                const h2 = document.querySelector('.content').offsetHeight
                this.bscroll.scrollTo(0, h1 - h2, 300)
            })
        },
        connectLiveChat() {
            if (!this.isLogin) {
                if (this.$store.state.appType === 1) {
                    toNativePage('com.star.mobile.video.account.LoginActivity')
                } else if (this.$store.state.appType === 2) {
                    toNativePage('startimes://login')
                } else {
                    this.$route.push('/hybrid/account/login')
                }
                return false
            }

            this.connectState = 1
            this.$axios
                .post('/genesys-proxy/v1/chats', {
                    emailAddress: this.user.id,
                    nickname: this.user.id,
                    subject: 'app live chat',
                    tenantName: 'Resources',
                    userData: {
                        key1: this.$store.state.country.country,
                        key2: 'value2'
                    }
                })
                .then(res => {
                    if (res.data.statusCode === 0) {
                        this.chatLink = res.data
                        this.$axios
                            .post(`/genesys-proxy/v1/chats/${this.chatLink.chatId}/messages`, {
                                alias: this.chatLink.alias,
                                operationName: 'GetChat',
                                secureKey: this.chatLink.secureKey,
                                tenantName: 'Resources',
                                userId: this.chatLink.userId
                            })
                            .then(res => {
                                if (res.data.statusCode === 0 && !res.data.chatEnded) {
                                    this.connectState = 2 // BUTTON 变成输入框
                                    autosize(document.querySelectorAll('textarea.form-control'))

                                    this.chatPullTimer = window.setInterval(() => {
                                        this.pullReply()
                                    }, 5000)
                                    this.nextPosition = res.data.nextPosition

                                    this.createServiceRecord(1, () => {
                                        this.addOperate({
                                            tpl: 'chatanswer',
                                            name: 'Hello! How can I help you?'
                                        })
                                    })
                                } else {
                                    this.createServiceRecord(1)
                                    this.connectLiveChat()
                                }
                            })
                    } else if (res.data.statusCode === -1) {
                        // TODO 是否要只显示一次
                        this.addOperate({
                            text: 'Working time(7:00–20:00) Agents are only available during working hours (7am~8pm).',
                            tpl: 'tips'
                        })
                    } else {
                        this.addOperate({
                            text: 'Connect fail',
                            tpl: 'tips'
                        })
                    }
                })
        },
        sendChatMsg() {
            const msg = this.chatMsg
                .replace(/\r\n/g, '<br/>')
                .replace(/\n/g, '<br/>')
                .replace(/\s/g, ' ')
                .trim()
            if (msg !== '') {
                this.addOperate({
                    tpl: 'chatask',
                    name: msg
                })
                this.chatMsg = ''
                this.$nextTick(() => {
                    // 重置输入框的高
                    autosize.update(document.querySelectorAll('textarea.form-control'))
                })

                this.$axios
                    .post(`/genesys-proxy/v1/chats/${this.chatLink.chatId}`, {
                        alias: this.chatLink.alias,
                        secureKey: this.chatLink.secureKey,
                        tenantName: 'Resources',
                        userId: this.chatLink.userId,
                        operationName: 'SendMessage',
                        text: msg
                    })
                    .then(res => {
                        if (res.data.statusCode !== 0 || res.data.chatEnded) {
                            this.addOperate({
                                text: 'Sending Failure',
                                tpl: 'tips'
                            })
                        }
                    })
                    .catch(() => {
                        this.addOperate({
                            text: 'Sending Failure',
                            tpl: 'tips'
                        })
                    })
            }
        },
        pullReply() {
            this.$axios
                .post(`/genesys-proxy/v1/chats/${this.chatLink.chatId}/messages`, {
                    alias: this.chatLink.alias,
                    operationName: 'GetChat',
                    secureKey: this.chatLink.secureKey,
                    tenantName: 'Resources',
                    userId: this.chatLink.userId,
                    transcriptPosition: this.nextPosition
                })
                .then(res => {
                    if (res.data.statusCode === 0 && !res.data.chatEnded) {
                        this.nextPosition = res.data.nextPosition
                        const messages = res.data.messages
                        if (messages.length > 0) {
                            messages.forEach(item => {
                                if (item.from.type === 'Agent' && item.type === 'Message' && item.text) {
                                    this.addOperate({
                                        tpl: 'chatanswer',
                                        name: item.text
                                    })
                                }
                                // if (
                                //     item.from.type === 'Client' &&
                                //     item.type === 'Message' &&
                                //     item.text
                                // ) {
                                //     this.addOperate({
                                //         tpl: 'chatask',
                                //         name: item.text
                                //     })
                                // }
                            })
                        }
                    } else if (res.data.statusCode === -1) {
                        this.addOperate({
                            text: 'Working time(7:00–20:00) Agents are only available during working hours (7am~8pm).',
                            tpl: 'tips'
                        })
                        window.clearInterval(this.chatPullTimer)
                        this.endChat()
                    } else {
                        this.addOperate({
                            text: 'Disconnected',
                            tpl: 'tips'
                        })
                        window.clearInterval(this.chatPullTimer)
                        this.endChat()
                    }
                })
        },
        endChat() {
            this.renderQueue.push({
                tpl: 'evaluate',
                serviceRecord: this.serviceRecord
            })
            // BUTTON 变成输入框
            this.connectState = 0
            // 创建新服务记录
            this.createServiceRecord(6)
        }
    },
    head() {
        return {
            title: 'Customer Service'
        }
    }
}
</script>
<style lang="less">
@import '~assets/less/faq/common.less';
</style>
<style lang="less" scoped>
.wrapper {
    overflow: hidden;
    background: #eeeeee;
    .content {
        min-height: 101%;
        padding-bottom: 1rem;
    }
}
.order-contain {
    box-shadow: 0px 1px 3px 1px #dddddd;
    border-radius: 5px;
    width: 95%;
    margin: 1rem 2.5% 0 2.5%;
    background: #fff;
}
</style>
