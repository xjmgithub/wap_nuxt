<template>
    <div class="wrapper">
        <div class="guide">
            <div class="search">
                <input type="text" placeholder="Search your favorite channels">
                <img @click="search" src="~assets/img/web/ic_search.png">
            </div>
            <channel v-for="(item ,i) in channelList" :key="i" :item="item"/>
        </div>
    </div>
</template>
<script>
import channel from '~/components/web/guideitem'
import localforage from 'localforage'
import dayjs from 'dayjs'
export default {
    components: {
        channel: channel
    },
    data() {
        return {
            channelList: []
        }
    },
    mounted() {
        
        localforage.config({
            driver: localforage.INDEXEDDB,
            name: 'StarTimes'
        })

        localforage
            .getItem('dbtime')
            .then(val => {
                if (val) {
                    if (val != dayjs().format('YYYY-MM-DD')) {
                        // DELETE CACHE
                        localforage.clear().then(() => {
                            localforage.setItem('dbtime', dayjs().format('YYYY-MM-DD'))
                            this.getChannels()
                        })
                    } else {
                        this.getChannels()
                    }
                } else {
                    localforage.setItem('dbtime', dayjs().format('YYYY-MM-DD'))
                    this.getChannels()
                }
            })
            .catch(err => {
                console.log(err)
            })

        document.querySelector('#__layout>.wrapper').addEventListener('scroll', () => {
            this.$store.commit('SCROLL_PAGE', document.querySelector('#__layout>.wrapper').scrollTop)
        })
    },
    methods: {
        search() {},
        getChannels() {
            this.$nextTick(() => this.$nuxt.$loading.start())
            this.$axios.get(`/cms/v2/vup/snapshot/channels?count=100&platformTypes=1&platformTypes=0`).then(res => {
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
                this.channelList = data
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
            line-height: 2.5rem;
            outline-style: none;
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
}
</style>


