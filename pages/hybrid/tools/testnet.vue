<template>
    <div>
        <div>请在不同的网络环境下依次点击各个按钮，将最终结果截图保存</div>
        <div>
            不同环境包括2G/3G/4G/wifi/商场/宿舍等
        </div>
        <div>
            <button @click="testimg1">测试cloudfront图片加载</button>
            <div>{{imgLoad1}}</div>
        </div>
        <div>
            <button @click="testimg2">测试cdn图片加载</button>
            <div>{{imgLoad2}}</div>
        </div>
        <!-- <div>
            <button @click="testjs1">测试cloudfrontjs加载</button>
            <div>{{jsLoad1}}</div>
        </div>
        <div>
            <button @click="testjs2">测试wapjs加载</button>
            <div>{{jsLoad2}}</div>
        </div>
        <div>
            <button @click="testhtml">测试html加载</button>
            <div>{{htmlLoad}}</div>
        </div> -->
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            startTime: null,
            imgLoad1: 0,
            imgLoad2: 0,
            jsLoad1: 0,
            jsLoad2: 0,
            htmlLoad: 0,
            imgArr: [
                'argentina_idle',
                'argentina_idle2',
                'argentina_shot',
                'brazil_idle',
                'brazil_idle2',
                'brazil_shot',
                'england_idle',
                'england_idle2',
                'england_shot',
                'france_idle',
                'france_idle2',
                'france_shot',
                'germany_idle',
                'germany_idle2',
                'germany_shot',
                'goalkeeper_center',
                'goalkeeper_center_high',
                'goalkeeper_down_left',
                'goalkeeper_down_right',
                'goalkeeper_high_left',
                'goalkeeper_high_right',
                'goalkeeper_idle',
                'goalkeeper_med_left',
                'goalkeeper_med_right',
                'italy_idle',
                'italy_idle2',
                'italy_shot',
                'wall_idle',
                'wall_jump'
            ],
            jsArr: [
                'Ajax',
                'base',
                'base64',
                'bluebird.min',
                'bootstrap',
                'bootstrap.min',
                'bootstrap-carousel',
                'bscroll',
                'click',
                'common',
                'countly.min',
                'datalazyload',
                'date.format',
                'day.min',
                'download',
                'download1',
                'env',
                'fun',
                'hello.all.min',
                'index',
                'jquery.cookie',
                'jquery.countdown',
                'jquery.hashchange.min',
                'jquery-1.11.1.min',
                'jquery-3.3.1.min',
                'jquery-easytabs.min',
                'jqueryScroll',
                'md5.min',
                'moment.min',
                'reveal.min',
                'round',
                'round_data',
                'round_data_2',
                'round_data_3',
                'round_data_serie',
                'round_data_serie1',
                'round_data_test',
                'round_data1',
                'round_serie',
                'round_test',
                'script',
                'skip',
                'skip1',
                'skip2',
                'sweetalert.min',
                'sweetalert-dev',
                'swiper.min',
                'round_test',
                'template-web',
                'ua-parser.min',
                'vue.min'
            ],
            htmlArr: [
                'http://m.startimestv.com/browser',
                'http://m.startimestv.com/browser/program/subdetail/56323',
                'http://m.startimestv.com/browser/program/subdetail/37026',
                'http://m.startimestv.com/browser/program/subdetail/37029',
                'http://m.startimestv.com/browser/program/subdetail/37035',
                'http://m.startimestv.com/browser/guide',
                'http://m.startimestv.com/browser/liveDetail?channelId=92',
                'http://m.startimestv.com/browser/program/list',
                'http://m.startimestv.com/browser/program/subdetail/37028',
                'http://m.startimestv.com/browser/liveDetail?channelId=649',
                'http://m.startimestv.com/browser/search',
                'http://m.startimestv.com/hybrid/vote/acon',
                'http://m.startimestv.com/hybrid/dvb/bind',
                'http://m.startimestv.com/hybrid/faq/onlineService?entrance_id=43&config_id=146'
            ]
        }
    },
    mounted() {},
    methods: {
        testimg1() {
            this.startTime = new Date().getTime()
            this.Iteration('http://m.startimestv.com/res_nuxt/acon/sprites/players/', 0)
        },
        testimg2() {
            this.startTime = new Date().getTime()
            this.Iteration('http://cdn.startimestv.com/banner/', 0)
        },
        testjs1() {
            this.startTime = new Date().getTime()
            this.Iteration2('http://m.startimestv.com/res_nuxt/testjs/', 0)
        },
        testjs2() {
            this.startTime = new Date().getTime()
            this.Iteration2('http://m.startimestv.com/resource/js/', 0)
        },
        testhtml() {
            this.startTime = new Date().getTime()
            this.Iteration3(0)
        },
        Iteration(pre, i) {
            if (i < this.imgArr.length) {
                this.loadImg(pre + this.imgArr[i] + '.png', () => {
                    this.Iteration(pre, i + 1)
                })
            } else if (pre.indexOf('m.startimestv') > 0) {
                this.imgLoad1 = new Date().getTime() - this.startTime
            } else {
                this.imgLoad2 = new Date().getTime() - this.startTime
            }
        },
        Iteration2(pre, i) {
            if (i < this.jsArr.length) {
                this.loadScript(pre + this.jsArr[i] + '.js', () => {
                    this.Iteration2(pre, i + 1)
                })
            } else if (pre.indexOf('res_nuxt') > 0) {
                this.jsLoad1 = new Date().getTime() - this.startTime
            } else {
                this.jsLoad2 = new Date().getTime() - this.startTime
            }
        },
        Iteration3(i) {
            if (i < this.htmlArr.length) {
                this.loadScript(this.htmlArr[i], () => {
                    this.Iteration3(i + 1)
                })
            } else {
                this.htmlLoad = new Date().getTime() - this.startTime
            }
        },
        loadImg(src, callback) {
            const img = new Image()
            img.onload = () => {
                callback()
            }
            img.src = src
        },
        loadScript(src, callback) {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', src, true)
            xhr.onreadystatechange = function() {
                callback()
            }
            xhr.send()
        }
    },
    head: {
        meta: [
            { 'HTTP-EQUIV': 'pragma', content: 'no-cache' },
            { 'HTTP-EQUIV': 'Cache-Control', content: 'no-cache, must-revalidate' },
            { 'HTTP-EQUIV': 'expires', content: '0' }
        ]
    }
}
</script>
