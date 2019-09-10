<template>
    <div class="wrapper">
        <div class="container">
            <img src="~assets/img/vote/voiceToFame/bg-img.jpg" alt="bg-img" />
            <div class="vote-box">
                <div class="tab">
                    <div class="rules" @click="showRules">
                        <p>RULES</p>
                        <img src="~assets/img/vote/voiceToFame/ic-rule.png" alt="ic-rule" />
                    </div>
                    <div class="share" @click="toShare('upshare')">
                        <p>SHARE</p>
                        <img src="~assets/img/vote/voiceToFame/ic-share.png" alt="ic-share" />
                    </div>
                </div>
                <div v-show="coupleList.length>0">
                    <div class="flag-box">
                        <div class="vote-flag">
                            <img src="~assets/img/vote/voiceToFame/con-left.png" alt="con-left" class="con-left" />
                            <p>VOTE</p>
                            <img src="~assets/img/vote/voiceToFame/con-right.png" alt="con-right" class="con-right" />
                        </div>
                    </div>
                    <div class="vote-remaining">
                        <div>VOTES REMAINING:{{voteLeft}}</div>
                    </div>
                    <ul class="clearfix">
                        <li
                            v-for="(item,key) in coupleList"
                            :key="key"
                            :class="{'only-two':advisorList.length>0&&advisorList.length<3}"
                            data-id="item.id"
                        >
                            <div class="item-box" @click="toPlayer(item)">
                                <img v-show="item.link_vod_code" src="~assets/img/vote/voiceToFame/flag-vote.png" class="flag" />
                                <p>{{key+1}}</p>
                                <img :src="cdnPic(item.icon)" class="icon" />
                                <span class="name">{{item.name}}</span>
                                <span class="poll">poll: {{item.ballot_num}}</span>
                            </div>
                            <div class="vote-btn">
                                <div class="btn" @touchstart="handleViceVote(item,$event)">VOTE</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-if="appType==1" class="share-box" @click="toShare('midshare')">
                <img src="~assets/img/vote/voiceToFame/bg-left.png" alt class="bg-left" />
                <img src="~assets/img/vote/voiceToFame/img-sharefor.png" alt="img-sharefor" class="sharefor" />
                <img src="~assets/img/vote/voiceToFame/bg-right.png" alt class="bg-right" />
            </div>
            <div class="lottery-box">
                <div class="flag-box">
                    <div class="vote-flag">
                        <img src="~assets/img/vote/voiceToFame/con-left.png" alt="con-left" class="con-left" />
                        <p>LOTTERY</p>
                        <img src="~assets/img/vote/voiceToFame/con-right.png" alt="con-right" class="con-right" />
                    </div>
                </div>
                <div v-if="appType==1&&!isLogin" class="sign-in-box">
                    <div class="text">
                        <img src="~assets/img/vote/voiceToFame/line-left.png" alt class="line-left" />
                        <div class="sign-in-text">
                            <div class="btn" @click="toSignIn">SIGN IN</div>
                            <div class="word">to get started</div>
                        </div>
                        <img src="~assets/img/vote/voiceToFame/line-right.png" alt class="line-right" />
                    </div>
                </div>
                <div v-else class="title">
                    <div class="text">
                        <img src="~assets/img/vote/voiceToFame/line-left.png" alt class="line-left" />
                        <div>Every time you vote</div>
                        <div>you'll get a chance to win a prize</div>
                        <img src="~assets/img/vote/voiceToFame/line-right.png" alt class="line-right" />
                    </div>
                </div>
                <div class="lottery">
                    <div class="count">left lottery: {{appType>0&&isLogin?lotteryLeft:0}}</div>
                    <div class="lottery-type">
                        <ul>
                            <li v-for="(item,key) in lotteryType" :key="key" class="lottry-type">
                                <div :class="index==key?'active':''">
                                    <div class="prize">
                                        <p>{{item.name}}</p>
                                    </div>
                                    <div class="mask"></div>
                                </div>
                            </li>
                        </ul>
                        <div class="getLuck" @click="startLottery">
                            <p>START</p>
                        </div>
                    </div>
                    <div class="msg">
                        <img src alt />
                        <ul ref="msgul" :class="{anim:animate==true}">
                            <li v-for="item in items" :key="item.key">: {{item.name}}</li>
                        </ul>
                    </div>
                </div>
                <div class="tip">Find the prize in Me -> My Coupon</div>
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
// import mVoteSwiper from '~/components/vote/vote_swiper'
import mShare from '~/components/web/share.vue'
import { callApp, callMarket, playVodinApp, toNativePage, shareInvite } from '~/functions/app'
export default {
    layout: 'base',
    components: {
        mShare
        // mVoteSwiper
    },
    data() {
        return {
            // 页面
            show_rules: false,
            // appType: this.$store.state.appType || 0,
            appType: 1,
            // isLogin: this.$store.state.user.roleName && this.$store.state.user.roleName.toUpperCase() !== 'ANONYMOUS',
            isLogin: true,
            // isLogin: false,
            title: 'Voice to Fame',
            imgUrl: '',

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
            loaded_l: false,

            // 消息轮播
            animate: false,
            items: [
                {
                    name: '消息1',
                    key: 1
                },
                {
                    name: '消息2',
                    key: 2
                },
                {
                    name: '消息3',
                    key: 3
                }
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
        $axios.setHeader('token', store.state.token)
        try {
            const { data } = await $axios.get(`/voting/v1/vote?vote_id=8`)
            return {
                vote_sign: (req && req.headers.vote_sign) || '', // 通过serverMiddleWare拿到的唯一标识
                voteTitle: data.data.name,
                serverTime: new Date()
            }
        } catch (e) {
            return {
                vote_sign: (req && req.headers.vote_sign) || '',
                voteTitle: 'Voice to Fame',
                serverTime: new Date()
            }
        }
    },
    mounted() {
        this.mSendEvLog('page_show', '', '')
        this.getVoteRemain()
        this.getAdvisorList()
        this.getLeftLottery()
        this.getLotteryType()
        this.getMsgList()
        setInterval(() => {
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
            console.log(action, label, value)
        },
        // app登录方法
        toSignIn() {
            this.mSendEvLog('signin_click', '', '')
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
            this.mSendEvLog('share_click', label, '')
            if (this.appType == 1) {
                shareInvite(
                    `${window.location.href}?pin=${this.$store.state.user.id}&utm_source=VOTE&utm_medium=VOICE&utm_campaign=${this.platform}`,
                    this.title,
                    'Download StarTimes ON app. Vote and win FREE VIP!',
                    this.imgUrl
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
                this.mSendEvLog('downloadpopup_show', label, '')
                this.$confirm(
                    'Download StarTimes ON app. Vote and win FREE VIP!',
                    () => {
                        this.mSendEvLog('downloadpopup_clickok', label, '')
                        callMarket.call(this)
                    },
                    () => {
                        this.mSendEvLog('downloadpopup_clicknot', label, '')
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
            this.mSendEvLog('votepic_click', advisor.name, '')
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
            this.mSendEvLog('votebtn_click', advisor.name, '')
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
                .get(`/voting/lottery/v1/draw/user-draw-nums?lottery_id=${this.lottery_id}&vote_id=${this.vote_id}`)
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
                .get(`/voting/lottery/v1/admin/reward/pool?lottery_id=${this.lottery_id}`)
                .then(res => {
                    if (res.data.code === 0) {
                        this.lotteryType = res.data.data
                        console.log(this.lotteryType)
                    } else {
                        this.lotteryType = [] // 服务器端计算数据错误时
                    }
                    this.loaded_l = true
                })
                .catch(() => {
                    this.lotteryLeft = []
                })
        },
        // 获取消息列表
        getMsgList() {
            this.$axios
                .get(`/voting/lottery/v1/admin/reward/users?lottery_id=${this.lottery_id}`)
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
                    this.$axios
                        .post(`/voting/lottery/v1/drawing?lottery_id=${this.lottery_id}&vote_id=${this.vote_id}`)
                        .then(res => {})
                        .catch(() => {})
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
    background-color: #2f0081;
    font-size: 0.9rem;
    letter-spacing: -0.03rem;
    .container {
        > img {
            width: 100%;
            height: auto;
        }
        .vote-box {
            width: 100%;
            height: auto;
            // margin-bottom: 1rem;
            position: relative;
            .vote-flag {
                width: 5rem;
            }
            .tab {
                width: 100%;
                position: absolute;
                color: #fff;
                top: -3.6rem;
                left: 0;
                height: 3rem;
                line-height: 3rem;
                .rules {
                    width: 6rem;
                    float: left;
                    background: url('~assets/img/vote/voiceToFame/btn-rules.png') no-repeat;
                    background-size: 6rem 3rem;
                    text-align: left;
                    padding-left: 0.5rem;
                    position: relative;
                    img {
                        width: 1rem;
                        height: auto;
                        position: absolute;
                        left: 3.8rem;
                        top: 0.9rem;
                    }
                }
                .share {
                    width: 6rem;
                    float: right;
                    background: url('~assets/img/vote/voiceToFame/btn-share.png') no-repeat;
                    background-size: 6rem 3rem;
                    text-align: right;
                    padding-right: 0.5rem;
                    position: relative;
                }
                img {
                    width: 1rem;
                    height: auto;
                    position: absolute;
                    right: 3.8rem;
                    top: 1.2rem;
                }
            }
            .vote-remaining {
                width: 100%;
                height: 2.5rem;
                line-height: 2.5rem;
                font-size: 0.8rem;
                div {
                    width: 10rem;
                    // margin: 0 auto;
                    height: 1.7rem;
                    line-height: 1.7rem;
                    text-align: center;
                    margin-right: 1rem;
                    border-radius: 0.7rem;
                    color: #b69af3;
                    background: #1c0251;
                    float: right;
                }
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
                    .item-box {
                        position: relative;
                        width: 100%;
                        background-color: #410eb1;
                        margin-bottom: 0.5rem;
                        overflow: hidden;
                        border-radius: 0.6rem;
                        &:after {
                            display: block;
                            visibility: hidden;
                            clear: both;
                            height: 0;
                            content: '';
                        }
                        .flag {
                            width: 1.2rem;
                            height: auto;
                            position: absolute;
                            top: 0;
                            left: 0.4rem;
                            z-index: 1;
                        }
                        p {
                            display: block;
                            width: 1rem;
                            height: 1.2rem;
                            position: absolute;
                            top: 0;
                            left: 0.5rem;
                            z-index: 1;
                            color: #fff;
                            font-size: 0.75rem;
                            font-weight: 200;
                            text-align: center;
                            line-height: 1.2rem;
                        }
                        .icon {
                            width: 100%;
                            padding: 0.2rem 0.2rem 0;
                            height: auto;
                            margin: 0 auto;
                            display: block;
                            border-radius: 0.6rem;
                            position: relative;
                        }
                        .name {
                            width: 100%;
                            height: 1.5rem;
                            padding: 0 0.2rem;
                            line-height: 1.5rem;
                            font-size: 0.8rem;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: #fff;
                            display: block;
                            text-align: center;
                        }
                        .poll {
                            width: 80%;
                            height: 1.2rem;
                            line-height: 1.2rem;
                            font-size: 0.75rem;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: #b69af3;
                            display: block;
                            text-align: center;
                            margin: 0 auto 0.3rem;
                            background-color: #381091;
                            border-radius: 0.4rem;
                        }
                    }
                    .vote-btn {
                        width: 100%;
                        margin: 1rem 0 0.3rem;
                        .btn {
                            width: 4.5rem;
                            height: 1.3rem;
                            line-height: 1.3rem;
                            color: #ffffff;
                            background: url('~assets/img/vote/voiceToFame/btn-vote.png') no-repeat;
                            background-size: 100%;
                            margin: 0 auto;
                            text-align: center;
                            font-size: 0.8rem;
                        }
                    }
                }
            }
        }
        .share-box {
            width: 100%;
            height: 4rem;
            margin-bottom: 2.5rem;
            position: relative;
            .bg-left {
                width: 3rem;
                position: absolute;
                left: 0;
                top: -2rem;
                z-index: 0;
            }
            .bg-right {
                width: 4rem;
                position: absolute;
                right: 0;
                top: 0;
                z-index: 0;
            }
            .sharefor {
                display: block;
                width: 84%;
                position: relative;
                margin: 0 auto;
                z-index: 1;
            }
        }
        .lottery-box {
            .vote-flag {
                width: 7rem;
            }
            .sign-in-box {
                .sign-in-text {
                    margin: 0 auto;
                    line-height: 2rem;
                    div {
                        display: inline-block;
                        &.btn {
                            color: #f739fb;
                        }
                    }
                }
                .text {
                    width: 10rem;
                }
            }
            .title {
                .text {
                    width: 14rem;
                    line-height: 1rem;
                }
            }
            .sign-in-box,
            .title {
                width: 100%;
                margin: 0 auto 0.5rem;
                height: 2rem;
                color: #b69af3;
                font-size: 0.75rem;
                .text {
                    // width: 14rem;
                    margin: 0 auto;
                    height: 2rem;
                    // line-height: 1rem;
                    text-align: center;
                    position: relative;
                    img {
                        width: 1rem;
                        position: absolute;
                        top: 0.5rem;
                    }
                    .line-left {
                        left: -1rem;
                    }
                    .line-right {
                        right: -1rem;
                    }
                }
            }
            .lottery {
                width: 90%;
                height: 15rem;
                background-color: #6427c2;
                margin: 0 auto;
                .count {
                    height: 1.5rem;
                    line-height: 1.5rem;
                    font-size: 0.9rem;
                    color: #666;
                    text-align: right;
                    margin-right: 7%;
                    margin-bottom: 1rem;
                }
                .lottery-type {
                    width: 80%;
                    margin: 0 auto 1rem;
                    ul {
                        width: 100%;
                        margin: 0 auto;
                        &:after {
                            display: block;
                            visibility: hidden;
                            clear: both;
                            height: 0;
                            content: '';
                        }
                        li {
                            width: 30%;
                            float: left;
                            margin-top: 0.4rem;
                            margin-right: 0.4rem;
                            &:last-chile {
                                margin-bottom: 0.4rem;
                            }
                            > div {
                                width: 100%;
                                height: 5rem;
                                line-height: 5rem;
                                // flex: 1;
                                // margin-right: 0.4rem;
                                background-color: #faf;
                                text-align: center;
                                position: relative;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
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
                            }
                        }
                    }
                    .getLuck {
                        // flex: 1/3;
                        width: 30%;
                        height: 2rem;
                        line-height: 2rem;
                        text-align: center;
                        margin: 1rem auto;
                        background-color: red;
                        p {
                            font-size: 1.2rem;
                            font-weight: 600;
                        }
                    }
                }
                .msg {
                    width: 100%;
                    height: 2rem;
                    line-height: 2rem;
                    overflow: hidden;
                    border: 1px solid black;
                    transition: all 0.5s;
                    position: relative;
                    margin-bottom: 1rem;
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
            .tip {
                width: 100%;
                height: 1rem;
                line-height: 1rem;
                text-align: center;
                font-size: 0.8rem;
                margin-bottom: 1rem;
            }
        }
        .vote-box,
        .lottery-box {
            .flag-box {
                width: 100%;
                height: 3rem;
                background: url('~assets/img/vote/voiceToFame/bg-title.png') no-repeat;
                background-size: 100% 3rem;
                .vote-flag {
                    margin: 0 auto;
                    color: #fff;
                    text-align: center;
                    font-weight: 600;
                    height: 2.7rem;
                    line-height: 2.7rem;
                    position: relative;
                    img {
                        width: 0.7rem;
                        height: 0.7rem;
                        position: absolute;
                        top: 1rem;
                        &.con-left {
                            left: 0;
                        }
                        &.con-right {
                            right: 0;
                        }
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
