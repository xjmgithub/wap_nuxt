<template>
    <div class="container">
        <div v-show="step==1" class="step1">
            <verify-tel
                ref="phone"
                :title="reset?'Confirm your cellphone number':'Enter your phone number'"
                :disabled="reset"
                @canNext="canStep2=true"
            />
            <div class="change-phone">
                <nuxt-link to="/hybrid/payment/wallet/resetPhone">Change cellphone number</nuxt-link>
            </div>
            <div class="footer">
                <mButton :disabled="!canStep2" text="NEXT" @click="goStep(2)" />
            </div>
        </div>
        <div v-show="step==2" class="step2">
            <div class="label">Enter SMS vertification code</div>
            <passInput ref="vscode" :length="4" :toggle-view="true" @endinput="canStep3=true" @inputing="canStep3=false" />
            <div class="footer">
                <mButton :disabled="!canStep3" text="NEXT" @click="goStep(3)" />
            </div>
        </div>
        <div v-show="step==3" class="step2 step3">
            <div class="label">Set payment password</div>
            <passInput ref="newpass" :toggle-view="true" placeholder="Set a 6-bit password" @endinput="canStep4=true" @inputing="canStep4=false" />
            <div class="footer">
                <mButton :disabled="!canStep4" text="NEXT" @click="goStep(4)" />
            </div>
        </div>
        <div v-show="step==4" class="step2 step4">
            <div class="label">Confirm password</div>
            <passInput ref="confirmpass" :toggle-view="true" placeholder="Confirm password" @endinput="canStep5=true" @inputing="canStep5=false" />
            <div class="footer">
                <mButton :disabled="!canStep5" text="OK" @click="goStep(5)" />
            </div>
        </div>
    </div>
</template>
<script>
import verifyTel from '~/components/form/wallet_tel_verify'
import passInput from '~/components/password'
import mButton from '~/components/button'
import { invoke, commonPayAfter, payWithBalance } from '~/functions/pay'
import { setCookie } from '~/functions/utils'
export default {
    layout: 'base',
    components: {
        verifyTel,
        passInput,
        mButton
    },
    data() {
        return {
            loadStatus: true,
            canStep2: false,
            canStep3: false,
            canStep4: false,
            canStep5: false,
            reset: false,
            accountNo: null,
            channel: this.$route.query.channel,
            payToken: this.$route.query.payToken,
            card: this.$route.query.card // paystack card
        }
    },
    async asyncData({ app: { $axios }, store }) {
        try {
            $axios.setHeader('token', store.state.token)
            const res = await $axios.get('/vup/v1/ums/user/area', {
                headers: {
                    versionCode: '5300',
                    clientType: 'android',
                    token: store.state.token
                }
            })
            const configs = res.data && res.data.appFBConfigs
            let type = true
            configs.forEach(item => {
                if (item.functionBlockType === 91) {
                    if (item.validType === 2) {
                        type = true
                    } else {
                        type = false
                    }
                }
            })

            if (type === true) {
                return { step: 1 }
            } else {
                return { step: 3 }
            }
        } catch (e) {
            return { step: 1 }
        }
    },
    mounted() {
        const walletAccount = JSON.parse(window.sessionStorage.getItem('wallet'))
        this.accountNo = walletAccount.accountNo
        if (walletAccount.phone) {
            this.reset = true
            this.$refs.phone.setTel(walletAccount.phone.substr(3))
        }
    },
    methods: {
        goStep(num) {
            if (num === 3) {
                const vscode = this.$refs.vscode.password
                const tel = this.$refs.phone.tel
                const prefix = this.$refs.phone.prefix
                if (this.reset) {
                    this.$axios
                        .get(`/mobilewallet/uc/v2/accounts/${this.accountNo}/verify-code?phone=${prefix + tel}&verifyCode=${vscode}`)
                        .then(res => {
                            const data = res.data
                            if (data && data.code === 0) {
                                this.step = num
                            } else {
                                this.$alert(data.message)
                            }
                        })
                } else {
                    this.$axios.put(`/mobilewallet/v1/accounts/${this.accountNo}/phone?phone=${prefix + tel}&verifyCode=${vscode}`, {}).then(res => {
                        const data = res.data
                        if (data && data.code === 0) {
                            this.$alert('Set phone successfully', () => {
                                this.step = num
                            })
                        } else {
                            this.$alert(data.message)
                        }
                    })
                }
            } else if (num === 5) {
                const vscode = this.$refs.vscode.password
                const newpass = this.$refs.newpass.password
                const confirmpass = this.$refs.confirmpass.password
                if (newpass !== confirmpass) {
                    this.$alert('Password do not match.Please try again.')
                    return false
                }
                this.$axios
                    .put(`/mobilewallet/uc/v2/accounts/${this.accountNo}/pay-password?newPassword=${newpass}&verifyCode=${vscode}`, {})
                    .then(res => {
                        if (res.data && res.data.code === 0) {
                            this.pay()
                        } else {
                            this.$alert(res.data.message)
                        }
                    })
            } else if (num === 4) {
                const newpass = this.$refs.newpass.password
                const reg = /^[\d]+$/
                if (!reg.test(newpass)) {
                    this.$alert('You must enter pure numbers.')
                    return false
                }
                this.step = num
            } else {
                this.step = num
            }
        },
        pay() {
            this.$nuxt.$loading.start()
            this.$store.commit('SHOW_SHADOW_LAYER')
            if (this.card) {
                invoke.call(
                    this,
                    this.payToken,
                    993102,
                    data => {
                        this.$nuxt.$loading.finish()
                        this.$store.commit('HIDE_SHADOW_LAYER')
                        commonPayAfter.call(this, data, 3, 3)
                    },
                    { authorization_code: this.card }
                )
                return false
            } else {
                invoke.call(this, this.payToken, this.channel, data => {
                    payWithBalance.call(this, this.accountNo, data, this.$refs.newpass.password, res => {
                        this.$nuxt.$loading.finish()
                        this.$store.commit('HIDE_SHADOW_LAYER')
                        this.$router.push(`/hybrid/payment/payResult?seqNo=${data.paySeqNo}`)
                    })
                })
            }
        }
    },
    head() {
        return {
            title: this.reset ? 'Reset Password' : 'Setting Password'
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    padding: 3rem 0.6rem;
    height: 100%;
    background: white;
    .step2 {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: white;
        z-index: 2;
        padding: 3rem 1rem;
    }
    .step3 {
        z-index: 3;
    }
    .change-phone-link {
        text-align: right;
        a {
            color: #0087eb;
            text-decoration: underline;
            font-size: 0.9rem;
            font-weight: bold;
        }
    }
}
.footer {
    position: fixed;
    bottom: 3rem;
    width: 75%;
    margin: 0 auto;
    left: 0;
    right: 0;
    text-align: center;
    a {
        color: #0087eb;
        text-decoration: underline;
        font-size: 0.8rem;
        font-weight: bold;
    }
}
.change-phone {
    text-align: right;
    text-decoration: underline;
    a {
        color: #0087eb;
    }
}
</style>
