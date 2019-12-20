<template>
    <div class="wrapper">
        <div>
            <img src="~assets/img/landpage/punguzo-doen.png" class="btn" alt="StarTimes APP" @click="down()" />
        </div>
    </div>
</template>
<script>
import { downApk, callApp, callMarket, getUtmParam } from '~/functions/app'
import { getBrowser } from '~/functions/utils'
export default {
    layout: 'base',
    mounted() {
        const browser = getBrowser()
        this.appType = browser.isIos ? 2 : 1
        const utmParm = getUtmParam.call(this)
        this.sendEvLog(
            Object.assign(
                {
                    category: 'callup_app',
                    action: 'landing_show',
                    label: window.location.pathname,
                    value: 1
                },
                utmParm.map
            )
        )
    },
    methods: {
        down() {
            this.$nuxt.$loading.start()
            callApp.call(this, '', () => {
                callMarket.call(this, () => {
                    downApk.call(this)
                    this.$nuxt.$loading.finish()
                })
            })
        }
    },
    head() {
        return {
            title: 'StarTimes ON APP',
            meta: [
                { name: 'description', property: 'description', content: 'StarTimes | Movies | Sport | Series | Music | TV Guide | Entertainment' },
                {
                    name: 'og:description',
                    property: 'og:description',
                    content: 'StarTimes | Movies | Sport | Series | Music | TV Guide | Entertainment'
                },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: 'http://m.startimestv.com/_nuxt/img/6672906.png'
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: 'StarTimes APP' },
                {
                    name: 'al:android:url',
                    property: 'al:android:url',
                    content: 'starvideo://platformapi/webtoapp?channel=facebook'
                },
                { name: 'al:android:app_name', property: 'al:android:app_name', content: 'StarTimes' },
                { name: 'al:android:package', property: 'al:android:package', content: 'com.star.mobile.video' },
                { name: 'al:web:url', property: 'al:web:url', content: 'http://m.startimestv.com' }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    background: url('~assets/img/landpage/punguzo.jpg') no-repeat;
    background-size: 100% 100%;
    width: 100%;
    min-height: 660px;
    min-height: 100vh;
    div {
        width: 100%;
        position: fixed;
        bottom: 2%;
        text-align: center;
    }
    .btn {
        width: 60%;
    }
}
</style>
