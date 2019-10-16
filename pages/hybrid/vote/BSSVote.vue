<template>
    <div class="wrapper">
        <div class="container">
            <img src="~assets/img/vote/BSSRegister/banner-vote.png" alt="bg-img" class="bg-img" />
            <div class="tab-box">
                <div class="tab">
                    <div class="rules" @click="showRule">
                        <p>
                            SHERIA
                            <br />ZA KINA
                        </p>
                        <img src="~assets/img/vote/BSSRegister/ic-rule.png" alt="ic-rule" class />
                    </div>
                    <div class="share" @click="toShare('upshare')">
                        <p>SHIRIKI</p>
                        <img src="~assets/img/vote/BSSRegister/ic-share.png" alt="ic-share" />
                    </div>
                </div>
            </div>
            <img v-if="!isResult10Start&&!isResult5Start" src="~assets/img/vote/BSSRegister/bg-register.png" alt class="ic-green" />
            <img v-if="isResult10Start&&!isResult5Start" src="~assets/img/vote/BSSRegister/result10-slogen.png" alt class="ic-green" />
            <img v-if="isResult5Start" src="~assets/img/vote/BSSRegister/result5-slogen.png" alt class="ic-green" />
            <img v-if="isCommentStart" src="~assets/img/vote/BSSRegister/bg-ask.png" alt class="ic-green-a" @click="toComment('up')" />
            <img v-if="!isResult10Start&&!isResult5Start" class="text text-one" src="~assets/img/vote/BSSRegister/text1.png" alt />
            <img v-if="isResult10Start&&!isResult5Start" class="text text-one" src="~assets/img/vote/BSSRegister/10text6.png" alt />
            <img v-if="isResult5Start" class="text text-one" src="~assets/img/vote/BSSRegister/5text6.png" alt />
            <div class="vote-box">
                <div v-if="coupleList.length>0&&!isResult10Start&&!isResult5Start">
                    <div class="vote-remaining">
                        <div class="remain">KURA ZILIZOBAKI:{{appType==0?0:(voteLeft>0?voteLeft:0)}}</div>
                        <div class="ask" @click="toHowToGetVote">JINSI YA KUPIGA KURA ZAIDI?</div>
                    </div>
                    <ul class="clearfix">
                        <li v-for="(item,key) in coupleList" :key="key" data-id="item.id">
                            <div class="item-box">
                                <div>
                                    <img :src="cdnPic(item.icon)" class="icon" @click="toPlayer(item,'votepic_click')" />
                                    <p>{{item.ballot_num | formatVotes}}</p>
                                </div>
                                <span class="name">{{item.name.toUpperCase()}}</span>
                            </div>
                            <div class="vote-btn">
                                <div class="btn" @click="handleViceVote(item)">KURA</div>
                            </div>
                        </li>
                    </ul>
                    <div class="more" @click="toAll">ANGALIA WASHIRIKI WOTE</div>
                </div>
                <div v-if="coupleList10.length>0&&isResult10Start&&!isResult5Start">
                    <ul class="result clearfix">
                        <li v-for="(item,key) in coupleList10" :key="key" data-id="item.id">
                            <div class="item-box">
                                <div>
                                    <img :src="cdnPic(item.icon)" class="icon" @click="toPlayer(item,'votepic_click')" />
                                    <p>{{item.ballot_num | formatVotes}}</p>
                                </div>
                                <span class="name">{{item.name.toUpperCase()}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-if="coupleList5.length>0&&isResult5Start">
                    <ul class="result clearfix">
                        <li v-for="(item,key) in coupleList5" :key="key" data-id="item.id">
                            <div class="item-box">
                                <div>
                                    <img :src="cdnPic(item.cover)" class="icon" @click="toPlayer(item,'votepic_click')" />
                                </div>
                                <span class="name">{{item.description.toUpperCase()}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <img
                v-if="!isResult10Start&&!isResult5Start"
                src="~assets/img/vote/BSSRegister/ic-link-register.png"
                alt
                class="link"
                @click="toRegister"
            />
            <img v-if="!isResult10Start&&!isResult5Start" id="text2" class="text" src="~assets/img/vote/BSSRegister/text2.png" alt />
            <div v-if="!isResult10Start&&!isResult5Start" class="share-box" @click="toShare('midshare')">
                <div>
                    <img v-if="appType>0&&isLogin" src="~assets/img/vote/BSSRegister/bg-login-no.png" alt @click="stopBubble" />
                    <img v-else src="~assets/img/vote/BSSRegister/bg-login.png" alt @click="toSignIn" />
                    <img src="~assets/img/vote/BSSRegister/bg-share-btn.png" alt @click="toShare('invite')" />
                    <div class="num">
                        <p>FANIKIWA KUALIKA RAFIKI {{share_num}}</p>
                    </div>
                </div>
                <img src="~assets/img/vote/BSSRegister/img-share.png" alt="img-sharefor" />
            </div>
            <img
                v-if="appType>0&&!isLogin&&!isResult10Start&&!isResult5Start"
                class="text"
                src="~assets/img/vote/BSSRegister/text3-sign.png"
                alt
                @click="toSignIn"
            />
            <img v-if="!isResult10Start&&!isResult5Start&&!(appType>0&&!isLogin)" class="text" src="~assets/img/vote/BSSRegister/text3.png" alt />
            <div v-if="!isResult10Start&&!isResult5Start" class="lottery-box">
                <div class="lottery">
                    <div class="count">NAFASI ZILIZOBAKI:{{appType>0&&isLogin?(lotteryLeft>0?lotteryLeft:0):0}}</div>
                    <div class="lottery-type">
                        <ul class="clearfix">
                            <li v-for="(item,key) in lotteryList" :key="key" class="lottry-type" :class="index==key?'active':''">
                                <div>
                                    <div class="prize">
                                        <img :src="cdnPic(item.picture_url)" alt />
                                        <p>{{item.name}}</p>
                                    </div>
                                </div>
                            </li>
                            <div v-if="appType>0&&isLogin&&lotteryLeft>0" class="getLuck" @click="startLottery">Anza</div>
                            <div v-else class="getLuck-gray" @click="canNotLottery">Anza</div>
                        </ul>
                    </div>
                    <div class="msg">
                        <ul ref="msgul" :class="{anim:animate==true}">
                            <img src="~assets/img/vote/BSSRegister/sound.png" alt />
                            <li
                                v-for="item in msgList"
                                :key="item.key"
                            >{{item.nick_name?item.nick_name:(item.user_name?item.user_name:item.user_id)}} umeshinda {{(lotteryList[item.fk_reward-1-6]||{}).name}}!</li>
                        </ul>
                    </div>
                    <div class="tip">
                        <p>TAFUTA ZAWADI KWENYE ME -> KUPONI YANGU</p>
                    </div>
                </div>
            </div>
            <img v-if="isCommentStart" src="~assets/img/vote/BSSRegister/ic-link-comment.png" alt class="link" @click="toComment('mid')" />
            <img v-if="isCommentStart" class="text" src="~assets/img/vote/BSSRegister/text7.png" alt />
            <div v-if="isCommentStart" class="past-programme">
                <img src="~assets/img/vote/BSSRegister/bg-orange.png" alt />
                <ul class="clearfix">
                    <li v-for="(item,i) in clipsListNew" :key="i">
                        <div @click="toPlayer(item,'video_click')">
                            <img class="url" :src="cdnPic(item.cover)" />
                        </div>
                        <p class="title">{{(item.description)}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div v-show="show_rules" class="rules-box">
            <img src="~assets/img/vote/BSSRegister/bg-rule.png" alt />
            <div class="rule-text">
                1. Kutoka tarehe 8th Oct hadi 30th Oct, una kura 5 kila siku baada ya kuingia. Kura zitakuwa zinajumlishwa na kuwa halali hadi mwisho wa shughuli.
                <br />2. Unaweza kumpigia kura mshiriki yeyote unayempenda!
                <br />3. Washirikishe link rafiki zako na waombe wapakue app ya StarTimes ON ili kupata kura zaidi! Utapata kura 5 zaidi kwa kila mtumiaji mpya. Unavyozidi kuleta watumiaji wapya, ndivyo unavyopata kura zaidi!
                <br />4. Kila wakati unapopiga kura, utapata nafasi moja ya kushinda, na utapata fursa ya kushinda Abreader subwoofer, yenye thamani ya Shilingi 85,000 na Aborder bluetooth speaker, yenye thamani ya Shilingi 35,000, pamoja na Max VIP ya Mwezi ya StarTimes ON na Kuponi.
                <br />5. Zawadi zitakuwa zinatolewa siku ya pili ya kazi katika Me-> Kuponi zangu.
                <br />6. Wagombea 10 bora wenye kura nyingi zaidi wataweza kuingia kwenye usaili wa mwisho na kupata nafasi ya kushiriki 2019BSS.
            </div>
            <div class="share-btn" @click="toShare('voterules')">SHIRIKI</div>
            <img src="~assets/img/vote/BSSRegister/ic-close.png" alt @click="closeRule" />
        </div>
        <div v-show="show_rules" class="shadow-box" @click="closeRule"></div>
        <mShare />
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
    filters: {
        formatVotes(val) {
            return val.toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,')
        }
    },
    data() {
        return {
            // 页面
            show_rules: false,
            appType: this.$store.state.appType || 0,
            isLogin: this.$store.state.user.roleName && this.$store.state.user.roleName.toUpperCase() !== 'ANONYMOUS',
            // appType: 1,
            // isLogin: true,
            firstTime: true,
            msg: '',
            user_id: this.$store.state.user.id,
            share_num: 0,
            enroll_id: 2,
            isCommentStart: false,
            startTime_comment: '',
            endTime_comment: '',
            clipsList: [],
            clipsListNew: [],
            clipsListNew5: [],
            result10StartTime: '2019-10-01T00:00:00',
            result5StartTime: '2019-10-08T00:00:00',
            isResult10Start: false,
            isResult5Start: false,

            // 投票
            voteLeft: 0,
            loaded: false,
            advisorList: [],
            loaded10: false,
            loaded5: false,
            advisorList10: [],
            vote_id: 16,
            startTime: '',
            endTime: '',
            tip: '',
            tip_timer: null,
            canVote: true,

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
            star: '',
            loaded_m: false,
            msgul: '',

            title: 'Bongo Star Search 2019',
            imgUrl: 'http://cdn.startimestv.com/banner/BSSbanner-share.jpeg',
            shareTitle: 'Chaguo ni lako!',
            shareText: 'Chagua mshiriki unayempenda na umsaidie kushiriki kwenye hatua ya utafutaji wa washiriki wa Bongo Star Search 2019.',
            content: 'Chagua mshiriki unayempenda na umsaidie kushiriki kwenye hatua ya utafutaji wa washiriki wa Bongo Star Search 2019.'
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
        coupleList10() {
            if (this.loaded10) {
                return this.advisorList10
            } else {
                return []
            }
        },
        coupleList5() {
            if (this.loaded5) {
                return this.clipsListNew5
            } else {
                return []
            }
        },
        lotteryList() {
            if (this.loaded_l) {
                return this.lotteryType
            } else {
                return []
            }
        },
        msgList() {
            if (this.loaded_l && this.loaded_m) {
                return this.items
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
            const { data } = await $axios.get(`/voting/v1/vote?vote_id=16`)
            // console.log(req.headers.vote_sign)
            return {
                vote_sign: (req && req.headers.vote_sign) || '', // 通过serverMiddleWare拿到的唯一标识
                voteTitle: data.data.name,
                serverTime: new Date().getTime()
            }
        } catch (e) {
            return {
                vote_sign: (req && req.headers.vote_sign) || '',
                voteTitle: 'Bongo Star Search 2019',
                serverTime: new Date().getTime()
            }
        }
    },
    mounted() {
        this.getCommentInfo()
        const startTime10 = new Date(this.result10StartTime.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime()
        const startTime5 = new Date(this.result5StartTime.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime()
        console.log(this.serverTime, startTime10, startTime5)
        if (this.serverTime >= startTime5) {
            this.isResult5Start = true
        }
        if (this.serverTime >= startTime10) {
            this.isResult10Start = true
        }
        if (this.isResult5Start) {
            this.mSendEvLog('page_show', 'result2', '')
            return
        } else if (this.isResult10Start) {
            this.mSendEvLog('page_show', 'result1', '')
            this.$axios
                .get(`/voting/v1/candidates-show?vote_id=${this.vote_id}&sort_type=BALLOT&size=10`)
                .then(res => {
                    if (res.data.code === 0) {
                        this.advisorList10 = res.data.data
                        this.advisorList10.sort(function(a, b) {
                            return b.ballot_num - a.ballot_num
                        })
                    } else {
                        this.advisorList10 = []
                        this.$alert('Please Waiting 10 Result!')
                    }
                    this.loaded10 = true
                })
                .catch(err => {
                    this.advisorList10 = []
                    this.$alert(err + 'Please Waiting 10 Result!')
                })
            return
        }
        this.mSendEvLog('page_show', 'homepage', '')
        this.msgul = this.$refs.msgul
        this.getLotteryMsg()
        // this.getCommentInfo()
        this.getAdvisorList()
        this.getLotteryType()
        this.getMsgList()
        this.getShareNum()
        // this.getVideoMsg()
        const times = setInterval(() => {
            if (this.serverTime > this.endTime) clearInterval(times)
            this.getMsgList()
        }, 60000)
        setInterval(this.scroll, 2000)
        this.$route.query.pin && setCookie('vote_share_user', this.$route.query.pin) // 分享源用户记录
        !getCookie('vote_share_down') && setCookie('vote_share_down', this.vote_sign) // 是否点击过下载
    },

    methods: {
        toHowToGetVote() {
            this.mSendEvLog('goto_click', '', '')
            document.getElementById('text2').scrollIntoView()
        },
        toAll() {
            this.mSendEvLog('full_click', '', '')
            this.$router.push(`/hybrid/vote/BSSVoteDetail`)
            // window.location.href = '/hybrid/vote/BSSVoteDetail'
        },
        showRule() {
            this.show_rules = true
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.left = '0'
            document.body.style.right = '0'
        },
        closeRule() {
            this.show_rules = false
            document.body.style.overflow = 'auto'
            document.body.style.position = 'static'
        },
        toRegister() {
            this.$router.push(`/hybrid/vote/BSSRegister`)
            // window.location.href = '/hybrid/vote/BSSRegister'
        },
        toComment(label) {
            this.mSendEvLog('audreg_click', label, '')
            this.$router.push(`/hybrid/vote/BSSComment`)
            // window.location.href = '/hybrid/vote/BSSComment'
        },
        cdnPic(src) {
            return cdnPicSrc.call(this, src)
        },
        // 埋点方法
        mSendEvLog(action, label, value) {
            this.sendEvLog({
                category: 'form_BSSVote1_' + this.platform,
                action: action,
                label: label,
                value: value
            })
            console.log(action, label, value)
        },
        stopBubble() {
            event && event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true)
        },
        // app登录方法
        toSignIn() {
            this.stopBubble()
            this.mSendEvLog('signin_click', '', '')
            if (this.appType <= 0) {
                this.callOrDownApp()
            } else if (this.appType == 1) {
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
            this.stopBubble()
            if (label == 'voterules') this.closeRule()
            this.mSendEvLog('share_click', label, '')
            if (this.appType >= 1) {
                shareInvite(
                    `${window.location.href}?pin=${this.$store.state.user.id}&utm_source=VOTE&utm_medium=BSS&utm_campaign=${this.platform}`,
                    this.shareTitle,
                    this.shareText,
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
                this.$confirm(
                    'Pakua Startimes ON app na shiriki BSS2019',
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
                    'PAKUA',
                    'FUTA'
                )
            })
        },
        // 获取剩余票数
        getVoteRemain() {
            if (this.serverTime >= this.startTime && this.serverTime < this.endTime) {
                this.$axios({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify({
                        vote_id: this.vote_id
                    }),
                    url: '/voting/v1/ticket/sign-in'
                })
                    .then(res => {
                        if (res.data.code == 0 || res.data.code == 1) {
                            this.voteLeft = res.data.data
                        } else {
                            this.voteLeft = 0 // 服务器端计算数据错误时
                        }
                    })
                    .catch(err => {
                        this.voteLeft = 0
                        this.$alert(err)
                    })
            }
        },
        // 获取投票单元数据
        getAdvisorList() {
            this.$axios
                .get(`/voting/v1/candidates-show?vote_id=${this.vote_id}&sort_type=BALLOT&size=9`)
                .then(res => {
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
                .catch(err => {
                    this.advisorList = []
                    this.$alert(err)
                })
        },
        // 播放视频方法
        toPlayer(advisor, label) {
            this.mSendEvLog(label, advisor.name, '')
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
            if (!this.canVote) {
                return
            }
            if (this.appType == 0) {
                this.mSendEvLog('votebtn_click', advisor.name, '-1')
                this.callOrDownApp('vote')
                return
            }
            if (this.serverTime < this.startTime) {
                this.mSendEvLog('votebtn_click', advisor.name, '-1')
                this.$alert('Upigaji kura utaanza tarehe 8th Octoba, kwa hiyo kaa tayari!', () => {}, 'SAWA')
                return
            } else if (this.serverTime > this.endTime) {
                this.mSendEvLog('votebtn_click', advisor.name, '-1')
                this.$alert('Samahani, kura zimekwisha.', () => {}, 'SAWA')
                return
            }
            if (this.voteLeft <= 0) {
                this.mSendEvLog('votebtn_click', advisor.name, '-1')
                this.$confirm(
                    'Samahani, kura yako iliyobaki ni 0, shirikisha marafiki zako na upate kura zaidi.',
                    () => {
                        this.toShare('votefail')
                    },
                    () => {},
                    'SHIRIKI',
                    'FUTA'
                )
            } else {
                this.canVote = false
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
                            if (this.isLogin) {
                                this.mSendEvLog('votebtn_click', advisor.name, '1')
                            } else {
                                this.mSendEvLog('votebtn_click', advisor.name, '0')
                            }
                            advisor.ballot_num++
                            this.voteLeft--
                            this.lotteryLeft++
                            if (this.voteLeft > 0) {
                                if (this.firstTime) {
                                    this.$alert(
                                        'Upigaji umefanikiwa! Umepata nafasi ya kucheza bahati nasibu.',
                                        () => {
                                            this.firstTime = false
                                        },
                                        'SAWA'
                                    )
                                } else {
                                    this.tipShow('Upigaji umefanikiwa! Umepata nafasi ya kucheza bahati nasibu.')
                                }
                            } else {
                                this.$confirm(
                                    'Upigaji umefanikiwa! Shirikisha marafiki kupata kura zaidi.',
                                    () => {
                                        this.toShare('0leftvote')
                                    },
                                    () => {},
                                    'SHIRIKI',
                                    'FUTA'
                                )
                            }
                            this.canVote = true
                        } else {
                            this.$alert(res.data.message)
                            this.canVote = true
                        }
                    })
                    .catch(err => {
                        this.$alert(err)
                        this.canVote = true
                    })
            }
        },
        // 获取大众评审活动信息
        getCommentInfo() {
            this.$axios
                .get(`/voting/enroll/v1/info?enroll_id=${this.enroll_id}`)
                .then(res => {
                    if (res.data.code === 200) {
                        this.startTime_comment = new Date(res.data.data.start_time.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime()
                        this.endTime_comment = new Date(res.data.data.end_time.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime()
                        if (this.serverTime > this.startTime_comment) {
                            this.isCommentStart = true
                        }
                        this.getVideoMsg()
                    } else {
                        this.$alert('ERROR TO GET COMMENT TIME')
                    }
                })
                .catch(err => {
                    this.$alert(err)
                })
        },
        // 获取大众评审活动信息
        getShareNum() {
            this.$axios
                .get(`/voting/v1/action/count?vote_id=${this.vote_id}&action=SHARE_DOWNLOAD`)
                .then(res => {
                    if (res.data.code == 0) {
                        this.share_num = res.data.data
                    } else {
                        this.$alert('ERROR TO GET SHARE NUM')
                    }
                })
                .catch(err => {
                    this.$alert(err)
                })
        },
        // 获取抽奖活动时间信息
        getLotteryMsg() {
            // this.serverTime = Date.parse(this.serverTime)
            this.$axios
                .get(`/voting/lottery/v1/info?lottery_id=${this.lottery_id}`)
                .then(res => {
                    if (res.data.code === 200) {
                        this.startTime = new Date(res.data.data.start_time.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime()
                        this.endTime = new Date(res.data.data.end_time.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime()
                        this.getVoteRemain()
                        this.getLeftLottery()
                        this.getMsgList()
                    } else {
                        this.$alert('ERROR TO GET LOTTERY TIME')
                    }
                })
                .catch(err => {
                    this.$alert(err)
                })
        },
        // 获取剩余抽奖机会
        getLeftLottery() {
            if (this.serverTime >= this.startTime && this.serverTime < this.endTime) {
                this.$axios
                    .get(`/voting/lottery/v1/draw/user-draw-nums?lottery_id=${this.lottery_id}&vote_id=${this.vote_id}`)
                    .then(res => {
                        if (res.data.code === 0) {
                            this.lotteryLeft = res.data.data
                        } else {
                            this.lotteryLeft = 0 // 服务器端计算数据错误时
                        }
                    })
                    .catch(err => {
                        this.lotteryLeft = 0
                        this.$alert(err)
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
                .catch(err => {
                    this.lotteryType = []
                    this.$alert(err)
                })
        },
        randomList(arr) {
            for (let i = 0; i < arr.length; i++) {
                const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i
                ;[arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
            }
            return arr
        },
        // 获取消息列表
        getMsgList() {
            this.$axios
                .get(`/voting/lottery/v1/admin/reward/users?lottery_id=${this.lottery_id}`)
                .then(res => {
                    if (res.data.code === 0) {
                        if (this.serverTime <= this.startTime) {
                            this.items = []
                        } else {
                            this.items = res.data.data
                            this.randomList(this.items)
                            this.items.forEach((item, index, arrs) => {
                                if (item.user_name) {
                                    if (
                                        new RegExp(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/).test(
                                            item.user_name
                                        )
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
                            this.loaded_m = true
                        }
                    } else {
                        this.items = [] // 服务器端计算数据错误时
                    }
                })
                .catch(err => {
                    this.items = []
                    this.$alert(err)
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
                this.$alert(
                    'Tafadhali jisajili ili uanze mchuano wa bahati.',
                    () => {
                        this.toSignIn()
                    },
                    'JISAJILI'
                )
                return
            }
            if (this.serverTime < this.startTime) {
                this.mSendEvLog('lottery_click', '', '-1')
                this.$alert('Shughuli haijaanza.', () => {}, 'SAWA')
                return
            }
            if (this.serverTime >= this.endTime) {
                this.mSendEvLog('lottery_click', '', '-1')
                this.$alert('Shughuli imemalizika.', () => {}, 'SAWA')
                return
            }
            this.mSendEvLog('lottery_click', '', '-1')
            this.$alert(
                'Nenda kupiga kura ili kushinda bahati nzuri ya kuteka. Kila wakati unapopiga kura, utapata nafasi ya kushinda zawadi.',
                () => {},
                'SAWA'
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
                        this.$alert(
                            'Hongera! Umepata ' +
                                this.lotteryType[this.index].name +
                                '! Zawadi zitatolewa kwenye siku ya pili ya kazi katika Me-> Kuponi zangu.',
                            () => {
                                this.click = true
                            },
                            'SAWA'
                        )
                    }, 1000)
                } else if (this.index == 5) {
                    this.getTicketAward(res => {
                        if (res.data.code == 200) {
                            setTimeout(() => {
                                this.$alert(
                                    'Hongera! Umepata kura ' + res.data.data + ' zaidi!',
                                    () => {
                                        this.click = true
                                    },
                                    'SAWA'
                                )
                                this.voteLeft += res.data.data
                            }, 1000)
                        } else {
                            this.$alert(res.data.message)
                        }
                    })
                } else if (this.index === 6) {
                    setTimeout(() => {
                        this.lotteryLeft++
                        this.$alert(
                            'Hongera! Umepata nafasi moja zaidi!',
                            () => {
                                this.click = true
                                this.startLottery()
                            },
                            'SAWA'
                        )
                    }, 1000)
                } else if (this.index === 7) {
                    setTimeout(() => {
                        this.$alert(
                            'Asante kwa ushiriki wako.',
                            () => {
                                this.click = true
                            },
                            'SAWA'
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
                            lottery_id: this.lottery_id,
                            vote_id: this.vote_id
                        }),
                        url: '/voting/lottery/v1/drawing'
                    })
                        .then(res => {
                            if (res.data.code == 0) {
                                this.prize = res.data.data - 7
                                console.log(`中奖位置${this.prize + 1}`)
                                if (res.data.data == 9) this.mSendEvLog('lottery_click', 'vip', '1')
                                else if (res.data.data == 10) this.mSendEvLog('lottery_click', '40offcoupon', '1')
                                else if (res.data.data == 11) this.mSendEvLog('lottery_click', '30offcoupon', '1')
                                else if (res.data.data == 12) this.mSendEvLog('lottery_click', 'morevotes', '1')
                                else if (res.data.data == 13) this.mSendEvLog('lottery_click', 'tryagain', '0')
                                else if (res.data.data == 14) this.mSendEvLog('lottery_click', 'sorry', '0')
                            } else {
                                setTimeout(() => {
                                    clearTimeout(this.timer)
                                    this.times = 0
                                    this.$alert(
                                        'LOTTERY ERROR!',
                                        () => {
                                            this.lotteryLeft = 0
                                        },
                                        'SAWA'
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
            // const msg = this.$refs.msgul
            this.msgul.style.marginTop = '-30px'
            this.animate = !this.animate
            setTimeout(() => {
                this.msgList.push(this.msgList[0])
                this.msgList.shift()
                this.msgul.style.marginTop = '0'
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
            })
                .then(res => {
                    callback && callback(res)
                })
                .catch(err => {
                    this.$alert(err)
                })
        },
        // 获取往期视频
        getVideoMsg() {
            // 获取投票单元数据
            if (this.isCommentStart) {
                this.$axios
                    .get(`/voting/v1/program?vote_id=${this.vote_id}`)
                    .then(res => {
                        if (res.data.code === 0) {
                            this.clipsList = res.data.data
                            this.clipsList.forEach(item => {
                                if (item.name.substr(0, 1) == 'c') {
                                    this.clipsListNew.push(item)
                                }
                                if (item.name.substr(0, 1) == 'd') {
                                    this.clipsListNew5.push(item)
                                }
                            })
                            this.clipsListNew.forEach(item => {
                                this.mSendEvLog('video_show', item.id, '')
                            })
                        } else {
                            this.$alert('GET VIDEO MSG ERROR')
                        }
                        this.loaded5 = true
                    })
                    .catch(err => {
                        this.$alert(err)
                    })
            }
        },
        // toast方法
        tipShow(text, duration = 2000) {
            console.log(text)
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
                { name: 'description', property: 'description', content: this.content },
                { name: 'og:description', property: 'og:description', content: this.content },
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
                            `com.star.mobile.video.activity.BrowserActivity?loadUrl=http://m.startimestv.com/hybrid/vote/BSSVote`.replace(/&/g, '**')
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
    min-height: 50rem;
    .container {
        > img {
            display: block;
            margin: 0 auto;
            padding-top: 0.5rem;
            width: 95%;
            height: auto;
            &.ic-green {
                width: 90%;
                padding-top: 0;
                position: relative;
                top: -0.3rem;
            }
            &.ic-green-a {
                width: 90%;
                position: relative;
                padding-top: 0;
                top: -0.5rem;
            }
            &.link {
                width: 90%;
                margin: 0.3rem auto 0.8rem;
            }
        }
        .tab-box {
            width: 100%;
            height: 2.2rem;
            position: relative;
            z-index: 1;
            .tab {
                width: 100%;
                position: absolute;
                color: #fff;
                top: -1rem;
                left: 0;
                height: 4rem;
                .rules {
                    width: 7rem;
                    float: left;
                    background: url('~assets/img/vote/BSSRegister/bg-ruleb.png') no-repeat;
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
                    background: url('~assets/img/vote/BSSRegister/bg-shareb.png') no-repeat;
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
        .text {
            width: 100%;
            display: block;
        }
        .vote-box {
            width: 90%;
            height: auto;
            background-color: #00701a;
            border-radius: 0.2rem;
            margin: 0.5rem auto 0;
            padding-bottom: 1rem;
            position: relative;
            .vote-remaining {
                width: 100%;
                height: 5rem;
                font-size: 0.75rem;
                padding-top: 1rem;
                div {
                    height: 1.7rem;
                    line-height: 1.7rem;
                    text-align: center;
                    border-radius: 0.2rem;
                    &.remain {
                        margin: 0 auto;
                        width: 10rem;
                        color: #fff;
                        background: #006313;
                    }
                    &.ask {
                        width: 100%;
                        color: #0fff95;
                        text-decoration: underline;
                    }
                }
            }
            ul {
                width: 100%;
                height: auto;
                padding: 0 0.5% 0 1.3%;
                li {
                    list-style: none;
                    width: 31%;
                    float: left;
                    margin: 0 1% 1.3rem;
                    .item-box {
                        position: relative;
                        width: 100%;
                        overflow: hidden;
                        border-radius: 0.2rem;
                        div {
                            position: relative;
                            width: 100%;
                            .icon {
                                width: 100%;
                                height: 100%;
                                position: absolute;
                                top: 0;
                            }
                            &:before {
                                content: '';
                                display: inline-block;
                                padding-bottom: 62%;
                                width: 0.1px;
                                vertical-align: middle;
                            }
                        }
                        .name {
                            width: 100%;
                            height: 2rem;
                            padding: 0 0.2rem;
                            margin-top: 0.2rem;
                            line-height: 1rem;
                            font-size: 0.8rem;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            color: #fff;
                            display: block;
                            text-align: center;
                        }
                        p {
                            display: block;
                            width: 101%;
                            height: 1.3rem;
                            position: absolute;
                            bottom: -0.1rem;
                            z-index: 1;
                            color: #fff;
                            font-size: 0.75rem;
                            text-align: center;
                            line-height: 1.3rem;
                            background-image: url('~assets/img/vote/BSSRegister/bg-pull.png');
                            background-size: 100% 1.3rem;
                        }
                    }
                    .vote-btn {
                        width: 100%;
                        height: 1.3rem;
                        margin: 0.2rem 0 0;
                        .btn {
                            width: 4.5rem;
                            height: 1.3rem;
                            line-height: 1.3rem;
                            color: #ffffff;
                            background-image: url('~assets/img/vote/BSSRegister/bg-vote.png');
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
            ul.result {
                padding: 1.3rem 0.5% 0 1.3%;
                li {
                    width: 45%;
                    margin: 0 2.4% 0;
                }
            }
            .more {
                width: 14rem;
                background-color: #06b42e;
                text-align: center;
                height: 1.5rem;
                line-height: 1.5rem;
                border-radius: 1rem;
                color: #fff;
                margin: 0.2rem auto 0;
            }
        }
        .share-box {
            width: 100%;
            margin-bottom: 0.7rem;
            > img {
                display: block;
                width: 90%;
                margin: 1rem auto 0;
            }
            > div {
                width: 90%;
                margin: 1rem auto 0;
                font-size: 0.75rem;
                text-align: center;
                padding: 1.3rem 2.5% 0.8rem;
                background-color: #1e91d6;
                position: relative;
                border-radius: 0.2rem;
                img {
                    width: 100%;
                    margin-bottom: 0.5rem;
                }
                .num {
                    width: 100%;
                    height: 1.1rem;
                    line-height: 1.1rem;
                    position: absolute;
                    bottom: 1.7rem;
                    left: 0;
                    p {
                        display: block;
                        border-radius: 0.2rem;
                        width: 13rem;
                        margin: 0 auto;
                        background-color: #02609c;
                        color: #fec808;
                    }
                }
            }
        }
        .lottery-box {
            width: 100%;
            height: 29rem;
            margin-top: 1rem;
            padding-bottom: 1rem;
            .lottery {
                width: 90%;
                height: 28rem;
                background-color: #fea42f;
                margin: 0 auto;
                border-radius: 0.5rem;
                padding: 1rem 2%;
                position: relative;
                z-index: 2;
                .count {
                    width: 11rem;
                    height: 1.5rem;
                    line-height: 1.5rem;
                    border-radius: 0.2rem;
                    color: #fff;
                    background-color: #ff6d21;
                    text-align: center;
                    margin: 0 auto 0.5rem;
                    font-size: 0.75rem;
                }
                .lottery-type {
                    width: 100%;
                    margin: 0 auto;
                    background-image: url('~assets/img/vote/BSSRegister/bg-border.png');
                    background-size: 100% 19.8rem;
                    color: #ad5500;
                    ul {
                        width: 90%;
                        margin: 0 auto;
                        border-radius: 0.5rem;
                        padding: 0.2rem 0;
                        position: relative;
                        height: 19.8rem;
                        li {
                            width: 30%;
                            height: 5.2rem;
                            display: block;
                            position: absolute;
                            overflow: hidden;
                            border-radius: 0.2rem;
                            background-color: #fff;
                            border: 0.25rem solid transparent;
                            &:nth-child(1) {
                                background-image: url('~assets/img/vote/BSSRegister/bg-lottery-light.png');
                                background-size: 100% 100%;
                                border-top-left-radius: 1rem;
                                left: 3%;
                                top: 1.7rem;
                            }
                            &:nth-child(2) {
                                background-image: url('~assets/img/vote/BSSRegister/bg-lottery-light.png');
                                background-size: 100% 100%;
                                left: 35%;
                                top: 1.7rem;
                            }
                            &:nth-child(3) {
                                border-top-right-radius: 1rem;
                                left: 67%;
                                top: 1.7rem;
                            }
                            &:nth-child(4) {
                                left: 67%;
                                top: 7.2rem;
                            }
                            &:nth-child(5) {
                                border-bottom-right-radius: 1rem;
                                left: 67%;
                                top: 12.7rem;
                            }
                            &:nth-child(6) {
                                left: 35%;
                                top: 12.7rem;
                            }
                            &:nth-child(7) {
                                border-bottom-left-radius: 1rem;
                                left: 3%;
                                top: 12.7rem;
                            }
                            &:nth-child(8) {
                                left: 3%;
                                top: 7.2rem;
                            }
                            &.active {
                                border: 0.25rem solid #8cd021;
                            }
                            > div {
                                width: 100%;
                                height: 5.5rem;
                                padding: 0 0.2rem;
                                .prize {
                                    img {
                                        display: block;
                                        width: auto;
                                        height: 2.75rem;
                                        margin: 0 auto;
                                        padding: 0.3rem 0;
                                    }
                                    p {
                                        display: block;
                                        width: 100%;
                                        text-align: center;
                                        font-size: 0.75rem;
                                        display: -webkit-box;
                                        -webkit-box-orient: vertical;
                                        -webkit-line-clamp: 2;
                                        overflow: hidden;
                                    }
                                }
                            }
                        }
                        .getLuck,
                        .getLuck-gray {
                            width: 32%;
                            height: 5.5rem;
                            border-radius: 0.2rem;
                            text-align: center;
                            position: absolute;
                            top: 7.2rem;
                            left: 34%;
                            background-size: 100% 5.5rem;
                            font-size: 1.3rem;
                            font-weight: bold;
                            line-height: 4.5rem;
                        }
                        .getLuck {
                            background-image: url('~assets/img/vote/BSSRegister/start.png');
                            &:active {
                                background-image: url('~assets/img/vote/BSSRegister/start-ac.png');
                            }
                        }
                        .getLuck-gray {
                            background-image: url('~assets/img/vote/BSSRegister/start-gray.png');
                            color: #ccc;
                        }
                    }
                }
                .msg {
                    width: 100%;
                    height: 2rem;
                    line-height: 2rem;
                    overflow: hidden;
                    transition: all 0.5s;
                    position: relative;
                    margin-top: 0.3rem;
                    margin-bottom: 0.5rem;
                    background-color: #c86a02;
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
                            color: #fde8ae;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
                .tip {
                    width: 100%;
                    height: 1.3rem;
                    font-size: 0.75rem;
                    line-height: 1.3rem;
                    text-align: center;
                    color: #fff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .past-programme {
            margin: 1rem auto 0;
            width: 90%;
            padding-bottom: 1rem;
            img {
                width: 100%;
                display: block;
            }
            ul {
                width: 100%;
                background-color: #e98005;
                border-radius: 0.2rem;
                padding: 1rem 3% 0.5rem;
                li {
                    float: left;
                    width: 48.5%;
                    &:nth-child(2n) {
                        float: right;
                    }
                    div {
                        position: relative;
                        width: 100%;
                        .url {
                            width: 100%;
                            height: 100%;
                            border-radius: 0.3rem;
                            position: absolute;
                            top: 0;
                        }
                        &:before {
                            content: '';
                            display: inline-block;
                            padding-bottom: 62%;
                            width: 0.1px;
                            vertical-align: middle;
                        }
                    }
                    .title {
                        margin: 0.5rem 0;
                        width: 100%;
                        height: 2rem;
                        line-height: 1rem;
                        color: #fff;
                        font-size: 0.75rem;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                    }
                }
            }
        }
    }
    .rules-box {
        width: 17rem;
        height: 26rem;
        line-height: 1.2rem;
        position: fixed;
        overflow: hidden;
        top: 50%;
        left: 50%;
        margin-left: -8.5rem;
        margin-top: -13rem;
        z-index: 999;
        img {
            &:first-child {
                width: 100%;
                display: block;
            }
            &:last-child {
                width: 10%;
                display: block;
                margin: 1.5rem auto 0;
            }
        }
        .rule-text {
            width: 15rem;
            height: 14.5rem;
            color: #1b9145;
            position: absolute;
            left: 1rem;
            top: 4rem;
            padding: 0.5rem;
            overflow-x: hidden;
            overflow-y: scroll;
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .share-btn {
            width: 8rem;
            height: 1.8rem;
            text-align: center;
            line-height: 1.8rem;
            color: #fff;
            background-image: url('~assets/img/vote/BSSRegister/btn-success.png');
            background-size: 8rem 1.8rem;
            position: absolute;
            left: 4.5rem;
            top: 19.2rem;
            border-radius: 0.2rem;
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
    .vote-toast {
        position: fixed;
        left: 50%;
        top: 50%;
        margin-left: -7.5rem;
        margin-top: -2.1rem;
        font-size: 0.9rem;
        background: rgba(0, 0, 0, 0.65);
        padding: 0.6rem 1.5rem;
        border-radius: 3px;
        width: 15rem;
        height: 4.2rem;
        color: #fff;
        z-index: 9999;
    }
}
</style>
