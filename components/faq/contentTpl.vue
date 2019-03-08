<template>
    <div class="list_faq_item clearfix">
        <div class="content_avatar fl">
            <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
        </div>
        <div class="content_show">
            <img class="arrow" src="~assets/img/faq/Triangle.png">
            <div v-html="content" class="result-wraper" />
            <div>
                <div @click="tocomplain" class="btn">
                    COMPLAIN
                </div>
                <div class="clear" />
                <div v-if="!noevaluate" class="attitude-container">
                    <div @click="evaluate(1)" class="yes-item">
                        <img v-show="!agree" src="~assets/img/faq/ic_happy_def_g.png" alt>
                        <img v-show="agree" src="~assets/img/faq/ic_happy_sl_green.png" alt>
                        <span>YES</span>
                    </div>
                    <div @click="evaluate(0)" class="no-item">
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
import { toNativePage, getFaqAnswerLabel } from '~/functions/utils'
export default {
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
    data() {
        return {
            agree: false,
            disagree: false,
            ended: false,
            isLogin: this.$store.state.user.type || false
        }
    },
    mounted() {
        this.$nextTick(() => {
            const s = document.querySelectorAll('.result-wraper img')
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
                    if (res.data.code === 200) {
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
            this.sendEvLog({
                category: 'onlineService',
                action: type ? `answer_${this.question}_yes_click` : `answer_${this.question}_no_click`,
                label: getFaqAnswerLabel(this, this.question) + '_1',
                value: 1
            })
        },
        tocomplain() {
            this.sendEvLog({
                category: 'onlineService',
                action: `answer_${this.question}_complain`,
                label: getFaqAnswerLabel(this, this.question) + '_1',
                value: 1
            })
            if (!this.isLogin) {
                if (this.$store.state.appType === 1) {
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
