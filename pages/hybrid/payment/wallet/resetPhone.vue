<template>
    <div class="container">
        <verifyTel ref="phone" :disabled="!nocheck" :title="title" :prefix="prefix" @canNext="canStep1=true" />
        <div class="footer">
            <mButton :disabled="!canStep1" :text="$store.state.lang.text_onair_next" @click="goStep(2)" />
        </div>
        <div v-show="step==2" class="step2">
            <div class="label">{{$store.state.lang.enter_code}}</div>
            <passInput ref="vscode" :length="4" :toggle-view="true" :default-view="0" @endinput="codeEnd" />
            <div class="footer">
                <mButton :disabled="!canStep2" :text="$store.state.lang.text_onair_next" @click="goStep(3)" />
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
            canStep1: false,
            canStep2: false,
            step: 1,
            nocheck: this.$route.query.nocheck || false,
            accountNo: '',
            prefix: '',
            oldphone: this.$route.query.oldphone,
            vscode: this.$route.query.vscode
        }
    },
    computed: {
        title() {
            return !this.nocheck ? this.$store.state.lang.confirm_phone_number : this.$store.state.lang.enter_phone_number
        }
    },
    mounted() {
        const walletAccount = JSON.parse(sessionStorage.getItem('wallet'))
        const sessionAppId = sessionStorage.getItem('merchantAppId')
        this.accountNo = walletAccount.accountNo
        if (!this.nocheck) {
            if (walletAccount.phone) {
                this.prefix = walletAccount.phone.substr(0, 3)
                this.$refs.phone.setTel(walletAccount.phone.substr(3))
            } else {
                this.$alert(this.$store.state.lang.unknown_error)
            }
        } else {
            this.$axios.get('/vup/v1/ums/user/area').then(res => {
                if (res.data && res.data.phonePrefix) {
                    this.prefix = res.data.phonePrefix
                }
            })
        }
        this.sendEvLog({
            category: 'set_password',
            action: 'reset_phone_show',
            label: 1,
            value: 1,
            merchant_app_id: sessionAppId,
            data_source: 2
        })
    },
    methods: {
        goStep(num) {
            if (num === 3) {
                const vscode = this.$refs.vscode.password
                const tel = this.$refs.phone.tel
                if (this.nocheck) {
                    this.$axios
                        .put(
                            `/mobilewallet/v1/accounts/${this.accountNo}/phone?phone=${this.prefix + tel}&verifyCode=${vscode}&oldPhone=${
                                this.oldphone
                            }&verifyCode4Old=${this.vscode}`
                        )
                        .then(res => {
                            const data = res.data
                            if (data && data.code === 0) {
                                this.$alert(this.$store.state.lang.set_phone_succ, () => {
                                    window.location.href = '/hybrid/payment/wallet/setPassword?dissphone=1'
                                })
                            } else {
                                this.$alert(data.message)
                            }
                        })
                } else {
                    this.$axios
                        .get(`/mobilewallet/uc/v2/accounts/${this.accountNo}/verify-code?phone=${this.prefix + tel}&verifyCode=${vscode}`)
                        .then(res => {
                            const data = res.data
                            if (data && data.code === 0) {
                                window.location.href = `/hybrid/payment/wallet/resetPhone?nocheck=1&oldphone=${this.prefix + tel}&vscode=${vscode}`
                            } else {
                                this.$alert(data.message)
                            }
                        })
                }
            } else {
                const tel = this.$refs.phone.tel
                if (this.oldphone === this.prefix + tel) {
                    this.$alert(this.$store.state.lang.phone_already_set)
                    return false
                } else {
                    this.step = num
                }
            }
        },
        codeEnd(bool) {
            this.canStep2 = bool
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    padding: 3rem 1rem;
    min-height: 100%;
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
</style>
