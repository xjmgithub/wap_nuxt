<template>
    <div class="container">
        <loading v-show="loadStatus"></loading>
        <template v-if="result=='1'&&!loadStatus">
            <img class="success_img" src="~assets/img/pay/pic_done_b.png" alt="">
            <p class="success">
                Recharge Successful
            </p>
            <p class="money">
                {{amount}}
                <span>{{currency}}</span>
            </p>
            <p class="msg">
                Thanks for your payment. Your account has been successfully paymented. Please click "OK" if you are not redirected within 5s.
            </p>
            <p class="msg">
                Recharge No.:{{accountNo}} <br />
                Recharge amount: {{amount}} {{currensySymbol}} <br />
                eWallet balance: {{balance}} {{balanceCurrency}} <br />
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
            balance:'',
            balanceCurrency:'',
            accountNo:''
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
        if (this.result == 2) {
            this.loadStatus = false
        } else {
            this.loadStatus = true
            this.$axios
                .get('/mobilewallet/v1/accounts/me')
                .then(res => {
                    if (res.data) {
                        localStorage.setItem(
                            'wallet_account',
                            JSON.stringify(res.data)
                        )
                        this.accountNo = res.data.accountNo
                        this.balance = res.data.amount
                        this.balanceCurrency = res.data.currencySymbol
                        this.loadStatus = false
                    }
                })
        }
    },
    methods: {
        back() {
            window.location.href = '/hybrid/payment/wallet/payto'
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
    width: 12rem;
    height: 12rem;
}
.container img.success_img {
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
    margin: 1rem;
}
.container .money span {
    font-size: 1.25rem;
}
.container .msg {
    color: #666;
    font-size: 1rem;
    line-height: 1.4rem;
    text-align: left;
    margin-top: 2rem;
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