<template>
    <div class="untrim-page">
        <div v-if="channel.poster&&channel.poster.resources[0].url" class="poster" @click="confirmDown">
            <img :src="channel.poster&&cdnPicSrc(channel.poster.resources[0].url)">
            <img src="~assets/img/web/ic_play.png">
        </div>
        <div class="container-main">
            <div class="views">
                {{channel.liveOnlineUserNumber||0 | formatViewCount}} views
                <div class="share" @click="toShare">
                    <img src="~assets/img/web/ic_share_def_g.png">
                    {{$store.state.lang.officialwebsitemobile_action_share}}
                </div>
            </div>
            <div v-if="channel.id" class="base-info clearfix">
                <div class="logo">
                    <img :src="channel.logo.resources[0]&&cdnPicSrc(channel.logo.resources[0].url)" alt>
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
        <mShare :show="showShare"/>
    </div>
</template>
<script>
import mShare from '~/components/web/share.vue'
import { normalToAppStore, UAType } from '~/functions/utils'
import dayjs from 'dayjs'
export default {
    components: {
        mShare
    },
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
            epgList: [],
            epgTime: [],
            progress: 0,
            currentIndex: 3,
            showShare: false
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
    async asyncData({ app: { $axios }, route, store }) {
        let data = null
        let time = new Date().getTime()
        let cusShareTitle = ''
        let cusShareImg = ''
        try {
            $axios.setHeader('token', store.state.gtoken)
            const res = await $axios.get(`/cms/vup/v6/channels/${route.query.channelId}`)
            const res2 = await $axios.get(`/adm/v1/sharing/custom-contents?target_type=1&target_id=${route.query.channelId}`)
            time = dayjs(res.headers.date).valueOf()
            data = res.data
            cusShareTitle = (res2.data.data && res2.data.data.copywriting) || ''
            cusShareImg = (res2.data.data && res2.data.data.image_url) || ''
        } catch (e) {
            data = null
        }
        return {
            serverTime: time,
            channel: data,
            platformInfos: data && data.ofAreaTVPlatforms[0].platformInfos,
            cusShareTitle: cusShareTitle,
            cusShareImg: cusShareImg
        }
    },
    mounted() {
        if (!this.channel) {
            this.$alert('Get channel error')
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

        if (this.channel.poster && this.channel.poster.resources[0].url) {
            this.sendEvLog({
                category: document.title,
                action: 'install_promo_show',
                label: UAType() + '_2',
                value: 1
            })
        }
    },
    methods: {
        toShare() {
            this.$store.commit('SET_SHARE_STATE', true)
        },
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
            this.$axios
                .get(`/cms/programs?channelID=${this.channelID}&startDate=${item.start}&endDate=${item.end}&count=1000`)
                .then(res => {
                    this.$nextTick(() => this.$nuxt.$loading.finish())
                    const data = res.data
                    if (data.length > 0) {
                        const now = this.serverTime
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
                .catch(() => {
                    this.$nextTick(() => this.$nuxt.$loading.finish())
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
            this.$confirm(
                this.$store.state.lang.officialwebsitemobile_downloadpromo,
                () => {
                    normalToAppStore.call(this)
                    this.sendEvLog({
                        category: document.title,
                        action: 'install_dialog_install',
                        label: UAType() + '_2',
                        value: 1
                    })
                },
                () => {
                    this.sendEvLog({
                        category: document.title,
                        action: 'install_dialog_cancel',
                        label: UAType() + '_2',
                        value: 1
                    })
                },
                this.$store.state.lang.officialwebsitemobile_downloadpopup_install,
                this.$store.state.lang.officialwebsitemobile_downloadpopup_cancel
            )
            this.sendEvLog({
                category: document.title,
                action: 'install_promo_click',
                label: UAType() + '_2',
                value: 1
            })
        }
    },
    head() {
        return {
            title: this.channel.name,
            meta: [
                { name: 'description', property: 'description', content: this.channel.description },
                { name: 'og:description', property: 'og:description', content: this.channel.description + '#StarTimes ON Live TV & football' },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: this.cusShareImg || (this.channel.logo && this.channel.logo.resources[0].url.replace('http:', 'https:'))
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary' },
                { name: 'og:title', property: 'og:title', content: this.channel.name }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
.untrim-page {
    padding-left: 0;
    padding-right: 0;
}
.poster {
    position: relative;
    padding-top: 55%;
    img {
        width: 100%;
        height: 100%;
        top: 0;
        position: absolute;
        & + img {
            width: 3rem;
            top: 50%;
            height: 3rem;
            left: 50%;
            margin-left: -1.5rem;
            margin-top: -1.5rem;
        }
    }
}
.container-main {
    margin: 0 0.8rem 0.8rem;
    .views {
        color: #999999;
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 0.5rem;
        height: 3rem;
        line-height: 3rem;
        .share {
            float: right;
            color: #666666;
            font-size: 0.8rem;
            line-height: 0.8rem;
            padding-top: 0.3rem;
            text-align: center;
            img {
                display: block;
                width: 1.5rem;
                margin: 0 auto;
            }
        }
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
                img {
                    width: 1.5rem;
                    float: right;
                }
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
