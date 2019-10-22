<template>
    <div :class="{'grey-back':result==2||result==0}" class="container">
        <template v-if="result<=0">
            <div class="top">
                <img class="wait" src="~assets/img/pay/img_load_def_b.png" alt />
                <img class="loading" src="~assets/img/Spinner-1s-200px.gif" />
            </div>
            <div class="paying" v-html="load_message" />
        </template>
        <template v-if="result=='1'">
            <img class="success_img" src="~assets/img/pay/pic_done_b.png" alt />
            <p class="success">{{$store.state.lang.payment_successful}}</p>
            <p class="money">
                <span>{{currency}}</span>
                {{money | formatAmount}}
            </p>
            <p class="msg lf">{{$store.state.lang.pay_successful_desc}}</p>
        </template>
        <template v-if="result=='2'">
            <img class="fail_img" src="~assets/img/pay/img_failed_def_b.png" alt />
            <p class="fail">{{$store.state.lang.payment_failed}}</p>
            <p class="msg">{{$store.state.lang.pay_failed_desc}}</p>
        </template>
        <div class="footer">
            <mButton v-show="result>0" :text="$store.state.lang.pay_refresh" @click="refresh" />
            <mButton v-show="result>0" :text="$store.state.lang.pay_ok" @click="click" />
            <p v-show="isApp===1&&result<=0" class="help">{{$store.state.lang.pay_help}}</p>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import { formatAmount } from '~/functions/utils'
import { toNativePage } from '~/functions/app'

export default {
    layout: 'base',
    components: {
        mButton
    },
    filters: {
        formatAmount(num) {
            return formatAmount(num)
        }
    },
    data() {
        return {
            fail_message: 'Your request was not accepted. Please refresh the current page or try again the payment.',
            isApp: this.$store.state.appType,
            timer: null,
            timer2: null,
            timer3: null,
            merchantAppId: '',
            load_message: ''
        }
    },
    async asyncData({ app: { $axios }, store, route }) {
        if (route.query.paytype) {
            const payType = route.query.paytype || 'InterSwitchPayDirectWeb-NG'
            try {
                $axios.setHeader('token', store.state.token)
                const { data } = await $axios.post(`/payment/v2/third-party-payment-web-notify/${payType}`, route.query)
                let result = 0
                if (data.state == 3) {
                    result = 1
                } else if (data.state == 4) {
                    result = 2
                } else {
                    result = 0
                }
                return {
                    result: result,
                    money: data.amount,
                    currency: data.currencySymbol,
                    seqNo: data.seqNo,
                    merchantAppId: data.merchantAppId,
                    merchantPayRedirectUrl: data.merchantPayRedirectUrl
                }
            } catch (e) {
                return {
                    result: 0,
                    money: 0,
                    currency: '',
                    seqNo: route.query.reference,
                    merchantAppId: '',
                    merchantPayRedirectUrl: ''
                }
            }
        } else {
            return {
                result: 0, // 0 支付查询中， 1 支付成功，2 支付失败
                money: 0,
                currency: '',
                seqNo: route.query.seqNo,
                merchantAppId: '',
                merchantPayRedirectUrl: ''
            }
        }
    },
    mounted() {
        window.payment && window.payment.setCloseVisibility && window.payment.setCloseVisibility(true)
        if (this.result > 0) {
            window.payment && window.payment.payResult(this.result == 1 ? 'SUCCESS' : 'FAIL')
            window.getChannelId && window.getChannelId.payResult && window.getChannelId.payResult(this.result == 1 ? 'SUCCESS' : 'FAIL')
            // 直接回调
            if (this.result === 1) {
                this.timer2 = setTimeout(() => {
                    if (!document.hidden) {
                        this.click()
                    }
                }, 10000)
            }
        } else {
            window.payment && window.payment.payResult('PAYING')
            window.getChannelId && window.getChannelId.payResult && window.getChannelId.payResult('PAYING')
            // wait 模式
            if (!this.seqNo) {
                this.$alert(this.$store.state.lang.error_notice)
                return false
            }

            this.load_message = sessionStorage.getItem('instructions') || this.$store.state.lang.starpay_payment_pending_message

            this.getPayStatus()
            this.timer = setInterval(() => {
                if (this.result > 0) {
                    clearInterval(this.timer)
                } else {
                    this.getPayStatus()
                }
            }, 3000)
            setTimeout(() => {
                this.load_message = this.$store.state.lang.starpay_payment_timeout_notice
            }, 30000)
        }
        const sessionAppId = sessionStorage.getItem('merchantAppId')
        if (!this.merchantAppId && sessionAppId) this.merchantAppId = sessionAppId
        this.sendEvLog({
            category: 'pay_result',
            action: 'page_show',
            label: 1,
            value: this.result,
            merchant_app_id: this.merchantAppId,
            data_source: 2
        })
    },
    methods: {
        click() {
            this.sendEvLog({
                category: 'pay_result',
                action: 'ok_click',
                label: 1,
                value: this.result,
                merchant_app_id: this.merchantAppId,
                data_source: 2
            })
            if (this.timer3) clearTimeout(this.timer3)
            if (this.isApp === 1) {
                if (this.merchantAppId && this.merchantAppId > 1000) {
                    window.getChannelId && window.getChannelId.payResult && window.getChannelId.payResultFinish(this.result == 1 ? 'SUCCESS' : 'FAIL')
                    window.getChannelId && window.getChannelId.finish()
                } else {
                    if (this.result == 1) {
                        window.getChannelId && window.getChannelId.noticePaySuccess && window.getChannelId.noticePaySuccess()
                    }
                    toNativePage('com.star.mobile.video.me.orders.MyOrdersActivity')
                    window.getChannelId && window.getChannelId.finish()
                }
            } else if (this.isApp === 2) {
                window.location.href = 'startimes://ottOrders?isBackToSource=true'
            } else {
                if (this.timer2) clearTimeout(this.timer2)
                if (this.timer) clearInterval(this.timer)
                if (window.payment) {
                    window.payment.finishActivity(this.result == 1 ? 'SUCCESS' : 'FAIL')
                } else if (this.merchantPayRedirectUrl) {
                    window.location.href = this.merchantPayRedirectUrl
                }
            }
        },
        getPayStatus() {
            this.$axios.get(`/payment/v2/order-pay-bills/${this.seqNo}`).then(res => {
                if (this.result > 0) return false
                const data = res.data
                this.merchantAppId = data.merchantAppId
                this.merchantPayRedirectUrl = data.merchantPayRedirectUrl
                if (data && data.state === 3) {
                    this.result = 1
                    this.money = data.amount
                    this.currency = data.currencySymbol
                    window.payment && window.payment.payResult('SUCCESS')
                    window.getChannelId && window.getChannelId.payResult && window.getChannelId.payResult('SUCCESS')
                    window.getChannelId && window.getChannelId.returnRechargeResult && window.getChannelId.returnRechargeResult(true)
                    this.timer2 = setTimeout(() => {
                        if (!document.hidden) {
                            this.click()
                        }
                    }, 10000)
                } else if (data && data.state === 4) {
                    this.result = 2
                    this.fail_message = data.summary ? data.summary : this.fail_message
                    window.payment && window.payment.payResult('FAIL')
                    window.getChannelId && window.getChannelId.payResult && window.getChannelId.payResult('FAIL')
                    window.getChannelId && window.getChannelId.returnRechargeResult && window.getChannelId.returnRechargeResult(false)
                }
            })
        },
        refresh() {
            this.sendEvLog({
                category: 'pay_result',
                action: 'refresh_click',
                label: 1,
                value: this.result,
                merchant_app_id: this.merchantAppId,
                data_source: 2
            })
            this.$router.go(0)
        }
    },
    head() {
        return {
            title: this.$store.state.lang.payment_results
        }
    }
}
</script>
<style scoped lang="less">
html {
    background: #eeeeee;
}
.container {
    padding: 1rem 1rem 0;
    text-align: center;
    min-height: 100%;
    background: #eeeeee;
    height: 100vh;
    .top {
        height: 19rem;
        background: #eeeeee;
        position: fixed;
        top: 0rem;
        left: 0;
        padding-top: 3rem;
        width: 100%;
        text-align: center;
        box-sizing: border-box;
    }
    img {
        &.wait {
            width: 13rem;
            height: 11rem;
        }
        &.loading {
            display: block;
            width: 3rem;
            height: 3rem;
            margin: 1rem auto;
        }
        &.success_img {
            width: 3rem;
            height: 3rem;
            margin-top: 2rem;
        }
        &.fail_img {
            width: 13rem;
            height: 11rem;
        }
    }
    &.grey-back {
        height: 100vh;
        background: #eeeeee;
    }

    .paying {
        width: 100%;
        color: #666666;
        font-size: 0.9rem;
        overflow-y: scroll;
        position: absolute;
        top: 19rem;
        bottom: 7rem;
        left: 0;
        text-align: left;
        background: #eeeeee;
        padding: 0px 1rem;
    }
    .success {
        color: #0087eb;
        font-size: 1.1rem;
        font-weight: bold;
        margin-top: 0.75rem;
    }
    .fail {
        line-height: 2rem;
        font-size: 1.2rem;
        font-weight: bold;
        color: #ff6100;
        margin-top: 1rem;
    }
    .money {
        color: #212121;
        font-size: 2rem;
        font-weight: bold;
        margin: 1rem 0 1.5rem;
        span {
            font-size: 1.25rem;
        }
    }
    .msg {
        color: #666;
        font-size: 1rem;
        line-height: 1.4rem;
        &.lf {
            text-align: left;
        }
    }
    .footer {
        position: fixed;
        bottom: 0rem;
        width: 100%;
        margin: 0 auto;
        left: 0;
        right: 0;
        z-index: 99;
        padding-bottom: 1rem;
        background: #eeeeee;
        max-height: 8rem;
        box-sizing: border-box;
        button {
            width: 75%;
        }
        .help {
            color: #0087eb;
            text-decoration: underline;
            margin-top: 0.7rem;
            font-weight: bold;
        }
    }
}
</style>
