<template>
    <div class="container">
        <verifyEmail ref="emailCont"></verifyEmail>
        <div class="change-phone-link">
            <nuxt-link to="/c/payment/wallet/changephone">Change email</nuxt-link>
        </div>
        <div class="footer">
            <mButton :disabled="false" text="NEXT" @click="goStep(2)"></mButton>
            <nuxt-link to="/c/payment/wallet/validPhone?reset=1">RESET IT BY CELLPHONE NUMBER</nuxt-link>
        </div>
        <div class="step2" v-show="step==2">
            <passInput length="4" placeholder="Enter SMS verification code"></passInput>
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
            reset: this.$route.query.reset || false,
            canStep1: false,
            canStep2: false,
            canStep3: false,
            canStep4: false,
            step: 1,
            accountNo: ''
        }
    },
    components: {
        verifyEmail,
        mButton,
        passInput
    },
    methods: {
        goStep(num) {
            this.step = num
            if (num == 2) {
                let accountNo = window.sessionStorage.getItem('wallet_account')
                let email = this.$refs.emailCont.email
                this.$axios
                    .post(
                        `/mobilewallet/uc/v2/accounts/${accountNo}/verify-code-mail?email=${email}`
                    )
                    .then(res => {
                        if (res.data.code == 0) {
                            this.step = num
                        }
                    })
            } else if (num == 5) {
                let vscode = this.$refs.vscode.password
                let newpass = this.$refs.newpass.password
                this.$axios
                    .put(
                        `/mobilewallet/uc/v2/accounts/${
                            this.accountNo
                        }/pay-password?newPassword=${newpass}&verifyCode=${vscode}`
                    )
                    .then(res => {
                        let data = res.data
                        if (data && data.code == '0') {
                            this.$alert(data.message, () => {
                                window.location.href = './payto'
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