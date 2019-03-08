<template>
    <div class="container">
        <Password ref="pass" :toggle-view="true" @endinput="setPassword" placeholder="Enter Payment Password" />
        <div class="forgot-pwd">
            <nuxt-link to="/hybrid/payment/wallet/resetPhone">
                Forgot payment password?
            </nuxt-link>
        </div>
        <div class="footer">
            <mButton :disabled="!canPay" :text="'PAY NOW'" @click="nextStep" />
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import Password from '~/components/password'
import { createDVBOrder, invoke, commonPayAfter } from '~/functions/pay'
export default {
    layout: 'base',
    components: {
        mButton,
        Password
    },
    data() {
        return {
            password: '',
            canPay: false,
            product: this.$route.query.product,
            card: this.$route.query.card // paystack card
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
    },
    methods: {
        setPassword(data) {
            this.password = this.$refs.pass.password
        },
        nextStep() {
            const ewallet = JSON.parse(sessionStorage.getItem('wallet'))
            const payObj = JSON.parse(sessionStorage.getItem('payObj'))
            const order = JSON.parse(sessionStorage.getItem('order-info'))
            const opt = this.card ? { authorization_code: this.card } : null

            if (this.card) {
                this.$axios.get(`/mobilewallet/v1/accounts/${ewallet.accountNo}/pay-password?password=${this.password}`).then(res => {
                    if (res.data.code === 0) {
                        createDVBOrder(this, order, data => {
                            invoke(
                                this,
                                data.paymentToken,
                                993102,
                                data => {
                                    this.$nuxt.$loading.finish()
                                    this.$store.commit('HIDE_SHADOW_LAYER')
                                    commonPayAfter(this, data, 3, 2)
                                },
                                opt
                            )
                        })
                    } else {
                        this.$alert('Incorrect payment password.')
                    }
                })

                return false
            }

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
    }
}
</script>
<style scoped>
.container {
    padding: 6rem 1rem 0 1rem;
    background: white;
    min-height: 100%;
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
