<template>
    <div class="container">
        <div v-if="goodMsg" class="goods">
            <p class="pay-money">
                <span>{{goodMsg.symbol}}</span>
                {{goodMsg.amount}}
            </p>
        </div>
        <p class="password">{{$store.state.lang.enter_pay_password}}</p>
        <Password ref="pass" :toggle-view="true" :placeholder="$store.state.lang.enter_pay_password" @endinput="setPassword" @inputing="setPassword" />
        <div class="forgot-pwd">
            <a @click="forgetPass">{{$store.state.lang.forgot_payment_password}}</a>
        </div>
        <div class="footer">
            <mButton :disabled="!canPay" :text="$store.state.lang.text_onair_next" @click="nextStep" />
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import Password from '~/components/password'
import { invoke, getInvokeResult, commonPayAfter, verifyWalletPass, payWithBalance } from '~/functions/pay'
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
            merchantAppId: this.$route.query.merchantAppId || '',
            apiType: this.$route.query.apiType,
            card: this.$route.query.card || '',
            goodMsg: {},
            time: 0,
            timer: null
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
    beforeRouteLeave(to, from, next) {
        this.$toastLoading()
        next()
    },
    mounted() {
        const sessionPayToken = sessionStorage.getItem('payToken')
        const sessionChannel = sessionStorage.getItem('payChannel')
        const sessionAppId = sessionStorage.getItem('merchantAppId')
        const card = sessionStorage.getItem('card') || ''
        if (!this.payToken && sessionPayToken) this.payToken = sessionPayToken
        if (!this.channel && sessionChannel) this.channel = sessionChannel
        if (!this.merchantAppId && sessionAppId) this.merchantAppId = sessionAppId
        if (!this.card && card) this.card = card
        this.goodMsg = JSON.parse(sessionStorage.getItem('goodMsg'))
        this.sendEvLog({
            category: 'paybypass',
            action: 'page_show',
            label: 1,
            value: 1,
            merchant_app_id: this.merchantAppId,
            data_source: 2
        })
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
        // state=1 至多循环20次
        getInvoke(seqNo) {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                if (this.time >= 20) {
                    clearTimeout(this.timer)
                    this.$toastLoading()
                    this.$alert(this.$store.state.lang.invoke_timeout_notice)
                    this.sendEvLog({
                        category: 'invoke_error_notice',
                        action: 'popup_show',
                        label: 'invoke_timeout_notice',
                        value: ''
                    })
                    this.time = 0
                    return false
                }
                this.paymentInitResult(seqNo)
                this.time++
            }, 3000)
        },
        // 异步获取invoke状态
        paymentInitResult(seqNo) {
            if (location.pathname.indexOf('hybrid/payment/wallet/paybyPass') < 0) {
                clearTimeout(this.timer)
                return false
            }
            getInvokeResult.call(this, seqNo, result => {
                if (result.state == 1) {
                    this.getInvoke(seqNo)
                } else {
                    this.$toastLoading()
                    result.paySeqNo = result.seqNo
                    commonPayAfter.call(this, result, 3, 3)
                }
            })
        },
        nextStep() {
            const ewallet = JSON.parse(sessionStorage.getItem('wallet'))
            verifyWalletPass.call(this, ewallet.accountNo, this.password, result => {
                this.$toastLoading(1)
                if (this.card) {
                    invoke.call(
                        this,
                        this.payToken,
                        this.channel,
                        data => {
                            this.$toastLoading()
                            commonPayAfter.call(this, data, 3, 3)
                        },
                        seqNo => {
                            this.paymentInitResult(seqNo)
                        },
                        {
                            payPwdVerifyToken: result.data,
                            authorization_code: this.card
                        }
                    )
                } else {
                    invoke.call(
                        this,
                        this.payToken,
                        this.channel,
                        data => {
                            payWithBalance.call(this, ewallet.accountNo, data, this.password, res => {
                                this.$toastLoading()
                                commonPayAfter.call(this, data, 3, 3)
                            })
                        },
                        seqNo => {
                            this.paymentInitResult(seqNo)
                        }
                    )
                }
            })
            this.sendEvLog({
                category: 'paybypass',
                action: 'next_click',
                label: 1,
                value: 'pass_right',
                merchant_app_id: this.merchantAppId,
                data_source: 2
            })
        }
    },
    head() {
        return {
            title: this.$store.state.lang.payment_details
        }
    }
}
</script>
<style scoped>
.container {
    padding: 2rem 1rem;
    background: white;
    min-height: 100%;
    position: relative;
}
.goods {
    width: 90%;
    text-align: center;
    padding: 0.8rem 0;
    background: #ffffff;
    height: 5rem;
}
.pay-money {
    font-weight: bold;
    font-size: 2.25rem;
    color: #212121;
    margin-bottom: 0.8rem;
}
.pay-money span {
    font-size: 1.25rem;
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
