<template>
    <div class="wrapper">
        <div class="container">
            <img src="~assets/img/vote/BSSRegister/bg-img.png" alt="bg-img" />
            <div class="tab-box">
                <div class="tab">
                    <div class="rules" @click="showRule">
                        <p>
                            SHERIA
                            <br />ZA KINA
                        </p>
                        <img src="~assets/img/vote/BSSRegister/ic-rule.png" alt="ic-rule" />
                    </div>
                    <div class="share" @click="toShare('upshare')">
                        <p>SHIRIKI</p>
                        <img src="~assets/img/vote/BSSRegister/ic-share.png" alt="ic-share" />
                    </div>
                </div>
            </div>
            <div class="vote-box">
                <div v-show="coupleList.length>0">
                    <div class="vote-remaining">
                        <div>VOTES REMAINING:{{appType==0?0:voteLeft}}</div>
                    </div>
                    <ul class="clearfix">
                        <li
                            v-for="(item,key) in coupleList.slice(0,9)"
                            :key="key"
                            :class="{'only-two':advisorList.length>0&&advisorList.length<3}"
                            data-id="item.id"
                        >
                            <div class="item-box">
                                <img v-show="item.link_vod_code" src="~assets/img/vote/voiceToFame/flag-vote.png" class="flag" />
                                <p>{{key+1}}</p>
                                <div>
                                    <img :src="cdnPic(item.icon)" class="icon" @click="toPlayer(item)" />
                                </div>
                                <span class="name">{{item.name.toUpperCase()}}</span>
                                <span class="poll">poll: {{item.ballot_num}}</span>
                            </div>
                            <div class="vote-btn">
                                <div class="btn" @click="handleViceVote(item)">VOTE</div>
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
                    <div class="coins">
                        <img class="left" src="~assets/img/vote/voiceToFame/coins1.png" alt />
                        <img class="right" src="~assets/img/vote/voiceToFame/coins2.png" alt />
                    </div>
                    <div class="count">CHANCES REMAINING:{{appType>0&&isLogin?lotteryLeft:0}}</div>
                    <div class="lottery-type">
                        <ul class="clearfix">
                            <li v-for="(item,key) in lotteryType" :key="key" class="lottry-type">
                                <div :class="index==key?'active':''">
                                    <div class="prize">
                                        <img :src="cdnPic(item.picture_url)" alt />
                                        <p>{{item.name.toUpperCase()}}</p>
                                    </div>
                                </div>
                            </li>
                            <!-- <li v-for="(item,key) in lotteryType.slice(7,8)" :key="key" class="lottry-type">
                                <div :class="index==key?'active':''">
                                    <div class="prize">
                                        <img :src="cdnPic(item.picture_url)" alt />
                                        <p>{{item.name.toUpperCase()}}</p>
                                    </div>
                                </div>
                            </li> -->
                            <div v-if="appType>0&&isLogin&&lotteryLeft>0" class="getLuck" @click="startLottery">
                                <p>START</p>
                            </div>
                            <div v-else class="getLuck-gray" @click="canNotLottery">
                                <p>START</p>
                            </div>
                            <!-- <li v-for="(item,key) in lotteryType.slice(3,4)" :key="key" class="lottry-type">
                                <div :class="index==key?'active':''">
                                    <div class="prize">
                                        <img :src="cdnPic(item.picture_url)" alt />
                                        <p>{{item.name.toUpperCase()}}</p>
                                    </div>
                                </div>
                            </li>
                            <li v-for="(item,key) in lotteryType.slice(4,7)" :key="key" class="lottry-type">
                                <div :class="index==key?'active':''">
                                    <div class="prize">
                                        <img :src="cdnPic(item.picture_url)" alt />
                                        <p>{{item.name.toUpperCase()}}</p>
                                    </div>
                                </div>
                            </li> -->
                        </ul>
                    </div>
                    <div class="msg">
                        <ul ref="msgul" :class="{anim:animate==true}">
                            <img src="~assets/img/vote/voiceToFame/sound.png" alt />
                            <li
                                v-for="item in items"
                                :key="item.key"
                            >{{item.nick_name?item.nick_name:(item.user_name?item.user_name:item.user_id)}} has won {{lotteryType[item.fk_reward-1].name}}!</li>
                        </ul>
                    </div>
                </div>
                <div class="tip">
                    <img src="~assets/img/vote/voiceToFame/bg-left2.png" class="left" alt />
                    <p>Find the prize in ME → My Coupons</p>
                    <img src="~assets/img/vote/voiceToFame/bg-right2.png" class="right" alt />
                </div>
            </div>
        </div>
        <div v-show="show_rules" class="alert-rules-box">
            <div class="rules-title">VOTING RULES</div>
            <div class="rules-close" @click="show_rules=false">✖️</div>
            <div class="rules-box">
                <div class="rules-text">
                    <div class="rules-item">1. From Sep. 23rd to Oct. 27th, you have 5 votes each day.</div>
                    <div class="rules-item">2. You can vote for any contestants you like!</div>
                    <div class="rules-item">3. Every time you vote, you‘ll get a chance to win a prize!</div>
                    <div
                        class="rules-item"
                    >4. Share the link with your friends and ask them to download StarTimes ON app to get more votes! You'll get 5 more votes for each new user. The more new users you bring, the more votes you will gain!</div>
                    <div class="rules-item">5. Votes can be accumulated and are valid until the end of the activity.</div>
                    <div class="rules-item">6. The contestant with the most votes will win a 55-inch TV!</div>
                </div>
            </div>
            <div class="share-btn" @click="toShare('voterules')">Share</div>
        </div>
        <div v-show="show_rules" class="shadow-box" @click="show_rules=false"></div>
        <mShare />
        <div :style="{display:style}" class="alert">
            <div class="alert-body">
                <div class="alert-default">
                    <p>
                        <span v-html="msg" />
                    </p>
                </div>
            </div>
            <div class="alert-footer">
                <div class="btn sure" @click="sure" v-html="yes"></div>
                <div class="btn close" @click="close" v-html="no"></div>
            </div>
        </div>
        <div v-show="tip" class="vote-toast">{{tip}}</div>
    </div>
</template>
<script>
import qs from 'qs'
import { Base64 } from 'js-base64'
import { cdnPicSrc, getCookie, setCookie } from '~/functions/utils'
import mShare from '~/components/web/share.vue'
import { invokeByIframe, downApk, playVodinApp, toNativePage, shareInvite } from '~/functions/app'
export default {
    layout: 'base',
    components: {
        mShare
    },
    data() {
        return {
            // 页面
            show_rules: false,
            // appType: this.$store.state.appType || 0,
            // isLogin: this.$store.state.user.roleName && this.$store.state.user.roleName.toUpperCase() !== 'ANONYMOUS',
            appType: 1,
            isLogin: true,
            title: 'Voice To Fame',
            imgUrl: 'http://cdn.startimestv.com/banner/bg-img.jpg',
            firstTime: true,
            msg: '',
            style: 'none',
            callback: '',
            yes: '',
            no: '',
            shareTitle: 'Voice To Fame',
            user_id: this.$store.state.user.id,

            // 投票
            voteLeft: 0,
            loaded: false,
            advisorList: [],
            vote_id: 16,
            startTime: '',
            endTime: '',
            currentTime: '',
            tip: '',
            tip_timer: null,

            // 抽奖
            index: -1, // 当前转动到哪个位置，起点位置
            count: 8, // 总共有多少个位置
            timer: 0, // 每次转动定时器
            speed: 200, // 初始转动速度
            times: 0, // 转动次数
            cycle: 30, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
            prize: -1, // 中奖位置
            click: true,

            lotteryLeft: 0,
            lottery_id: 2,
            lotteryType: [],
            loaded_l: false,

            // 消息轮播
            animate: false,
            items: [],
            star: ''
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
        // console.log(store.state.deviceId)
        $axios.setHeader('token', store.state.token)
        try {
            const { data } = await $axios.get(`/voting/v1/vote?vote_id=15`)
            // console.log(req.headers.vote_sign)
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
        this.getLotteryMsg()
        this.getAdvisorList()
        this.getLotteryType()
        this.getMsgList()
        setInterval(() => {
            this.getMsgList()
        }, 60000)
        setInterval(this.scroll, 2000)
        this.$route.query.pin && setCookie('vote_share_user', this.$route.query.pin) // 分享源用户记录
        !getCookie('vote_share_down') && setCookie('vote_share_down', this.vote_sign) // 是否点击过下载
    },

    methods: {
        showRule() {
            this.show_rules=true
            // 页面静止
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
        },
        closeRule() {
            this.show_rules=false
            // 页面静止
            document.body.style.overflow = 'auto'
            document.body.style.position = 'static'
        },
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
        // 调出分享弹层(app/web)
        toShare(label) {
            if (label == 'voterules') this.show_rules = false
            this.mSendEvLog('share_click', label, '')
            if (this.appType >= 1) {
                shareInvite(
                    `${window.location.href}?pin=${this.$store.state.user.id}&utm_source=VOTE&utm_medium=VOICE&utm_campaign=${this.platform}`,
                    this.shareTitle,
                    'Download StarTimes ON app. Vote and win FREE VIP!',
                    this.imgUrl
                )
            } else {
                this.$store.commit('SET_SHARE_STATE', true)
            }
        },
        // 唤醒转入活动页或下载App
        callOrDownApp(label) {
            // 唤醒App
            invokeByIframe.call(this, 'com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.href, () => {
                // 下载App
                this.mSendEvLog('downloadpopup_show', label, '')
                this.show(
                    `<p style="padding-top: 1rem;">Download StarTimes ON app. Vote and win FREE VIP!</p>`,
                    () => {
                        this.mSendEvLog('downloadpopup_clickok', label, '')
                        downApk.call(this)
                        const voteDownTag = getCookie('vote_share_down')
                        const user = getCookie('vote_share_user')
                        if (voteDownTag && voteDownTag != -1) {
                            this.$axios({
                                method: 'POST',
                                headers: {
                                    'content-type': 'application/x-www-form-urlencoded',
                                    token: this.$store.state.token,
                                    'X-Secret': voteDownTag
                                },
                                data: qs.stringify({
                                    vote_id: this.vote_id,
                                    target: user,
                                    action: 'SHARE_DOWNLOAD'
                                }),
                                url: '/voting/v1/ticket'
                            })
                        }
                    },
                    () => {
                        this.mSendEvLog('downloadpopup_clicknot', label, '')
                    },
                    `<p style="padding: 0 1rem">Download Now</p>`,
                    `<p style="padding: 0 1rem">Cancle</p>`
                )
            })
        },
        // 获取剩余票数
        getVoteRemain() {
            if (this.currentTime >= this.startTime && this.currentTime < this.endTime) {
                this.$axios({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify({
                        vote_id: this.vote_id
                    }),
                    url: '/voting/v1/ticket/sign-in'
                }).then(res => {
                    if (res.data.code == 0 || res.data.code == 1) {
                        this.voteLeft = res.data.data
                    } else {
                        this.voteLeft = 0 // 服务器端计算数据错误时
                    }
                })
            }
        },
        // 获取投票单元数据
        getAdvisorList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=${this.vote_id}`).then(res => {
                if (res.data.code === 0) {
                    this.advisorList = res.data.data
                    this.advisorList.sort(function(a, b) {
                        return b.ballot_num - a.ballot_num
                    })
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
            if (this.currentTime < this.startTime) {
                this.show(
                    `<p style="padding-top:0.5rem">Stay tuned! Voting will begin on September 23rd.</p>`,
                    () => {},
                    () => {},
                    `<p style="padding: 0 1rem">GOT IT</p>`,
                    ''
                )
                return
            } else if (this.currentTime > this.endTime) {
                this.show(
                    `<p style="padding-top: 1rem">Sorry, the voting has ended.</p>`,
                    () => {},
                    () => {},
                    `<p style="padding: 0 1rem">GOT IT</p>`,
                    ''
                )
                return
            }
            if (this.voteLeft <= 0) {
                this.show(
                    `<p style="font-size:0.9rem">Sorry, your have 0 vote remaining. Come here tomorrow or Share with your friends to earn more votes!</p>`,
                    () => {
                        this.toShare('votefail')
                    },
                    () => {},
                    `<p style="padding: 0 1rem">SHARE</p>`,
                    `<p style="padding: 0 1rem">CANCEL</p>`
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
                            advisor.ballot_num++
                            this.voteLeft--
                            this.lotteryLeft++
                            if (this.voteLeft > 0) {
                                if (this.firstTime) {
                                    this.show(
                                        `<p style="font-size:0.9rem">Congrats! You‘ve successfully voted! You‘ve got 1 chance to win VIP! Swipe down and try your luck!</p>`,
                                        () => {
                                            this.firstTime = false
                                        },
                                        () => {},
                                        `<p style="padding: 0 1rem">GOT IT</p>`,
                                        ''
                                    )
                                } else {
                                    this.tipShow("Successfully voted! And you've got 1 chance to win VIP!")
                                }
                            } else {
                                this.show(
                                    `<p style="font-size:0.9rem">Successfully voted! you have 0 vote remaining. Share with your friends to earn more votes!</p>`,
                                    () => {
                                        this.toShare('0leftvote')
                                    },
                                    () => {},
                                    `<p style="padding: 0 1rem">SHARE</p>`,
                                    `<p style="padding: 0 1rem">CANCEL</p>`
                                )
                            }
                        } else {
                            this.$alert(res.data.message)
                        }
                    })
                    .catch(err => {
                        this.show(err, () => {}, () => {}, `<p style="padding: 0 1rem">GOT IT</p>`, '')
                    })
            }
        },
        // 获取抽奖信息
        getLotteryMsg() {
            this.currentTime = Date.parse(this.serverTime)
            this.$axios
                .get(`/voting/lottery/v1/info?lottery_id=${this.lottery_id}`)
                .then(res => {
                    if (res.data.code === 200) {
                        this.startTime = new Date(res.data.data.start_time).getTime()
                        this.endTime = new Date(res.data.data.end_time).getTime()
                        // console.log(this.startTime)
                        // console.log(this.endTime)
                        this.getVoteRemain()
                        this.getLeftLottery()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 获取剩余抽奖机会
        getLeftLottery() {
            if (this.currentTime >= this.startTime && this.currentTime < this.endTime) {
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
            }
        },
        // 获取抽奖种类
        getLotteryType() {
            this.$axios
                .get(`/voting/lottery/v1/admin/reward/pool?lottery_id=${this.lottery_id}`)
                .then(res => {
                    if (res.data.code === 0) {
                        this.lotteryType = res.data.data
                    } else {
                        this.lotteryType = [] // 服务器端计算数据错误时
                    }
                    this.loaded_l = true
                })
                .catch(() => {
                    this.lotteryType = []
                })
        },
        // 获取消息列表
        getMsgList() {
            this.$axios
                .get(`/voting/lottery/v1/admin/reward/users?lottery_id=${this.lottery_id}`)
                .then(res => {
                    if (res.data.code === 0) {
                        this.items = res.data.data
                        this.items.forEach((item, index, arrs) => {
                            if (item.user_name) {
                                if (
                                    new RegExp(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/).test(item.user_name)
                                ) {
                                    // 邮箱用户
                                    const arr = item.user_name.split('@')
                                    if (arr[0].length > 3) {
                                        item.user_name =
                                            arr[0].substr(0, 2) +
                                            arr[0].slice(2, -1).replace(/[^\s]/g, '*') +
                                            arr[0].substring(arr[0].length - 1) +
                                            '@' +
                                            arr[1]
                                    }
                                    if (arr[0].length == 3) {
                                        item.user_name = arr[0].replace(/(\w{1})\w{1}(\w{1})/, '$1*$2') + '@' + arr[1]
                                    }
                                    if (arr[0].length == 2) {
                                        item.user_name = arr[0].replace(/\w{1}(\w{1})/, '*$1') + '@' + arr[1]
                                    }
                                    if (arr[0].length == 1) {
                                        item.user_name = arr[0].replace(/\w{1}/, '*') + '@' + arr[1]
                                    }
                                } else if (new RegExp(/^\d{1,}$/).test(item.user_name)) {
                                    // 手机用户
                                    item.user_name = item.user_name.toString().replace(/(.*)\d{3}(\d{3})/, '$1***$2')
                                }
                            }
                            item.user_id = item.user_id.toString().replace(/(.*)\d{2}/, '$1**')
                        })
                    } else {
                        this.items = [] // 服务器端计算数据错误时
                    }
                })
                .catch(() => {
                    this.items = []
                })
        },
        // 抽奖按钮为灰提示
        canNotLottery() {
            if (this.appType == 0) {
                this.mSendEvLog('lottery_click', '', '-1')
                this.callOrDownApp('lottery')
                return
            }
            if (!this.isLogin) {
                this.mSendEvLog('lottery_click', '', '-1')
                // 移动端未登录
                this.show(
                    `<p style="padding-top:0.5rem">Please sign in to start the luck draw.</p>`,
                    () => {
                        this.toSignIn()
                    },
                    () => {},
                    `<p style="padding: 0 1rem">SIGN IN</p>`,
                    ''
                )
                return
            }
            if (this.currentTime < this.startTime) {
                this.mSendEvLog('lottery_click', '', '-1')
                this.show(
                    `<p style="padding-top:0.5rem">Stay tuned! Lottery will begin on September 23rd.</p>`,
                    () => {},
                    () => {},
                    `<p style="padding: 0 1rem">GOT IT</p>`,
                    ''
                )
                return
            }
            if (this.currentTime >= this.endTime) {
                this.mSendEvLog('lottery_click', '', '-1')
                this.show(
                    `<p style="padding-top:0.5rem">Sorry, the lottery has ended.</p>`,
                    () => {},
                    () => {},
                    `<p style="padding: 0 1rem">GOT IT</p>`,
                    ''
                )
                return
            }
            this.mSendEvLog('lottery_click', '', '-1')
            this.show(
                `<p>Vote and win more chances! Every time you vote, you‘ll get a chance to win a prize.</p>`,
                () => {},
                () => {},
                `<p style="padding: 0 1rem">GOT IT</p>`,
                ''
            )
        },
        // 开始抽奖
        startLottery() {
            if (!this.click) {
                return
            }
            this.lotteryLeft--
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
                console.log('你已经中奖了，位置' + (this.index + 1))
                if (this.index < 5) {
                    setTimeout(() => {
                        this.show(
                            `<p>Congrats! You've got ` +
                                this.lotteryType[this.index].name +
                                `!</p> <p style="font-size:0.75rem">Prize will be offered on the second business day in Me→My Coupon</p>`,
                            () => {
                                this.click = true
                            },
                            () => {},
                            `<p style="padding: 0 1rem">GOT IT</p>`,
                            ''
                        )
                    }, 1000)
                } else if (this.index === 5) {
                    this.getTicketAward(res => {
                        if (res.data.code == 200) {
                            setTimeout(() => {
                                this.show(
                                    `<p style="padding-top: 1rem;">Congrats! You've got ` + res.data.data + ` more votes!</p>`,
                                    () => {
                                        this.click = true
                                    },
                                    () => {},
                                    `<p style="padding: 0 1rem">GOT IT</p>`,
                                    ''
                                )
                                this.voteLeft += res.data.data
                            }, 1000)
                        } else {
                            window.alert(res.data.message)
                        }
                    })
                } else if (this.index === 6) {
                    setTimeout(() => {
                        this.lotteryLeft++
                        this.show(
                            `<p style="padding-top: 1rem;">Congrats! You've got 1 more chance!</p>`,
                            () => {
                                this.click = true
                                this.startLottery()
                            },
                            () => {},
                            `<p style="padding: 0 1rem">TRY AGAIN</p>`,
                            ''
                        )
                    }, 1000)
                } else if (this.index === 7) {
                    setTimeout(() => {
                        this.show(
                            `<p style="padding-top: 1rem;">Thanks for your participation.</p>`,
                            () => {
                                this.click = true
                            },
                            () => {},
                            `<p style="padding: 0 1rem">GOT IT</p>`,
                            ''
                        )
                    }, 1000)
                }
            } else {
                if (this.times < this.cycle) {
                    this.speed -= 10 // 加快转动速度
                } else if (this.times === this.cycle) {
                    // TODO后台取得一个中奖位置 随机数代替
                    this.$axios({
                        method: 'POST',
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            token: this.$store.state.token
                        },
                        data: qs.stringify({
                            lottery_id: 1,
                            vote_id: 15
                        }),
                        url: '/voting/lottery/v1/drawing'
                    })
                        .then(res => {
                            if (res.data.code == 0) {
                                this.prize = res.data.data - 1
                                console.log(`中奖位置${this.prize + 1}`)
                                if (res.data.data == 1) this.mSendEvLog('lottery_click', 'dvb', '1')
                                else if (res.data.data == 2) this.mSendEvLog('lottery_click', 'vip', '1')
                                else if (res.data.data == 3) this.mSendEvLog('lottery_click', 'coupon', '1')
                                else if (res.data.data == 4) this.mSendEvLog('lottery_click', 'morevotes', '1')
                                else if (res.data.data == 5) this.mSendEvLog('lottery_click', 'tryagain', '0')
                                else if (res.data.data == 6) this.mSendEvLog('lottery_click', 'sorry', '0')
                            } else {
                                setTimeout(() => {
                                    clearTimeout(this.timer)
                                    this.times = 0
                                    this.show(
                                        `<p style="padding-top: 1rem;">LOTTERY ERROR!</p>`,
                                        () => {
                                            // this.click = true
                                            // this.getLeftLottery()
                                            this.lotteryLeft = 0
                                        },
                                        () => {},
                                        `<p style="padding: 0 1rem">GOT IT</p>`,
                                        ''
                                    )
                                }, 3000)
                            }
                        })
                        .catch(err => {
                            clearTimeout(this.timer)
                            this.times = 0
                            this.$alert(err, () => {
                                this.lotteryLeft = 0
                            })
                        })
                } else if (this.times > this.cycle + 10 && ((this.prize === 0 && this.index === 5) || this.prize === this.index + 1)) {
                    this.speed += 110
                } else {
                    this.speed += 20
                }

                if (this.speed < 80) {
                    this.speed = 80
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
        },
        // 获得加票方法
        getTicketAward(callback) {
            this.$axios({
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                    // token: this.$store.state.token
                },
                data: qs.stringify({
                    vote_id: this.vote_id,
                    user_id: this.user_id
                }),
                url: 'hybrid/vote/getTicketAward'
            }).then(res => {
                callback && callback(res)
            })
        },
        // 弹窗方法
        show(msg, callback, cancel, yes, no) {
            this.yes = ''
            this.no = ''
            if (yes) this.yes = yes
            if (no) this.no = no
            this.msg = msg
            this.style = 'block'
            this.$store.commit('SHOW_SHADOW_LAYER')
            if (callback) {
                this.callback = callback
            } else {
                this.callback = ''
            }
            if (cancel) {
                this.cancel = cancel
            } else {
                this.cancel = ''
            }
        },
        close() {
            this.style = 'none'
            this.$store.commit('HIDE_SHADOW_LAYER')
            if (this.cancel) {
                this.cancel()
            }
        },
        sure() {
            this.style = 'none'
            this.$store.commit('HIDE_SHADOW_LAYER')
            if (this.callback) this.callback()
        },
        tipShow(text, duration = 2000) {
            clearInterval(this.tip_timer)
            const _this = this
            this.tip = text
            this.tip_timer = setTimeout(() => {
                _this.tip = ''
            }, duration)
        }
    },
    head() {
        return {
            title: this.title,
            meta: [
                { name: 'description', property: 'description', content: 'Download StarTimes ON app. Vote and win FREE VIP!' },
                { name: 'og:description', property: 'og:description', content: 'Download StarTimes ON app. Vote and win FREE VIP!' },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: this.imgUrl
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: this.shareTitle },
                {
                    name: 'al:android:url',
                    property: 'al:android:url',
                    content:
                        'starvideo://platformapi/webtoapp?channel=facebook&target=' +
                        Base64.encode(
                            `com.star.mobile.video.activity.BrowserActivity?loadUrl=http://m.startimestv.com/hybrid/vote/voiceToFame`.replace(
                                /&/g,
                                '**'
                            )
                        )
                },
                { name: 'al:android:app_name', property: 'al:android:app_name', content: 'StarTimes' },
                { name: 'al:android:package', property: 'al:android:package', content: 'com.star.mobile.video' },
                { name: 'al:web:url', property: 'al:web:url', content: 'http://m.startimestv.com' }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/vote/normal.less';
.wrapper {
    background-image: url('~assets/img/vote/BSSRegister/bg-img-re.jpg');
    background-size: contain;
    background-repeat: repeat-y;
    font-size: 0.9rem;
    letter-spacing: -0.03rem;
    position: static;
    .container {
        > img {
            display: block;
            margin: 0 auto;
            padding-top: 0.5rem;
            width: 95%;
            height: auto;
        }
        .tab-box {
            width: 100%;
            height: 2.2rem;
            position: relative;
            .tab {
                width: 100%;
                position: absolute;
                color: #fff;
                top: -1rem;
                left: 0;
                height: 4rem;
                // line-height: 3.8rem;
                .rules {
                    width: 7rem;
                    float: left;
                    background: url('~assets/img/vote/BSSRegister/btn-left.png') no-repeat;
                    background-size: 7rem 4rem;
                    text-align: left;
                    padding-left: 0.5rem;
                    position: relative;
                    line-height: 4rem;
                    p {
                        display: block;
                        height: 4rem;
                        padding: 1rem 0 1.2rem;
                        line-height: 0.9rem;
                    }
                    img {
                        width: 1rem;
                        height: auto;
                        position: absolute;
                        left: 4.1rem;
                        top: 1.2rem;
                    }
                }
                .share {
                    width: 7rem;
                    float: right;
                    background: url('~assets/img/vote/BSSRegister/btn-right.png') no-repeat;
                    background-size: 7rem 4rem;
                    text-align: right;
                    padding-right: 0.5rem;
                    position: relative;
                    line-height: 3.8rem;
                }
                img {
                    width: 1rem;
                    height: auto;
                    position: absolute;
                    right: 4.1rem;
                    top: 1.5rem;
                }
            }
        }
        .vote-box {
            width: 90%;
            height: auto;
            // margin-bottom: 1rem;
            background-color: lightgreen;
            margin: 0 auto;
            position: relative;
            .vote-flag {
                width: 5rem;
            }
            // .tab {
            //     width: 100%;
            //     position: absolute;
            //     color: #fff;
            //     top: -3.6rem;
            //     left: 0;
            //     height: 3rem;
            //     line-height: 3rem;
            //     .rules {
            //         width: 6rem;
            //         float: left;
            //         background: url('~assets/img/vote/voiceToFame/btn-rules.png') no-repeat;
            //         background-size: 6rem 3rem;
            //         text-align: left;
            //         padding-left: 0.5rem;
            //         position: relative;
            //         img {
            //             width: 1rem;
            //             height: auto;
            //             position: absolute;
            //             left: 3.8rem;
            //             top: 0.9rem;
            //         }
            //     }
            //     .share {
            //         width: 6rem;
            //         float: right;
            //         background: url('~assets/img/vote/voiceToFame/btn-share.png') no-repeat;
            //         background-size: 6rem 3rem;
            //         text-align: right;
            //         padding-right: 0.5rem;
            //         position: relative;
            //     }
            //     img {
            //         width: 1rem;
            //         height: auto;
            //         position: absolute;
            //         right: 3.8rem;
            //         top: 1.2rem;
            //     }
            // }
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
                    margin: 0 1.5% 1.3rem;
                    &.only-two {
                        margin: 0 10% 0.5rem;
                    }
                    .item-box {
                        position: relative;
                        width: 100%;
                        background-color: #410eb1;
                        // margin-bottom: rem;
                        overflow: hidden;
                        border-radius: 0.6rem;
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
                            // font-weight: 200;
                            text-align: center;
                            line-height: 1.2rem;
                        }
                        div {
                            position: relative;
                            width: 100%;
                            .icon {
                                width: 100%;
                                // padding: 0.2rem 0.2rem 0;
                                padding: 0.2rem;
                                height: 100%;
                                border-radius: 0.5rem;
                                // border-radius: 50%;
                                position: absolute;
                                top: 0;
                            }
                            &:before {
                                content: '';
                                display: inline-block;
                                padding-bottom: 100%;
                                width: 0.1px;
                                vertical-align: middle;
                            }
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
                        height: 1.3rem;
                        margin: 1.5rem 0 0;
                        .btn {
                            width: 4.5rem;
                            height: 1.3rem;
                            line-height: 1.3rem;
                            color: #ffffff;
                            background: url('~assets/img/vote/voiceToFame/btn-vote.png') no-repeat;
                            background-size: 4.5rem 1.3rem;
                            margin: 0 auto;
                            text-align: center;
                            font-size: 0.8rem;
                            &:active {
                                width: 4.3rem;
                                height: 1.1rem;
                                line-height: 1.1rem;
                                font-size: 0.75rem;
                                background-size: 4.3rem 1.1rem;
                                margin-top: 0.1rem;
                            }
                        }
                    }
                }
            }
        }
        .share-box {
            width: 100%;
            height: 4rem;
            margin-bottom: 1.2rem;
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
                    margin: 0 auto;
                    height: 2rem;
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
                height: 21rem;
                background-color: #6427c2;
                margin: 0 auto;
                border-radius: 0.5rem;
                padding: 1rem 5%;
                position: relative;
                z-index: 2;
                .coins {
                    img {
                        position: absolute;
                        width: 2rem;
                        height: auto;
                        &.left {
                            bottom: 4rem;
                            left: -5%;
                        }
                        &.right {
                            top: 4rem;
                            right: -5%;
                        }
                    }
                }
                .count {
                    width: 11rem;
                    height: 1.5rem;
                    line-height: 1.5rem;
                    border-radius: 1rem;
                    color: #fff;
                    background-color: #350e73;
                    text-align: center;
                    margin: 0 auto 0.5rem;
                    font-size: 0.75rem;
                }
                .lottery-type {
                    width: 100%;
                    margin: 0 auto 0.5rem;
                    ul {
                        width: 100%;
                        margin: 0 auto;
                        background-color: #350e73;
                        border-radius: 0.5rem;
                        padding: 0.2rem 0;
                        position: relative;
                        height: 15.8rem;
                        li {
                            width: 30%;
                            display: block;
                            position: absolute;
                            overflow: hidden;
                            border-radius: 0.2rem;
                            &:nth-child(1) {
                                border-top-left-radius: 1rem;
                                left: 2.5%;
                                top: 0.2rem;
                            }
                            &:nth-child(2) {
                                left: 35%;
                                top: 0.2rem;
                            }
                            &:nth-child(3) {
                                border-top-right-radius: 1rem;
                                left: 67.5%;
                                top: 0.2rem;
                            }
                            &:nth-child(4) {
                                left: 67.5%;
                                top: 5.4rem;
                            }
                            &:nth-child(5) {
                                border-bottom-right-radius: 1rem;
                                left: 67.5%;
                                top: 10.6rem;
                            }
                            &:nth-child(6) {
                                left: 35%;
                                top: 10.6rem;
                            }
                            &:nth-child(7) {
                                border-bottom-left-radius: 1rem;
                                left: 2.5%;
                                top: 10.6rem;
                            }
                            &:nth-child(8) {
                                left: 2.5%;
                                top: 5.4rem;
                            }
                            > div {
                                width: 100%;
                                height: 5rem;
                                background-color: #6427c2;
                                border: 2px solid transparent;
                                .prize {
                                    img {
                                        display: block;
                                        width: auto;
                                        height: 3rem;
                                        margin: 0 auto;
                                        padding: 0.5rem 0;
                                    }
                                    p {
                                        display: block;
                                        width: 100%;
                                        text-align: center;
                                        font-size: 0.75rem;
                                        color: #fff;
                                    }
                                }
                                &.active {
                                    background-color: #7839dd;
                                    border: 2px solid #fb0bd1;
                                }
                            }
                        }
                        .getLuck,
                        .getLuck-gray {
                            width: 30.5%;
                            line-height: 5rem;
                            height: 5rem;
                            background-color: #6427c2;
                            border-radius: 0.2rem;
                            border: 2px solid transparent;
                            color: #fff;
                            text-align: center;
                            position: absolute;
                            top: 5.4rem;
                            left: 35%;
                            font-size: 1.2rem;
                        }
                        .getLuck {
                            // background: url('~assets/img/vote/voiceToFame/btn-start.png') no-repeat;
                            background-color: red;
                            // background-size: 8rem 2.2rem;
                            &:active {
                                background-color: yellow;
                                // width: 7.5rem;
                                // height: 2rem;
                                // line-height: 2rem;
                                // margin: 0.6rem auto;
                                // font-size: 1rem;
                                // background-size: 7.5rem 2rem;
                            }
                        }
                        .getLuck-gray {
                            // background: url('~assets/img/vote/voiceToFame/btn-start-gray.png') no-repeat;
                            background-color: green;
                            // background-size: 8rem 2.2rem;
                        }
                    }
                    // .getLuck,
                    // .getLuck-gray {
                    //     width: 8rem;
                    //     height: 2.2rem;
                    //     line-height: 2.2rem;
                    //     color: #fff;
                    //     text-align: center;
                    //     // margin: 0 auto;
                    //     font-size: 1.2rem;
                    // }
                    // .getLuck {
                    //     background: url('~assets/img/vote/voiceToFame/btn-start.png') no-repeat;
                    //     background-size: 8rem 2.2rem;
                    //     &:active {
                    //         width: 7.5rem;
                    //         height: 2rem;
                    //         line-height: 2rem;
                    //         margin: 0.6rem auto;
                    //         font-size: 1rem;
                    //         background-size: 7.5rem 2rem;
                    //     }
                    // }
                    // .getLuck-gray {
                    //     background: url('~assets/img/vote/voiceToFame/btn-start-gray.png') no-repeat;
                    //     background-size: 8rem 2.2rem;
                    // }
                }
                .msg {
                    width: 100%;
                    height: 2rem;
                    line-height: 2rem;
                    overflow: hidden;
                    transition: all 0.5s;
                    position: relative;
                    margin-bottom: 1rem;
                    background-color: #350e72;
                    border-radius: 1rem;
                    .anim {
                        transition: all 0.5s;
                    }
                    img {
                        position: absolute;
                        display: block;
                        width: 1.23rem;
                        height: 1rem;
                        left: 0.8rem;
                        top: 0.5rem;
                    }
                    ul {
                        width: 100%;
                        li {
                            width: 100%;
                            padding-left: 2.5rem;
                            line-height: 2rem;
                            height: 2rem;
                            color: #927db3;
                            // font-weight: 200;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }
            .tip {
                position: relative;
                img {
                    display: block;
                    width: 4rem;
                    height: auto;
                    position: absolute;
                    bottom: 0.4rem;
                    &.left {
                        left: 0;
                    }
                    &.right {
                        right: 0;
                    }
                }
                p {
                    width: 100%;
                    height: 3rem;
                    line-height: 3rem;
                    text-align: center;
                    color: #7a58b0;
                    padding-bottom: 1rem;
                }
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
        width: 17rem;
        height: 25rem;
        background-color: #8150fc;
        position: fixed;
        overflow: hidden;
        left: 50%;
        top: 50%;
        margin: auto;
        margin-left: -8.5rem;
        margin-top: -12.5rem;
        z-index: 999;
        padding: 1rem 1.5rem 0;
        border-radius: 1rem;
        color: #fff;
        // font-weight: 200;
        .rules-title {
            width: 100%;
            height: 1rem;
            line-height: 1rem;
            text-align: center;
            margin-bottom: 1rem;
            font-size: 1.2rem;
            font-weight: 400;
        }
        .rules-close {
            position: absolute;
            right: 1rem;
            top: 1rem;
        }
        .rules-box {
            overflow-x: hidden;
            overflow-y: scroll;
            margin-bottom: 0.5rem;
            .rules-text {
                width: 100%;
                height: 18.5rem;
                .rules-item {
                    text-align: left;
                    line-height: 1.1rem;
                }
            }
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .share-btn {
            width: 7rem;
            margin: 0 auto;
            height: 2rem;
            line-height: 2rem;
            text-align: center;
            color: #965500;
            background-color: #f0c846;
            border-radius: 1rem;
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
    .alert {
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: #8150fc;
        border-radius: 2px;
        overflow: hidden;
        zoom: 1;
        z-index: 1001;
        width: 17rem;
        height: 10rem;
        margin-top: -5rem;
        margin-left: -8.5rem;
        padding: 1.5rem 1.2rem 1rem;
        color: #fff;
        font-size: 1rem;
        text-align: center;
        .alert-default {
            line-height: 1.3rem;
            padding-bottom: 0.5rem;
            height: 5.5rem;
        }
        .alert-footer .btn {
            width: auto;
            height: 2rem;
            line-height: 2rem;
            text-align: center;
            border-radius: 1rem;
            font-size: 0.9rem;
            &.sure {
                float: right;
                color: #965500;
                background-color: #f0c846;
                margin-right: 0.5rem;
            }
            &.close {
                float: left;
                color: #d7d4fe;
                background-color: #a099fd;
                margin-left: 0.5rem;
            }
        }
    }
    .vote-toast {
        position: fixed;
        left: 50%;
        top: 50%;
        margin-left: -7.5rem;
        margin-top: -1.7rem;
        font-size: 0.9rem;
        background: rgba(0, 0, 0, 0.65);
        padding: 0.6rem 1.5rem;
        border-radius: 3px;
        width: 15rem;
        height: 3.4rem;
        color: #fff;
        z-index: 9999;
    }
}
</style>
