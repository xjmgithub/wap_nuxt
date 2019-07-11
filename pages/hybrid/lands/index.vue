<template>
    <div class="wrapper">
        <div class="page-top clear">
            <img class="landing-page-bg-center" src="~assets/img/landpage/landing-page-0903.jpg" alt="StarTimes APP">
        </div>
        <div class="page-bottom">
            <div class="download">
                <div v-if="appType==2" class="download-appstore-wrapper" @click="downFromAppStore()">
                    <img v-if="langType=='fr'" src="~assets/img/landpage/ios_appstore_bg_fy.png">
                    <img v-if="langType=='pt'" src="~assets/img/landpage/ios_appstore_bg_py.png">
                    <img v-else src="~assets/img/landpage/ios_appstore_bg.png">
                </div>
                <div v-if="appType==1" class="download-app-wrapper">
                    <div class="download-app-btn" @click="downApk()">
                        <div style="padding:0px 0.8rem">
                            {{$store.state.lang.download_apk}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { downloadApk } from '~/functions/utils'
export default {
    layout: 'base',
    data() {
        return {
            langType: this.$store.state.langType,
            appType: 0
        }
    },
    mounted() {
        let timeout
        const ua = navigator.userAgent.toLowerCase()
        let appStoreLink
        this.sendEvLog({
            category: 'langingpage',
            action: 'show',
            label: window.location.pathname
        })

        if (ua.indexOf('iphone') >= 0 || ua.indexOf('ipad') >= 0) {
            this.appType = 2
            appStoreLink = 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'
        } else {
            this.appType = 1
            appStoreLink = 'market://details?id=com.star.mobile.video&' + window.location.search.replace('?', '')
        }

        timeout && clearTimeout(timeout)
        // timeout = setTimeout(function() {
        //     if (Date.now() - t < interval + 800) {
        //         location.href = 'http://www.baidu.com'
        //     }
        // }, interval)

        const iframe = document.createElement('iframe')
        iframe.onload = function() {
            if (this.appType === 1) {
                this.sendEvLog({
                    category: 'langingpage',
                    action: 'jump_googleplay',
                    label: window.location.pathname
                })
            }
            if (this.appType === 2) {
                this.sendEvLog({
                    category: 'langingpage',
                    action: 'jump_appstore',
                    label: window.location.pathname
                })
            }
        }
        iframe.setAttribute('src', appStoreLink)
        iframe.setAttribute('style', 'display:none')
        document.body.appendChild(iframe)
        setTimeout(function() {
            document.body.removeChild(iframe)
        }, 200)
    },
    methods: {
        downFromAppStore() {
            this.sendEvLog({
                category: 'langingpage',
                action: 'appstore_click',
                label: window.location.pathname
            })
            window.location.href = 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'
        },
        downApk() {
            downloadApk.call(this)
        }
    },
    head() {
        return {
            title: 'StarTimes APP'
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    min-height: 100%;
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
