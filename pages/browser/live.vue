<template>
    <div class="wrapper wide">
        <download class="clearfix"/>
        <div v-show="!loadstate" class="channelList">
            <p class="title">{{channelList.length}} {{$store.state.lang.officialwebsitemobile_live_channelnumber}}</p>
            <channel v-for="(item,index) in channelList" :key="index" class="piece" :channel="item"/>
        </div>
    </div>
</template>
<script>
import channel from '~/components/web/channel'
import download from '~/components/web/download'
export default {
    data() {
        return {
            channelList: [],
            loadstate: true
        }
    },
    mounted() {
        this.$nextTick(() => this.$nuxt.$loading.start())
        this.$axios.get(`/cms/vup/channels/dispark/categories`).then(res => {
            this.loadstate = false
            this.$nextTick(() => this.$nuxt.$loading.finish())
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
    components: {
        channel,
        download
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
</style>
