<template>
    <div class="container">
        <verifyEmail></verifyEmail>
        <div class="footer" v-show="!loadStatus">
            <mButton :disabled="false" :text="'OK'" @click="back"></mButton>
        </div>
        <div class="step2">
            <div class="title">Enter SMS verification code</div>
            <passInput></passInput>
            <div class="footer">
                <mButton :disabled="false" :text="'OK'" @click="back"></mButton>
            </div>
        </div>
        <div class="step2 step3">
            <div class="title">Confirm Password</div>
            <passInput></passInput>
            <div class="footer">
                <mButton :disabled="false" :text="'OK'" @click="back"></mButton>
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
    components: {
        verifyEmail,
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
    .step3{
        z-index: 3;
    }
}
.footer {
    position: fixed;
    bottom: 2rem;
    width: 16rem;
    margin: 0 auto;
    left: 0;
    right: 0;
}
</style>