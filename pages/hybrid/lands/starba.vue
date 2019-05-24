<template>
    <div class="wrapper">
        <div class="page-top clear">
            <img class="landing-page-bg-center" src="~assets/img/landpage/landing-page-0903.jpg" alt="StarTimes APP">
        </div>
    </div>
</template>
<script>
import CallApp from 'callapp-lib'
import { Base64 } from 'js-base64'
export default {
    layout: 'base',
    data() {
        return {
            langType: this.$store.state.langType,
            appType: 0
        }
    },
    mounted() {
        const scheme = 'starba'
        let path = 'platformapi/webtoapp'

        if (this.$route.query.target) {
            let target = this.$route.query.target
            for (const i in this.$route.query) {
                if (i != 'target') {
                    target.indexOf('?') > 0
                        ? (target = target + '&' + i + '=' + this.$route.query[i])
                        : (target = target + '?' + i + '=' + this.$route.query[i])
                }
            }
            path = path + '?target=' + Base64.encode(target.replace(/&/g, '**'))
        }

        const callLib = new CallApp({
            scheme: {
                protocol: scheme
            }
        })
        callLib.open({
            path: path,
            callback() {
                console.log('唤醒失败')
            }
        })
    },
    head() {
        return {
            title: 'StarTimes APP'
        }
    }
}
</script>
<style>
html,
body {
    background: linear-gradient(to right, #698aad, #2d5078);
}
</style>
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
