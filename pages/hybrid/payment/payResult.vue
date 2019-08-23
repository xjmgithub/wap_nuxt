<template>
    <div :class="{'grey-back':result==2}" class="container">
        <loading v-show="result<=0" />
        <template v-if="result=='1'">
            <img class="success_img" src="~assets/img/pay/pic_done_b.png" alt />
            <p class="success">Payment Successful</p>
            <p class="money">
                <span>{{currency}}</span>
                {{money}}
            </p>
            <p class="msg lf">Thanks for your payment. Your account has been successfully paymented. Please click "OK" if you are not redirected within 5s.</p>
        </template>
        <template v-if="result=='2'">
            <img src="~assets/img/pay/img_failed_def_b.png" alt />
            <p class="fail">Payment Failed</p>
            <p class="msg">{{fail_message}}</p>
        </template>
        <div v-show="result>0" class="footer">
            <mButton text="REFRESH" @click="refresh" />
            <mButton text="OK" @click="click" />
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import loading from '~/components/loading'
import { setCookie } from '~/functions/utils'
import { toNativePage } from '~/functions/app'
export default {
    layout: 'base',
    components: {
        mButton,
        loading
    },
    data() {
        return {
            fail_message: 'Your request was not accepted. Please refresh the current page or try again the payment.',
            isApp: this.$store.state.appType,
            timer: null,
            maxReqNum: 10,
            timer2: null,
            merchantAppId: ''
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
                    merchantAppId: data.merchantAppId
                }
            } catch (e) {
                return {
                    result: 0,
                    money: 0,
                    currency: '',
                    seqNo: route.query.reference,
                    merchantAppId: ''
                }
            }
        } else {
            return {
                result: 0, // 0 支付查询中， 1 支付成功，2 支付失败
                money: 0,
                currency: '',
                seqNo: route.query.seqNo,
                merchantAppId: ''
            }
        }
    },
    mounted() {
        if (this.result > 0) {
            window.payment && window.payment.payResult(this.result == 1 ? 'SUCCESS' : 'FAIL')
            window.getChannelId && window.getChannelId.payResult && window.getChannelId.payResult(this.result == 1 ? 'SUCCESS' : 'FAIL')
            // 直接回调
            if (this.result === 1) {
                const channel = sessionStorage.getItem('paychannel')
                if (channel) setCookie('lastpay', channel)
                this.timer2 = setTimeout(() => {
                    if (!document.hidden) {
                        this.click()
                    }
                }, 5000)
            }
        } else {
            window.payment && window.payment.payResult('PAYING')
            window.getChannelId && window.getChannelId.payResult && window.getChannelId.payResult('PAYING')
            // wait 模式
            if (!this.seqNo) {
                this.$alert('Query seqNo needed! please check request')
                return false
            }

            this.getPayStatus()
            this.timer = setInterval(() => {
                if (this.result > 0) {
                    clearInterval(this.timer)
                } else {
                    this.getPayStatus()
                }
            }, 3000)
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
            if (this.isApp === 1) {
                if (this.merchantAppId && this.merchantAppId > 2) {
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
                // toNativePage('com.star.mobile.video.me.orders.MyOrdersActivity')
                // TODO this.$router.push('/browser')
                // TODO 根据ua判断是否是我们的sdk
                if (this.timer2) clearTimeout(this.timer2)
                if (this.timer) clearInterval(this.timer)
                window.payment && window.payment.finishActivity(this.result == 1 ? 'SUCCESS' : 'FAIL')
            }
        },
        getPayStatus() {
            if (this.maxReqNum > 0) {
                this.maxReqNum--
                this.$axios.get(`/payment/v2/order-pay-bills/${this.seqNo}`).then(res => {
                    if (this.result > 0) return false
                    const data = res.data
                    if (data && data.state === 3) {
                        this.result = 1
                        const channel = sessionStorage.getItem('paychannel')
                        if (channel) setCookie('lastpay', channel)
                        this.money = data.amount
                        this.currency = data.currencySymbol
                        this.merchantAppId = data.merchantAppId
                        window.payment && window.payment.payResult('SUCCESS')
                        window.getChannelId && window.getChannelId.payResult && window.getChannelId.payResult('SUCCESS')
                        window.getChannelId && window.getChannelId.returnRechargeResult && window.getChannelId.returnRechargeResult(true)
                        this.timer2 = setTimeout(() => {
                            if (!document.hidden) {
                                this.click()
                            }
                        }, 5000)
                    } else if (data && data.state === 4) {
                        this.result = 2
                        this.fail_message = data.summary ? data.summary : this.fail_message
                        this.merchantAppId = data.merchantAppId
                        window.payment && window.payment.payResult('FAIL')
                        window.getChannelId && window.getChannelId.payResult && window.getChannelId.payResult('FAIL')
                        window.getChannelId && window.getChannelId.returnRechargeResult && window.getChannelId.returnRechargeResult(false)
                    }
                })
            } else {
                this.result = 2
            }
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
            title: 'Payment Results'
        }
    }
}
</script>
<style scoped lang="less">
.container {
    padding: 3rem 1rem 0;
    text-align: center;
    min-height: 100%;
    background: white;
    &.grey-back {
        height: 100vh;
        background: #eeeeee;
    }
}
.container img {
    width: 13rem;
    height: 11rem;
}
.container img.success_img {
    width: 3rem;
    height: 3rem;
    margin-top: 2rem;
}
.container .success {
    color: #0087eb;
    font-size: 1.1rem;
    font-weight: bold;
    margin-top: 0.75rem;
}
.container .fail {
    line-height: 2rem;
    font-size: 1.2rem;
    font-weight: bold;
    color: #ff6100;
    margin-top: 1rem;
}
.container .money {
    color: #212121;
    font-size: 2rem;
    font-weight: bold;
    margin: 1rem 0 1.5rem;
}
.container .money span {
    font-size: 1.25rem;
}
.container .msg {
    color: #666;
    font-size: 1rem;
    line-height: 1.4rem;
}
.container .msg.lf {
    text-align: left;
}
.footer {
    position: fixed;
    bottom: 2rem;
    width: 75%;
    margin: 0 auto;
    left: 0;
    right: 0;
}
</style>
