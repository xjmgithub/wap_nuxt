<template>
    <div class="wrapper">
        <div class="selfService">
            <h3>
                <div class="dot">‧</div>
                <div>{{$store.state.lang.officialwebsitemobile_selfservice_section}}</div>
            </h3>
            <div class="recharge">
                <span>$</span>
                <div>RECHARGE</div>
            </div>
        </div>
        <div class="bouquets">
            <h3>
                <div class="dot">‧</div>
                <div>{{$store.state.lang.officialwebsitemobile_bouquet_section}}</div>
            </h3>
            <span v-show="dishList.length>0">Dish</span>
            <ul class="dish clearfix">
                <li v-for="(item,index) in dishList" :key="index" v-show="item.show" @click="goToBouquetDetail(item)">
                    <bg-img-data :img-path="item.poster&&item.poster.resources[0].url"/>
                    <p class="money">{{currency}} {{item.price}}/M</p>
                </li>
            </ul>
            <span v-show="antennaList.length>0">Antenna</span>
            <ul class="antenna clearfix">
                <li v-for="(item,index) in antennaList" :key="index" v-show="item.show" @click="goToBouquetDetail(item)">
                    <bg-img-data :img-path="item.poster&&item.poster.resources[0].url"/>
                    <p class="money">{{currency}} {{item.price}}/M</p>
                </li>
            </ul>
        </div>
        <div class="startimes">
            <h3 class="flytitle">
                <div>{{$store.state.lang.officialwebsitemobile_startimeson_section}}</div>
            </h3>
            <img src="~assets/img/web/pic_show.jpg" class="bigPic">
            <div class="download clearfix">
                <a href="https://m.startimestv.com/DownloadAPP.php">
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
import bgImgData from '~/components/web/bgImgData'
export default {
    layout: 'default',
    data() {
        return {
            dishList: [], //DTH
            antennaList: [] //DTT
        }
    },
    mounted() {
        this.getBouquets()
    },
    methods: {
        getBouquets() {
            this.$axios.get(`/cms/packages?platformTypes=0&platformTypes=1`).then(res => {
                let data = res.data
                if (data.length > 0) {
                    data.forEach(ele => {
                        if (ele.tvPlatForm == 'DTT') {
                            ele.show = this.$options.filters.dttImgUrl(ele.name)
                            if (ele.show) {
                                this.antennaList.push(ele)
                            }
                        } else if (ele.tvPlatForm == 'DTH') {
                            ele.show = this.$options.filters.dthImgUrl(ele.name)
                            if (ele.show) {
                                this.dishList.push(ele)
                            }
                        }
                    })
                }
            })
        },
        goToBouquetDetail(item) {
            let packageCode = item.code
            let bouId = item.id
            let price = item.price
            this.$router.push(`/browser/bouquetDetail?packageCode=${packageCode}&id=${bouId}&price=${price}`)
        }
    },
    filters: {
        dttImgUrl(name) {
            let data = name.toLowerCase()
            if (data == 'sport plus' || data == 'unique' || data == 'classique' || data == 'nova' || data == 'basique' || data == 'sport play') {
                return true
            }
        },
        dthImgUrl(name) {
            let data = name.toLowerCase()
            if (
                data == 'sport plus' ||
                data == 'super' ||
                data == 'smart' ||
                data == 'engilsh' ||
                data == 'indian' ||
                data == 'chinese' ||
                data == 'sport play'
            ) {
                return true
            }
        }
    },
    computed: {
        currency() {
            return this.$store.state.country.currencySymbol
        }
    },
    components: {
        bgImgData
    },
    head() {
        return {
            title: 'StarTimes'
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.boxStyle {
    width: 94%;
    margin: 0 auto;
    border-bottom: 1px solid #d8d8d8;
    h3 {
        margin-bottom: 0.2rem;
        color: #333333;
        font-weight: bold;
        div {
            margin-right: 0.3rem;
            font-size: 1rem;
            &.dot {
                font-size: 2.5rem;
                height: 1rem;
                line-height: 1.7rem;
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
            background-size: 0.8rem;
            padding-left: 1.2rem;
        }
    }
}
.selfService {
    .boxStyle;
    padding: 0.5rem 0 1rem 0.2rem;
    .recharge {
        width: 45%;
        border: 2px solid #0087eb;
        border-radius: 4px;
        color: #0087eb;
        text-align: center;
        height: 2.5rem;
        font-size: 0.85rem;
        span {
            display: block;
            width: 1.6rem;
            height: 1.6rem;
            line-height: 1.44rem;
            border: 2px solid #0087eb;
            border-radius: 50%;
            margin: 0.3rem 0.7rem 0.3rem 1rem;
            font-size: 1.2rem;
            float: left;
        }
        div {
            text-align: left;
            line-height: 2.3rem;
            font-weight: bold;
        }
    }
}
.bouquets {
    .boxStyle;
    padding: 0.3rem 0;
    & > span {
        font-size: 0.95rem;
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
            margin: 0 3% 0 0;
            display: block;
            &:nth-child(3n) {
                margin: 0.2rem 0 0 0;
            }
            .money {
                color: #333333;
                font-size: 0.7rem;
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
