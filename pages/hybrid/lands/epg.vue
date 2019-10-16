<template>
    <div class="wrapper">
        <div class="page-top clear">
            <img class="landing-page-bg-center" src="~assets/img/landpage/landing-page-0903.jpg" alt="StarTimes APP" />
        </div>
        <div class="page-bottom">
            <div class="download">
                <div v-if="appType==2" class="download-appstore-wrapper" @click="down()">
                    <img v-if="langType=='fr'" src="~assets/img/landpage/ios_appstore_bg_fy.png" />
                    <img v-if="langType=='pt'" src="~assets/img/landpage/ios_appstore_bg_py.png" />
                    <img v-else src="~assets/img/landpage/ios_appstore_bg.png" />
                </div>
                <div v-if="appType==1" class="download-app-wrapper">
                    <div class="download-app-btn" @click="down()">
                        <div style="padding:0px 0.8rem">{{$store.state.lang.download_apk}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { downApk, callMarket } from '~/functions/app'
import { getBrowser } from '~/functions/utils'
export default {
    layout: 'base',
    data() {
        return {
            langType: this.$store.state.langType,
            appType: 0
        }
    },
    mounted() {
        // this.$router.replace({
        //     query: Object.assign({}, this.$route.query, {
        //         utms: '456',
        //         utmm: 'share',
        //         utmc: 'epg'
        //     })
        // })
        const browser = getBrowser()
        this.appType = browser.isIos ? 2 : 1
        this.sendEvLog({
            category: 'callup_app',
            action: 'landing_show',
            label: window.location.pathname,
            value: 1
        })
    },
    methods: {
        down() {
            this.$nuxt.$loading.start()
            callMarket.call(this, () => {
                downApk.call(this)
                this.$nuxt.$loading.finish()
            })
        }
    },
    head() {
        return {
            title: 'StarTimes APP',
            meta: [
                { name: 'description', property: 'description', content: 'StarTimes | Movies | Sport | Series | Music | TV Guide | Entertainment' },
                {
                    name: 'og:description',
                    property: 'og:description',
                    content: 'StarTimes | Movies | Sport | Series | Music | TV Guide | Entertainment'
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
    min-height: 100%;
    height: 100vh;
    background: linear-gradient(to right, #698aad, #2d4f7c);
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    max-width: 1300px;
    margin: 0 auto;
    position: relative;
    padding-top: 0;
}
.page-top img {
    width: 100%;
    height: 100%;
    display: block;
}
.page-bottom {
    position: absolute;
    bottom: 2.5rem;
    width: 100%;
}
.page-bottom .download {
    width: 65%;
    margin: 0.1rem auto;
}
.page-bottom .download-app-btn {
    font-size: 1.2rem;
    line-height: 3rem;
    height: 3rem;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    background-color: #231f20;
    border-radius: 0.2rem;
}
.page-bottom .download-appstore-wrapper {
    width: 100%;
    min-height: 44px;
    overflow: hidden;
}
.page-bottom img {
    float: left;
    width: 100%;
    min-height: 44px;
}
</style>
