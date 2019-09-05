<template>
    <div class="wrapper">
        <div class="container">
            <mVoteSwiper v-if="banners.length" :banners="banners" :name="voteTitle" />
            <div class="tab">
                <div class="rules" @click="showRules">Rules</div>
                <div class="share" @click="toShare('upshare')">Share</div>
            </div>
            <div v-show="coupleList.length>0" class="vote-box">
                <div class="vote-remaining">Vote remaining: {{voteLeft}}</div>
                <ul class="clearfix">
                    <li
                        v-for="(item,key) in coupleList"
                        :key="key"
                        :class="{'only-two':advisorList.length>0&&advisorList.length<3}"
                        data-id="item.id"
                    >
                        <div class="img-box" @click="toPlayer(item)">
                            <img :src="cdnPic(item.icon)" class="icon" />
                            <img v-show="item.link_vod_code" src="~assets/img/vote/ic_play_small_white.png" class="player" />
                        </div>
                        <span class="player-name">{{item.name.split('&')[0]}}</span>
                        <span class="player-name">{{item.name.split('&')[1]}}</span>
                        <div class="vote-btn">
                            <div class="votes">{{item.ballot_num}}</div>
                            <div :class="{disabled:voteLeft==0}" class="btn" @touchstart="handleViceVote(item,$event)">
                                <span v-if="item.user_ballot_num>0">{{$store.state.lang.mrright_voted}}</span>
                                <span v-else>{{$store.state.lang.mrright_vote}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-if="appType==1" class="share-box">
                <div class="text">Share for more votes!</div>
                <div class="share-btn" @click="toShare('midshare')">Share now</div>
            </div>
            <div v-if="appType==1&&!isLogin" class="sign-in-box">
                <div class="sign-in" @click="toSignIn">SIGN IN</div>
                <div class="text">to get started</div>
            </div>
            <div class="lottery-box">
                <div class="title">Every 1 votes you vote, exchange 1 lottery</div>
                <div class="count">left lottery: {{appType>0&&isLogin?lotteryLeft:0}}</div>
                <div class="lottery">
                    <ul>
                        <li>
                            <div :class="index==0?'active':''">
                                <div class="prize">
                                    <p>Coupons</p>
                                </div>
                                <div class="mask"></div>
                            </div>
                            <div :class="index==1?'active':''">
                                <div class="prize">
                                    <p>DVB包+月会员</p>
                                </div>
                                <div class="mask"></div>
                            </div>
                            <div :class="index==2?'active':''">
                                <div class="prize">
                                    <p>Try Again</p>
                                </div>
                                <div class="mask"></div>
                            </div>
                        </li>
                        <li>
                            <div :class="index==5?'active':''">
                                <div class="prize">
                                    <p>More Votes</p>
                                </div>
                                <div class="mask"></div>
                            </div>
                            <div :class="index==4?'active':''">
                                <div class="prize">
                                    <p>月会员</p>
                                </div>
                                <div class="mask"></div>
                            </div>
                            <div :class="index==3?'active':''">
                                <div class="prize">
                                    <p>Sorry</p>
                                </div>
                                <div class="mask"></div>
                            </div>
                        </li>
                        <li>
                            <div class="getLuck" @click="startLottery">
                                <p>START</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="tip">Find the prize in Me -> My Coupon</div>
                <div class="msg">
                    <img src alt />
                    <ul ref="msgul" :class="{anim:animate==true}">
                        <li v-for="item in items" :key="item.key">: {{item.name}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-show="show_rules" class="alert-rules-box">
            <div class="rules-title">Voting Rules</div>
            <div class="rules-close" @click="closeRules">✖️</div>
            <div class="rules-box">
                <div class="rules-text">
                    <div class="rules-item">From Sep. 23rd to Oct. 27th, you have 5 votes each day.</div>
                    <div class="rules-item">You can vote for any contestants you like!</div>
                    <div class="rules-item">Every time you vote, you‘ll get a chance to win a prize!</div>
                    <div
                        class="rules-item"
                    >Share the link with your friends and ask them to download StarTimes ON app to get more votes! You\'ll get 5 more votes for each new user. The more new users you bring, the more votes you will gain!</div>
                    <div class="rules-item">Votes can be accumulated and are valid until the end of the activity.</div>
                    <div class="rules-item">The contestant with the most votes will win a 55-inch TV!</div>
                </div>
            </div>
            <div class="share-btn" @click="rulesToShare">Share</div>
        </div>
        <div v-show="show_rules" class="shadow-box"></div>
        <mShare />
    </div>
</template>
<script>
import qs from 'qs'
// import { Base64 } from 'js-base64'
import { cdnPicSrc } from '~/functions/utils'
// import { animateCSS, cdnPicSrc } from '~/functions/utils'
import mVoteSwiper from '~/components/vote/vote_swiper'
import mShare from '~/components/web/share.vue'
import { callApp, callMarket, playVodinApp, toNativePage, shareInvite } from '~/functions/app'
export default {
    layout: 'base',
    components: {
        mShare,
        mVoteSwiper
    },
    data() {
        return {
            // 页面
            show_rules: false,
            // appType: this.$store.state.appType || 0,
            appType: 1,
            // isLogin: this.$store.state.user.roleName && this.$store.state.user.roleName.toUpperCase() !== 'ANONYMOUS',
            isLogin: true,
            title: 'Voice to Fame',

            // 投票
            voteLeft: 0,
            loaded: false,
            advisorList: [],
            vote_id: 1,

            // 抽奖
            // title: '积分转盘',
            index: -1, // 当前转动到哪个位置，起点位置
            count: 6, // 总共有多少个位置
            timer: 0, // 每次转动定时器
            speed: 200, // 初始转动速度
            times: 0, // 转动次数
            cycle: 30, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
            prize: -1, // 中奖位置
            click: true,

            lotteryLeft: 0,
            lottery_id: 1,
            lotteryType: [],

            // 消息轮播
            animate: false,
            items: [
                {
                    name: '消息1',
                    key: 1,
                },
                {
                    name: '消息2',
                    key: 2,
                },
                {
                    name: '消息3',
                    key: 3,
                },
            ]
        }
    },
    computed: {
        coupleList() {
            if (this.loaded) {
                return this.advisorList
            } else {
                return []
            }
        },
        platform() {
            if (this.appType == 1) {
                return 'Android'
            } else if (this.appType == 2) {
                return 'iOS'
            } else {
                return 'web'
            }
        }
    },
    // 唯一标识处理
    async asyncData({ app: { $axios }, store, req }) {
        let banners = []
        $axios.setHeader('token', store.state.token)
        try {
            const { data } = await $axios.get(`/voting/v1/vote?vote_id=8`)
            if (data.data.banner) {
                banners = await $axios.get(`/adm/v1/units/${data.data.banner}/materials`)
            }
            return {
                banners: banners.data.data || [],
                vote_sign: (req && req.headers.vote_sign) || '', // 通过serverMiddleWare拿到的唯一标识
                voteTitle: data.data.name,
                serverTime: new Date()
            }
        } catch (e) {
            return {
                banners: [],
                vote_sign: (req && req.headers.vote_sign) || '',
                voteTitle: 'Voice to Fame',
                serverTime: new Date()
            }
        }
    },

    mounted() {
        this.mSendEvLog('page_show','','')
        this.getVoteRemain()
        this.getAdvisorList()
        this.getLeftLottery()
        this.getLotteryType()
        this.getMsgList()
        setInterval(()=>{
            this.getMsgList()
        }, 60000)
        setInterval(this.scroll, 2000)
    },

    methods: {
        cdnPic(src) {
            return cdnPicSrc.call(this, src)
        },
        // 埋点方法
        mSendEvLog(action, label, value) {
            this.sendEvLog({
                category: 'vote_VoiceToFame_' + this.platform,
                action: action,
                label: label,
                value: value
            })
            console.log(action,label,value)
        },
        // app登录方法
        toSignIn() {
            this.mSendEvLog('signin_click','','')
            if (this.appType == 1) {
                // 原生登录，跳回活动页面
                toNativePage(
                    'com.star.mobile.video.account.LoginActivity?returnClass=com.star.mobile.video.activity.BrowserActivity?loadUrl=' +
                        encodeURIComponent(window.location.href)
                )
            } else {
                toNativePage('startimes://login')
            }
        },
        // 展示规则弹窗
        showRules() {
            this.show_rules = true
        },
        // 关闭规则弹窗
        closeRules() {
            this.show_rules = false
        },
        // 调出分享弹层(app/web)
        toShare(label) {
            this.mSendEvLog('share_click',label,'')
            if (this.appType == 1) {
                shareInvite(
                    `${window.location.href}?pin=${this.$store.state.user.id}&utm_source=VOTE&utm_medium=VOICE&utm_campaign=${this.platform}`,
                    this.title,
                    'Download StarTimes ON app. Vote and win FREE VIP!',
                    this.banners.length > 0 ? this.banners[0].materials : ''
                )
            } else {
                this.$store.commit('SET_SHARE_STATE', true)
            }
        },
        // 关闭规则弹窗，并调出分享弹层
        rulesToShare() {
            this.closeRules()
            this.toShare('voterules')
        },
        // 唤醒转入活动页或下载App
        callOrDownApp(label) {
            // 唤醒App
            callApp.call(this, 'com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.href, () => {
                // 下载App
                this.mSendEvLog('downloadpopup_show',label,'')
                this.$confirm(
                    'Download StarTimes ON app. Vote and win FREE VIP!',
                    () => {
                        this.mSendEvLog('downloadpopup_clickok',label,'')
                        callMarket.call(this)
                    },
                    () => {
                        this.mSendEvLog('downloadpopup_clicknot',label,'')
                    },
                    'Download Now',
                    'Cancle'
                )
            })
        },
        // 获取剩余票数
        getVoteRemain() {
            this.$axios.get(`/voting/v1/ballot/user-ballot-nums?vote_id=${this.vote_id}`).then(res => {
                if (res.data.code === 0) {
                    this.voteLeft = res.data.data
                } else {
                    this.voteLeft = 0 // 服务器端计算数据错误时
                }
            })
        },
        // 获取投票单元数据
        getAdvisorList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=${this.vote_id}`).then(res => {
                if (res.data.code === 0) {
                    // this.advisorList = res.data.data
                    this.advisorList = [
                        {
                            show: true,
                            id: 659,
                            created_time: '2019-08-05T02:28:11',
                            updated_time: '2019-08-14T06:02:32',
                            index: 3,
                            name: 'Chesoli brian & Lillian',
                            icon: 'http://cdn.startimestv.com/banner/708.jpg',
                            link_vod_code: '56948',
                            state: 3,
                            ballot_num: 555,
                            user_ballot_num: 2
                        },
                        {
                            show: true,
                            id: 660,
                            created_time: '2019-08-05T02:28:14',
                            updated_time: '2019-08-14T06:02:36',
                            index: 4,
                            name: 'Chesoli briane & Lillian',
                            icon: 'http://cdn.startimestv.com/banner/708.jpg',
                            link_vod_code: '56949',
                            state: 3,
                            ballot_num: 235,
                            user_ballot_num: 0
                        },
                        {
                            show: true,
                            id: 661,
                            created_time: '2019-08-05T02:28:31',
                            updated_time: '2019-08-14T06:02:52',
                            index: 5,
                            name: 'Chesoli brianf & Lillian',
                            icon: 'http://cdn.startimestv.com/banner/708.jpg',
                            link_vod_code: '56958',
                            state: 3,
                            ballot_num: 373,
                            user_ballot_num: 1
                        },
                        {
                            show: true,
                            id: 662,
                            created_time: '2019-08-05T02:29:11',
                            updated_time: '2019-08-14T06:03:32',
                            index: 6,
                            name: 'Chesoli briang & Lillian',
                            icon: 'http://cdn.startimestv.com/banner/708.jpg',
                            link_vod_code: '56948',
                            state: 3,
                            ballot_num: 276,
                            user_ballot_num: 0
                        }
                    ]
                } else {
                    this.advisorList = []
                }
                this.loaded = true
            })
        },
        // 播放视频方法
        toPlayer(advisor) {
            this.mSendEvLog('votepic_click',advisor.name,'')
            if (this.appType == 0) {
                this.callOrDownApp('pic')
                return
            }
            if (advisor.link_vod_code) {
                playVodinApp.call(this, this.appType, advisor.link_vod_code)
            }
        },
        // 投票方法
        handleViceVote(advisor) {
            this.mSendEvLog('votebtn_click',advisor.name,'')
            if (this.appType == 0) {
                this.callOrDownApp('vote')
                return
            }
            const startTime = Date.parse('2019-09-23')
            const endTime = Date.parse('2019-10-28')
            const currentTime = Date.parse(new Date(this.serverTime))
            if (currentTime < startTime) {
                this.$alert('Stay tuned! Voting will begin on September 23rd', () => {}, 'GOT IT')
                return
            } else if (currentTime > endTime) {
                this.$alert('Sorry, the voting has ended.', () => {}, 'GOT IT')
                return
            }
            if (this.voteLeft <= 0) {
                this.$confirm(
                    'Sorry, your have 0 vote remaining. Come here tomorrow or Share with your friends to earn more votes!',
                    () => {},
                    () => {
                        this.toShare('votefail')
                    },
                    'CANCEL',
                    'SHARE'
                )
            } else {
                this.$axios({
                    url: '/voting/v1/ballot',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify({
                        candidate_id: advisor.id,
                        vote_id: this.vote_id
                    })
                })
                    .then(res => {
                        if (res.data.code === 0) {
                            this.getVoteRemain()
                            this.getAdvisorList()
                            if (this.voteLeft > 0) {
                                this.$alert(
                                    'Congrats! You‘ve successfully voted! You‘ve got 1 chance to win VIP! Swipe down and try your luck!',
                                    () => {},
                                    'GOT IT'
                                )
                            } else {
                                this.$confirm(
                                    'Congrats! You‘ve successfully voted! Share with your friends to earn more votes! ',
                                    () => {},
                                    () => {
                                        this.toShare('0leftvote')
                                    },
                                    'CONCLE',
                                    'SHARE'
                                )
                            }
                        }
                    })
                    .catch(err => {
                        this.$alert(err, () => {}, 'GOT IT')
                    })
            }
        },
        // 获取剩余抽奖机会
        getLeftLottery() {
            this.$axios
                .get(`/lottery/v1/draw/user-draw-nums?lotteryId=${this.lottery_id}`)
                .then(res => {
                    if (res.data.code === 0) {
                        this.lotteryLeft = res.data.data
                    } else {
                        this.lotteryLeft = 0 // 服务器端计算数据错误时
                    }
                })
                .catch(() => {
                    this.lotteryLeft = 0
                })
        },
        // 获取抽奖种类
        getLotteryType() {
            this.$axios
                .get(`/lottery/v1/admin/reward/pool?lotteryId=${this.lottery_id}`)
                .then(res => {
                    if (res.data.code === 0) {
                        this.lotteryType = res.data.data
                    } else {
                        this.lotteryType = [] // 服务器端计算数据错误时
                    }
                })
                .catch(() => {
                    this.lotteryLeft = []
                })
        },
        // 获取消息列表
        getMsgList() {
            this.$axios
                .get(`/lottery/v1/admin/reward/users?lotteryId=${this.lottery_id}`)
                .then(res => {
                    if (res.data.code === 0) {
                        this.items = res.data.data
                    } else {
                        this.items = [] // 服务器端计算数据错误时
                    }
                })
                .catch(() => {
                    // this.items = []
                })
        },
        // 开始抽奖
        startLottery() {
            if (this.appType == 0) {
                this.callOrDownApp('lottery')
                return
            }
            if (!this.isLogin) {
                // 移动端未登录
                this.$alert(
                    'Please sign in to start the luck draw',
                    () => {
                        this.toSignIn()
                    },
                    'SIGN IN'
                )
                return
            }
            if (!this.click) {
                return
            }
            this.speed = 200
            this.click = false
            this.startRoll()
        },
        // 开始转动
        startRoll() {
            this.times += 1 // 转动次数
            this.oneRoll() // 转动过程调用的每一次转动方法，这里是第一次调用初始化

            // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
            if (this.times > this.cycle + 10 && this.prize === this.index) {
                clearTimeout(this.timer) // 清除转动定时器，停止转动
                // this.prize = -1
                this.times = 0
                console.log('你已经中奖了，位置' + this.index)
                if (this.index === 0) {
                    setTimeout(() => {
                        this.$alert(
                            'Coupons',
                            () => {
                                this.click = true
                            },
                            '收下了'
                        )
                    }, 1000)
                } else if (this.index === 1) {
                    setTimeout(() => {
                        this.$alert(
                            'DVB包+月会员~',
                            () => {
                                this.click = true
                            },
                            '收下了'
                        )
                    }, 1000)
                } else if (this.index === 2) {
                    setTimeout(() => {
                        this.$alert(
                            'Try Again~',
                            () => {
                                this.click = true
                                this.startLottery()
                            },
                            'Try Again'
                        )
                    }, 1000)
                } else if (this.index === 3) {
                    setTimeout(() => {
                        this.$alert(
                            'sorry~',
                            () => {
                                this.click = true
                            },
                            'Got It'
                        )
                    }, 1000)
                } else if (this.index === 4) {
                    setTimeout(() => {
                        this.$alert(
                            '月会员~',
                            () => {
                                this.click = true
                            },
                            '收下了'
                        )
                    }, 1000)
                } else if (this.index === 5) {
                    setTimeout(() => {
                        this.$alert(
                            'You Have Got ' + Math.ceil(Math.random() * 5) + ' Votes~',
                            () => {
                                this.click = true
                            },
                            '收下了'
                        )
                    }, 1000)
                }
            } else {
                if (this.times < this.cycle) {
                    this.speed -= 10 // 加快转动速度
                } else if (this.times === this.cycle) {
                    // TODO后台取得一个中奖位置 随机数代替
                    const index = Math.floor(Math.random() * 10) > 5 ? 5 : Math.floor(Math.random() * 5)
                    // const index = 2
                    this.prize = index
                    console.log(`中奖位置${this.prize}`)
                } else if (this.times > this.cycle + 10 && ((this.prize === 0 && this.index === 5) || this.prize === this.index + 1)) {
                    this.speed += 110
                } else {
                    this.speed += 20
                }

                if (this.speed < 40) {
                    this.speed = 40
                }
                this.timer = setTimeout(this.startRoll, this.speed)
            }
        },
        // 每一次转动
        oneRoll() {
            let index = this.index // 当前转动到哪个位置
            const count = this.count // 总共有多少个位置
            index += 1
            if (index > count - 1) {
                index = 0
            }
            this.index = index
        },
        // 消息轮播
        scroll() {
            const msg = this.$refs.msgul
            msg.style.marginTop = '-30px'
            this.animate = !this.animate
            setTimeout(() => {
                this.items.push(this.items[0])
                this.items.shift()
                msg.style.marginTop = '0'
                this.animate = !this.animate // 避免回滚
            }, 500)
        }
    },
    head() {
        return {
            title: this.title,
            meta: []
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/vote/normal.less';
.wrapper {
    background-color: chocolate;
    .container {
        .ad {
            width: 100%;
            height: 10rem;
            background-color: #fe9;
        }
        .tab {
            width: 100%;
            height: 2rem;
            line-height: 2rem;
            color: #87e;
            display: flex;
            text-align: center;
            position: relative;
            .rules {
                flex: 1;
            }
            .share {
                flex: 1;
            }
        }
        .vote-box {
            width: 100%;
            height: auto;
            margin-bottom: 1rem;
            .vote-remaining {
                width: 100%;
                height: 2rem;
                line-height: 2rem;
                text-align: right;
                padding-right: 2.5%;
                margin-bottom: 1rem;
            }
            ul {
                width: 100%;
                height: auto;
                padding: 0 2.5%;
                li {
                    list-style: none;
                    width: 30%;
                    float: left;
                    margin: 0 1.5% 0.5rem;
                    &.only-two {
                        margin: 0 10% 0.5rem;
                    }
                    .img-box {
                        position: relative;
                        width: 100%;
                        margin-bottom: 0.5rem;
                        overflow: hidden;
                        border-radius: 2px;
                        opacity: 0.9262;
                        border: 2px solid #ffffff;
                        box-shadow: 0px 0px 10px #f7ebe2, 0px 0px 10px #f7ebe2 inset;
                        &:before {
                            content: '';
                            display: inline-block;
                            padding-bottom: 100%;
                            width: 0.1px;
                            vertical-align: middle;
                        }
                        .icon {
                            width: 100%;
                            height: 100%;
                            display: block;
                            position: absolute;
                            top: 0;
                            left: 0;
                        }
                        .player {
                            width: 1.5rem;
                            height: 1.5rem;
                            position: absolute;
                            right: 3px;
                            bottom: 3px;
                        }
                    }
                    .player-name {
                        height: 1.2rem;
                        line-height: 1.2rem;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #666666;
                        display: block;
                        text-align: center;
                    }
                    .vote-btn {
                        width: 100%;
                        height: 2rem;
                        line-height: 1.6rem;
                        background: #fed56b;
                        border-radius: 15px;
                        font-size: 0.88rem;
                        text-align: center;
                        padding: 0.2rem 0.1rem;
                        margin-top: 0.5rem;
                        position: relative;
                        .votes {
                            position: absolute;
                            left: 0;
                            width: 40%;
                            color: #ff598c;
                            font-size: 0.75rem;
                        }
                        .btn {
                            position: absolute;
                            right: 2px;
                            width: 55%;
                            color: #ffffff;
                            font-weight: bold;
                            background: #ff598c;
                            border-radius: 15px;
                            &.disabled {
                                background: #b0b0b0;
                            }
                        }
                    }
                }
            }
        }
        .share-box {
            width: 90%;
            height: 2rem;
            line-height: 2rem;
            margin: 0 auto;
            margin-bottom: 1rem;
            display: flex;
            .text {
                flex: 2;
                text-align: left;
            }
            .share-btn {
                flex: 1;
                text-align: right;
            }
        }
        .sign-in-box {
            width: 90%;
            height: 2rem;
            line-height: 2rem;
            margin: 0 auto;
            margin-bottom: 1rem;
            text-align: center;
            .sign-in {
                color: #87e;
                display: inline-block;
            }
            .text {
                display: inline-block;
            }
        }
        .lottery-box {
            .title {
                width: 100%;
                margin: 0 auto 0.5rem;
                height: 2rem;
                line-height: 2rem;
                font-weight: 600;
                font-size: 1rem;
                text-align: center;
            }
            .count {
                height: 1.5rem;
                line-height: 1.5rem;
                font-size: 0.9rem;
                color: #666;
                text-align: right;
                margin-right: 7%;
                margin-bottom: 1rem;
            }
            .lottery {
                width: 80%;
                margin: 0 auto 1rem;
                ul {
                    width: 100%;
                    margin: 0 auto;
                    li {
                        width: 100%;
                        margin: 0 auto;
                        height: 5rem;
                        display: flex;
                        margin-top: 0.4rem;
                        > div {
                            flex: 1;
                            margin-right: 0.4rem;
                            width: 5.5rem;
                            height: 5rem;
                            line-height: 5rem;
                            text-align: center;
                            position: relative;
                            background-color: #faf;
                            .prize {
                                p {
                                    display: block;
                                    width: 100%;
                                    height: 100%;
                                    position: absolute;
                                    left: 0;
                                    right: 0;
                                    top: 0;
                                    bottom: 0;
                                    font-size: 0.8rem;
                                }
                            }
                            .mask {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                opacity: 0.3;
                                background-color: #000;
                                display: none;
                            }
                            &.active {
                                .mask {
                                    display: block;
                                }
                            }
                            &:first-child {
                                margin-left: 0.4rem;
                            }
                            &.getLuck {
                                flex: 1/3;
                                margin: auto;
                                p {
                                    font-size: 1.2rem;
                                    font-weight: 600;
                                }
                            }
                        }
                        &:last-chile {
                            margin-bottom: 0.4rem;
                        }
                    }
                }
            }
            .tip {
                width: 100%;
                height: 1rem;
                line-height: 1rem;
                text-align: center;
                font-size: 0.8rem;
                margin-bottom: 1rem;
            }
            .msg {
                width: 100%;
                height: 2rem;
                line-height: 2rem;
                overflow: hidden;
                // padding-left: 2rem;
                border: 1px solid black;
                transition: all 0.5s;
                position: relative;
                // margin-bottom: 1rem;
                .anim {
                    transition: all 0.5s;
                }
                img {
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                ul {
                    width: 100%;
                    li {
                        width: 100%;
                        padding-left: 4rem;
                        line-height: 2rem;
                        height: 2rem;
                    }
                }
            }
        }
    }
    .alert-rules-box {
        width: 18rem;
        height: 26rem;
        background-color: #fff;
        position: fixed;
        overflow: hidden;
        left: 50%;
        top: 50%;
        margin: auto;
        margin-left: -9rem;
        margin-top: -13rem;
        z-index: 999;
        padding: 1rem 1.5rem;
        .rules-title {
            width: 100%;
            height: 1rem;
            line-height: 1rem;
            text-align: center;
            color: #000;
            margin-bottom: 1rem;
        }
        .rules-close {
            // width: 1rem;
            // height: 1rem;
            position: absolute;
            right: 1rem;
            top: 1rem;
            color: #ff598c;
        }
        .rules-box {
            overflow-x: hidden;
            overflow-y: scroll;
            margin-bottom: 1rem;
            
            .rules-text {
                width: 100%;
                height: 20rem;
                .rules-item {
                    text-align: left;
                    font-size: 0.9rem;
                    color: royalblue;
                    line-height: 1.1rem;
                }
            }
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .share-btn {
            height: 1rem;
            line-height: 1rem;
            text-align: center;
            color: #ff598c;
        }
    }
    .shadow-box {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0.5;
        background-color: #000;
        z-index: 998;
    }
}
</style>
