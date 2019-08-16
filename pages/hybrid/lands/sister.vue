<template>
    <div class="wrapper">
        <div class="page-top clear">
            <img class="landing-page-bg-center" src="~assets/img/landpage/sister3.jpg" alt="StarTimes APP" />
            <div>
                <nuxt-link to="/hybrid/dvb/bind">
                    <img src="~assets/img/landpage/sister1.png">
                </nuxt-link>
            </div>
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
                        <div style="padding:0px 0.8rem">{{$store.state.lang.download_apk.toUpperCase()}}</div>
                    </div>
                </div>
            </div>
            <div class="channel">
                <img src="~assets/img/landpage/sister2.png">
            </div>
        </div>
    </div>
</template>
<script>
import { downApk, callApp, callMarket } from '~/functions/app'
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
        this.$router.replace({
            query: Object.assign({}, this.$route.query, {
                utms: 'startimes_app',
                utmm: 'share',
                utmc: 'The_blood_sisters'
            })
        })
        const browser = getBrowser()
        this.appType = browser.isIos ? 2 : 1
        this.sendEvLog({
            category: 'callup_app',
            action: 'landing_show',
            label: window.location.pathname,
            value: 1
        })
        callApp.call(this, '', () => {
            callMarket.call(this) // 默认唤醒不起来app
        })
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
    background: #e45e76;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    max-width: 1300px;
    margin: 0 auto;
    position: relative;
    padding-top: 0;
}
.page-top {
    position: relative;
    div {
        width: 100%;
        padding: 1.5rem 5% 0;
        position: absolute;
        top: 0;
        left: 0;
        img {
            width: 100%;
        }
    }
    & > img {
        width: 100%;
        height: 100%;
        display: block;
    }
}
.page-bottom {
    position: absolute;
    bottom: 1rem;
    width: 100%;
    .download {
        width: 65%;
        margin: 0.1rem auto;
        .download-app-btn {
            font-size: 1.2rem;
            line-height: 3rem;
            height: 3rem;
            text-align: center;
            color: rgba(255, 255, 255, 1);
            background-color: #231f20;
            border-radius: 0.3rem;
        }
        .download-appstore-wrapper {
            width: 85%;
            min-height: 44px;
            overflow: hidden;
            text-align: center;
            margin: 0 auto;
            img {
                width: 100%;
                min-height: 44px;
            }
        }
    }
    .channel {
        width: 100%;
        text-align: center;
        margin-top: 1rem;
        img {
            width: 30%;
        }
    }
}
</style>
