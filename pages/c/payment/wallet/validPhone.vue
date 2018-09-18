<template>
    <div class="container">
        <verifyTel :title="title" prefix="234" @canNext="canStep1=true"></verifyTel>
        <div class="change-phone-link">
            <nuxt-link to="/c/payment/wallet/changephone">Change cellphone number</nuxt-link>
        </div>
        <div class="footer">
            <mButton :disabled="!canStep1" text="NEXT" @click="goStep(2)"></mButton>
            <nuxt-link to="/c/payment/wallet/validEmail?reset=1">RESET IT BY EMAIL</nuxt-link>
        </div>
        <div class="step2" v-show="step==2">
            <passInput placeholder="Enter SMS verification code" @endinput="codeEnd"></passInput>
            <div class="footer">
                <mButton :disabled="!canStep2" text="NEXT" @click="goStep(3)"></mButton>
            </div>
        </div>
        <div class="step2 step3" v-show="step==3">
            <passInput placeholder="Confirm Password" @endinput="confirmEnd"></passInput>
            <div class="footer">
                <mButton :disabled="!canStep3" text="OK"></mButton>
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
            step: 1
        }
    },
    computed: {
        title() {
            return this.reset
                ? 'Confirm your cellphone number'
                : 'Enter cellphone number'
        }
    },
    methods: {
        goStep(num) {
            this.step = num
        },
        codeEnd(bool) {
            this.canStep2 = bool
        },
        confirmEnd(bool) {
            this.canStep3 = bool
        }
    },
    mounted() {
        // 获取当前国家的 phonefix
        // 获取是否已经设置了password
        // 是否需要验证手机

        if (this.reset) {
            // TODO 获取手机号码
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