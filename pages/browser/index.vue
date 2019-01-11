<template>
    <div class="wrapper">
        <div class="selfService">
            <h3>StarTimes Decoder Selfservice</h3>
            <div class="recharge">
                <span>$</span>RECHARGE
            </div>
        </div>
        <div class="bouquets">
            <h3>Decoder Bouquets</h3>
            <span>Dish</span>
            <ul class="dish clearfix">
                <li v-for="(item,index) in dishList" :key="index" v-show="item.className" @click="goToBouquetDetail(item)">
                    <bgImg :bouquet-name="item.className" />
                    <p class="money">{{currency}} {{item.price}}/M</p>
                </li>
            </ul>
            <span>Antenna</span>
            <ul class="antenna clearfix">
                <li v-for="(item,index) in antennaList" :key="index" v-show="item.className" @click="goToBouquetDetail(item)">
                    <bgImg :bouquet-name="item.className" />
                    <p class="money">{{currency}} {{item.price}}/M</p>
                </li>
            </ul>
        </div>
        <div class="startimes">
            <h3><img src="~assets/img/web/ON-RIGHT.png" alt=""> StarTimes ON</h3>
            <img src="~assets/img/web/pic_show.jpg" class="bigPic">
            <div class="download clearfix">
                <img src="~assets/img/web/pic_downloadapk.png">
                <img src="~assets/img/web/pic_googleplay.png">
                <img src="~assets/img/web/pic_appstore.png">
            </div>
        </div>
    </div>
</template>
<script>
import bgImg from '~/components/web/bgImg'
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
                            ele.className = this.$options.filters.dttImgUrl(ele.name)
                            if (ele.className) {
                                this.antennaList.push(ele)
                            }
                        } else if (ele.tvPlatForm == 'DTH') {
                            ele.className = this.$options.filters.dthImgUrl(ele.name)
                            if (ele.className) {
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
            let className = item.className
            let price = item.price
            this.$router.push(`/browser/bouquetDetail?packageCode=${packageCode}&id=${bouId}&className=${className}&price=${price}`)
        }
    },
    filters: {
        dttImgUrl(name) {
            let data = name.toLowerCase()
            let className = ''
            if (data == 'sport plus') className = 'dtt-sportsplus'
            else if (data == 'unique') className = 'dtt-unique'
            else if (data == 'classique') className = 'dtt-classique'
            else if (data == 'nova') className = 'dtt-nova'
            else if (data == 'basique') className = 'dtt-basique'
            else if (data == 'sport play') className = 'dtt-sportsplay'
            return className
        },
        dthImgUrl(name) {
            let data = name.toLowerCase()
            let className = ''
            if (data == 'sport plus') className = 'dth-sportsplus'
            else if (data == 'super') className = 'dth-super'
            else if (data == 'smart') className = 'dth-smart'
            else if (data == 'engilsh') className = 'dth-engilsh'
            else if (data == 'indian') className = 'dth-indian'
            else if (data == 'chinese') className = 'dth-chinese'
            else if (data == 'sport play') className = 'dth-sportsplay'
            return className
        }
    },
    computed: {
        currency() {
            return this.$store.state.country.currencySymbol
        }
    },
    components:{
        bgImg
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
        font-size: 1rem;
        display: list-item;
        list-style-type: disc;
        margin-left: 1em;
        color: #333333;
        font-weight: bold;
    }
}
.selfService {
    .boxStyle;
    padding: 0.5rem 0 1rem 0.2rem;
    .recharge {
        width: 48%;
        border: 2px solid #0087eb;
        border-radius: 4px;
        color: #0087eb;
        text-align: center;
        height: 2.7rem;
        line-height: 2.7rem;
        font-size: 0.85rem;
        span {
            display: inline-block;
            width: 1.8rem;
            height: 1.8rem;
            line-height: 1.6rem;
            border: 2px solid #0087eb;
            border-radius: 50%;
            margin-right: 0.8rem;
            margin-top: 0.3rem;
            font-size: 1.2rem;
        }
    }
}
.bouquets {
    .boxStyle;
    padding: 0.5rem 0 0.5rem 0.2rem;
    & > span {
        font-size: 0.95rem;
        color: #333333;
        font-weight: 600;
        margin-top:0.4rem;
        clear:both;
        display:block;
    }
    ul {
        width: 100%;
        li {
            float: left;
            width: 31%;
            margin: 0.2rem 3% 0 0;
            display: block;
            &:nth-child(3n) {
                margin:0.2rem 0 0 0;
            }
            .money {
                color: #333333;
                font-size: 0.85rem;
                text-align: right;
                line-height: 1.5rem;
                margin-right: 0.3rem;
            }
            img {
                width: 100%;
            }
        }
    }
}
.startimes {
    .boxStyle;
    padding: 0.5rem 0 1rem 0.2rem;
    margin-bottom: 1.5rem;
    h3 {
        display: block;
        list-style-type: none;
        margin-left: 0;
        img {
            height: 1.2rem;
        }
    }
    .bigPic {
        width: 100%;
    }
    .download {
        img {
            display: block;
            width: 48%;
            margin-top: 5%;
            float: left;
            &:nth-child(2n) {
                float: right;
            }
        }
    }
}
</style>
