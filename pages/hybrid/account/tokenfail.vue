<template>
    <div class="wrapper">
        <img src="~assets/img/pay/img_failed_def_b.png">
        <p class="fail">
            Your account is signed in elsewhere. Please
            <a href="javascript:void(0)" @click="toNativeLogin">Log in again</a>
        </p>
    </div>
</template>
<script>
import { toNativePage } from '~/functions/utils'
export default {
    layout: 'base',
    methods: {
        toNativeLogin() {
            if (this.$store.state.appType == 1) {
                toNativePage('com.star.mobile.video.account.LoginActivity')
            } else {
                toNativePage('startimes://login')
            }
        }
    }
}
</script>
<style scoped>
.wrapper {
    height: 100vh;
    background: #eeeeee;
    text-align: center;
    padding-top: 4rem;
}
img {
    width: 15rem;
    height: 13rem;
}
.fail{
    width:80%;
    margin:0 auto;
    margin-top:1rem;
}
</style>
