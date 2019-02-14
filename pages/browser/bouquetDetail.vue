<template>
    <div class="wrapper wide">
        <div class="bouquets clearfix" v-show="!loadstate">
            <p>{{tvPlatFormName}}</p>
            <div class="logo">
                <bg-img-data :img-path="packageLogo" :package-name="bouquetName"/>
            </div>
            <div class="info">
                <p class="bouquetName">{{bouquetName}} Bouquet</p>
                <p class="money">{{currency}} {{price}}</p>
                <p class="recharge">
                    <a :href="recharge_url">
                        <img src="~assets/img/web/Group.png" alt> Recharge
                    </a>
                </p>
            </div>
        </div>
        <p class="title" v-show="!loadstate">{{detailList.length}} TV Channels inclued</p>
        <ul class="channelList">
            <li v-for="(item,index) in detailList" :key="index">
                <div class="lasy_bg">
                    <nuxt-link :to="`/browser/liveDetail?channelId=${item.channel_id}`">
                        <img :src="item.logo.resources[0].url.replace('http:','https:')" alt>
                    </nuxt-link>
                </div>
                <img src="~assets/img/web/channelsOn.png" v-show="item.liveStatus" class="imgOn">
            </li>
        </ul>
    </div>
</template>
<script>
import bgImgData from '~/components/web/bgImgData'
export default {
    layout: 'default',
    data() {
        return {
            detailList: [],
            price: this.$route.query.price,
            bouquetName: this.$route.query.name,
            packageLogo: this.$route.query.logo,
            tvPlatFormName: this.$route.query.plat == 'DTH' ? 'Dish' : 'Antenna',
            loadstate: true,
            recharge_url: 'https://m.startimestv.com/DVB/binding.php'
        }
    },
    mounted() {
        this.$nextTick(() => this.$nuxt.$loading.start())
        let host = window.location.host
        if (host.indexOf('qa') >= 0 || host.indexOf('dev') >= 0 || host.indexOf('localhost') >= 0) {
            this.recharge_url = 'http://qa.upms.startimestv.com/wap/DVB/binding.php'
        }

        let id = this.$route.query.id
        let countryCode = this.$store.state.country.country
        let packageId = this.$route.query.id
        let plat = this.$route.query.plat == 'DTH' ? '1' : '0'
        this.$axios
            .get(
                `/channel/v1/channels/broadcast/channels/package-id?country_code=${countryCode}&platform_type=${plat}&package_id=${packageId}&include_lower_code=true`
            )
            .then(res => {
                this.$nextTick(() => this.$nuxt.$loading.finish())
                this.loadstate = false
                let countChannel = res.data.data
                if (res.data && res.data.code == 200) {
                    this.detailList = res.data.data
                } else {
                    this.detailList = []
                }
            })
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
            title: this.$store.state.lang.seo_title_bouquets,
            meta: [
                { hid: 'description', name: 'description', content: this.$store.state.lang.seo_desc_bouquets },
                { hid: 'keywords', name: 'keywords', content: this.$store.state.lang.seo_keywords_bouquets }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.bouquets {
    margin: 0 0.8rem;
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
            a {
                color: #333333;
            }
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
</style>
