<template>
    <div class="container">
        <verifyTel ref="phone" :disabled="reset" :title="title" :prefix="prefix" @canNext="canStep1=true" />
        <div v-if="reset" class="change-phone-link">
            <nuxt-link to="/hybrid/payment/wallet/resetPhone">
                Change cellphone number
            </nuxt-link>
        </div>
        <div class="footer">
            <mButton :disabled="!canStep1" @click="goStep(2)" text="NEXT" style="margin-bottom:0.5rem" />
            <nuxt-link v-if="!init&&wallet_email_config" to="/hybrid/payment/wallet/validEmail">
                RESET IT BY EMAIL
            </nuxt-link>
        </div>
        <div v-show="step==2" class="step2">
            <passInput />
            <div class="footer">
                <mButton :disabled="!canStep2" @click="goStep(3)" text="NEXT" />
            </div>
        </div>
        <div v-show="step==3" class="step2 step3">
            <passInput />
            <div class="footer">
                <mButton :disabled="!canStep3" @click="goStep(4)" text="NEXT" />
            </div>
        </div>
        <div v-show="step==4" class="step2 step4">
            <passInput />
            <div class="footer">
                <mButton :disabled="!canStep4" @click="goStep(5)" text="OK" />
            </div>
        </div>
    </div>
</template>
<script>
import verifyTel from '~/components/form/wallet_tel_verify'
import mButton from '~/components/button'
import passInput from '~/components/password'
export default {
    layout: 'base',
    components: {
        verifyTel,
        mButton,
        passInput
    },
    data() {
        return {
            reset: false,
            canStep1: false,
            canStep2: false,
            canStep3: false,
            canStep4: false,
            step: 1,
            accountNo: '',
            prefix: '',
            init: this.$route.query.init || false,
            wallet_email_config: false
        }
    },
    computed: {
        title() {
            return this.reset ? 'Confirm your cellphone number' : 'Enter cellphone number'
        }
    },
    mounted() {
        const walletAccount = JSON.parse(window.sessionStorage.getItem('wallet'))
        this.accountNo = walletAccount.accountNo
        if (walletAccount.email) {
            this.wallet_email_config = true
        }

        if (walletAccount.phone) {
            // already set phone
            this.reset = true
            this.prefix = walletAccount.phone.substr(0, 3)
            this.$refs.phone.setTel(walletAccount.phone.substr(3))
        } else {
            this.reset = false
            this.$axios.get('/vup/v1/ums/user/area').then(res => {
                if (res.data && res.data.phonePrefix) {
                    this.prefix = res.data.phonePrefix
                }
            })
        }
    },
    methods: {
        goStep(num) {
            if (num === 3) {
                const vscode = this.$refs.vscode.password
                const tel = this.$refs.phone.tel
                if (this.reset) {
                    this.$axios
                        .get(`/mobilewallet/uc/v2/accounts/${this.accountNo}/verify-code?phone=${this.prefix + tel}&verifyCode=${vscode}`)
                        .then(res => {
                            const data = res.data
                            if (data && data.code === '0') {
                                this.step = num
                            } else {
                                this.$alert(data.message)
                            }
                        })
                } else {
                    this.$axios
                        .put(`/mobilewallet/v1/accounts/${this.accountNo}/phone?phone=${this.prefix + tel}&verifyCode=${vscode}`, {})
                        .then(res => {
                            const data = res.data
                            if (data && data.code === '0') {
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
                    this.$confirm(
                        'Password do not match.Please try again.',
                        () => {
                            window.location.href = '/hybrid/payment/wallet/validPhone'
                        },
                        () => {
                            this.$confirm('Cancel setting your payment password?', () => {
                                window.location.href = '/hybrid/payment/wallet/payto'
                            })
                        }
                    )
                    return false
                }
                this.$axios
                    .put(`/mobilewallet/uc/v2/accounts/${this.accountNo}/pay-password?newPassword=${newpass}&verifyCode=${vscode}`, {})
                    .then(res => {
                        const data = res.data
                        if (data && data.code === '0') {
                            this.$alert(data.message, () => {
                                this.$router.replace('/hybrid/payment/wallet/paybyPass')
                            })
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
        codeEnd(bool) {
            this.canStep2 = bool
        },
        inputPass(bool) {
            this.canStep3 = bool
        },
        confirmEnd(bool) {
            this.canStep4 = bool
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    padding: 3rem 1rem;
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
</style>
