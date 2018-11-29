<template>
    <div class="list_faq_item clearfix">
        <div class="content_avatar fl">
            <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
        </div>
        <div class="content_show">
            <img class="arrow" src="~assets/img/faq/Triangle.png">
            <div class="result-wraper" v-html="content"/>
            <div>
                <div class="btn" @click="tocomplain">COMPLAIN</div>
                <div class="clear"/>
                <div class="attitude-container" v-if="!noevaluate">
                    <div class="yes-item" @click="evaluate(1)">
                        <img v-show="!agree" src="~assets/img/faq/ic_happy_def_g.png" alt>
                        <img v-show="agree" src="~assets/img/faq/ic_happy_sl_green.png" alt>
                        <span>YES</span>
                    </div>
                    <div class="no-item" @click="evaluate(0)">
                        <img v-show="!disagree" src="~assets/img/faq/ic_disappoint_def_g.png" alt>
                        <img v-show="disagree" src="~assets/img/faq/ic_disappoint_sl_red.png" alt>
                        <span>NO</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { toNativePage } from '~/functions/utils'
export default {
    data() {
        return {
            agree: false,
            disagree: false,
            ended: false,
            isLogin: this.$store.state.user.type || false
        }
    },
    props: {
        content: {
            require: true,
            type: String,
            default: ''
        },
        serviceRecord: {
            require: true,
            type: Number,
            default: -1
        },
        noevaluate: {
            // 是否有评价
            type: Boolean,
            require: false,
            default: false
        },
        question: {
            type: Number,
            require: true,
            default: -1
        }
    },
    mounted() {
        this.$nextTick(() => {
            let s = document.querySelectorAll('.result-wraper img')
            for (let i = 0; i < s.length; i++) {
                s[i].onload = () => {
                    this.$emit('imgloaded')
                }
            }
        })
    },
    methods: {
        evaluate(type) {
            if (!this.ended) {
                this.$axios.post(`/css/v1/service/evaluation/${this.serviceRecord}?whether_to_solve=${type}&grade=${type ? 2 : 1}`).then(res => {
                    if (res.data.code == 200) {
                        // 改变状态
                        if (type) {
                            this.agree = true
                        } else {
                            this.disagree = true
                        }
                        this.ended = true
                    }
                })
            }
        },
        tocomplain() {
            if (!this.isLogin) {
                if (this.$store.state.appType == 1) {
                    toNativePage('com.star.mobile.video.account.LoginActivity')
                } else {
                    toNativePage('startimes://login')
                }
                return false
            } else {
                this.$router.replace({ path: '/hybrid/faq/complain', query: Object.assign({}, this.$route.query, { question: this.question }) })
            }
        }
    }
}
</script>
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