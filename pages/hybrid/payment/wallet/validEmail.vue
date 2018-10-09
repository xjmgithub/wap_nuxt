<template>
    <div class="container">
        <verifyEmail :disabled="reset" ref="emailCont"></verifyEmail>
        <div class="change-phone-link" v-if="reset">
            <nuxt-link to="/hybrid/payment/wallet/resetEmail">Change email</nuxt-link>
        </div>
        <div class="footer">
            <mButton :disabled="false" text="NEXT" @click="goStep(2)"></mButton>
            <nuxt-link v-if="!init&&wallet_phone_config" to="/hybrid/payment/wallet/validPhone">RESET IT BY CELLPHONE NUMBER</nuxt-link>
        </div>
        <div class="step2" v-show="step==2">
            <passInput length="4" ref="vscode" :toggleView="true" placeholder="Enter SMS verification code"></passInput>
            <div class="footer">
                <mButton :disabled="false" text="NEXT" @click="goStep(3)"></mButton>
            </div>
        </div>
        <div class="step2 step3" v-show="step==3">
            <passInput ref="newpass" :toggleView="true" placeholder="Set payment password" @endinput="inputPass"></passInput>
            <div class="footer">
                <mButton :disabled="!canStep3" text="NEXT" @click="goStep(4)"></mButton>
            </div>
        </div>
        <div class="step2 step4" v-show="step==4">
            <passInput ref="confirmpass" :toggleView="true" placeholder="Confirm Password" @endinput="confirmEnd"></passInput>
            <div class="footer">
                <mButton :disabled="!canStep4" text="OK" @click="goStep(5)"></mButton>
            </div>
        </div>
    </div>
</template>
<script>
import verifyEmail from '~/components/form/wallet_email_verify'
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
            init: this.$route.query.init || false,
            wallet_phone_config: false
        }
    },
    components: {
        verifyEmail,
        mButton,
        passInput
    },
    mounted() {
        let walletAccount = JSON.parse(
            window.localStorage.getItem('wallet_account')
        )
        this.accountNo = walletAccount.accountNo

        if (walletAccount.phone) {
            this.wallet_phone_config = true
        }
        if (walletAccount.email) {
            // already set email
            this.reset = true
            this.$refs.emailCont.setEmail(walletAccount.email)
        }
    },
    methods: {
        goStep(num) {
            if (num == 2) {
                let email = this.$refs.emailCont.email
                this.$axios
                    .post(
                        `/mobilewallet/uc/v2/accounts/${
                            this.accountNo
                        }/verify-code-mail?email=${email}`,
                        {},
                        {
                            headers: {
                                token: this.$store.state.token
                            }
                        }
                    )
                    .then(res => {
                        if (res.data.code == 0) {
                            this.step = num
                        }
                    })
            } else if (num == 3) {
                let vscode = this.$refs.vscode.password
                let email = this.$refs.emailCont.email
                let wallet_config = JSON.parse(
                    localStorage.getItem('wallet_config')
                )

                if (this.reset) {
                    // 验证邮箱
                    this.$axios
                        .get(
                            `/mobilewallet/uc/v2/accounts/${
                                this.accountNo
                            }/verify-code?phone=${email}&verifyCode=${vscode}`,
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
                } else {
                    // 设置邮箱
                    this.$axios
                        .put(
                            `/mobilewallet/uc/v2/accounts/${
                                this.accountNo
                            }/setEmail?email=${email}&verifyCode=${vscode}`,
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
                                if (wallet_config.payPassword == 'true') {
                                    this.$router.replace(
                                        '/hybrid/payment/wallet/paybyPass'
                                    )
                                } else {
                                    this.step = num
                                }
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
                                window.location.href = './payto'
                            })
                        }
                    })
            } else if (num == 4) {
                let newpass = this.$refs.newpass.password
                let reg = /^[\d]+$/
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