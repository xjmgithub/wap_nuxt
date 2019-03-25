<template>
    <div v-if="item.logo" class="channels clearfix">
        <nuxt-link :to="`/browser/liveDetail?channelId=${item.id}`">
            <img ref="dataimg" src="~assets/img/web/channel.png" alt class="logo">
            <div class="celDetail">
                <p>
                    {{item.name}}
                    <span v-show="item.isDTT" class="dtt">
                        <img src="~assets/img/web/ic_guide_dtt.png" alt>
                        {{item.dttChannel}}
                    </span>
                    <span v-show="item.isDTH" class="dth">
                        <img src="~assets/img/web/ic_guide_dth.png" alt>
                        {{item.dthChannel}}
                    </span>
                </p>

                <div v-for="(epg,index) in epgList" v-show="loaded" :key="index" class="epgMsg">
                    <span :class="{current:index==0}" class="playTime">{{epg.startDate | formatPlayTime}}</span>
                    <div :class="{current:index==0}" class="playTitle">
                        {{epg.name}}
                        <div v-show="index==0" class="total">
                            <div :style="{ width: progress + '%'}" class="progress"/>
                        </div>
                    </div>
                </div>
                <div v-if="!loaded">
                    <div class="gray-block"/>
                    <div class="gray-block"/>
                </div>
                <div v-if="loaded && epgList.length==0" class="noEpg">{{$store.state.lang.officialwebsitemobile_tvguide_noepg}}</div>
            </div>
        </nuxt-link>
    </div>
</template>
<script>
import localforage from 'localforage'
import dayjs from 'dayjs'
export default {
    filters: {
        formatPlayTime(time) {
            const tmp = new Date(time)
            const hours = tmp.getHours() >= 10 ? tmp.getHours() : '0' + tmp.getHours()
            const minutes = tmp.getMinutes() >= 10 ? tmp.getMinutes() : '0' + tmp.getMinutes()
            return hours + ':' + minutes
        }
    },
    props: {
        item: {
            type: Object,
            require: true,
            default() {
                return {}
            }
        },
        serverTime: {
            type: Number,
            require: true,
            default: new Date().getTime()
        }
    },
    data() {
        return {
            loading: false,
            loaded: false,
            epgList: [],
            start: dayjs(this.serverTime)
                .startOf('day')
                .valueOf(),
            end: dayjs(this.serverTime)
                .endOf('day')
                .valueOf(),
            progress: 0
        }
    },
    computed: {
        scrollPage() {
            return this.$store.state.scrollPage
        }
    },
    watch: {
        scrollPage() {
            this.getEPG()
        }
    },
    mounted() {
        localforage.config({
            driver: [localforage.INDEXEDDB, localforage.WEBSQL],
            name: 'StarTimes'
        })
        this.$nextTick(() => {
            setTimeout(() => {
                this.getEPG()
            }, 1000)
        })
    },
    methods: {
        loadImg() {
            this.$refs.dataimg.src = this.item.logo.resources[0].url.replace('http:', 'https:')
        },
        getEPG() {
            const top = this.$el.getBoundingClientRect().top
            const screenHeight = window.screen.availHeight

            if (this.loading || this.loaded) return false

            if (top < screenHeight) {
                this.loadImg()
                this.loading = true
                const channelID = this.item.id
                localforage
                    .getItem('channel_' + channelID)
                    .then(val => {
                        if (!val) {
                            this.$axios.get(`/cms/programs?channelID=${channelID}&startDate=${this.start}&endDate=${this.end}&count=50`).then(res => {
                                this.loading = false
                                this.loaded = true
                                this.getCurrentEpg(res.data)
                                localforage.setItem('channel_' + channelID, res.data || '')
                            })
                        } else {
                            this.loading = false
                            this.loaded = true
                            this.getCurrentEpg(val)
                        }
                    })
                    .catch(function(err) {
                        console.log(err)
                    })
            }
        },
        getCurrentEpg(data) {
            if (data.length > 0) {
                const now = this.serverTime
                data.sort(function(a, b) {
                    return a.startDate - b.startDate
                })
                data.forEach((ele, i) => {
                    if (ele.startDate <= now && now <= ele.endDate) {
                        const totalTime = ele.endDate - ele.startDate
                        const nowTime = now - ele.startDate
                        this.progress = Math.floor((nowTime / totalTime) * 100)
                        if (i < data.length - 3) {
                            this.epgList = data.slice(i, i + 3)
                        } else {
                            this.epgList = data.slice(i)
                        }
                    }
                })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.channels {
    padding: 1rem 0;
    border-bottom: 1px solid #d8d8d8;
    img {
        &.logo {
            width: 25%;
            border: 1px solid #979797;
            float: left;
        }
    }
    .celDetail {
        float: right;
        width: 72%;
        font-size: 0.95rem;
        p {
            color: #333333;
            span {
                float: right;
                margin-left: 0.5rem;
                font-size: 0.95rem;
                &.dtt {
                    color: #5eb108;
                }
                &.dth {
                    color: #e7336e;
                }
                img {
                    width: 1rem;
                    height: 1rem;
                    vertical-align: top;
                }
            }
        }
        .epgMsg {
            margin: 0.2rem 0;
        }
    }
    .playTime {
        font-size: 0.95rem;
        color: #000000;
        width: 20%;
        display: inline-block;
        vertical-align: top;
        &.current {
            color: #0084e5;
        }
    }
    .playTitle {
        font-size: 0.95rem;
        color: #333333;
        display: inline-block;
        width: 78%;
        vertical-align: top;
        &.current {
            color: #0084e5;
        }
        .total {
            width: 100%;
            height: 4px;
            background-color: #dddddd;
            border-radius: 4px;
            margin: 0.3rem 0;
            .progress {
                background-color: #0084e5;
                height: 4px;
                border-radius: 4px;
            }
        }
    }
    .gray-block {
        background: #d0d0d0;
        height: 1.3rem;
        margin: 0.8rem 0;
    }
    .noEpg {
        color: #666666;
        background: linear-gradient(360deg, rgba(255, 255, 255, 1) 0%, rgba(238, 238, 238, 1) 100%);
        height: 3.8rem;
        line-height: 3.8rem;
        text-align: center;
        margin-top: 0.5rem;
    }
}
</style>
