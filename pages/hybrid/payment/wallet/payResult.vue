<template>
    <div class="container" :class="{'grey-back':result==2}">
        <loading v-show="loadStatus"></loading>
        <template v-if="result=='1'&&!loadStatus">
            <img class="success_img" src="~assets/img/pay/pic_done_b.png" alt="">
            <p class="success">
                Payment Successful
            </p>
            <p class="money">
                {{amount}}
                <span>{{currency}}</span>
            </p>
            <p class="msg">
                Thanks for your payment. Your account has been successfully paymented. Please click "OK" if you are not redirected within 5s.
            </p>
        </template>
        <template v-if="result=='2'&&!loadStatus">
            <img src="~assets/img/pay/img_failed_def_b.png" alt="">
            <p class="fail">
                Payment Failed
            </p>
            <p class="msg">
                {{fail_message}}
            </p>
        </template>
        <div class="footer" v-show="!loadStatus">
            <mButton :disabled="false" text="OK" @click="back"></mButton>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import loading from '~/components/loading'
export default {
    layout: 'base',
    data() {
        return {
            result: this.$route.query.result || 0, // 0 支付查询中， 1 支付成功，2 支付失败
            loadStatus: true,
            fail_message: this.$route.query.message || '',
            payToken: this.$route.query.payToken,
            amount: this.$route.query.amount || '',
            currency: this.$route.query.currency || '',
            currensySymbol: this.$route.query.currensySymbol || '',
            redirect: this.$route.query.redirect
        }
    },
    components: {
        mButton,
        loading
    },
    mounted() {
        if (this.result == 1 || this.result == 2) {
            this.loadStatus = false
        }
        let _this = this
        setInterval(function() {
            window.location.href = _this.redirect
        }, 5000)
    },
    methods: {
        back() {
            window.location.href = this.redirect
        }
    }
}
</script>
<style scoped lang="less">
.container {
    padding: 5rem 1rem 0;
    text-align: center;
    &.grey-back {
        height: 100vh;
        background: #EEEEEE;
    }
}
.container img {
    width: 15rem;
    height: 13rem;
}
.container img.success_img {
    width: 3rem;
    height: 3rem;
    margin-top:2rem;
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
.container .msg.lf{
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