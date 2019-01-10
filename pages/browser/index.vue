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
                <li v-for="(item,index) in dishList" :key="index" v-show="item.imgUrl" @click="goToBouquetDetail(item)">
                    <img :src="require(item.imgUrl)">
                    <p class="money">{{currency}} {{item.price}}/M</p>
                </li>
            </ul>
            <span>Antenna</span>
            <ul class="antenna clearfix">
                <li v-for="(item,index) in antennaList" :key="index" v-show="item.imgUrl" @click="goToBouquetDetail(item)">
                    <img :src="require(item.imgUrl)">
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
export default {
    layout: 'default',
    data() {
        return {
            dishList: [], //DTH
            antennaList: [] ,//DTT
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
                            ele.imgUrl = this.$options.filters.dttImgUrl(ele.name)
                            if(ele.imgUrl){
                                this.antennaList.push(ele)
                            }
                        } else if (ele.tvPlatForm == 'DTH') {
                            ele.imgUrl = this.$options.filters.dthImgUrl(ele.name)
                            if(ele.imgUrl){
                                this.dishList.push(ele)
                            }
                        }
                    })
                    console.log(this.antennaList)
                    console.log(this.dishList)
                }
            })
        },
        goToBouquetDetail(item){
            let packageCode = item.code
            let bouId = item.id
            this.$router.push(`/browser/bouquetDetail?packageCode=${packageCode}&id=${bouId}`)
        }
    },
    filters:{
        dttImgUrl(name){
            let data = name.toLowerCase()
            let imgUrl = ''
            if(data == 'sport plus'){
                imgUrl = "../assets/img/web/pic_sportsplus_dtt.png"
            }else if(data == 'unique'){
                imgUrl = "../assets/img/web/pic_unique_dtt.png"
            }else if(data == 'classique'){
                imgUrl = "../assets/img/web/pic_classique_dtt.png"
            }else if(data == 'nova'){
                imgUrl = "../assets/img/web/pic_nova_dtt.png"
            }else if(data == 'basique'){
                imgUrl = "../assets/img/web/pic_basique_dtt.png"
            }else if(data == 'sport play'){
                imgUrl = "../assets/img/web/pic_sportsplay_dtt.png"
            }
            return imgUrl
        },
        dthImgUrl(name){
            let data = name.toLowerCase()
            let imgUrl = ''
            if(data == 'sport plus'){
                imgUrl = "../assets/img/web/pic_sportsplus_dth.png"
            }else if(data == 'super'){
                imgUrl = "../assets/img/web/pic_super_dth.png"
            }else if(data == 'smart'){
                imgUrl = "../assets/img/web/pic_smart_dth.png"
            }else if(data == 'engilsh'){
                imgUrl = "../assets/img/web/pic_engilsh_dth.png"
            }else if(data == 'indian'){
                imgUrl = "../assets/img/web/pic_indian_dth.png"
            }else if(data == 'chinese'){
                imgUrl = "../assets/img/web/pic_Chinese_dth.png"
            }else if(data == 'sport play'){
                imgUrl = "../assets/img/web/pic_sportsplay_dth.png"
            }
            return imgUrl
        }
    },
    computed: {
        currency() {
            return this.$store.state.country.currencySymbol
        }
    },
    head() {
        return {
            title: 'StarTimes'
        }
    }
}
</script>

<style lang="less">
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
        margin-bottom: 0.25rem;
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
    }
    ul {
        width: 100%;
        li {
            float: left;
            width: 31.3%;
            margin: 3% 2% 3% 0;
            display: block;
            &:nth-child(3n) {
                margin-top: 3%;
            }
            .money {
                color: #333333;
                font-size: 0.85rem;
                text-align: right;
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
    padding: 0.5rem 0 4.5rem 0.2rem;
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
