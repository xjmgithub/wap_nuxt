<template>
    <div class="wrapper">
        <div class="selfService">
            <h3>
                <div class="dot">‧</div>
                <div>{{$store.state.lang.officialwebsitemobile_selfservice_section}}</div>
            </h3>
            <div class="recharge">
                <nuxt-link to="/hybrid/dvb/bind">
                    <span>$</span>
                    <span>RECHARGE</span>
                </nuxt-link>
            </div>
        </div>
        <vod-list v-for="(item,index) in programs" :key="index" :item="item"/>
        <div class="bouquets">
            <h3>
                <div class="dot">‧</div>
                <div>{{$store.state.lang.officialwebsitemobile_bouquet_section}}</div>
            </h3>
            <span v-show="dishList.length>0">Dish</span>
            <ul class="dish clearfix">
                <li v-for="(item,index) in dishList" :key="index" @click="goToBouquetDetail(item)">
                    <bg-img-data :img-path="item.poster&&item.poster.resources[0].url" :package-name="item.name"/>
                    <p class="money">{{currency}} {{item.price}}</p>
                </li>
            </ul>
            <span v-show="antennaList.length>0">Antenna</span>
            <ul class="antenna clearfix">
                <li v-for="(item,index) in antennaList" :key="index" @click="goToBouquetDetail(item)">
                    <bg-img-data :img-path="item.poster&&item.poster.resources[0].url" :package-name="item.name"/>
                    <p class="money">{{currency}} {{item.price}}</p>
                </li>
            </ul>
        </div>
        <div class="startimes">
            <h3 class="flytitle">
                <div>{{$store.state.lang.officialwebsitemobile_startimeson_section}}</div>
            </h3>
            <img src="~assets/img/web/wap_pic.jpg" class="bigPic">
            <div class="download clearfix">
                <a @click="downloadApk" href="javascript:void(0)">
                    <img src="~assets/img/web/pic_downloadapk.png">
                </a>
                <a href="market://details?id=com.star.mobile.video" target="_blank">
                    <img src="~assets/img/web/pic_googleplay.png">
                </a>
                <a href="https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8">
                    <img src="~assets/img/web/pic_appstore.png">
                </a>
            </div>
        </div>
    </div>
</template>
<script>
import env from '~/env.js'
import bgImgData from '~/components/web/bgImgData'
import { downloadApk } from '~/functions/utils'
import vodList from '~/components/web/vod'
export default {
    layout: 'default',
    filters: {
        dttImgUrl(name) {
            const data = name.toLowerCase()
            if (
                data === 'sport plus' ||
                data === 'unique' ||
                data === 'classique' ||
                data === 'nova' ||
                data === 'basique' ||
                data === 'sport play'
            ) {
                return true
            }
        },
        dthImgUrl(name) {
            const data = name.toLowerCase()
            if (
                data === 'sport plus' ||
                data === 'super' ||
                data === 'smart' ||
                data === 'engilsh' ||
                data === 'indian' ||
                data === 'chinese' ||
                data === 'sport play'
            ) {
                return true
            }
        }
    },
    components: {
        bgImgData,
        vodList
    },
    data() {
        return {
            dishList: [], // DTH
            antennaList: [], // DTT
            recharge_url: 'https://m.startimestv.com/DVB/binding.php',
            programs: []
        }
    },
    computed: {
        currency() {
            return this.$store.state.country.currencySymbol
        }
    },
    mounted() {
        const host = window.location.host
        if (host.indexOf('qa') >= 0 || host.indexOf('dev') >= 0 || host.indexOf('localhost') >= 0) {
            this.recharge_url = 'http://qa.upms.startimestv.com/wap/DVB/binding.php'
        }
        this.getBouquets()
        this.getPrograms()
    },
    methods: {
        getBouquets() {
            this.$axios.get(`/cms/packages?platformTypes=0&platformTypes=1`).then(res => {
                const data = res.data
                if (data.length > 0) {
                    data.forEach(ele => {
                        if (ele.tvPlatForm === 'DTT') {
                            if (ele.type === 1) {
                                this.antennaList.push(ele)
                            }
                        } else if (ele.tvPlatForm === 'DTH') {
                            if (ele.type === 1) {
                                this.dishList.push(ele)
                            }
                        }
                    })
                }
                this.$nextTick(() => this.$nuxt.$loading.finish())
            })
        },
        goToBouquetDetail(item) {
            const bouId = item.id
            const price = item.price
            const logo = encodeURI((item.poster && item.poster.resources[0].url) || '')
            const name = item.name
            const plat = item.tvPlatForm
            this.$router.push(`/browser/bouquetDetail?id=${bouId}&price=${price}&logo=${logo}&name=${name}&plat=${plat}`)
        },
        downloadApk() {
            downloadApk(this)
        },
        getPrograms() {
            const tmp = new Date().toLocaleDateString()
            const start = new Date(new Date(tmp)).getTime() // 00:00:00
            const end = new Date(new Date(tmp)).getTime() + 24 * 60 * 60 * 1000 - 1 // 23:59:59
            this.$axios.get(`/vup/v2/tabs/${env.vodtab}/sections?pageNumber=1&perSize=100&dateFrom=${start}&dateTo=${end}`).then(res => {
                const data = res.data.data
                if (data && data.length > 0) {
                    data.forEach(ele => {
                        if (ele.widgets && ele.widgets.length > 0) {
                            ele.widgets.forEach(item => {
                                if (item.content_code.indexOf('100') == 0 || item.content_code.indexOf('109') == 0) {
                                    this.programs.push({
                                        name: ele.name,
                                        type: item.content_code,
                                        list: JSON.parse(item.data_json)
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    },
    head() {
        return {
            title: this.$store.state.lang.seo_title_browser,
            meta: [
                { hid: 'description', name: 'description', content: this.$store.state.lang.seo_desc_browser },
                { hid: 'keywords', name: 'keywords', content: this.$store.state.lang.seo_keywords_browser }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.boxStyle {
    margin: 0 auto;
    border-bottom: 1px solid #d8d8d8;
    h3 {
        margin: 0.4rem 0;
        color: #333333;
        font-weight: bold;
        div {
            margin-right: 0.3rem;
            font-size: 1.1rem;
            line-height: 2.5rem;
            &.dot {
                font-size: 2.5rem;
                height: 1rem;
                line-height: 2.3rem;
                float: left;
            }
        }
        img {
            width: auto;
            float: left;
            display: block;
        }
        &.flytitle {
            background: url('~assets/img/web/ON-RIGHT.png') no-repeat left center;
            background-size: 1rem;
            padding-left: 1.5rem;
        }
    }
}
.selfService {
    .boxStyle;
    padding-bottom: 1.2rem;
    .recharge {
        width: 45%;
        border: 2px solid #0087eb;
        border-radius: 4px;
        color: #0087eb;
        text-align: center;
        height: 2.8rem;
        line-height: 2.6rem;
        span:first-child {
            width: 1.6rem;
            color: #0087eb;
            height: 1.6rem;
            line-height: 1.4rem;
            font-size: 1.2rem;
            border: 2px solid #0087eb;
            border-radius: 50%;
            display: inline-block;
            margin-right: -0.72rem;
        }
        span:last-child {
            font-size: 1.2rem;
            color: #0087eb;
            display: inline-block;
            font-weight: bold;
            transform: perspective(1px) scale(0.8);
        }
    }
}

.bouquets {
    .boxStyle;
    padding: 0.3rem 0;
    & > span {
        color: #333333;
        font-weight: 600;
        clear: both;
        display: block;
    }
    ul {
        width: 100%;
        margin: 0.3rem 0;
        li {
            float: left;
            width: 31%;
            margin: 0 3% 1.5% 0;
            display: block;
            &:nth-child(3n) {
                margin: 0 0 0 0;
            }
            .money {
                color: #333333;
                font-size: 0.8rem;
                line-height: 1.4rem;
                text-align: right;
                margin-right: 0.3rem;
                font-weight: bold;
            }
            img {
                width: 100%;
            }
        }
    }
}
.startimes {
    .boxStyle;
    padding: 0.3rem 0 1.5rem;
    margin-bottom: 1rem;
    .bigPic {
        width: 100%;
    }
    .download {
        a {
            img {
                display: block;
                width: 48%;
                margin-top: 4%;
                float: left;
            }
            &:nth-child(2n) {
                img {
                    float: right;
                }
            }
        }
    }
}
</style>
