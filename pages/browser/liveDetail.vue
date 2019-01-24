<template>
    <div class="wrapper">
        <download class="clearfix"/>
        <div class="poster">
            <img :src="poster" alt>
        </div>
        <div class="container">
            <p class="views">{{liveOnlineUserNumber | formatViewCount}} views</p>
            <div class="base-info clearfix">
                <div class="logo">
                    <img :src="logo" alt>
                </div>
                <div class="info">
                    <p class="info-name">{{name}}</p>
                    <img src="~assets/img/web/online.png" v-show="liveStatus">
                    <img src="~assets/img/web/ic_TERRESTRIAL.png" v-show="isDTT">
                    <img src="~assets/img/web/ic_dth.png" v-show="isDTH">
                </div>
            </div>
            <div class="describes">
                <p>introduction: {{describes}}</p>
            </div>
            <div class="watch" v-show="packages.length > 0">
                <p>Watch it on TV</p>
                <div v-for="(item,index) in packages" :key="index" class="watchList" @click="goToBouquetDetail(item)">
                    <img src="~assets/img/web/DTT.png" class="sign" v-show="item.tvPlatForm=='DTT'">
                    <img src="~assets/img/web/DTH.png" class="sign" v-show="item.tvPlatForm=='DTH'">
                    <span :class="{isDtt:item.tvPlatForm=='DTT',isDth:item.tvPlatForm=='DTH'}">{{item.id}}</span>
                    <span class="name">{{item.name}}</span>
                    <img src="~assets/img/web/ic_categary1.png" class="arrows">
                </div>
            </div>
            <div class="tv-guide" v-show="epgList.length > 0">
                <p>TV Guide</p>
                <ul class="clearfix">
                    <li v-for="(item,index) in epgTime" :key="index" @click="getTvGuide(item,index)">
                        <span :class="{today : index==currentIndex}">{{item.dateStr}}</span>
                    </li>
                </ul>
                <div class="epg-contain">
                    <div class="epg" v-for="(item,index) in epgList" :key="index">
                        <span class="playTime">{{item.startDate | formatPlayTime}}</span>
                        <span class="circle" :class="{current:item.isCurrent}"/>
                        <div class="playTitle" @click="toggleDetail(item)">
                            {{item.name}}
                            <div style="height:0.8rem;"/>
                            <div class="total" v-show="item.isCurrent">
                                <div class="progress" :style="{ width: progress + '%'}"/>
                            </div>
                            <div class="more-info" v-show="item.showDetail">
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
import download from '~/components/web/download'
export default {
    layout: 'default',
    data() {
        return {
            poster: '',
            liveOnlineUserNumber: '',
            logo: '',
            name: '',
            describes: '',
            liveStatus: false,
            packages: [],
            programVO: {},
            isDTT: false,
            isDTH: false,
            channelID: this.$route.query.channelId,
            epgTime: [],
            epgList: [],
            progress: 0,
            currentIndex: 3,
            channelList: []
        }
    },
    mounted() {
        let msg = sessionStorage.getItem('liveMsg')
        if (msg) {
            let info = JSON.parse(msg)
            this.poster = info.poster
            this.liveOnlineUserNumber = info.liveOnlineUserNumber
            this.logo = info.logo
            this.name = info.name
            this.liveStatus = info.liveStatus
            this.describes = info.describes
            this.packages = info.packages
            this.programVO = info.programVO
        } else {
            this.getChannelsList()
        }
    },
    watch: {
        packages: {
            handler(val) {
                if (val.length > 0) {
                    val.forEach(ele => {
                        if (ele.tvPlatForm == 'DTT') this.isDTT = true
                        else if (ele.tvPlatForm == 'DTH') this.isDTH = true
                    })
                }
            },
            immediate: true,
            deep: true
        },
        programVO: {
            handler(val) {
                if (JSON.stringify(val) != '{}') {
                    this.getEpgTime()
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        goToBouquetDetail(item) {
            let packageCode = item.code
            let bouId = item.id
            let price = item.price
            let logo = encodeURI((item.poster && item.poster.resources[0].url) || '')
            let name = item.name
            let plat = item.tvPlatForm
            this.$router.push(`/browser/bouquetDetail?id=${bouId}&price=${price}&logo=${logo}&name=${name}&plat=${plat}`)
        },
        getEpgTime() {
            // 获取当前时间 前三后四天
            let today = new Date()
            this.epgTime.push(this.getDateStr(new Date().setDate(new Date().getDate() - 3)))
            this.epgTime.push(this.getDateStr(new Date().setDate(new Date().getDate() - 2)))
            this.epgTime.push(this.getDateStr(new Date().setDate(new Date().getDate() - 1)))
            this.epgTime.push(this.getDateStr(new Date()))
            this.epgTime.push(this.getDateStr(new Date().setDate(new Date().getDate() + 1)))
            this.epgTime.push(this.getDateStr(new Date().setDate(new Date().getDate() + 2)))
            this.epgTime.push(this.getDateStr(new Date().setDate(new Date().getDate() + 3)))
            this.epgTime.push(this.getDateStr(new Date().setDate(new Date().getDate() + 4)))
            this.getTvGuide(this.epgTime[3], 3)
        },
        getDateStr(date) {
            let tmp = new Date(date).toLocaleDateString()
            let today = new Date().toLocaleDateString()
            let dateStr
            if (tmp == today) {
                dateStr = 'Today'
            } else {
                dateStr = tmp.split('/')[1] + '/' + tmp.split('/')[2]
            }
            let start = new Date(new Date(tmp)).getTime() // 00:00:00
            let end = new Date(new Date(tmp)).getTime() + 24 * 60 * 60 * 1000 - 1 // 23:59:59
            return {
                dateStr: dateStr,
                start: start,
                end: end
            }
        },
        getTvGuide(item, index) {
            this.currentIndex = index
            this.$axios.get(`/cms/programs?channelID=${this.channelID}&startDate=${item.start}&endDate=${item.end}&count=1000`).then(res => {
                let data = res.data
                if (data.length > 0) {
                    let now = new Date().getTime()
                    data.forEach(ele => {
                        ele.showDetail = false
                        if (ele.startDate <= now && now <= ele.endDate) {
                            ele.isCurrent = true
                            let totalTime = ele.endDate - ele.startDate
                            let nowTime = now - ele.startDate
                            this.progress = Math.floor((nowTime / totalTime) * 100)
                        } else {
                            ele.isCurrent = false
                        }
                    })
                    this.epgList = data

                    this.$nextTick(() => {
                        //TODO scroll
                        let current = document.querySelector('.epg .current').parentElement.offsetTop
                        let h = document.querySelector('.epg .current').parentElement.offsetHeight
                        document.querySelector('.epg-contain').scrollTop = current 
                    })
                }
            })
        },
        getChannelsList() {
            this.$axios.get(`/cms/vup/channels/dispark/categories`).then(res => {
                let data = res.data
                if (data.length > 0) {
                    data.forEach(ele => {
                        let disparkChannel = ele.disparkChannel
                        disparkChannel.forEach(item => {
                            this.channelList.push(item)
                        })
                    })
                    this.getChannelDetail()
                }
            })
        },
        getChannelDetail() {
            try {
                this.channelList.forEach(ele => {
                    if (this.channelID == ele.channelId) {
                        ;(this.poster = ele.channel.poster.resources[0].url),
                            (this.liveOnlineUserNumber = ele.channel.liveOnlineUserNumber),
                            (this.logo = ele.channel.logo.resources[0].url),
                            (this.name = ele.name)
                        ;(this.liveStatus = ele.channel.liveStatus || false), (this.describes = ele.describes)
                        this.programVO = ele.programVO || {}
                        if (
                            ele.channel &&
                            ele.channel.ofAreaTVPlatforms[0] &&
                            ele.channel.ofAreaTVPlatforms[0].platformInfos[0] &&
                            ele.channel.ofAreaTVPlatforms[0].platformInfos[0].packages
                        ) {
                            this.packages = ele.channel.ofAreaTVPlatforms[0].platformInfos[0].packages
                        } else {
                            this.packages = []
                        }
                        throw new Error('EndIterative')
                    }
                })
            } catch (e) {
                if (e.message != 'EndIterative') throw e
            }
        },
        toggleDetail(program) {
            if (program.showDetail == true) {
                program.showDetail = false
            } else {
                this.epgList.forEach((item, index) => {
                    if (item.id == program.id) {
                        item.showDetail = true
                    } else {
                        item.showDetail = false
                    }
                })
            }
        }
    },
    filters: {
        formatViewCount(count) {
            return count.toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,')
        },
        formatPlayTime(time) {
            let tmp = new Date(time)
            let hours = tmp.getHours() >= 10 ? tmp.getHours() : '0' + tmp.getHours()
            let minutes = tmp.getMinutes() >= 10 ? tmp.getMinutes() : '0' + tmp.getMinutes()
            return hours + ':' + minutes
        }
    },
    components: {
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
.wrapper {
    .poster {
        width: 100%;
        img {
            width: 100%;
            height: 12rem;
        }
    }
    .container {
        width: 93%;
        margin: 0.5rem auto;
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
                    margin-top: 0.4rem;
                    background-color: #eeeeee;
                    border-radius: 4px;
                    text-align: center;
                    color: #212121;
                    font-weight: bold;
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
}
</style>
