<template>
    <div class="container">
        <Password ref="pass" :placeholder="pwdType" :toggleView="false" @endinput="setPassword"></Password>
        <div class="forgot-pwd">
            <nuxt-link :to="forgetUrl">Forgot payment password?</nuxt-link>
        </div>
        <div class="footer">
            <mButton :disabled="!canPay" :text="'PAY NOW'" @click="nextStep"></mButton>
        </div>
    </div>

</template>
<script>
import mButton from '~/components/button'
import Password from '~/components/password'
export default {
    data() {
        return {
            pwdType: 'Enter Payment Password',
            payChannelId: '',
            password: '',
            canPay: false,
            forgetUrl: '/hybrid/payment/wallet/resetPhone'
        }
    },
    layout: 'base',
    components: {
        mButton,
        Password
    },
    mounted() {
        let wallet_config = JSON.parse(
            window.localStorage.getItem('wallet_config')
        )
        this.payChannelId = JSON.parse(
            window.localStorage.getItem('payChannelId')
        )
        if (wallet_config.phone) {
            this.forgetUrl = '/hybrid/payment/wallet/validPhone'
        } else {
            this.forgetUrl = '/hybrid/payment/wallet/validEmail'
        }
    },
    methods: {
        setPassword(data) {
            this.password = this.$refs.pass.password
        },
        nextStep() {
            let payObject = JSON.parse(localStorage.getItem('payObject'))
            let ewallet = JSON.parse(localStorage.getItem('wallet_account'))
            let order = localStorage.getItem('txNo')

            this.$axios
                .post('/mobilewallet/v1/balance-payments', {
                    amount: payObject.totalAmount,
                    currency: payObject.currency,
                    note: payObject.payNote,
                    orderId: order,
                    payeeAccountNo: this.payChannelId,
                    payerAccountNo: ewallet.accountNo,
                    payerPayPassword: this.password,
                    subject: payObject.paySubject
                })
                .then(res => {
                    if (res.data && res.data.resultCode == 0) {
                        this.$router.push(
                            '/hybrid/payment/wallet/payResult?result=1'
                        )
                    } else {
                        this.$router.push(
                            '/hybrid/payment/wallet/payResult?result=2&resultMsg=' +
                                res.data.resultMessage
                        )
                    }
                })
        }
    },
    watch: {
        password(val, oldVal) {
            if (val.length >= 6) {
                this.canPay = true
            } else {
                this.canPay = false
            }
        }
    }
}
</script>
<style scoped>
.container {
    padding: 6rem 1rem 0 1rem;
    font-family: 'Roboto';
}

.forgot-pwd {
    text-align: right;
}

.forgot-pwd a {
    color: #0087eb;
    font-size: 0.85rem;
    font-weight: bold;
    display: inline-block;
    border-bottom: 1px solid #0087eb;
    padding-top: 0.3rem;
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