<template>
    <div class="wrapper">
        <div class="bouquets clearfix">
            <p>{{tvPlatForm}}</p>
            <div class="logo">
                <bgImg :bouquet-name = "className" />
            </div>
            <div class="info">
                <p class="bouquetName">{{bouquetName}} Bouquet</p>
                <p class="money">{{currency}} {{price}}</p>
                <p class="recharge"><img src="~assets/img/web/Group.png" alt=""> Recharge</p>
            </div>
        </div>
        <p class="title">{{detailList.length}} TV Channels inclued</p>
        <ul class="channelList">
            <li v-for="(item,index) in detailList" :key="index">
                <img :src="item.logo" alt="">
                <img src="~assets/img/web/channelsOn.png" v-show ="item.liveStatus" class="imgOn">
            </li>
        </ul>
    </div>
</template>

<script>
import bgImg from '~/components/web/bgImg'
export default {
    layout:'default',
    data(){
        return{
            detailList:[],
            className:'',
            price:'',
            bouquetName:'',
            tvPlatForm:''
        }
    },
    mounted() {
        let packageCode = this.$route.query.packageCode
        let id = this.$route.query.id
        this.className = this.$route.query.className
        this.price = this.$route.query.price
        this.$axios.get(
            `/cms/v2/vup/snapshot/channels?count=500&platformTypes=1&platformTypes=0&packageCode=${packageCode}`
        ).then(res => {
            let countChannel = res.data
            let platformInfo, packages, detail
            if(countChannel.length > 0){
                countChannel.forEach(channel => {
                    platformInfo = channel.ofAreaTVPlatforms[0].platformInfos
                    platformInfo.forEach(platform=>{
                        packages = platform.packages
                        packages.forEach(detail=>{
                            if(detail.id == id){
                                this.bouquetName = detail.name
                                this.tvPlatForm =  detail.tvPlatForm == 'DTH' ? 'Dish' :'Antenna' 
                                detail.logo = channel.logo.resources[0].url
                                detail.liveStatus = channel.liveStatus
                                this.detailList.push(detail)
                            }
                        })
                    })
                });

            }
        })
    },
    computed: {
        currency() {
            return this.$store.state.country.currencySymbol
        },
    },
    components:{
        bgImg
    },
    head() {
        return {
            title: 'bouquetDetail'
        }
    }
}
</script>

<style lang="less">
@import '~assets/less/browser/index.less';
.wrapper{
    .bouquets{
        width: 94%;
        margin: 0 auto;
        border-bottom: 2px solid #d8d8d8;
        padding: 0.5rem 0 1rem 0.2rem;
        & > p {
            color: #333333;
            font-weight: 600;
            margin-bottom:.7rem;
            font-size:1.1rem;
        }
        .logo{
            width: 32%;
            float: left;
            margin-right:1rem;
        }
        .info{
            float: right;
            width:60%;
            .bouquetName{
                font-weight: bold
            }
            .recharge{
                font-size:.9rem;
                img{
                    width: 1rem;
                    vertical-align: top;
                }
            }
            .money{
                font-size: .9rem;

            }
        }
    }
    .title{
        padding:.5rem 0  .5rem .5rem;
        font-weight: bold;
    }
    .channelList{
        border-top:1px solid #d8d8d8;
        li{
            width:25%;
            float: left;
            padding:.3rem;
            box-sizing: border-box;
            border-bottom:1px solid #d8d8d8;
            border-right:1px solid #d8d8d8;
            position: relative;
            img{
                width:100%;
            }
            .imgOn{
                position: absolute;
                width:1.5rem;
                top:0;
                right:0;
            }
        }
    }
}
</style>
