<template>
    <div class="wrapper">
        <div class="reply">
            <div v-if="!msg.replyRecordDtoList||msg.replyRecordDtoList.length<=0" class="waiting">
                <div class="waiting_btn">
                    Waiting For Result…
                </div>
            </div>
            <div v-if="msg.replyRecordDtoList&&msg.replyRecordDtoList.length>0" class="over">
                <div class="replied_txt">
                    Replied
                </div>
                <div v-for="item in msg.replyRecordDtoList" :key="item.id" class="replied_content">
                    {{item.message}}
                </div>
            </div>
        </div>
        <div class="gap" />
        <div v-if="msg.order_no" class="order-contain">
            <orderBlock :order="msg" />
        </div>
        <div class="problem">
            <p>Your Problem</p>
            <div class="problem_txt">
                {{msg.problem}}
            </div>
            <div v-if="msg.problemChannelTypeValue" class="problem_txt">
                {{msg.problemChannelTypeValue}}
            </div>
            <div v-if="msg.problemChannelNameValue" class="problem_txt">
                {{msg.problemChannelNameValue}}
            </div>
            <div v-if="msg.problemCountryCode" class="problem_txt">
                {{msg.problemCountryCode}}
            </div>
            <p>Detail Description</p>
            <div class="msg_container">
                {{msg.message}}
            </div>
        </div>
        <div class="gap" />
        <div class="personal">
            <p>Personal Information</p>
            <ul>
                <li>
                    <p class="p-name">
                        Account
                        <span>*</span>
                    </p>
                    <p class="p-value">
                        {{msg.userId}}
                    </p>
                </li>
                <li v-if="msg.operatorInfo">
                    <p class="p-name">
                        Telecom Info
                        <span>*</span>
                    </p>
                    <p class="p-value">
                        {{msg.operatorInfo}}
                    </p>
                </li>
                <li v-if="msg.unitType">
                    <p class="p-name">
                        Device
                        <span>*</span>
                    </p>
                    <p class="p-value">
                        {{msg.unitType}}
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import orderBlock from '~/components/faq/order'
export default {
    layout: 'base',
    components: {
        orderBlock: orderBlock
    },
    data() {
        return {
            msg: {}
        }
    },
    mounted() {
        const msg = sessionStorage.getItem('showMsg')
        if (msg) {
            this.msg = JSON.parse(msg)
            // 设为已读状态
            const messageids = []
            if (this.msg.replyRecordDtoList) {
                this.msg.replyRecordDtoList.forEach(item => {
                    messageids.push(item.id)
                })
                const messageStr = messageids.join('_')
                this.$axios.put(`/csms-service/v1/reply-records/update-have-read?replyIds=${messageStr}`).then(res => {
                    if (res.data.code !== 200) {
                        // this.$alert('message readed set error')
                    }
                })
            }
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
