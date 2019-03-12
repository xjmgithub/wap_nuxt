<template>
    <div :class="{'grey-back':result==2}" class="container">
        <loading v-show="loadStatus"/>
        <template v-if="result=='1'&&!loadStatus">
            <img class="success_img" src="~assets/img/pay/pic_done_b.png" alt>
            <p class="success">Payment Successful</p>
            <p class="money">
                <span>{{currency}}</span>
                {{money}}
            </p>
            <p
                class="msg lf"
            >Thanks for your payment. Your account has been successfully paymented. Please click "OK" if you are not redirected within 5s.</p>
        </template>
        <template v-if="result=='2'&&!loadStatus">
            <img src="~assets/img/pay/img_failed_def_b.png" alt>
            <p class="fail">Payment Failed</p>
            <p class="msg">{{fail_message}}</p>
        </template>
        <div v-show="!loadStatus" class="footer">
            <mButton @click="refresh" text="REFRESH"/>
            <mButton @click="click" text="OK"/>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import loading from '~/components/loading'
import { toNativePage } from '~/functions/utils'
export default {
    layout: 'base',
    components: {
        mButton,
        loading
    },
    data() {
        return {
            result: 0, // 0 支付查询中， 1 支付成功，2 支付失败
            loadStatus: true,
            fail_message: 'Your request was not accepted. Please refresh the current page or try again the payment.',
            money: '',
            currency: '',
            redirect: '',
            seqNo: this.$route.query.seqNo,
            isApp: this.$store.state.appType
        }
    },
    mounted() {
        if (!this.seqNo) {
            this.$alert('Query seqNo needed! please check request')
            return false
        }
        const _this = this
        let num = 5

        const timer = setInterval(() => {
            num--
            if (num < 0) {
                clearInterval(timer)
                _this.result = 2
                _this.loadStatus = false
            }

            _this.$axios.get(`/payment/v2/order-pay-bills/${this.seqNo}`).then(res => {
                const data = res.data

                if (data && data.state === 3) {
                    _this.result = 1
                    _this.loadStatus = false
                    _this.money = data.amount
                    _this.currency = data.currencySymbol
                    clearInterval(timer)
                    window.getChannelId && window.getChannelId.returnRechargeResult && window.getChannelId.returnRechargeResult(true)
                } else {
                    _this.result = 2
                    _this.loadStatus = false
                    clearInterval(timer)
                    window.getChannelId && window.getChannelId.returnRechargeResult && window.getChannelId.returnRechargeResult(false)
                }
            })
        }, 4000)
    },
    methods: {
        click() {
            if (this.isApp === 1||this.isApp === '1') {
                toNativePage('com.star.mobile.video.me.orders.MyOrdersActivity')
                window.getChannelId && window.getChannelId.finish()
            } else if (this.isApp === 2||this.isApp === '2') {
                window.location.href = 'startimes://ottOrders?isBackToSource=true'
            } else {
                this.$router.push('/browser')
            }
        },
        refresh() {
            this.$router.go(0)
        }
    }
}
</script>
<style scoped lang="less">
.container {
    padding: 5rem 1rem 0;
    text-align: center;
    min-height: 100%;
    background: white;
    &.grey-back {
        height: 100vh;
        background: #eeeeee;
    }
}
.container img {
    width: 15rem;
    height: 13rem;
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
    line-height: 3rem;
    font-size: 1.3rem;
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
