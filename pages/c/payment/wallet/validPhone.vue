<template>
    <div class="container">
        <verifyTel :title="title" prefix="234"></verifyTel>
        <div class="change-phone-link">
            <nuxt-link to="/c/payment/wallet/changephone">Change cellphone number</nuxt-link>
        </div>
        <div class="footer">
            <mButton :disabled="false" text="NEXT" @click="back"></mButton>
            <nuxt-link to="/c/payment/wallet/validEmail?reset=1">RESET IT BY EMAIL</nuxt-link>
        </div>
        <div class="step2">
            <div class="title">Enter SMS verification code</div>
            <passInput></passInput>
            <div class="footer">
                <mButton :disabled="false" text="NEXT" @click="back"></mButton>
            </div>
        </div>
        <div class="step2 step3">
            <div class="title">Confirm Password</div>
            <passInput></passInput>
            <div class="footer">
                <mButton :disabled="false" text="OK" @click="back"></mButton>
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
            reset: this.$route.query.reset || false
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
        display: none;
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