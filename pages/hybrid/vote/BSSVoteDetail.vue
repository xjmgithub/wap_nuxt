<template>
    <div class="wrapper">
        <div class="container">
            <img src="~assets/img/vote/BSSRegister/bg-img.png" alt="bg-img" class="bg-img" />
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
            <img src="~assets/img/vote/BSSRegister/bg-register.png" alt class="ic-green" />
            <img class="text text-one" src="~assets/img/vote/BSSRegister/text1.png" alt />
            <div v-show="true" class="vote-box">
                <div class="vote-remaining">
                    <div class="remain">KURA ZILIZOBAKI:{{appType==0?0:voteLeft}}</div>
                </div>
                <div class="index-box" :class="count>=30&&scrollTop>550?'':'none'">
                    <div v-for="(word,i) in wordListReady" :key="i">
                        <div :class="index==i?'active':''" @touchstart="toWord(word)">{{word}}</div>
                    </div>
                </div>
                <div v-for="(item,key) in wordTree" :id="key" :key="key" :ref="key" class="vote-word">
                    <div class="vote-title">{{key}}</div>
                    <ul class="clearfix">
                        <li v-for="(n,i) in item" :key="i">
                            <div class="item-box">
                                <div>
                                    <img v-if="n.icon" :src="n.icon" class="icon" />
                                    <img v-else src=" " class="icon" />
                                    <p v-if="n.name">{{n.ballot_num}}</p>
                                    <p v-else />
                                </div>
                                <span v-if="n.name" class="name">{{n.name}}</span>
                                <span v-else class="name">{{n.name}}</span>
                            </div>
                            <div class="vote-btn">
                                <div v-if="n.name" class="btn" @click="handleViceVote(n)">VOTE</div>
                                <div v-else class="btn">VOTE</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-show="show_rules" class="rules-box">
            <img src="~assets/img/vote/BSSRegister/bg-rule.png" alt />
            <div class="rule-text">
                1. Kutoka tarehe 8th Oct hadi 27th Oct, una kura 5 kila siku baada ya kuingia. Kura zitakuwa zinajumlishwa na kuwa halali hadi mwisho wa shughuli.
                <br />2. Unaweza kumpigia kura mshiriki yeyote unayempenda!
                <br />3. Washirikishe link rafiki zako na waombe wapakue app ya StarTimes ON ili kupata kura zaidi! Utapata kura 5 zaidi kwa kila mtumiaji mpya. Unavyozidi kuleta watumiaji wapya, ndivyo unavyopata kura zaidi!
                <br />4. Kila wakati unapopiga kura, utapata nafasi ya kushinda zawadi! Una nafasi ya kushinda kila mwezi Max VIP na kuponi kwenye App ya StarTimes ON.
                <br />5. Zawadi zitakuwa zinatolewa siku ya pili ya kazi katika Me-> Kuponi zangu.
                <br />6. Washiriki 10 wa mwanzo wenye kura nyingi zaidi wataingia kwenye orodha ya uchaguzi wa mwisho na kupata nafasi ya kuonekana rasmi kwenye onyesho la BSS2019.
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
import { cdnPicSrc } from '~/functions/utils'
import mShare from '~/components/web/share.vue'
import { playVodinApp, shareInvite } from '~/functions/app'
export default {
    layout: 'base',
    components: {
        mShare
    },
    data() {
        return {
            // 页面
            // appType: this.$store.state.appType || 0,
            // isLogin: this.$store.state.user.roleName && this.$store.state.user.roleName.toUpperCase() !== 'ANONYMOUS',
            appType: 1,
            isLogin: true,
            show_rules: false,
            tip: '',
            tip_timer: null,
            title: 'Bongo Star Search 2019 Vote Detail',
            wordListReady: [],
            wordTree: {},
            adviserList: {},
            isload: false,
            vote_id: 16,
            isload_w: false,
            index: 0,
            adviser: {},
            timer: null,
            t1: 0,
            t2: 0,
            count: 0,

            shareTitle: '',
            imgUrl: '',

            voteLeft: 0,
            startTime: '',
            endTime: '',
            finishWord: '',
            reqWordList: [],
            firstTime: true
        }
    },
    computed: {
        scrollTop() {
            return this.t1
        }
    },
    // 唯一标识处理
    async asyncData({ app: { $axios }, store, req }) {
        $axios.setHeader('token', store.state.token)
        try {
            const { data } = await $axios.get(`/voting/v1/vote?vote_id=16`)
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
    created() {
        // this.getVoteMsg()
    },
    mounted() {
        this.getVoteMsg()
        this.mSendEvLog('page_show', '', '')
        this.getVoteinfo()
        window.addEventListener('scroll', this.handleScroll)
    },

    methods: {
        showRule() {
            this.show_rules = true
            // 页面静止
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
        },
        closeRule() {
            this.show_rules = false
            // 页面静止
            document.body.style.overflow = 'auto'
            document.body.style.position = 'static'
        },
        handleScroll() {
            clearTimeout(this.timer)
            this.t1 = document.documentElement.scrollTop || document.body.scrollTop
            this.timer = setTimeout(() => {
                this.t2 = document.documentElement.scrollTop || document.body.scrollTop
                if (this.t2 === this.t1) {
                    console.log('滚动结束了')
                    this.canSeeWordList()
                }
            }, 500)
        },
        canSeeWordList() {
            this.reqWordList = []
            this.$nextTick(() => {
                this.wordListReady.forEach((item, index) => {
                    const el = document.getElementById(item)
                    const clientH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
                    const elTop = el.getBoundingClientRect().top
                    const elbottom = el.getBoundingClientRect().bottom

                    if ((elbottom > 100 || elTop >= 0) && (elbottom < clientH || elTop <= clientH)) {
                        this.reqWordList.push(item)
                    }
                })
                this.getAdviserList()
            })

            const len = this.reqWordList.length
            this.wordListReady.forEach((item, index) => {
                if (this.reqWordList[len - 1] == item) {
                    this.index = index
                }
            })
        },
        getAdviserList() {
            this.reqWordList.forEach((item, index) => {
                if (this.finishWord.indexOf(item) >= 0) {
                    this.reqWordList[index] = ''
                }
            })
            const tmp = this.reqWordList.join('').split('')
            if (tmp.length <= 0) return
            const labels = '&labels=' + this.reqWordList.join('&labels=')
            this.$axios.get(`/voting/v2/candidates-show?vote_id=${this.vote_id}` + labels).then(res => {
                this.adviserList = {}
                for (const key in res.data.data) {
                    this.adviserList[key] = res.data.data[key]
                    if (this.finishWord.indexOf(key) < 0) {
                        this.finishWord += key
                    }
                    }
                })
                .catch(err => {
                    this.$alert(err)
                })
        },
        toWord(id) {
            document.getElementById(id).scrollIntoView()
            this.wordList.forEach((item, index) => {
                if (id == item) {
                    this.index = index
                }
            })
        },
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
        // 获取存在的单词和选手数量列表
        getVoteMsg() {
            this.$axios
                .get(`/voting/v1/candidates/labels?vote_id=${this.vote_id}`)
                .then(res => {
                    Object.keys(res.data.data).forEach(key => {
                        if (key.charCodeAt() >= 65 && key.charCodeAt() <= 90) {
                            // this.adviserList[key] = res.data.data[key]
                            this.wordTree[key] = res.data.data[key]
                            this.count += res.data.data[key]
                            this.wordListReady.push(key)
                        }
                    })
                    this.isload_w = true
                    this.canSeeWordList()
                })
                .catch(err => {
                    this.$alert(err)
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
                }).then(res => {
                    if (res.data.code == 0 || res.data.code == 1) {
                        this.voteLeft = res.data.data
                    } else {
                        this.voteLeft = 0 // 服务器端计算数据错误时
                    }
                })
            }
        },
        toThousands(num) {
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        },
        // 投票方法
        handleViceVote(advisor) {
            this.mSendEvLog('votebtn_click', advisor.name, '')
            if (this.appType == 0) {
                this.callOrDownApp('vote')
                return
            }
            if (this.serverTime < this.startTime) {
                this.$alert('Upigaji kura utaanza tarehe 8th Octoba, kwa hiyo kaa tayari!', () => {}, 'SAWA')
                return
            } else if (this.serverTime > this.endTime) {
                this.$alert('Samahani, kura zimekwisha.', () => {}, 'SAWA')
                return
            }
            if (this.voteLeft <= 0) {
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
                            advisor.ballot_num = this.toThousands(parseInt(advisor.ballot_num.replace(',', '')) + 1)
                            // advisor.ballot_num++
                            this.voteLeft--
                            this.lotteryLeft++
                            if (this.voteLeft > 0) {
                                if (this.firstTime) {
                                    this.$alert(
                                        'Upigaji umefanikiwa! Umepata nafasi ya kucheza bahati nasibu.',
                                        () => {
                                            this.firstTime = false
                                        },
                                        'GOT IT'
                                    )
                                } else {
                                    this.tipShow('Upigaji umefanikiwa! Umepata nafasi ya kucheza bahati nasibu.')
                                }
                            } else {
                                this.$confirm(
                                    'Samahani, kura yako iliyobaki ni 0, shirikisha marafiki zako na upate kura zaidi.',
                                    () => {
                                        this.toShare('0leftvote')
                                    },
                                    () => {},
                                    'SHIRIKI',
                                    'FUTA'
                                )
                            }
                        } else {
                            this.$alert(res.data.message)
                        }
                    })
                    .catch(err => {
                        this.$alert(err)
                    })
            }
        },
        // 获取投票活动时间信息
        getVoteinfo() {
            // this.serverTime = Date.parse(this.serverTime)
            this.$axios
                .get(`/voting/v1/vote?vote_id=${this.vote_id}`)
                .then(res => {
                    if (res.data.code === 0) {
                        this.startTime = new Date(res.data.data.start_time).getTime()
                        this.endTime = new Date(res.data.data.end_time).getTime()
                        this.getVoteRemain()
                    } else {
                        this.$alert('ERROR TO GET VOTE TIME')
                    }
                })
                .catch(err => {
                    this.$alert(err)
                })
        },
        // toast方法
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
            &.ic-green {
                width: 90%;
                position: relative;
                top: -0.8rem;
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
        .text {
            width: 100%;
            display: block;
        }
        .vote-box {
            width: 100%;
            position: relative;
            background-color: #00701a;
            margin-top: 1rem;
            .vote-remaining {
                width: 100%;
                height: 2.5rem;
                font-size: 0.75rem;
                padding-top: 0.8rem;
                div {
                    height: 1.7rem;
                    line-height: 1.7rem;
                    text-align: center;
                    border-radius: 0.2rem;
                    &.remain {
                        margin: 0 auto;
                        width: 12rem;
                        color: #fff;
                        background: #006313;
                    }
                }
            }
            .index-box {
                position: fixed;
                right: 1.5%;
                top: 1.7rem;
                &.none {
                    display: none;
                }
                div {
                    width: 1rem;
                    height: 1rem;
                    line-height: 1rem;
                    text-align: center;
                    color: #fff;
                    font-size: 0.8rem;
                    border-radius: 0.5rem;
                    &.active {
                        color: #056f1e;
                        background-color: #e8d535;
                    }
                }
            }
            .vote-word {
                .vote-title {
                    width: 100%;
                    height: 3rem;
                    color: #fff;
                    margin: 0 auto 0.5rem;
                    text-align: center;
                    line-height: 3rem;
                    font-size: 1.6rem;
                    background: url('~assets/img/vote/BSSRegister/bg-word.png') no-repeat center;
                    background-size: 3.5rem 0.6rem;
                }
                ul {
                    width: 90%;
                    height: auto;
                    padding: 0 0.5% 0 1.3%;
                    margin: 0 auto;
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
