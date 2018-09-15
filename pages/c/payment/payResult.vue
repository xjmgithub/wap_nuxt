<template>
    <div class="container">
        <loading v-show="loadStatus"></loading>
        <template v-if="result=='1'&&!loadStatus">
            <img src="~assets/img/pay/pic_done_b.png" alt="">
            <p class="success">
                Payment Successful
            </p>
            <p class="money">
                50.00
                <span>Ksh</span>
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
            result: 0, // 0 支付查询中， 1 支付成功，2 支付失败
            loadStatus: true,
            fail_message: '',
            payToken: this.$route.query.payToken,
            redirect: this.$route.query.redirect
        }
    },
    components: {
        mButton,
        loading
    },
    mounted() {
        if (!this.payToken) {
            this.$alert('Query payToken needed! please check request')
            return false
        }

        this.$axios
            .get('/payment/api/v2/get-pre-payment', {
                payToken: this.payToken
            })
            .then(res => {
                let data = res.data
                // TODO 支付结果
            })
    },
    methods: {
        back() {
            // 退回商户
            window.location.href = this.redirect
        }
    }
}
</script>
<style scoped>
.container {
    font-family: 'Roboto';
    padding: 5rem 1rem 0;
    text-align: center;
}
.container img {
    width: 3rem;
    height: 3rem;
}
.container .success {
    color: #0087eb;
    font-size: 1.1rem;
    font-weight: bold;
    margin-top: 0.75rem;
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
    text-align: left;
}
.footer {
    position: fixed;
    bottom: 2rem;
    width: 16rem;
    margin: 0 auto;
    left: 0;
    right: 0;
}
</style>