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
    data() {
        return {
            invide_code: ''
        }
    },
    mounted() {
        this.invide_code = sessionStorage.getItem('invite_code')
        this.sendEvLog({
            category: 'tell_friends',
            action: 'register_success_show',
            label: this.invide_code,
            value: 1
        })
        // window.onbeforeunload = function(e){
        //     e = e || window.event;
        //     e.returnValue = "您还没有交卷，已填答案会丢失。";
        // }
    },
    methods: {
        callMarket() {
            this.sendEvLog({
                category: 'tell_friends',
                action: 'callMarket',
                label: this.invide_code,
                value: 1
            })

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
                this.sendEvLog({
                    category: 'tell_friends',
                    action: 'downApk',
                    label: this.invide_code,
                    value: 1
                })
                clearTimeout(s)
            }, 2000)
            document.addEventListener('visibilitychange', () => {
                clearTimeout(s)
                this.$nuxt.$loading.finish()
            })
        },
        invokeByIntent(failback) {
            const reffer = sessionStorage.getItem('utm_str')
            // window.addEventListener('popstate', (event) => {
            //     alert(123)
            // });
            window.location.href = 'intent://details?id=com.star.mobile.video&referrer=' + encodeURIComponent(reffer) + '#Intent;scheme=market;end'
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
