<template>
    <div>
        <div id="wrapper">
            <div class="list_faq_item clearfix" v-show="showWelcome">
                <div class="content_avatar fl">
                    <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
                </div>
                <div class="welcome-wraper ">
                    <img class="arrow" src="~assets/img/faq/Triangle.png">
                    <span class="welcome-item">Welcome to StarTimes Online Service.</span>
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
                            <li v-for="(item2,index2) in item.contents" @click="askThis(item2,item.type)" :key="index2">
                                <span class="recommend_q_con">{{item2.name}}</span>
                                <img class="forward_arrow" src="~assets/img/faq/ic_categary_copy41.png">
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-if="item.tpl=='ask'" :key="index" class="list_faq_item list_faq_item_fr clearfix">
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
                                {{item.order.order_create_time}}<span>{{item.order.order_amount}}</span>
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
            </template>
        </div>
        <div v-show="showLiveChatBtn" class="live-chat">
            <button class="btn">
                LIVE CHAT
            </button>
        </div>
    </div>
</template>
<script>
let moment = require('moment/moment.js')
export default {
    layout: 'base',
    data() {
        return {
            moreFaqsDate: [],
            orderMsg: {},
            isLogin: this.$store.state.user.type, // 如果有值即为登录状态,没有值则是匿名登录
            user: this.$store.state.user,
            config_id: this.$route.query.config_id,
            entrance_id: this.$route.query.entrance_id,
            categoryId: 183, // default others
            showLiveChatBtn: false,
            serviceRecord: null,
            renderQueue: [],
            showWelcome: false
        }
    },
    mounted() {
        let questions = JSON.parse(localStorage.getItem('faq_question'))
        let serviceModuleId = localStorage.getItem('serviceModuleId')
        let renderQueue = JSON.parse(localStorage.getItem('renderQueue'))
        // TODO 登录状态判断是否本地缓存有对话记录，进行恢复

        //if(this.isLogin&&renderQueue&&renderQueue.length>0){
        if (renderQueue && renderQueue.length > 0) {
            this.renderFromCacheQueue()

            return false
        }

        this.createServiceRecord(() => {
            if (questions) {
                // TODO 单个问题
                this.askThis(question, 1, 1)
            } else if (serviceModuleId) {
                // MORE FAQS
                this.renderQueue.push({
                    operator: 1,
                    tpl: 'ask',
                    name: 'more questions',
                    id: '-99'
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
                // 根目录
                this.showWelcome = true
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
        // livechat btn 按钮判断
        this.user.areaID &&
            this.$axios
                .get(
                    `/ocs/v1/faqs/faqConfigByAreaId?areaId=${
                        this.user.areaID
                    }&entranceId=${this.entrance_id}`
                )
                .then(res => {
                    if (res.data.code == 200) {
                        if (res.data.data.shortcuts_codes.indexOf(1) >= 0) {
                            this.showLiveChatBtn = true
                        }
                    }
                })
    },
    filters: {
        formatDate(date) {
            return moment(date).format('D MMM YYYY HH-mm:ss')
        }
    },
    methods: {
        getfaqDirectory(id) {
            if (!id) return false
            this.$axios
                .get(`/ocs/v1/faqs/category/${id}?config_id=${this.config_id}`)
                .then(res => {
                    if (res.data.code == 200) {
                        this.renderQueue.push(
                            Object.assign({}, res.data.data, {
                                operator: 0, // 0 客服， 1 用户
                                tpl: 'list' // list , content, order
                            })
                        )

                        this.cacheHisory(1, res.data.data)

                        // TODO TAGS
                    }
                })
        },
        askThis(item, type, withOrder) {
            this.renderQueue.push(
                Object.assign({}, item, {
                    operator: 1,
                    tpl: 'ask'
                })
            )

            this.cacheHisory(4, item)

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
                    this.renderQueue.push(
                        Object.assign({}, res.data.data, {
                            operator: 0,
                            tpl: 'content'
                        })
                    )
                    this.cacheHisory(2, res.data.data)
                }
            })
        },
        renderOrder() {
            let order = JSON.parse(localStorage.getItem('orderMsg'))
            if (order) {
                this.renderQueue.push({
                    operator: 0,
                    tpl: 'order',
                    order: order
                })
            }

            this.cacheHisory(3, order)
        },
        createServiceRecord(callback) {
            this.$axios.post('/css/v1/service/start?type=6').then(res => {
                if (res.data.code == 0) {
                    this.serviceRecord = res.data.data.recordId
                    let cacheRecord = localStorage.getItem('serviceRecords')
                    if (cacheRecord) {
                        cacheRecord = JSON.parse(cacheRecord)
                        cacheRecord.push(this.serviceRecord) // TODO 去重
                    } else {
                        cacheRecord = [this.serviceRecord]
                    }
                    localStorage.setItem(
                        'serviceRecords',
                        JSON.stringify(cacheRecord)
                    )
                    if (callback) callback()
                }
            })
        },
        cacheHisory(type, data) {
            // type 1-faqlist,2-faqanswer,3-faqorder
            let remark, serviceInfo
            if (type == 1) {
                remark = data
                serviceInfo = 'faqlist-'
                data.contents.forEach(item => {
                    serviceInfo += item.name + ' | '
                })
            } else if (type == 2) {
                remark = {}
                serviceInfo = 'faqanswer-' + data.content
            } else if (type == 3) {
                remark = data
                serviceInfo = 'faqorder-'
            } else if (type == 4) {
                remark = {}
                serviceInfo = 'faqask-' + data.name
            }

            this.updateCacheQueue()

            this.$axios
                .post('/css/v1/service/history', {
                    service_type: 1,
                    service_group_id: this.serviceRecord,
                    service_state: 2,
                    remark: remark,
                    service_info: serviceInfo,
                    operator: 1 // faq的值固定为1即用户，live chat根据情况选择用户或客服
                })
                .then(res => {
                    let cacheHisory = localStorage.getItem('historys')
                    if (cacheHisory) {
                        cacheHisory = JSON.parse(cacheHisory)

                        if (cacheHisory.indexOf(res.data.data.historyId) < 0) {
                            cacheHisory.push(res.data.data.historyId)
                        }
                    } else {
                        cacheHisory = [res.data.data.historyId]
                    }
                    localStorage.setItem(
                        'historys',
                        JSON.stringify(cacheHisory)
                    )
                })
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
            this.$axios.post('css/v1/history/updateUserId', {
                historyIds: historys,
                serviceIds: serviceIds
            })
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
    padding-bottom: 4.5rem;
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
    button {
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