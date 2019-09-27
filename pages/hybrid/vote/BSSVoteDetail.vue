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
                        <!-- <li v-for="n in item" :key="n">
                            <div class="item-box">
                                <div>
                                    <img :src="adviserList[key][n-1]" class="icon" @click="toPlayer(adviserList[key][n-1])" />
                                    <p>{{adviserList[key][n-1].ballot_num}}</p>
                                </div>
                                <span class="name">{{adviserList[key][n-1].name}}</span>
                            </div>
                            <div class="vote-btn">
                                <div class="btn" @click="handleVote(adviserList[key][n-1])">VOTE</div>
                            </div>
                        </li>-->
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
                                <div class="btn">VOTE</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
import { Base64 } from 'js-base64'
import { cdnPicSrc } from '~/functions/utils'
import { playVodinApp, shareInvite } from '~/functions/app'
export default {
    layout: 'base',
    components: {},
    data() {
        return {
            // 页面
            appType: 1,
            title: 'Bongo Star Search 2019 Vote Detail',
            wordList: [],
            wordListReady:[],
            wordTree: {},
            // voteList: [],
            // voteListWord: [[]],
            adviserList: {},
            isload: false,
            vote_id: 16,
            isload_w: false,
            isload_a: false,
            index: 0,
            array: [],
            adviser: {},
            timer: null,
            t1: 0,
            t2: 0,
            count: 0,

            shareTitle: '',
            imgUrl: '',

            voteLeft: 0,
            // scrollTop: 0
            startTime: '',
            endTime: '',
            finishWord: ''
        }
    },
    computed: {
        adviserListReady() {
            if (this.isload_a) {
                return this.adviserList
            } else {
                return []
            }
        },
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
        this.getVoteMsg()
    },
    mounted() {
        // this.getVoteMsg()
        this.mSendEvLog('page_show', '', '')
        this.getVoteinfo()
        window.addEventListener('scroll', this.handleScroll)
        this.getAdviserList(this.canSeeWordList())
    },

    methods: {
        handleScroll() {
            clearTimeout(this.timer)
            this.t1 = document.documentElement.scrollTop || document.body.scrollTop
            this.timer = setTimeout(() => {
                this.t2 = document.documentElement.scrollTop || document.body.scrollTop
                if (this.t2 === this.t1) {
                    console.log('滚动结束了')
                    this.getAdviserList(this.canSeeWordList())
                }
            }, 500)
        },
        canSeeWordList() {
            const array = []
            this.wordListReady.forEach((item, index) => {
                // const el = this.$refs.item
                const el = document.getElementById(item)
                const clientH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
                const elTop = el.getBoundingClientRect().top
                const elbottom = el.getBoundingClientRect().bottom

                if ((elbottom > 100 || elTop >= 0) && (elbottom < clientH || elTop <= clientH)) {
                    array.push(item)
                }
            })
            const len = array.length
            this.wordListReady.forEach((item, index) => {
                if (array[len-1] == item) {
                    this.index = index
                }
            })
            return array
        },
        getAdviserList(array) {
            array.forEach((item,index)=>{
                if(this.finishWord.indexOf(item) >=0 ) {
                    array[index] = ''
                }
            })
            array = array.join('').split('')
            if(array.length <= 0) return
            const labels = '&labels=' + array.join('&labels=')
            this.$axios.get(`/voting/v2/candidates-show?vote_id=${this.vote_id}` + labels).then(res => {
                this.adviserList = {}
                console.log('000')
                for (const key in res.data.data) {
                    this.adviserList[key] = res.data.data[key]
                    if (this.finishWord.indexOf(key) < 0) {
                        this.finishWord += key
                    }
                    this.wordTree[key] = this.adviserList[key]
                }
                this.isload_a = true
            })
        },
        toWord(id) {
            document.getElementById(id).scrollIntoView()
            this.wordListReady.forEach((item, index) => {
                if (id == item) {
                    this.index = index
                }
            })
        },
        showRule() {
            this.show_rules = true
            // 页面静止
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
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
                            this.wordTree[key] = res.data.data[key]
                            this.count += res.data.data[key]
                            this.wordList.push(key)
                        }
                    })
                    // this.wordList.sort((a, b) => {
                    //     return a - b
                    // })
                    this.isload_w = true
                    this.wordListReady = this.wordList
                    this.getAdviserList(this.canSeeWordList())
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
        // 投票方法
        handleVote(advisor) {
            this.mSendEvLog('votebtn_click', advisor.name, '')
            if (this.appType == 0) {
                this.callOrDownApp('vote')
                return
            }
            if (this.serverTime < this.startTime) {
                this.show(
                    `<p style="padding-top:0.5rem">Stay tuned! Voting will begin on September 23rd.</p>`,
                    () => {},
                    () => {},
                    `<p style="padding: 0 1rem">GOT IT</p>`,
                    ''
                )
                return
            } else if (this.serverTime > this.endTime) {
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
                                height: 1.5rem;
                                padding: 0 0.2rem;
                                margin-top: 0.2rem;
                                line-height: 1.5rem;
                                font-size: 0.8rem;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
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
}
</style>
