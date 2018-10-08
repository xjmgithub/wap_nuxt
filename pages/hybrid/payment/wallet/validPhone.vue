<template>
    <div class="container">
        <verifyTel ref="phone" :disabled="reset" :title="title" :prefix="prefix" @canNext="canStep1=true"></verifyTel>
        <div class="change-phone-link">
            <nuxt-link to="/hybrid/payment/wallet/resetPhone">Change cellphone number</nuxt-link>
        </div>
        <div class="footer">
            <mButton :disabled="!canStep1" text="NEXT" @click="goStep(2)"></mButton>
            <nuxt-link v-if="!init" to="/hybrid/payment/wallet/validEmail">RESET IT BY EMAIL</nuxt-link>
        </div>
        <div class="step2" v-show="step==2">
            <passInput length="4" ref="vscode" :toggleView="true" placeholder="Enter SMS verification code" @endinput="codeEnd"></passInput>
            <div class="footer">
                <mButton :disabled="!canStep2" text="NEXT" @click="goStep(3)"></mButton>
            </div>
        </div>
        <div class="step2 step3" v-show="step==3">
            <passInput length="6" ref="newpass" :toggleView="true" placeholder="Set payment password" @endinput="inputPass"></passInput>
            <div class="footer">
                <mButton :disabled="!canStep3" text="NEXT" @click="goStep(4)"></mButton>
            </div>
        </div>
        <div class="step2 step4" v-show="step==4">
            <passInput length="6" ref="confirmpass" :toggleView="true" placeholder="Confirm Password" @endinput="confirmEnd"></passInput>
            <div class="footer">
                <mButton :disabled="!canStep4" text="OK" @click="goStep(5)"></mButton>
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
            init: this.$route.query.init || false
        }
    },
    computed: {
        title() {
            return this.reset
                ? 'Confirm your cellphone number'
                : 'Enter cellphone number'
        }
    },
    mounted() {
        let walletAccount = JSON.parse(
            window.localStorage.getItem('wallet_account')
        )
        this.accountNo = walletAccount.accountNo

        if (walletAccount.phone) {
            // already set phone
            this.reset = true
            this.prefix = walletAccount.phone.substr(0, 3)
            this.$refs.phone.setTel(walletAccount.phone.substr(3))
        } else {
            this.reset = false
            this.$axios
                .get('/vup/v1/ums/user/area', {
                    headers: {
                        token: this.$store.state.token
                    }
                })
                .then(res => {
                    if (res.data && res.data.phonePrefix) {
                        this.prefix = res.data.phonePrefix
                    }
                })
        }
    },
    methods: {
        goStep(num) {
            if (num == 3) {
                let vscode = this.$refs.vscode.password
                let tel = this.$refs.phone.tel
                if (this.reset) {
                    this.$axios
                        .get(
                            `/mobilewallet/uc/v2/accounts/${
                                this.accountNo
                            }/verify-code?phone=${this.prefix +
                                tel}&verifyCode=${vscode}`,
                            {
                                headers: {
                                    token: this.$store.state.token
                                }
                            }
                        )
                        .then(res => {
                            let data = res.data
                            if (data && data.code == '0') {
                                this.step = num
                            }else{
                                this.$alert(data.message)
                            }
                        })
                } else {
                    this.$axios
                        .put(
                            `/mobilewallet/v1/accounts/${
                                this.accountNo
                            }/phone?phone=${this.prefix +
                                tel}&verifyCode=${vscode}`,
                            {},
                            {
                                headers: {
                                    token: this.$store.state.token
                                }
                            }
                        )
                        .then(res => {
                            let data = res.data
                            if (data && data.code == '0') {
                                this.step = num
                            } else {
                                this.$alert(data.message)
                            }
                        })
                }
            } else if (num == 5) {
                let vscode = this.$refs.vscode.password
                let newpass = this.$refs.newpass.password
                let confirmpass = this.$refs.confirmpass.password
                if (newpass != confirmpass) {
                    this.$alert('Two passwords are different.')
                    return false
                }
                this.$axios
                    .put(
                        `/mobilewallet/uc/v2/accounts/${
                            this.accountNo
                        }/pay-password?newPassword=${newpass}&verifyCode=${vscode}`,
                        {},
                        {
                            headers: {
                                token: this.$store.state.token
                            }
                        }
                    )
                    .then(res => {
                        let data = res.data
                        if (data && data.code == '0') {
                            this.$alert(data.message, () => {
                                this.$router.replace(
                                    '/hybrid/payment/wallet/paybyPass'
                                )
                            })
                        }
                    })
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
    },

    components: {
        verifyTel,
        mButton,
        passInput
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
    width: 16rem;
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