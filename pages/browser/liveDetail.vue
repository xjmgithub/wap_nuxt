<template>
    <div class="wrapper">
        <div v-if="channel.poster&&channel.poster.resources[0].url" class="poster" @click="confirmDown">
            <img :src="channel.poster.resources[0].url.replace('http:','https:')" alt>
            <img src="~assets/img/web/ic_play.png">
        </div>
        <div class="container-main">
            <p class="views">{{channel.liveOnlineUserNumber||0 | formatViewCount}} views</p>
            <div v-if="channel.id" class="base-info clearfix">
                <div class="logo">
                    <img :src="channel.logo.resources[0].url.replace('http:','https:')" alt>
                </div>
                <div class="info">
                    <p class="info-name">{{channel.name}}</p>
                    <img v-show="channel.liveStatus" src="~assets/img/web/online.png">
                    <img v-show="isDTT" src="~assets/img/web/ic_TERRESTRIAL.png">
                    <img v-show="isDTH" src="~assets/img/web/ic_dth.png">
                </div>
            </div>
            <div class="describes">
                <p>{{channel.description}}</p>
            </div>
            <div v-show="platformInfos.length>0" class="watch">
                <p>Watch it on TV</p>
                <div v-for="(item,index) in platformInfos" :key="index" class="watchList" @click="goToBouquetDetail(item)">
                    <img v-if="item.tvPlatForm=='DTT'" src="~assets/img/web/DTT.png" class="sign">
                    <img v-if="item.tvPlatForm=='DTH'" src="~assets/img/web/DTH.png" class="sign">
                    <span :class="{isDtt:item.tvPlatForm=='DTT',isDth:item.tvPlatForm=='DTH'}">{{item.channelNumber}}</span>
                    <span class="name">{{item.ofPackage.name}}</span>
                    <img src="~assets/img/web/ic_categary1.png" class="arrows">
                </div>
            </div>
            <div v-if="epgList.length>0" class="tv-guide">
                <p>TV Guide</p>
                <ul class="clearfix">
                    <li v-for="(item,index) in epgTime" :key="index" @click="getTvGuide(item,index)">
                        <span :class="{today : index==currentIndex}">{{item.dateStr}}</span>
                    </li>
                </ul>
                <div class="epg-contain">
                    <div v-for="(item,index) in epgList" :key="index" class="epg">
                        <span class="playTime">{{item.startDate | formatPlayTime}}</span>
                        <span :class="{current:item.isCurrent}" class="circle"/>
                        <div class="playTitle" @click="toggleDetail(item)">
                            {{item.name}}
                            <div style="height:0.8rem;"/>
                            <div v-show="item.isCurrent" class="total">
                                <div :style="{ width: progress + '%'}" class="progress"/>
                            </div>
                            <div v-show="item.showDetail" class="more-info">
                                <div>
                                    <span>Rate:</span>
                                    {{item.classification}}
                                </div>
                                <div>
                                    <span>Sub-title:</span>
                                    {{item.subhead}}
                                </div>
                                <div>
                                    <span>Intro:</span>
                                    {{item.description}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { downApp } from '~/functions/utils'
import dayjs from 'dayjs'
export default {
    layout: 'default',
    filters: {
        formatViewCount(count) {
            return count.toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,')
        },
        formatPlayTime(time) {
            const tmp = new Date(time)
            const hours = tmp.getHours() >= 10 ? tmp.getHours() : '0' + tmp.getHours()
            const minutes = tmp.getMinutes() >= 10 ? tmp.getMinutes() : '0' + tmp.getMinutes()
            return hours + ':' + minutes
        }
    },
    data() {
        return {
            channelID: this.$route.query.channelId,
            channel: {},
            platformInfos: [],
            epgList: [],
            epgTime: [],
            progress: 0,
            currentIndex: 3
        }
    },
    computed: {
        isDTH() {
            let t = false
            this.platformInfos.forEach(item => {
                if (item.tvPlatForm === 'DTH') {
                    t = true
                }
            })
            return t
        },
        isDTT() {
            let t = false
            this.platformInfos.forEach(item => {
                if (item.tvPlatForm === 'DTT') {
                    t = true
                }
            })
            return t
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
        if (this.channelID) {
            this.$nextTick(() => this.$nuxt.$loading.start())
            this.$axios
                .get(`/cms/vup/v6/channels/${this.channelID}`)
                .then(res => {
                    this.$nextTick(() => this.$nuxt.$loading.finish())
                    if (res.data.id) {
                        this.channel = res.data
                        this.platformInfos = res.data.ofAreaTVPlatforms[0].platformInfos
                    } else {
                        this.$alert('Channel id is incorrect')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            this.$alert('Channel id can not be null')
        }

        // 处理epgTime
        this.epgTime.push(
            this.getDateStr(
                dayjs(this.serverTime)
                    .subtract(3, 'd')
                    .valueOf()
            )
        )
        this.epgTime.push(
            this.getDateStr(
                dayjs(this.serverTime)
                    .subtract(2, 'd')
                    .valueOf()
            )
        )
        this.epgTime.push(
            this.getDateStr(
                dayjs(this.serverTime)
                    .subtract(1, 'd')
                    .valueOf()
            )
        )
        this.epgTime.push(this.getDateStr(dayjs(this.serverTime).valueOf()))
        this.epgTime.push(
            this.getDateStr(
                dayjs(this.serverTime)
                    .add(1, 'd')
                    .valueOf()
            )
        )
        this.epgTime.push(
            this.getDateStr(
                dayjs(this.serverTime)
                    .add(2, 'd')
                    .valueOf()
            )
        )
        this.epgTime.push(
            this.getDateStr(
                dayjs(this.serverTime)
                    .add(3, 'd')
                    .valueOf()
            )
        )
        this.epgTime.push(
            this.getDateStr(
                dayjs(this.serverTime)
                    .add(4, 'd')
                    .valueOf()
            )
        )
        this.getTvGuide(this.epgTime[3], 3)
    },
    methods: {
        goToBouquetDetail(item) {
            const pack = item.ofPackage
            const bouId = pack.id
            const price = pack.price
            const logo = encodeURI((pack.poster && pack.poster.resources[0].url) || '')
            const name = pack.name
            const plat = pack.tvPlatForm
            this.$router.push(`/browser/bouquetDetail?id=${bouId}&price=${price}&logo=${logo}&name=${name}&plat=${plat}`)
        },
        getDateStr(date) {
            const tmp = new Date(date)
            let dateStr
            if (date === this.serverTime) {
                dateStr = 'Today'
            } else {
                dateStr = tmp.getMonth() + 1 + '/' + tmp.getDate()
            }
            const start = dayjs(date)
                .startOf('day')
                .valueOf() // 00:00:00
            const end = dayjs(date)
                .endOf('day')
                .valueOf() // 23:59:59
            return {
                dateStr: dateStr,
                start: start,
                end: end
            }
        },
        getTvGuide(item, index) {
            this.currentIndex = index
            this.$axios.get(`/cms/programs?channelID=${this.channelID}&startDate=${item.start}&endDate=${item.end}&count=1000`).then(res => {
                const data = res.data
                if (data.length > 0) {
                    const now = new Date().getTime()
                    data.forEach(ele => {
                        ele.showDetail = false
                        if (ele.startDate <= now && now <= ele.endDate) {
                            ele.isCurrent = true
                            const totalTime = ele.endDate - ele.startDate
                            const nowTime = now - ele.startDate
                            this.progress = Math.floor((nowTime / totalTime) * 100)
                        } else {
                            ele.isCurrent = false
                        }
                    })
                    this.epgList = data
                    this.$nextTick(() => {
                        if (document.querySelector('.epg .current')) {
                            const current = document.querySelector('.epg .current').parentElement.offsetTop
                            document.querySelector('.epg-contain').scrollTop = current
                        }
                    })
                }
            })
        },
        toggleDetail(program) {
            if (program.showDetail === true) {
                program.showDetail = false
            } else {
                this.epgList.forEach((item, index) => {
                    if (item.id === program.id) {
                        item.showDetail = true
                    } else {
                        item.showDetail = false
                    }
                })
            }
        },
        confirmDown() {
            const _this = this
            this.$confirm(
                this.$store.state.lang.officialwebsitemobile_downloadpromo,
                () => {
                    downApp.call(_this)
                },
                () => {},
                'Go',
                'Not now'
            )
        }
    },
    head() {
        return {
            title: 'Live'
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    padding: 2.95rem 0 0;
}
.poster {
    position: relative;
    img {
        width: 100%;
        height: 12rem;
        & + img {
            position: absolute;
            width: 3rem;
            top: 4.5rem;
            height: 3rem;
            left: 50%;
            margin-left: -1.5rem;
        }
    }
}
.container-main {
    margin: 0.8rem;
    .views {
        color: #999999;
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 0.5rem;
    }
    .base-info {
        padding: 0.5rem;
        border-bottom: 1px solid #eeeeee;
        .logo {
            width: 23%;
            border: 1px solid #cccccc;
            float: left;
            img {
                width: 100%;
            }
        }
        .info {
            float: right;
            width: 73%;
            margin-left: 0.5rem;
            .info-name {
                font-weight: bold;
                padding-bottom: 0.5rem;
            }
            img {
                width: 1.8rem;
            }
        }
    }
    .describes {
        font-size: 0.9rem;
        color: #666666;
        border-bottom: 1px solid #eeeeee;
        padding: 0.5rem 0;
        line-height: 1.1rem;
    }
    .watch {
        padding: 0.5rem 0;
        p {
            color: #212121;
            font-weight: bold;
        }
        .watchList {
            border-bottom: 1px solid #eeeeee;
            padding: 0.6rem 0;
            .sign {
                width: 3.5rem;
            }
            .isDtt {
                color: #5eb108;
                margin: 0 0.5rem;
            }
            .isDth {
                color: #e7336e;
                margin: 0 0.5rem;
            }
            .name {
                font-weight: bold;
            }
            .arrows {
                float: right;
                width: 1.5rem;
            }
        }
    }
    .tv-guide {
        padding: 0.5rem 0;
        p {
            color: #111111;
            font-weight: bold;
        }
        ul {
            margin-bottom: 1rem;
            li {
                list-style: none;
                float: left;
                width: 22%;
                margin-right: 4%;
                margin-top: 0.7rem;
                background-color: #eeeeee;
                border-radius: 4px;
                text-align: center;
                color: #212121;
                font-weight: bold;
                padding: 0.2rem 0;
                &:nth-child(4n) {
                    margin-right: 0;
                }
                .today {
                    color: #0084e5;
                }
            }
        }
        .epg-contain {
            max-height: 20rem;
            overflow: auto;
            position: relative;
        }
        .epg {
            position: relative;
            .playTime {
                font-size: 0.95rem;
                color: #000000;
                width: 15%;
                display: inline-block;
                vertical-align: top;
            }
            .playTitle {
                font-size: 0.95rem;
                color: #333333;
                border-left: 1px dashed #979797;
                display: inline-block;
                width: 82%;
                padding-left: 0.8rem;
                vertical-align: top;
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
                .more-info {
                    font-size: 0.9rem;
                    padding-bottom: 0.8rem;
                    span {
                        color: black;
                    }
                }
            }
            .circle {
                background-color: #ffffff;
                display: inline-block;
                width: 0.5rem;
                height: 0.5rem;
                border: 1px solid #979797;
                border-radius: 50%;
                position: absolute;
                left: 15%;
                top: 0.6rem;
                margin-top: -0.25rem;
                margin-left: 0;
                &.current {
                    border: 1px solid #0084e5;
                }
            }
        }
    }
}
</style>
