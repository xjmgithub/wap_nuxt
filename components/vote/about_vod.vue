<template>
    <div id="about">
        <div class="vod">
            <div class="title clearfix">
                <span class="vote-title">{{share.voteName}}</span>
                <span v-show="app==1" class="invited" @click="handleInvite">invite friends to vote</span>
            </div>
            <p>{{vod_msg.programdetails}}</p>
            <div class="video-play">
                <div class="line" />
                <ul class="video-play clearfix">
                    <li v-for="(item,index) in vodDetails" :key="index" :class="item.className">
                        <span v-show="item.className =='review'">
                            <img src="~assets/img/vote/ic_replay_green.png">
                        </span>
                        <span v-show="item.className =='live'">
                            <img src="~assets/img/vote/ic_play_sl_blue.png">
                        </span>
                        <span v-show="item.className =='coming'">
                            <img src="~assets/img/vote/ic-round.png">
                        </span>
                        <span>{{item.date}}</span>
                        <span>{{item.time}}</span>
                        <span>{{item.title}}</span>
                    </li>
                </ul>
            </div>
            <p v-for="(item,index) in vod_msg.description" :key="index">
                {{item}}
            </p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        vodMsg: {
            type: Object,
            default: () => {
                return {}
            }
        },
        tabMsg: {
            type: Object,
            default: () => {
                return {}
            }
        },
        share: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            app: this.$store.state.appType,
            broadcast_time: this.vod_msg.vodTime.concat(),
            programTimeContral: [],
            vodDetails: [],
            serverTime: this.$store.state.serverTime
        }
    },
    created() {
        if (process.server) {
            const serverTime = new Date()
            this.$store.commit('SET_SERVER_TIME', serverTime)
        }
    },
    mounted() {
        this.getClientZoneTime()
        this.formatVod()
    },
    methods: {
        handleInvite() {
            this.sendEvLog({
                category: 'vote_' + this.share.voteName,
                action: 'share_click',
                label: '',
                value: 10
            })
        },
        // 根据零时区时间获取本地客户端时间
        getClientZoneTime() {
            const ua = window.navigator.userAgent
            if (ua.indexOf('iPhone') >= 0 || ua.indexOf('iPad') >= 0) {
                const tArr = []
                this.broadcast_time = tArr
            } else {
                const tmp = []
                this.broadcast_time.forEach(ele => {
                    const zeroZoneTime = new Date(ele.replace(/年|月/g, '-').replace(/日/g, ' ')).getTime()
                    const clientZoneTime = zeroZoneTime - new Date(zeroZoneTime).getTimezoneOffset() * 60 * 1000
                    tmp.push([this.formatDate(clientZoneTime), zeroZoneTime])
                })
                this.broadcast_time = tmp
            }
        },
        // 时间格式化
        formatDate(time) {
            const month = new Date(time).getMonth() + 1
            const date = new Date(time).getDate()
            const hour = new Date(time).getHours()
            const min = new Date(time).getMinutes()
            const myTime = month + '-' + date + ' ' + hour + ':' + min
            return myTime
        },
        getVod() {
            this.$axios({
                url: `/voting/v1/program?vote_id=${this.tab_msg.vote_id}`,
                method: 'get',
                data: {}
            }).then(res => {
                if (res.data.code === 0) {
                    this.programTimeContral = res.data.data
                }
            })
        },
        // 处理视频时间轴数据显示
        formatVod() {
            this.broadcast_time.forEach(ele => {
                if (ele[1] + 90 * 60 * 1000 < this.serverTime) {
                    // 回看
                    this.vodDetails.push({
                        className: 'review',
                        title: 'Highlights',
                        date: ele[0].split(' ')[0],
                        time: ele[0].split(' ')[1]
                    })
                } else if (ele[1] + 90 * 60 * 1000 > this.serverTime && ele[1] < this.serverTime) {
                    // 直播
                    this.vodDetails.push({
                        className: 'live',
                        title: 'Watch now',
                        date: ele[0].split(' ')[0],
                        time: ele[0].split(' ')[1]
                    })
                } else if (ele[1] > this.serverTime) {
                    // coming
                    this.vodDetails.push({
                        className: 'coming',
                        title: 'coming',
                        date: ele[0].split(' ')[0],
                        time: ele[0].split(' ')[1]
                    })
                }
            })
        }
    }
}
</script>

    
