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
            <img src="~assets/img/vote/BSSRegister/share-rule-img.png" alt class="ic-green" />
            <div v-show="voteListReady.length>0" class="vote-box">
                <div class="index-box">
                    <div v-for="(word,i) in wordList" :key="i">
                        <div @click="toWord(word)">{{word}}</div>
                    </div>
                </div>
                <div v-for="(word,i) in wordList" :id="word" :key="i" class="vote-word">
                    <div class="vote-title">{{word}}</div>
                    <div class="vote-item clearfix">
                        <div v-for="(item,key) in voteListReady[i]" :key="key">
                            <div v-if="typeof(item)=='object'" class="item">
                                <div class="img">
                                    <img :src="item.icon" alt class="icon" />
                                </div>
                                <div class="pull">{{item.ballot_num}}</div>
                                <div class="name">{{item.name}}</div>
                                <div class="btn">KURA</div>
                            </div>
                        </div>
                    </div>
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
            wordList: [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z'
            ],
            voteList: [],
            voteListWord: [[]],
            isload: false,
            vote_id: 16
        }
    },
    computed: {
        voteListReady() {
            if (this.isload) {
                console.log(this.voteListWord)
                return this.voteListWord
            } else {
                return []
            }
        }
    },
    created() {
        this.getVoteList()
    },
    mounted() {
        this.mSendEvLog('page_show', '', '')
        // console.log()
    },

    methods: {
        toWord(id) {
            document.getElementById(id).scrollIntoView()
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
        // 获取投票单元数据
        getVoteList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=${this.vote_id}`).then(res => {
                if (res.data.code === 0) {
                    this.voteList = res.data.data
                    this.voteList.sort(function(a, b) {
                        return b.ballot_num - a.ballot_num
                    })
                    console.log(this.voteList)
                    for (let w = 0; w < this.wordList.length; w++) {
                        this.voteListWord[w] = []
                        for (let i = 0; i < this.voteList.length; i++) {
                            if (this.voteList[i].name.toUpperCase().substr(0, 1) == this.wordList[w]) {
                                this.voteListWord[w][i] = this.voteList[i]
                            }
                        }
                    }
                } else {
                    this.voteList = []
                }
                this.isload = true
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
    color: #ffa415;
    color: #ff6d00;
    color: #ffc801;
    color: #cb6a01;
    color: #00701a;
    color: #00b721;
    color: #00b721;
    color: #03fa91;
    color: #8ad300;
    color: #fff;
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
                top: -2rem;
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
        .vote-box {
            width: 100%;
            position: relative;
            .index-box {
                position: fixed;
                right: 3%;
                top: 2rem;
                div {
                    width: 1.5rem;
                    height: 2rem;
                    line-height: 2rem;
                    text-align: center;
                    background-color: #fff;
                    border: 1px solid red;
                    color: #000;
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
                    font-size: 2rem;
                    font-weight: bold;
                }
                .vote-item {
                    width: 100%;
                    .item {
                        width: 30%;
                        float: left;
                        margin: 0 1.5% 1.3rem;
                        position: relative;
                        overflow: hidden;
                        border-radius: 0.6rem;
                        text-align: center;
                        color: #fff;
                        .img {
                            width: 100%;
                            position: relative;
                            .icon {
                                width: 100%;
                                // padding: 0.2rem 0.2rem 0;
                                height: 100%;
                                border-radius: 0.5rem;
                                position: absolute;
                                left: 0;
                                top: 0;
                            }
                            &:before {
                                content: '';
                                display: inline-block;
                                padding-bottom: 60%;
                                width: 0.1px;
                                vertical-align: middle;
                            }
                        }
                        .pull {
                            width: 100%;
                            height: 2rem;
                            line-height: 2rem;
                            position: absolute;
                            left: 0;
                            bottom: 2rem;
                            background-color: orange;
                        }
                        .name {
                            width: 100%;
                            margin: 0 auto;
                        }
                        .btn {
                            width: 80%;
                            margin: 0 auto;
                            background-color: orange;
                        }
                    }
                }
            }
        }
    }
}
</style>
