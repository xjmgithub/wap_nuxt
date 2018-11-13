<template>
    <div id="wrapper">
        <div class="content" style="min-height:101vh">
            <div class="pull_refresh">
                <div style="padding-top:1rem;" v-show="!loadHistoryState">
                    <span class="refresh_text" v-show="!historyEnd">Pull down to see more history</span>
                    <span class="refresh_text" v-show="historyEnd">No more history</span>
                </div>
                <div>
                    <img class="refresh_img" v-show="loadHistoryState" src="~/assets/img/spinner.gif" />
                </div>
            </div>
            <template v-for="(item,index) in renderQueue">
                <questionListTpl v-if="item.tpl=='list'" :key="index" :dtype="item.type" :list="item.contents" @ask="askQuest"></questionListTpl>
                <orderBlockTpl v-if="item.tpl=='order'" :key="index" :order="item.order"></orderBlockTpl>
                <askTpl v-if="item.tpl=='ask'||item.tpl=='chatask'" :key="index" :question="item.name"></askTpl>
                <answerTpl v-if="item.tpl=='chatanswer' || item.tpl=='welcome'" :key="index" :answer="item.name"></answerTpl>
                <contentTpl v-if="item.tpl=='content'" :key="index" :content="item.content"></contentTpl>
                <div v-if="item.tpl=='tips'" :key="index" class="tips">
                    <div>{{item.text}}</div>
                </div>
            </template>
            <msgTpl v-show="false"></msgTpl>
            <evaluate v-show="false"></evaluate>
        </div>
        <div v-show="showLiveChatBtn" class="live-chat">
            <div class="btn" v-show="connectState==0" @click="connectLiveChat">LIVE CHAT</div>
            <div class="btn" v-show="connectState==1">Connecting …</div>
        </div>
        <div class="live-chat-input" v-show="showLiveChatBtn&&connectState==2">
            <div class="user-control-w">
                <div class="user-edit-w">
                    <textarea class="form-control user-edit" v-model="chatMsg" placeholder="Enter your question"></textarea>
                </div>
                <div class="user-submit-w">
                    <button type="submit" class="user-submit-btn" @click="sendChatMsg">SEND</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import moment from 'moment/moment.js'
import BScroll from 'better-scroll'
import questionListTpl from '~/components/faq/questionListTpl'
import orderBlockTpl from '~/components/faq/orderBlockTpl'
import askTpl from '~/components/faq/askTpl'
import answerTpl from '~/components/faq/answerTpl'
import contentTpl from '~/components/faq/contentTpl'
import msgTpl from '~/components/faq/message'
import evaluate from '~/components/faq/evaluate'
export default {
    layout: 'base',
    data() {
        return {
            isLogin: this.$store.state.user.type || false,
            user: this.$store.state.user,
            config_id: this.$route.query.config_id,
            entrance_id: this.$route.query.entrance_id,
            categoryId: 183, // default others
            showLiveChatBtn: false,
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
            chatLink: null
        }
    },
    components: {
        questionListTpl,
        orderBlockTpl,
        askTpl,
        answerTpl,
        contentTpl,
        msgTpl,
        evaluate
    },
    mounted() {
        let questions = JSON.parse(localStorage.getItem('faq_question'))
        let serviceModuleId = localStorage.getItem('serviceModuleId')
        let renderQueue = JSON.parse(localStorage.getItem('renderQueue'))

        let _this = this
        // LiveChat 按钮判断
        this.user.areaID &&
            this.$axios
                .get(
                    `/ocs/v1/faqs/faqConfigByAreaId?areaId=${
                        this.user.areaID
                    }&entranceId=${this.entrance_id}`
                )
                .then(res => {
                    if (
                        res.data.code == 200 &&
                        res.data.data.shortcuts_codes.indexOf(1) >= 0
                    ) {
                        this.showLiveChatBtn = true
                    }
                })

        this.$nextTick(() => {
            let wrapper = document.querySelector('#wrapper')
            this.scroll = new BScroll(wrapper, {
                pullDownRefresh: {
                    threshold: 20,
                    stop: 40
                },
                startY: 0,
                bounce: {
                    top: true,
                    bottom: true,
                    left: true,
                    right: true
                },
                click: true
            })
            this.scroll.on('pullingDown', function() {
                _this.loadHistory()
            })
        })

        // TODO REMOVE
        if (this.isLogin && renderQueue && renderQueue.length > 0) {
            // if (renderQueue && renderQueue.length > 0) {
            this.renderFromCacheQueue()
            return false
        }

        // 创建服务记录
        this.createServiceRecord(6, () => {
            if (questions) {
                // 单个问题
                this.askQuest(questions, 1, 1)
            } else if (serviceModuleId) {
                // MORE FAQS

                this.addOperate({
                    tpl: 'ask',
                    name: 'more questions'
                })

                this.renderOrder()

                this.$axios
                    .get(`/ocs/v1/moreFaqs?serviceModuleId=${serviceModuleId}`)
                    .then(res => {
                        if (res.data.code == 200) {
                            let list = []
                            res.data.data.forEach((item, index) => {
                                list.push({
                                    id: item.id,
                                    name: item.thema
                                })
                            })
                            this.renderQueue.push(
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

                this.$axios
                    .get(`/ocs/v1/faqs/directory/${this.user.areaID}`)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.categoryId = res.data.data
                            this.getfaqDirectory(res.data.data)
                        }
                    })
            }
        })
    },
    methods: {
        getfaqDirectory(id) {
            if (!id) return false
            this.$axios
                .get(`/ocs/v1/faqs/category/${id}?config_id=${this.config_id}`)
                .then(res => {
                    if (res.data.code == 200) {
                        this.addOperate(
                            Object.assign({}, res.data.data, {
                                tpl: 'list'
                            })
                        )
                        // TODO TAGS
                    }
                })
        },
        askQuest(item, type, withOrder) {
            this.addOperate(
                Object.assign({}, item, {
                    tpl: 'ask',
                    name: item.thema || item.name
                })
            )

            if (withOrder) {
                this.renderOrder()
            }

            if (type == 1) {
                this.getAnswer(item.id)
            } else {
                this.getfaqDirectory(item.id)
            }
        },
        getAnswer(id) {
            this.$axios.get(`/ocs/v1/faqs/answer/${id}`).then(res => {
                if (res.data.code == 200) {
                    this.addOperate(
                        Object.assign({}, res.data.data, {
                            tpl: 'content'
                        })
                    )
                }
            })
        },
        renderOrder() {
            let order = JSON.parse(localStorage.getItem('orderMsg'))
            if (order) {
                this.addOperate({
                    tpl: 'order',
                    order: order
                })
            }
        },
        createServiceRecord(type, callback) {
            this.$axios
                .post(`/css/v1/service/start?type=${type || 6}&anonymity=0`)
                .then(res => {
                    if (res.data.code == 200) {
                        this.serviceRecord = res.data.data
                        if (!this.isLogin) {
                            let cacheRecord = localStorage.getItem(
                                'serviceRecords'
                            )
                            if (cacheRecord) {
                                cacheRecord = JSON.parse(cacheRecord)
                                if (
                                    cacheRecord.indexOf(this.serviceRecord) < 0
                                ) {
                                    cacheRecord.push(this.serviceRecord)
                                }
                            } else {
                                cacheRecord = [this.serviceRecord]
                            }
                            localStorage.setItem(
                                'serviceRecords',
                                JSON.stringify(cacheRecord)
                            )
                        }
                        if (callback) callback()
                    }
                })
        },
        addOperate(obj, send) {
            
            if (obj && obj.tpl) {
                this.renderQueue.push(obj)
                this.updateCacheQueue()
                this.$nextTick(() => {
                    this.scroll.refresh()
                    this.scrollToBottom()
                })

                // 发送历史记录
                let serviceInfo = ''
                let operator = 1 // 用户发起
                if (obj.tpl == 'list') {
                    serviceInfo = 'faqlist-'
                    obj.contents.forEach(item => {
                        serviceInfo += item.name + ' | '
                    })
                } else if (obj.tpl == 'ask' || obj.tpl == 'chatask') {
                    serviceInfo = 'faqask-' + obj.name
                } else if (obj.tpl == 'order') {
                    serviceInfo = 'faqorder-' + obj.order.order_type
                } else if (obj.tpl == 'content') {
                    serviceInfo = 'faqanswer-' + obj.content
                } else if (obj.tpl == 'chatanswer' || obj.tpl == 'welcome') {
                    serviceInfo = 'chatanswer-' + obj.name
                    operator = 2 // 客服发起
                } else if (obj.tpl == 'tips') {
                    return false
                }

                this.$axios
                    .post('/css/v1/service/history', {
                        service_type: 1, // TODO
                        service_group_id: this.serviceRecord,
                        service_state: 2,
                        remark: JSON.stringify(obj),
                        service_info: serviceInfo,
                        operator: operator
                    })
                    .then(res => {
                        if (res.data.code == 200) {
                            if (!this.isLogin) {
                                // 未登录状态缓存操作历史
                                let cacheHisory = localStorage.getItem(
                                    'historys'
                                )
                                if (cacheHisory) {
                                    cacheHisory = JSON.parse(cacheHisory)
                                    if (
                                        cacheHisory.indexOf(
                                            res.data.data.historyId
                                        ) < 0
                                    ) {
                                        cacheHisory.push(
                                            res.data.data.historyId
                                        )
                                    }
                                } else {
                                    cacheHisory = [res.data.data.historyId]
                                }
                                localStorage.setItem(
                                    'historys',
                                    JSON.stringify(cacheHisory)
                                )
                            } else {
                                // 最小historyId记录
                                
                                if (!this.minHistoryId) {
                                    this.minHistoryId = res.data.data
                                }else{
                                    if(res.data.data.historyId<this.minHistoryId){
                                        this.minHistoryId = res.data.data
                                    }
                                }
                            }
                        }
                    })
            }
        },
        updateCacheQueue() {
            if (!this.isLogin) {
                localStorage.setItem(
                    'renderQueue',
                    JSON.stringify(this.renderQueue)
                )
            }
        },
        renderFromCacheQueue() {
            // 恢复对话
            this.renderQueue = JSON.parse(localStorage.getItem('renderQueue'))

            // 更新历史记录
            let historys = JSON.parse(localStorage.getItem('historys'))
            let serviceIds = JSON.parse(localStorage.getItem('serviceRecords'))

            // TODO 设置minHistoryId
            if (historys && serviceIds) {
                this.$axios.post(
                    `/css/v1/history/updateUserId?historyIds=${historys.join(
                        ','
                    )}&serviceIds=${serviceIds.join(',')}`
                )
            }
        },
        loadHistory() {
            if (this.historyEnd) return
            this.loadHistoryState = true
            this.$axios
                .get(
                    `/css/v1/history/app?pageSize=5&pageNum=${
                        this.historyPage
                    }&minId=${this.minHistoryId}`
                )
                .then(res => {
                    if (res.data.code==200 && res.data.data.rows.length > 0) {
                        this.historyPage++
                        let rows = res.data.data.rows.sort((a,b)=>{
                            return a.id-b.id
                        })
                        rows.reverse().forEach(item => {
                            this.renderQueue.unshift(JSON.parse(item.remark))
                        })
                    } else {
                        this.historyEnd = true
                    }

                    this.loadHistoryState = false
                    this.scroll.finishPullDown()
                    this.$nextTick(() => {
                        this.scroll.refresh()
                    })
                })
        },
        scrollToBottom() {
            let h1 = document.querySelector('#wrapper').offsetHeight
            let h2 = document.querySelector('.content').offsetHeight
            this.scroll.scrollTo(0, h1 - h2, 300)
        },
        connectLiveChat() {
            if (!this.isLogin) return false
            this.connectState = 1
            this.$axios
                .post('/genesys-proxy/v1/chats', {
                    emailAddress: this.user.id,
                    nickname: this.user.id,
                    subject: 'app live chat',
                    tenantName: 'Resources',
                    userData: {
                        key1: this.user.countryCode,
                        key2: 'value2'
                    }
                })
                .then(res => {
                    if (res.data.statusCode == 0) {
                        this.chatLink = res.data
                        this.$axios
                            .post(
                                `/genesys-proxy/v1/chats/${
                                    this.chatLink.chatId
                                }}/messages`,
                                {
                                    alias: this.chatLink.alias,
                                    operationName: 'GetChat',
                                    secureKey: this.chatLink.secureKey,
                                    tenantName: 'Resources',
                                    userId: this.chatLink.userId
                                }
                            )
                            .then(res => {
                                if (
                                    res.data.statusCode == 0 &&
                                    !res.data.chatEnded
                                ) {
                                    this.connectState = 2 // BUTTON 变成输入框

                                    this.chatPullTimer = setInterval(() => {
                                        this.pullReply()
                                    }, 5000)
                                    this.nextPosition = res.data.nextPosition
                                    let messages = res.data.messages

                                    this.createServiceRecord(1, () => {
                                        this.addOperate({
                                            tpl: 'chatanswer',
                                            name: 'Hello! How can I help you?'
                                        })
                                    })
                                } else {
                                    this.connectLiveChat()
                                }
                            })
                    } else if (res.data.statusCode == -1) {
                        // TODO 是否要只显示一次
                        this.renderOrder.push({
                            text:
                                'Working time(7:00–20:00) Agents are only available during working hours (7am~8pm).',
                            tpl: 'tips'
                        })
                    } else {
                        this.renderOrder.push({
                            text: 'Connect fail',
                            tpl: 'tips'
                        })
                    }
                })
        },
        sendChatMsg() {
            let msg = this.chatMsg
                .replace(/\r\n/g, '<br/>')
                .replace(/\n/g, '<br/>')
                .replace(/\s/g, ' ')
                .trim()
            if (msg != '') {
                this.addOperate({
                    tpl: 'chatask',
                    name: msg
                })
                this.chatMsg = ''

                this.$axios
                    .post(`/genesys-proxy/v1/chats/${chatLink.chatId}`, {
                        alias: chatLink.alias,
                        secureKey: chatLink.secureKey,
                        tenantName: 'Resources',
                        userId: chatLink.userId,
                        operationName: 'SendMessage',
                        text: msg
                    })
                    .then(res => {
                        if (res.data.statusCode != 0 || res.data.chatEnded) {
                            this.addOperate({
                                text: 'Sending Failure',
                                tpl: 'tips'
                            })
                        }
                    })
                    .catch(err => {
                        this.addOperate({
                            text: 'Sending Failure',
                            tpl: 'tips'
                        })
                    })
            }
        },
        pullReply() {
            this.$axios
                .post(
                    `/genesys-proxy/v1/chats/${this.chatLink.chatId}/messages`,
                    {
                        alias: this.chatLink.alias,
                        operationName: 'GetChat',
                        secureKey: this.chatLink.secureKey,
                        tenantName: 'Resources',
                        userId: this.chatLink.userId,
                        transcriptPosition: this.nextPosition
                    }
                )
                .then(res => {
                    if (res.data.statusCode == 0 && !res.data.chatEnded) {
                        this.nextPosition = res.data.nextPosition
                        let messages = res.data.messages
                        if (messages.length > 0) {
                            messages.forEach(item => {
                                if (
                                    item.from.type == 'Agent' &&
                                    item.type == 'Message' &&
                                    item.text
                                ) {
                                    this.addOperate({
                                        tpl: 'chatanswer',
                                        name: item.text
                                    })
                                }
                                if (
                                    item.from.type == 'Client' &&
                                    item.type == 'Message' &&
                                    item.text
                                ) {
                                    this.addOperate({
                                        tpl: 'chatask',
                                        name: item.text
                                    })
                                }
                            })
                        }
                    } else if (res.data.statusCode == -1) {
                        this.addOperate({
                            text:
                                'Working time(7:00–20:00) Agents are only available during working hours (7am~8pm).',
                            tpl: 'tips'
                        })
                        clearInterval(this.chatPullTimer)
                        this.endChat()
                    } else {
                        this.addOperate({
                            text: 'Disconnected',
                            tpl: 'tips'
                        })
                        clearInterval(this.chatPullTimer)
                        this.endChat()
                    }
                })
        },
        endChat() {
            // TODO 评价
            // TODO 断开链接 变换按钮状态
            // TODO 创建新的服务记录
            // TODO 输入框多行支持
        },
        starToBlue(index, event) {
            let imgNode = document.querySelectorAll('.gave-star img')
            for (let i = 0; i < imgNode.length; i++) {
                // TODO 先全部恢复默认状态
            }
            for (let i = 0; i <= index; i++) {
                // TODO 当前index及之前变为蓝色
            }
        }
    },
    filters: {
        formatDate(date) {
            return moment(date).format('D MMM YYYY HH-mm:ss')
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
#wrapper{
    overflow: hidden;
}
</style>