<template>
    <div class="container">
        <verifyEmail ref="emailCont"></verifyEmail>
        <div class="footer">
            <mButton :disabled="false" text="NEXT" @click="goStep(2)"></mButton>
        </div>
        <div class="step2" v-show="step==2">
            <passInput length="4" ref="vscode" placeholder="Enter SMS verification code"></passInput>
            <div class="footer">
                <mButton :disabled="false" text="NEXT" @click="goStep(3)"></mButton>
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
            canStep1: false,
            canStep2: false,
            nocheck: this.$route.query.nocheck || false,
            step: 1,
            accountNo: '',
            oldemail: this.$route.query.oldemail,
            vscode: this.$route.query.vscode
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
        if (!this.nocheck) {
            if (walletAccount.email) {
                this.$refs.emailCont.setEmail(walletAccount.email)
            } else {
                this.$alert('unknown error')
            }
        }
    },
    methods: {
        goStep(num) {
            if (num == 2) {
                // TODO BUTTON按钮状态
                let email = this.$refs.emailCont.email
                this.$axios
                    .post(
                        `/mobilewallet/uc/v2/accounts/${
                            this.accountNo
                        }/verify-code-mail?email=${email}`,
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
                if (this.nocheck) {
                    this.$axios
                        .put(
                            `/mobilewallet/uc/v2/accounts/${
                                this.accountNo
                            }/setEmail?email=${email}&verifyCode=${vscode}&oldEmail=${
                                this.oldemail
                            }&verifyCode4Old=${this.vscode}`, {
                headers: {
                    token: this.$store.state.token
                }
            }
                        )
                        .then(res => {
                            let data = res.data
                            if (data && data.code == '0') {
                                window.location.href =
                                    '/hybrid/payment/wallet/payto'
                            } else {
                                this.$alert(data.message)
                            }
                        })
                } else {
                    this.$axios
                        .get(
                            `/mobilewallet/uc/v2/accounts/${
                                this.accountNo
                            }/verify-code?phone=${email}&verifyCode=${vscode}`, {
                headers: {
                    token: this.$store.state.token
                }
            }
                        )
                        .then(res => {
                            let data = res.data
                            if (data && data.code == '0') {
                                window.location.href = `/hybrid/payment/wallet/resetEmail?nocheck=1&oldemail=${email}&vscode=${vscode}`
                            }
                        })
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