<template>
    <div class="container">
        <verifyTel ref="phone" :title="title" :prefix="prefix" @canNext="canStep1=true"></verifyTel>
        <div class="change-phone-link">
            <nuxt-link to="/c/payment/wallet/changephone">Change cellphone number</nuxt-link>
        </div>
        <div class="footer">
            <mButton :disabled="!canStep1" text="NEXT" @click="goStep(2)"></mButton>
            <nuxt-link to="/c/payment/wallet/validEmail?reset=1">RESET IT BY EMAIL</nuxt-link>
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
            reset: this.$route.query.reset || false,
            canStep1: false,
            canStep2: false,
            canStep3: false,
            canStep4: false,
            step: 1,
            accountNo: '',
            prefix: '234'
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
        // TODO 获取当前国家的 phonefix
        let walletAccount = JSON.parse(
            window.localStorage.getItem('wallet_account')
        )
        this.accountNo = walletAccount.accountNo
        if (this.reset) {
            // TODO 获取手机号码
        }
    },
    methods: {
        goStep(num) {
            let vscode = this.$refs.vscode.password
            switch (num) {
                case 2:
                case 4:
                    this.step = num
                    break
                case 3:
                    let tel = this.$refs.phone.tel
                    this.$axios
                        .get(
                            `/mobilewallet/uc/v2/accounts/${
                                this.accountNo
                            }/verify-code?phone=${this.prefix +
                                tel}&verifyCode=${vscode}`
                        )
                        .then(res => {
                            let data = res.data
                            if (data && data.code == '0') {
                                this.step = 3
                            } else {
                                this.$alert(data.message)
                            }
                        })
                    break
                case 5:
                    // TODO 新旧密码的对比
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
                    break
                default:
                    break
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