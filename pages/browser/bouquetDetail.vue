<template>
    <div class="wrapper">
        <div class="bouquets clearfix" v-show="!loadstate">
            <p>{{tvPlatFormName}}</p>
            <div class="logo">
                <bg-img-data :img-path="packageLogo" :package-name="bouquetName"/>
            </div>
            <div class="info">
                <p class="bouquetName">{{bouquetName}} Bouquet</p>
                <p class="money">{{currency}} {{price}}</p>
                <p class="recharge">
                    <img src="~assets/img/web/Group.png" alt> Recharge
                </p>
            </div>
        </div>
        <p class="title" v-show="!loadstate">{{detailList.length}} TV Channels inclued</p>
        <ul class="channelList">
            <li v-for="(item,index) in detailList" :key="index">
                <div class="lasy_bg">
                    <img :src="item.logo" alt>
                </div>
                <img src="~assets/img/web/channelsOn.png" v-show="item.liveStatus" class="imgOn">
            </li>
        </ul>
        <loading v-show="loadstate"/>
    </div>
</template>
<script>
import bgImgData from '~/components/web/bgImgData'
import loading from '~/components/loading'
export default {
    layout: 'default',
    data() {
        return {
            detailList: [],
            price: '',
            bouquetName: '',
            packageLogo: '',
            tvPlatFormName: '',
            tvPlatForm: '',
            loadstate: true
        }
    },
    mounted() {
        let packageCode = this.$route.query.packageCode
        let id = this.$route.query.id
        this.price = this.$route.query.price
        this.$axios.get(`/cms/v2/vup/snapshot/channels?count=500&platformTypes=1&platformTypes=0&packageCode=${packageCode}`).then(res => {
            this.loadstate = false
            let countChannel = res.data
            let platformInfo, packages, detail
            if (countChannel.length > 0) {
                countChannel.forEach(channel => {
                    platformInfo = channel.ofAreaTVPlatforms[0].platformInfos
                    platformInfo.forEach(platform => {
                        packages = platform.packages
                        packages.forEach(detail => {
                            if (detail.id == parseInt(id)) {
                                this.packageLogo = detail.poster ? detail.poster.resources[0].url : ''
                                this.bouquetName = detail.name
                                this.tvPlatFormName = detail.tvPlatForm == 'DTH' ? 'Dish' : 'Antenna'
                                this.tvPlatForm = detail.tvPlatForm
                                detail.logo = channel.logo.resources[0].url
                                detail.liveStatus = channel.liveStatus
                                this.detailList.push(detail)
                            }
                        })
                    })
                })
            }
        })
    },
    computed: {
        currency() {
            return this.$store.state.country.currencySymbol
        }
    },
    components: {
        bgImgData,
        loading
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
.wrapper {
    .bouquets {
        width: 94%;
        margin: 0 auto;
        border-bottom: 1px solid #d8d8d8;
        padding: 0.5rem 0 0.5rem 0.2rem;
        & > p {
            color: #333333;
            font-weight: 600;
            margin-bottom: 0.7rem;
            font-size: 1.1rem;
        }
        .logo {
            width: 38%;
            float: left;
            margin-right: 0.5rem;
            img {
                display: block;
                width: 100%;
            }
        }
        .info {
            float: right;
            width: 58%;
            .bouquetName {
                font-weight: bold;
            }
            .recharge {
                font-size: 0.9rem;
                img {
                    width: 1rem;
                    vertical-align: top;
                }
            }
            .money {
                font-size: 0.9rem;
                line-height: 1.6rem;
            }
        }
    }
    .title {
        padding: 0.5rem 0 0.5rem 0.5rem;
        font-weight: bold;
    }
    .channelList {
        border-top: 1px solid #d8d8d8;
        li {
            width: 25%;
            float: left;
            padding: 0.3rem;
            box-sizing: border-box;
            border-bottom: 1px solid #d8d8d8;
            border-right: 1px solid #d8d8d8;
            position: relative;
            .lasy_bg {
                width: 100%;
                padding-top: 100%;
                background: white;
                position: relative;
                img {
                    width: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 2;
                }
            }

            .imgOn {
                position: absolute;
                width: 1.5rem;
                top: 0;
                right: 0;
                z-index: 3;
            }
        }
    }
}
</style>
