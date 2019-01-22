<template>
    <div class="wrapper">
        <download class="clearfix"/>
        <div v-show="!loadstate" class="channelList">
            <p class="title">{{channelList.length}} {{$store.state.lang.officialwebsitemobile_live_channelnumber}}</p>
            <channel
                v-for="(item,index) in channelList"
                :key="index"
                class="piece"
                :channel-name="item.name"
                :description="item.describesShow"
                :state="item.channel.billingType"
                :rate="item.rate"
                @onLive="liveDetail(item)"
            />
        </div>
        <loading v-show="loadstate"/>
    </div>
</template>
<script>
import channel from '~/components/web/channel'
import download from '~/components/web/download'
import loading from '~/components/loading'
export default {
    layout: 'default',
    data() {
        return {
            channelList: [],
            loadstate: true
        }
    },
    mounted() {
        this.$axios.get(`/cms/vup/channels/dispark/categories`).then(res => {
            this.loadstate = false
            let data = res.data
            if (data.length > 0) {
                data.forEach(ele => {
                    let disparkChannel = ele.disparkChannel
                    disparkChannel.forEach(item => {
                        if (item.programVO) {
                            let tmp = new Date(item.programVO.startDate).getHours()
                            let startDate = tmp > 0 ? tmp + ':00' : '0' + tmp + ':00'
                            item.describesShow = startDate + ' ' + item.programVO.name
                            let totalTime = item.programVO.endDate - item.programVO.startDate
                            let nowTime = new Date().getTime() - item.programVO.startDate
                            if (totalTime >= nowTime) {
                                item.rate = Math.floor((nowTime / totalTime) * 100)
                            } else {
                                item.rate = Math.floor(Math.random() * 100)
                            }
                        } else {
                            item.rate = Math.floor(Math.random() * 100)
                            item.describesShow = item.describes
                        }
                        this.channelList.push(item)
                    })
                })
            }
        })
    },
    methods: {
        liveDetail(item) {
            let packages
            if (
                item.channel &&
                item.channel.ofAreaTVPlatforms[0] &&
                item.channel.ofAreaTVPlatforms[0].platformInfos[0] &&
                item.channel.ofAreaTVPlatforms[0].platformInfos[0].packages
            ) {
                packages = item.channel.ofAreaTVPlatforms[0].platformInfos[0].packages
            } else {
                packages = []
            }
            let liveMsg = {
                channelId: item.channelId,
                name: item.name,
                describes: item.describes,
                logo: item.channel.logo.resources[0].url,
                poster: item.channel.poster.resources[0].url,
                liveOnlineUserNumber: item.channel.liveOnlineUserNumber,
                liveStatus: item.channel.liveStatus || false,
                programVO: item.programVO || {},
                packages: packages
            }
            sessionStorage.setItem('liveMsg', JSON.stringify(liveMsg))
            this.$router.push(`/browser/liveDetail?channelId=${item.channelId}`)
        }
    },
    components: {
        channel,
        download,
        loading
    },
    head() {
        return {
            title: 'Live'
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.wrapper {
    .channelList {
        padding: 0.8rem;
        .title {
            font-weight: bold;
            padding: 0;
        }
        .piece {
            margin: 0.8rem 0;
        }
    }
}
</style>
