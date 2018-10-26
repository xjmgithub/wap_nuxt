<template>
    <div id="wrapper">
        <div class="content">
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
                <div v-if="item.tpl=='list'" :key="index" class="list_faq_item clearfix">
                    <div class="content_avatar fl">
                        <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
                    </div>
                    <div class="content_show">
                        <img class="arrow" src="~assets/img/faq/Triangle.png">
                        <div class="hint">You may ask:</div>
                        <ul class="ques-item-wraper clearfix">
                            <li v-for="(item2,index2) in item.contents" @click="askQuest(item2,item.type)" :key="index2">
                                <span class="recommend_q_con">{{item2.name}}</span>
                                <img class="forward_arrow" src="~assets/img/faq/ic_categary_copy41.png">
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-if="item.tpl=='ask'||item.tpl=='chatask'" :key="index" class="list_faq_item list_faq_item_fr clearfix">
                    <div class="content_avatar fr">
                        <img v-show="user.head" :src="user.head" />
                        <img v-show="!user.head" src="~assets/img/faq/1-02.png" />
                    </div>
                    <div class="content_show fr">
                        <img class="arrow" src="~assets/img/faq/Triangle_right.png">
                        <div class="faq_content">{{item.name}}</div>
                    </div>
                </div>
                <div v-if="item.tpl=='order'" :key="index" class="order-msg">
                    <p class="time">{{item.order.order_create_time | formatDate}}</p>
                    <div class="order-type clearfix">
                        <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
                        <div class="right">
                            <p class="order-name">
                                {{item.order.order_type}}<span>{{item.order.order_amount}}</span>
                            </p>
                            <p class="order-status">
                                {{item.order.card_no}}<span>{{item.order.order_status}}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div v-if="item.tpl=='content'" :key="index" class="list_faq_item clearfix">
                    <div class="content_avatar fl">
                        <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
                    </div>
                    <div class="content_show">
                        <img class="arrow" src="~assets/img/faq/Triangle.png">
                        <div class="result-wraper" v-html="item.content"></div>
                        <div>
                            <div class="btn">COMPLAIN</div>
                            <div class="clear"></div>
                            <div class="attitude-container">
                                <div class="yes-item">
                                    <img src="~assets/img/faq/ic_happy_def_g.png" alt="">
                                    <span>YES</span>
                                </div>
                                <div class="no-item">
                                    <img src="~assets/img/faq/ic_disappoint_def_g.png" alt="">
                                    <span>NO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="item.tpl=='chatanswer' || item.tpl=='welcome'" :key="index" class="list_faq_item clearfix">
                    <div class="content_avatar fl">
                        <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
                    </div>
                    <div class="welcome-wraper ">
                        <img class="arrow" src="~assets/img/faq/Triangle.png">
                        <span class="welcome-item">{{item.name}}</span>
                    </div>
                </div>
                <div v-if="item.tpl=='tips'" :key="index" class="tips">
                    <div>{{item.text}}</div>
                </div>
            </template>
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
        <!-- Waiting For Result -->
        <div>
             <div class="order-msg">
                    <p class="time">11 Oct 2018 17-25:52 <span class="wait-result">Waiting For Result</span></p>
                    <div class="order-type clearfix">
                        <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
                        <div class="right">
                            <p class="order-name"> DVB Recharge </p>
                            <p class="order-status">Order ID: D1398765409 </p>
                        </div>
                    </div>
                    <p class="complain">Complain</p>
                    <p>I’ve recharged, but I still can’t watch channels on TV.</p>
                </div>
        </div>
        <!-- 评价星星星 -->
        <div class="evaluation">
            <p class="eval-title">Does this Custom-Service help you solve the problem?</p>
            <div class="eval-img">
                <span>
                    <img src="~assets/img/faq/ic_happy_sl_green.png"> NO
                </span>
                <span>
                    <img src="~assets/img/faq/ic_disappoint_def_g.png"> YES
                </span>
            </div>
            <div class="gave-star">
                <p>Please evaluate for us? THX.</p>
                <!-- <img src="~assets/img/faq/ic_favoritez_blue_evl.png" alt=""> -->
                <img v-for ="(item,index) in 5" :key="index" src="~assets/img/faq/ic_favorite_def_evl.png" @click="starToBlue(index,$event)">
                <!-- <img v-for ="(item,index) in 5" :key="index" src="~assets/img/faq/ic_favoritez_blue_evl.png" @click="starToBlue(index,$event)"> -->
            </div>
        </div>
    </div>
</template>
<script>
import moment from 'moment/moment.js'
import BScroll from 'better-scroll'
export default {
    layout: 'base',
    data() {
        return {
            isLogin: this.$store.state.user.type, // 如果有值即为登录状态,没有值则是匿名登录
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
                    top: true
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
                this.askQuest(question, 1, 1)
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
                        if (res.data.code == 0) {
                            let list = []
                            res.data.data.forEach((item, index) => {
                                list.push({
                                    id: item.id,
                                    name: item.content
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
                    tpl: 'ask'
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
                .post(`/css/v1/service/start?type=${type || 6}`)
                .then(res => {
                    if (res.data.code == 0) {
                        this.serviceRecord = res.data.data.recordId
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
                    data.contents.forEach(item => {
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
                        remark: obj,
                        service_info: serviceInfo,
                        operator: operator
                    })
                    .then(res => {
                        if (res.data.code == 0) {
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
                                    this.minHistoryId = res.data.data.historyId
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
            this.$axios.post('/css/v1/history/updateUserId', {
                historyIds: historys,
                serviceIds: serviceIds
            })
        },
        loadHistory() {
            if (this.historyEnd) return
            this.loadHistoryState = true
            this.$axios
                .post('/css/v1/history/app', {
                    pageNum: this.historyPage,
                    pageSize: 20,
                    minId: this.minHistoryId
                })
                .then(res => {
                    if (res.data instanceof Array && res.data.length > 0) {
                        this.historyPage++
                        // TODO 倒叙
                        res.data.reverse().forEach(item => {
                            this.renderQueue.unshift(item.remark)
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
        starToBlue(index,event){
            let imgNode = document.querySelectorAll(".gave-star img");
            console.log(event)
            for(let i = 0;i<imgNode.length;i++){
                // TODO 先全部恢复默认状态
            }
            for(let i = 0;i<=index;i++){
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

<style lang="less" scoped>
#wrapper {
    font-family: 'DINPro', Roboto, Arial, Helvetica, Sans-serif;
    background: #eee;
    height: 100vh;
    overflow: auto;
    .content {
        padding-bottom: 4.5rem;
    }
}
.fl {
    float: left;
}

.fr {
    float: right;
}
.clearfix:after {
    display: block;
    visibility: hidden;
    clear: both;
    height: 0;
    content: '';
}
.clearfix {
    zoom: 1;
}
.clear {
    clear: both;
}
.list_faq_item {
    margin-left: 8px;
    margin-right: 8px;
    padding-top: 1rem;
    .content_avatar {
        img {
            width: 36px;
            height: 36px;
        }
    }
    .welcome-wraper {
        display: inline-block;
        margin-left: 10px;
        background: #fff;
        border-radius: 5px;
        max-width: 75%;
        position: relative;
        padding: 0.6rem 0.8rem;
        .welcome-item {
            display: inline-block;
            margin: 0;
            height: auto;
            line-height: 1.2rem;
            font-size: 0.9rem;
            color: #333333;
        }
        img.arrow {
            width: 8px;
            height: 12px;
            position: absolute;
            top: 13px;
            left: -8px;
        }
    }
}
.content_show {
    margin-left: 45px;
    border-radius: 5px;
    position: relative;
    background: white;
    width: 75%;
    padding: 0.6rem 0.8rem;
    .faq_content {
        display: inline-block;
        margin: 0;
        padding: 0.6rem 0;
        height: auto;
        font-size: 0.9rem;
        line-height: 1rem;
        color: #fff;
    }
    .arrow {
        width: 8px;
        height: 12px;
        position: absolute;
        top: 13px;
        left: -8px;
    }

    .hint {
        font-weight: 600;
        font-size: 16px;
        margin-left: 0;
        padding-bottom: 0.6rem;
    }
    .btn {
        color: #0087eb;
        font-size: 0.8rem;
        margin: 0.7rem 0;
        float: right;
        font-weight: 600;
    }
    span.recommend_q_con {
        color: #666666;
        font-size: 0.85rem;
    }
    .ques-item-wraper {
        li {
            position: relative;
            border-top: 1px solid #eee;
            padding: 0.3rem 0.94rem 0.3rem 0;
            span {
                display: inline-block;
                width: 95%;
                vertical-align: middle;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            img {
                width: 20px;
                height: 20px;
                position: absolute;
                right: 0;
                top: 50%;
                margin-top: -10px;
            }
        }
    }
    .attitude-container {
        padding-top: 0.6rem;
        color: #212121;
        font-size: 0.9rem;
        border-top: 1px solid #eeeeee;
        div {
            display: inline-block;
            text-align: center;
            line-height: 1.3rem;
            &:last-child {
                margin-left: 20px;
            }
        }
        img {
            width: 25px;
            height: 25px;
            margin: 0 auto;
            display: block;
        }
    }
}

.list_faq_item_fr {
    .content_show {
        border-radius: 5px;
        padding: 0 10px;
        position: relative;
        margin-right: 10px;
        background: #1c88de;
        margin-left: 0px;
        width: auto;
        max-width: 75%;
        .arrow {
            position: absolute;
            width: 8px;
            height: 12px;
            top: 0.65rem;
            right: -7px;
            left: auto;
        }
    }
}

.order-msg {
    box-shadow: 0px 1px 3px 1px #dddddd;
    border-radius: 5px;
    padding: 0.5rem;
    width: 95%;
    margin: 1rem 2.5% 0 2.5%;
    background: #fff;
    .time {
        width: 100%;
        color: #aaaaaa;
        font-size: 0.8rem;
        border-bottom: 1px solid #eeeeee;
        padding: 0.2rem 0;
        .wait-result{
            color:#333333;
            float:right;
            font-weight:bold;
        }
    }
    .complain{
        font-size:.9rem;
        color:#666666;
        font-weight:bold;
        &+p{
            color:#666666;
            font-size:.8rem;
        }
    }
}
.order-type {
    padding: 0.7em 0;
    img {
        width: 2.5rem;
        height: 2.5rem;
        float: left;
    }
    .right {
        margin-left: 3rem;
    }
    .order-name {
        span {
            font-weight: bold;
            float: right;
        }
    }
    .order-status {
        font-size: 0.9rem;
        color: #999999;
        span {
            color: #00cc33;
            float: right;
        }
    }
}

.live-chat {
    width: 100%;
    background: #fff;
    text-align: center;
    color: #0087eb;
    border-top: 1px solid #eeeeee;
    margin-top: 1.5rem;
    padding: 1rem 0;
    position: fixed;
    bottom: 0;
    .btn {
        margin: 0 auto;
        border: 1px solid #0087eb;
        border-radius: 2px;
        background: #fff;
        padding: 0.3rem;
        font-weight: bold;
        width: 60%;
        outline: none;
    }
}

.pull_refresh {
    position: absolute;
    top: -2.5rem;
    width: 100%;
    text-align: center;
    .refresh_text {
        background: #ccc;
        border-radius: 1rem;
        color: white;
        font-size: 0.8rem;
        padding: 0.2rem 1rem;
    }
    .refresh_img {
        width: 2.5rem;
    }
}
.evaluation{
    box-shadow: 0px 1px 3px 1px #dddddd;
    border-radius: 5px;
    padding:1rem 1.5rem 2rem ;
    width: 95%;
    margin: 1rem 2.5% 2.5% 2.5%;
    background: #fff;
    font-size:.9rem;
    color:#333333;
    .eval-title{
        font-weight:bold;
    }
    .eval-img{
        margin-top:.5rem;
        padding:.5rem 1rem;
        border-top:1px solid #EEEEEE;
        border-bottom:1px solid #EEEEEE;
        span{
            text-align:center;
            display:inline-block;
            width:1.8rem;
            margin-right:4rem;
            img{
                display:block;
                width:100%;
            }
        }
    }
    .gave-star{
        padding: .5rem ;
        p{
            margin-bottom:.3rem;
        }
        img{
            width:1.8rem;
            margin-right:1.5rem;
        }
    }
}
/* livechat input */

.live-chat-input {
    width: 100%;
    background: #fff;
    text-align: center;
    color: #0087eb;
    border-top: 1px solid #eeeeee;
    padding: 0.8rem 0.5rem;
    position: fixed;
    bottom: 0;
    .user-control-w {
        width: 100%;
        display: flex;
        position: relative;
        .user-edit-w {
            width: 78%;
            border: solid 1px #a7a1a1;
            border-radius: 2px;
            textarea {
                height: 2rem;
                padding: 0.5rem;
                width: 100%;
                resize: none;
                line-height: 20px;
                display: block;
                border: none;
                font-size: 1rem;
                color: #20293d;
                outline: none;
                float: left;
            }
        }
        .user-submit-w {
            position: absolute;
            right: 0;
            width: 20%;
            height: 2rem;
            border-radius: 2px;
            overflow: hidden;
            button {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                display: block;
                border: none;
                text-align: center;
                color: #fff;
                background: #0087eb;
            }
        }
    }
}
.tips {
    padding-top: 1rem;
    div {
        text-align: center;
        width: 80%;
        background: #ccc;
        padding: 0.1rem 0.4rem;
        border-radius: 0.7rem;
        color: white;
        font-size: 0.8rem;
        margin: auto;
    }
}
</style>
<style>
/* for v-html */
.result-wraper p:first-child {
    padding-top: 9px;
}

.result-wraper p {
    line-height: 1.5;
    font-size: 14px;
    word-wrap: break-word;
    word-break: normal;
    color: #757575;
}

.result-wraper p img {
    display: block;
    width: 70% !important;
    height: auto !important;
    margin: 0 auto;
}

.result-wraper p span {
    display: inline-block;
    max-width: 100%;
    color: #212121 !important;
}

.result-wraper p a {
    color: #2196f3 !important;
    text-decoration: none !important;
}
</style>