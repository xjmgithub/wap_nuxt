<template>
    <div id="wrapper">
        <div class="reply">
            <div class="waiting" v-if="!msg.replyRecordDtoList||msg.replyRecordDtoList.length<=0">
                <div class="waiting_btn">Waiting For Result…</div>
            </div>
            <div class="over" v-if="msg.replyRecordDtoList&&msg.replyRecordDtoList.length>0">
                <div class="replied_txt">Replied</div>
                <div class="replied_content" v-for="item in msg.replyRecordDtoList" :key="item.id">
                    {{item.message}}
                </div>
            </div>
        </div>
        <div class="gap"></div>
        <div class="order-msg" v-if="msg.orderNo">
            <p class="time">{{msg.orderCreateTime | formatDate }}</p>
            <div class="order-type clearfix">
                <img src="~/assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
                <div class="right">
                    <p class="order-name">{{msg.orderType }}
                        <span>{{msg.orderAmount }}</span>
                    </p>
                    <p class="order-status">{{msg.orderName }}
                        <span>{{msg.orderStatus }}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="problem">
            <p>Your Problem</p>
            <div class="problem_txt">{{msg.problem}}</div>
            <div class="problem_txt" v-if="msg.problemChannelTypeValue">{{msg.problemChannelTypeValue}}</div>
            <div class="problem_txt" v-if="msg.problemChannelNameValue">{{msg.problemChannelNameValue}}</div>
            <div class="problem_txt" v-if="msg.problemCountryCode">{{msg.problemCountryCode}}</div>
            <p>Detail Description</p>
            <div class="msg_container">{{msg.message}}</div>
        </div>
        <div class="gap"></div>
        <div class="personal">
            <p>Personal Information</p>
            <ul>
                <li>
                    <p class="p-name">Account
                        <span>*</span>
                    </p>
                    <p class="p-value">{{msg.userId}}</p>
                </li>
                <li v-if="msg.operatorInfo">
                    <p class="p-name">Telecom Info
                        <span>*</span>
                    </p>
                    <p class="p-value">{{msg.operatorInfo}}</p>
                </li>
                <li v-if="msg.unitType">
                    <p class="p-name">Device
                        <span>*</span>
                    </p>
                    <p class="p-value">{{msg.unitType}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import moment from 'moment/moment.js'
export default {
    layout: 'base',
    data() {
        return {
            msg: {}
        }
    },
    mounted() {
        let msg = localStorage.getItem('showMsg')
        if (msg) {
            this.msg = JSON.parse(msg)
            // 设为已读状态
            let messageids = []
            this.msg.replyRecordDtoList.forEach(item => {
                messageids.push(item.id)
            })
            let messageStr = messageids.join('_') 
            this.$axios
                .put(
                    `/v1/reply-records/update-have-read?replyIds=${messageStr}`
                )
                .then(res => {
                    if (res.data.code != 200) {
                        this.$alert('message readed set error')
                    }
                })
        }
    },
    filters: {
        formatDate(date) {
            return moment(date).format('D MMM YYYY HH-mm:ss')
        }
    },
    head() {
        return {
            title: 'Complain'
        }
    }
}
</script>
<style lang="less">
@import '~assets/less/faq/common.less';
</style>
<style lang="less" scoped>
#wrapper {
    background: #ffffff;
}

.gap {
    background-color: #f2f2f2;
    height: 4px;
    width: 100%;
}

.order-msg {
    box-shadow: 0px 1px 3px 1px #dddddd;
    border-radius: 2px;
    padding: 0.5rem;
    width: 95%;
    margin: 0.5rem 2.5% 0 2.5%;
    position: relative;
    .time {
        width: 100%;
        color: #aaaaaa;
        font-size: 0.8rem;
        border-bottom: 1px solid #eeeeee;
        padding: 0.2rem 0;
        img {
            position: absolute;
            display: block;
            width: 1.2rem;
            right: 0.4rem;
            top: 0.4rem;
        }
    }
}

.problem {
    padding: 0.5rem;
    p {
        margin: 0.6rem 0 0.3rem 0;
        color: #212121;
        font-weight: bold;
        font-size: 0.9rem;
    }
    .problem_txt {
        font-size: 0.9rem;
    }
    .msg_container {
        font-size: 0.9rem;
        border: solid 1px #dddddd;
        padding: 0.5rem;
        word-break: break-all;
    }
}

.personal {
    width: 95%;
    margin: 0 2.5% 4.5rem 2.5%;
    & > p {
        margin: 0.6rem 0 0.3rem 0;
        color: #212121;
        font-weight: bold;
        font-size: 0.9rem;
    }
    ul {
        box-shadow: 0px 1px 3px 1px #dddddd;
        padding: 0.5rem 0.8rem;
        border-radius: 5px;
        li {
            padding: 0.5rem 0;
            p {
                display: inline-block;
                color: #212121;
                font-size: 0.8rem;
                &.p-name {
                    width: 30%;
                    border-right: 1px solid #eeeeee;
                    span {
                        color: #0087e0;
                    }
                }
                &.p-value {
                    font-weight: bold;
                    margin-left: 1.5rem;
                }
            }
            & + li {
                border-top: 1px solid #eeeeee;
            }
        }
    }
}

.reply {
    padding: 0.5rem;
    .replied_txt {
        font-weight: bold;
        padding-top: 0.5rem;
    }
    .replied_content {
        border: solid 1px #dddddd;
        padding: 0.5rem;
        font-size: 0.9rem;
        border-radius: 0.2rem;
        margin: 0.3rem 0;
    }
    .waiting_btn {
        background: #dddddd;
        border-radius: 0.2rem;
        height: 2.2rem;
        line-height: 2.2rem;
        text-align: center;
        color: #aaaaaa;
    }
}
</style>