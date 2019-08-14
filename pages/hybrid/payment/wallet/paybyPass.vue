<template>
    <div class="container">
        <Password ref="pass" :toggle-view="true" placeholder="Enter Payment Password" @endinput="setPassword" />
        <div class="forgot-pwd">
            <a @click="forgetPass">Forgot payment password?</a>
        </div>
        <div class="footer">
            <mButton :disabled="!canPay" :text="'PAY NOW'" @click="nextStep" />
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import Password from '~/components/password'
import { invoke, commonPayAfter, verifyWalletPass, payWithBalance } from '~/functions/pay'
import { toNativePage } from '~/functions/app'
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
            payToken: this.$route.query.payToken || '',
            channel: this.$route.query.channel || '',
            apiType: this.$route.query.apiType,
            card: this.$route.query.card
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
    mounted() {
        const sessionPayToken = sessionStorage.getItem('payToken')
        const sessionChannel = sessionStorage.getItem('payChannel')
        if (!this.payToken && sessionPayToken) this.payToken = sessionPayToken
        if (!this.channel && sessionChannel) this.channel = sessionChannel
    },
    methods: {
        setPassword(data) {
            this.password = this.$refs.pass.password
        },
        forgetPass() {
            if (this.$store.state.appType === 1) {
                toNativePage('com.star.mobile.video.wallet.WalletForgetPwdActivity')
            } else {
                this.$router.push(`/hybrid/payment/wallet/validSignPass`)
            }
        },
        nextStep() {
            const ewallet = JSON.parse(sessionStorage.getItem('wallet'))
            this.$nuxt.$loading.start()
            this.$store.commit('SHOW_SHADOW_LAYER')
            verifyWalletPass.call(this, ewallet.accountNo, this.password, result => {
                if (this.card) {
                    invoke.call(
                        this,
                        this.payToken,
                        this.channel,
                        data => {
                            this.$nuxt.$loading.finish()
                            this.$store.commit('HIDE_SHADOW_LAYER')
                            commonPayAfter.call(this, data, 3, 2)
                        },
                        {
                            payPwdVerifyToken: result.data,
                            authorization_code: this.card
                        }
                    )
                } else {
                    invoke.call(this, this.payToken, this.channel, data => {
                        payWithBalance.call(this, ewallet.accountNo, data, this.password, res => {
                            this.$nuxt.$loading.finish()
                            this.$store.commit('HIDE_SHADOW_LAYER')
                            commonPayAfter.call(this, data, 3, 3)
                        })
                    })
                }
            })
        }
    },
    head() {
        return {
            title: 'Payment Details'
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
