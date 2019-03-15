<template>
    <div @click="down" class="download">
        <div class="max-width">{{$store.state.lang.officialwebsitemobile_downloadpromo}}</div>
        <span>{{$store.state.lang.officialwebsitemobile_go}} &gt;</span>
    </div>
</template>
<script>
import CallApp from 'callapp-lib'
export default {
    data() {
        return {
            scheme: 'starvideo',
            failback: ''
        }
    },
    mounted() {
        const ua = navigator.userAgent.toLowerCase()
        if (ua.indexOf('iphone') >= 0 || ua.indexOf('ipad') >= 0) {
            this.scheme = 'startimes'
            this.failback = 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'
        }
    },
    methods: {
        down() {
            const callLib = new CallApp({
                scheme: {
                    protocol: this.scheme
                }
            })
            const _this = this
            callLib.open({
                path: 'platformapi/webtoapp',
                callback() {
                    if (_this.failback) {
                        window.location.href = _this.failback
                    } else {
                        _this.$axios.get('/cms/public/app').then(res => {
                            let url = res.data.apkUrl
                            if (url) {
                                if (url.indexOf('google') > 0) {
                                    url = url.replace('google', 'officialWap')
                                }
                                window.location.href = url
                            }
                        })
                    }
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.download {
    padding: 0rem 0.8rem;
    background-color: #ffbe19;
    font-weight: bold;
    color: #333333;
    overflow: hidden;
    zoom: 1;
    top: 3.45rem;
    position: fixed;
    width: 100%;
    z-index: 999;
    height: 2.5rem;
    line-height: 2.5rem;
    div {
        width: auto;
        float: left;
    }
    span {
        color: #0087eb;
        float: right;
    }
}
</style>

