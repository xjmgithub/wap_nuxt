<template>
    <div class="container">
        <Password ref="pass" :placeholder="pwdType" :toggle-view="true" @endinput="setPassword"/>
        <div class="forgot-pwd">
            <nuxt-link to="/hybrid/payment/wallet/resetPhone">Forgot payment password?</nuxt-link>
        </div>
        <div class="footer">
            <mButton :disabled="!canPay" :text="'PAY NOW'" @click="nextStep"/>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import Password from '~/components/password'
export default {
    layout: 'base',
    data() {
        return {
            pwdType: 'Enter Payment Password',
            password: '',
            canPay: false,
            product: this.$route.query.product
        }
    },
    components: {
        mButton,
        Password
    },
    methods: {
        setPassword(data) {
            this.password = this.$refs.pass.password
        },
        nextStep() {
            let ewallet = JSON.parse(sessionStorage.getItem('wallet_account'))
            let payObj = JSON.parse(sessionStorage.getItem('payObj'))

            this.$axios
                .post('/mobilewallet/v1/balance-payments', {
                    amount: payObj.totalAmount,
                    currency: payObj.currency,
                    note: this.product,
                    orderId: payObj.txNo,
                    payeeAccountNo: payObj.extendInfo.payeeAccountNo,
                    payerAccountNo: ewallet.accountNo,
                    payerPayPassword: this.password,
                    subject: payObj.paySubject,
                    signature: payObj.extendInfo.signature,
                    extensionInfo: {
                        paySeqNo: payObj.extendInfo.paySeqNo
                    }
                })
                .then(res => {
                    this.$router.push(`/hybrid/payment/payResult?seqNo=${payObj.paySeqNo}`)
                })
                .catch(err => {
                    this.$alert(err)
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
    background:white;
    min-height:100%;
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
    padding-top: 0.5rem;
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
