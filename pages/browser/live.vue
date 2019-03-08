<template>
    <div class="wrapper wide">
        <download class="clearfix" />
        <div v-show="!loadstate" class="channelList">
            <p class="title">
                {{channelList.length}} {{$store.state.lang.officialwebsitemobile_live_channelnumber}}
            </p>
            <channel v-for="(item,index) in channelList" :key="index" :channel="item" class="piece" />
        </div>
    </div>
</template>
<script>
import channel from '~/components/web/channel'
import download from '~/components/web/download'
export default {
    components: {
        channel,
        download
    },
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
            const data = res.data
            if (data.length > 0) {
                data.forEach(ele => {
                    const disparkChannel = ele.disparkChannel
                    disparkChannel.forEach(item => {
                        if (item.programVO) {
                            const tmp = new Date(item.programVO.startDate).getHours()
                            const startDate = tmp > 0 ? tmp + ':00' : '0' + tmp + ':00'
                            item.describesShow = startDate + ' ' + item.programVO.name
                            const totalTime = item.programVO.endDate - item.programVO.startDate
                            const nowTime = new Date().getTime() - item.programVO.startDate
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
    head() {
        return {
            title: this.$store.state.lang.seo_title_live,
            meta: [
                { hid: 'description', name: 'description', content: this.$store.state.lang.seo_desc_live },
                { hid: 'keywords', name: 'keywords', content: this.$store.state.lang.seo_keywords_live }
            ]
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
