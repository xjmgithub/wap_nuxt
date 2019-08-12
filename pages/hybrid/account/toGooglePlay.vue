<template>
    <div class="wrapper">
        <div class="title">{{$store.state.lang.tips_register_successful}}</div>
        <div class="msg">{{$store.state.lang.tips_register_successful_tip}}</div>
        <img src="~assets/img/pic_gift.png" />
        <div class="down-now" @click="callMarket">{{$store.state.lang.download_now}}</div>
    </div>
</template>
<script>
import { downApk } from '~/functions/app'
export default {
    layout: 'base',
    methods: {
        callMarket() {
            this.invokeByIntent()
        },
        invokeByIframe() {
            const reffer = sessionStorage.getItem('utm_str')
            const iframe = document.createElement('iframe')
            iframe.frameborder = '0'
            iframe.style.cssText = 'display:none;border:0;width:0;height:0;'
            document.body.appendChild(iframe)

            iframe.src = `market://details?id=com.star.mobile.video&referrer=` + encodeURIComponent(reffer)

            const s = setTimeout(() => {
                if (!document.hidden) downApk.call(this)
                clearTimeout(s)
            }, 2000)
            document.addEventListener('visibilitychange', () => {
                clearTimeout(s)
                this.$nuxt.$loading.finish()
            })
        },
        invokeByIntent(failback) {
            // const reffer = sessionStorage.getItem('utm_str')
            // window.location.href = 'intent://details?id=com.star.mobile.video&referrer=' + encodeURIComponent(reffer) + '#Intent;scheme=market;end'
            window.location.href =
                'intent://details?id=com.star.mobile.video&referrer=utm_source%3Dawards%26utm_medium%3Dshare%26utm_campaign%3Dtell_friends#Intent;scheme=market;end'
            const s = setTimeout(() => {
                if (!document.hidden) downApk.call(this)
                clearTimeout(s)
            }, 2000)
            document.addEventListener('visibilitychange', () => {
                clearTimeout(s)
                this.$nuxt.$loading.finish()
            })
        }
    },
    head() {
        return {
            title: 'Download'
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    position: static;
    min-height: 100%;
    padding-top: 17%;
    color: #333333;
    .title {
        text-align: center;
        margin: 0 auto;
        font-size: 1.25rem;
        font-weight: 600;
    }
    .msg {
        margin: 2rem auto 0;
        padding: 0 2rem;
        font-size: 0.9rem;
        font-weight: 400;
    }
    img {
        display: block;
        height: 65%;
        width: 65%;
        margin: 0 auto;
    }
    .down-now {
        width: 80%;
        height: 2.3rem;
        line-height: 2.3rem;
        font-size: 0.9rem;
        text-align: center;
        color: #ffffff;
        font-weight: 600;
        background-color: #0087eb;
        margin: 0.8rem 10%;
        border-radius: 0.2rem;
    }
}
</style>
