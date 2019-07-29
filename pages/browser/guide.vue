<template>
    <div>
        <div class="guide">
            <div class="search">
                <form @submit.prevent="search">
                    <input v-model="keyword" type="text" :placeholder="$store.state.lang.officialwebsitemobile_tvguide_searchbox">
                    <img src="~assets/img/web/ic_search.png" @click="search">
                </form>
            </div>
            <p class="count">
                <span v-if="!showSearch">{{channelList.length}} {{$store.state.lang.officialwebsitemobile_tvguide_channellist}}</span>
                <span
                    v-else-if="channelList.length > 1 && showSearch"
                >{{channelList.length}}{{$store.state.lang.officialwebsitemobile_tvguide_searchresults}}'{{showSearch}}'</span>
                <span
                    v-else-if="channelList.length == 1 && showSearch"
                >{{$store.state.lang.officialwebsitemobile_tvguide_search1result}}'{{showSearch}}'</span>
                <span
                    v-else-if="channelList.length == 0 && showSearch"
                >{{$store.state.lang.officialwebsitemobile_tvguide_search0result}}'{{showSearch}}'</span>
            </p>
            <div v-show="showSearch&&channelList.length==0" class="noResult">
                <img src="~assets/img/web/noresult.png" alt>
            </div>
            <channel v-for="item in channelList" :key="item.id" :search-times="searchTimes" :server-time="serverTime" :item="item"/>
            <p v-show="channelList.length>0" class="noMoreChannel">{{$store.state.lang.officialwebsitemobile_tvguide_channellistbottom}}</p>
        </div>
    </div>
</template>
<script>
import localforage from 'localforage'
import dayjs from 'dayjs'
import channel from '~/components/web/guideitem'
import { initDB, cacheDateUpdate } from '~/functions/utils'
export default {
    components: {
        channel: channel
    },
    data() {
        return {
            channelList: [],
            oriChannelList: [],
            keyword: '',
            showSearch: false,
            searchTimes: 0
        }
    },
    async asyncData({ $axios }) {
        if (process.server) {
            return { serverTime: new Date().getTime() }
        } else {
            const { headers } = await $axios.get('/hybrid/api/getServerTime')
            return {
                serverTime: dayjs(headers.date).valueOf()
            }
        }
    },
    mounted() {
        initDB()
        cacheDateUpdate.call(this, this.getChannels)

        document.addEventListener('scroll', () => {
            const scollTop = document.body.scrollTop || document.documentElement.scrollTop
            this.$store.commit('SCROLL_PAGE', scollTop)
        })
        document.addEventListener(
            'touchmove',
            () => {
                if (document.activeElement) document.activeElement.blur()
            },
            { passive: false }
        )
    },
    methods: {
        search() {
            this.channelList = []
            let channelNumber
            if (this.keyword) {
                this.oriChannelList.forEach(ele => {
                    if (ele.ofAreaTVPlatforms[0] && ele.ofAreaTVPlatforms[0].platformInfos) {
                        const platformInfos = ele.ofAreaTVPlatforms[0].platformInfos
                        platformInfos.forEach(plat => {
                            channelNumber = plat.channelNumber
                        })
                    }
                    if (ele.name.toLowerCase().indexOf(this.keyword.toLowerCase()) > -1 || channelNumber.toString().indexOf(this.keyword) > -1) {
                        this.channelList.push(ele)
                    }
                })
                this.showSearch = this.keyword
            } else {
                this.oriChannelList.forEach(ele => {
                    this.channelList.push(ele)
                })
                this.showSearch = ''
            }
            this.searchTimes++
        },
        getChannels() {
            this.$nextTick(() => this.$nuxt.$loading.start())
            localforage.getItem('channel').then(val => {
                if (!val) {
                    this.$axios.get(`/cms/v2/vup/snapshot/channels?count=1000&platformTypes=1&platformTypes=0`).then(res => {
                        this.$nextTick(() => this.$nuxt.$loading.finish())
                        const data = res.data
                        data.forEach(ele => {
                            if (ele.ofAreaTVPlatforms[0] && ele.ofAreaTVPlatforms[0].platformInfos) {
                                const platformInfos = ele.ofAreaTVPlatforms[0].platformInfos
                                platformInfos.forEach(plat => {
                                    ele.isDTT = plat.tvPlatForm === 'DTT' ? true : ''
                                    ele.isDTH = plat.tvPlatForm === 'DTH' ? true : ''
                                    ele.dttChannel = plat.tvPlatForm === 'DTT' ? plat.channelNumber : ''
                                    ele.dthChannel = plat.tvPlatForm === 'DTH' ? plat.channelNumber : ''
                                })
                            }
                        })
                        this.oriChannelList = data
                        this.channelList = data
                        localforage.setItem('channel', this.channelList)
                    })
                } else {
                    this.$nextTick(() => this.$nuxt.$loading.finish())
                    this.oriChannelList = val
                    this.channelList = val
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.guide {
    width: 100%;
    .search {
        position: relative;
        margin: 0.5rem 0;
        input {
            width: 100%;
            padding-left: 1rem;
            border-radius: 4px;
            border: 1px solid #979797;
            height: 2.5rem;
            line-height: 1.25rem;
            outline-style: none;
            z-index: -1;
            &::-webkit-input-placeholder {
                color: #bdbdbd;
                font-size: 0.95rem;
            }
            & + img {
                position: absolute;
                right: 0.8rem;
                top: 50%;
                width: 1.5rem;
                height: 1.5rem;
                margin-top: -0.75rem;
            }
        }
    }
    .count {
        color: #bdbdbd;
    }
    .noResult {
        text-align: center;
        color: #333333;
        img {
            display: block;
            width: 65%;
            margin: 2rem auto 2rem;
        }
    }
    .noMoreChannel {
        color: #bdbdbd;
        text-align: center;
        padding: 1rem;
    }
}
</style>


