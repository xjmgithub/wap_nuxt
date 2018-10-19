<template>
    <div>
        <div id="wrapper">
            <div class="list_faq_item  clearfix">
                <div class="content_avatar fr"><img src="~assets/img/faq/1-02.png"></div>
                <div class="content_show fr">
                    <img class="arrow" src="~assets/img/faq/Triangle_right.png">
                    <div class="faq_content">More Questions.</div>
                </div>
            </div>
            <div class="order-msg">
                <p class="time">{{orderMsg.order_create_time | formatDate}}</p>
                <div class="order-type clearfix">
                    <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
                    <div class="right">
                        <p class="order-name">{{orderMsg.order_type}}<span>{{orderMsg.order_amount}}</span></p>
                        <p class="order-status">{{orderMsg.card_no}}<span>{{orderMsg.order_status}}</span></p>
                    </div>
                </div>
            </div>
            <div class="list_faq_item clearfix">
                <div class="content_avatar fl"><img src="~assets/img/faq/ic_onlineservice_def_multicolor.png"></div>
                <div class="welcome-wraper ">
                    <img class="arrow" src="~assets/img/faq/Triangle.png">
                    <div class="hint">You may ask:</div>
                    <ul class="ques-item-wraper clearfix">
                        <li v-for="(item,index) in moreFaqsDate" :key="index">
                            <span class="recommend_q_con">{{item.content}}</span>
                            <img class="forward_arrow" src="~assets/img/faq/ic_categary_copy41.png">
                        </li>
                    </ul>
                </div>
            </div>
            <div class="list_faq_item clearfix">
                <div class="content_avatar fl">
                    <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
                </div>
                <div class="welcome-wraper ">
                    <img class="arrow" src="~assets/img/faq/Triangle.png">
                    <span class="welcome-item">1. Please make sure you have signed in the authorized account that you subscribed StarTimes ON. 2. Please make sure the channel is in the plan you have subscribed. 3. Please make sure the internet connection is working.</span>
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
        </div>
        <div class="live-chat">
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
            directory_id: this.$route.query.directory_id,
            showLiveChatBtn: false
        }
    },
    mounted() {
        
        
        this.createServiceRecord()
        // 登录状态判断是否本地缓存有对话记录，进行恢复
        // 


        this.orderMsg = JSON.parse(localStorage.getItem('orderMsg'))
        let questions = JSON.parse(localStorage.getItem('tagFaq'))
        if (this.directory_id) {
            // TODO 展示原来的faq逻辑，默认根目录
            let areaId = user.areaID
            this.$axios.get(`/ocs/v1/faqs//directory/${areaId}`).then(res => {
                let categoryId = 183
                if (res.data.code == 200) {
                    categoryId = res.data.data
                } else {
                    categoryId = 183
                }

                // TODO WELCOME
            })
        } else if (questions) {
            // TODO 单个问题
            
            this.renderOrder()
            this.getAnswer(id)
            // TODO 订单信息显示

        } else {
            // TODO MORE FAQS
            this.$axios.get('/ocs/v1/moreFaqs', {}).then(res => {
                if (res.data.data.length > 0) {
                    this.moreFaqsDate = res.data.data
                }
            })
        }

        // livechat btn 按钮判断
        this.$axios.get('/faqConfigByAreaId', {}).then(res => {
                if (res.data.data.length > 0) {
                    this.moreFaqsDate = res.data.data
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
            this.$axios.get(`/ocs/v1/faqs/category/${id}`).then(res => {
                if (res.data.code == 200) {
                    // TODO FAQ 列表
                    // TODO 发送服务历史
                    // TODO 未登录状态需要存储该操作记录进入本地缓存
                }
            })
        },
        getAnswer(id) {
            // TODO
            // TODO 发送服务历史
            // TODO 未登录状态需要存储该操作记录进入本地缓存
        },
        renderOrder(){
            // TODO 
            // TODO 发送服务历史
            // TODO 未登录状态需要存储该操作记录进入本地缓存
        },
        createServiceRecord(){
            // TODO 生成一条服务记录,服务记录要全局记录
            // TODO 未登录状态需要存储该操作记录进入本地缓存
        },
        cacheRecord(){
            // TODO 未登录状态需要存储该操作记录进入本地缓存
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
body {
    background: #eee;
}
#wrapper {
    font-family: 'DINPro', Roboto, Arial, Helvetica, Sans-serif;
    margin-bottom: 4.7rem;
    background: #eee;
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
        width: auto;
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
            font-size: 0.8rem;
            color: #333333;
        }
        img.arrow {
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
}
.content_show {
    display: inline-block;
    width: auto;
    margin-right: 10px;
    background: #0087eb;
    border-radius: 5px;
    max-width: 75%;
    position: relative;
    .faq_content {
        display: inline-block;
        margin: 0;
        padding: 0.6rem;
        height: auto;
        line-height: 1.2rem;
        font-size: 0.8rem;
        color: #fff;
    }
    img {
        width: 8px;
        height: 12px;
        position: absolute;
        top: 13px;
        right: -8px;
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