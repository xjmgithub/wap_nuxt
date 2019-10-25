<template>
    <div class="page-wrapper">
        <!-- 客户端或者浏览器端判断完开屏 -->
        <div v-if="!appType" class="download" @click="loadConfirm('download_tips')">Download StarTimes ON</div>
        <div class="topContain" :class="{'mtop':!appType}">
            <img src="~assets/img/vote/kenya.png" style="width:100%">
            <span class="about" @click="aboutCard = true">About</span>
            <div class="sticky">
                <nav id="nav">
                    <a v-for="(item,index) in tabList" :key="index" :class="{on:tabIndex===index}" @click="tabIndex=index">
                        <span>{{item}}</span>
                        <p />
                    </a>
                </nav>
            </div>
        </div>
        <div class="container">
            <div v-for="(item,index) in showDataList" :key="index" class="film-data">
                <p class="group">
                    <img src="~assets/img/vote/ic_Title.png">{{item.group_name}}
                    <span>Vote:{{item.ticket_num}}</span>
                </p>
                <ul>
                    <li v-for="(sub,si) in item.candidates" :key="si">
                        <div @click="toVideo(sub)">
                            <div class="pic">
                                <img :src="sub.icon">
                                <span>
                                    <img src="~assets/img/vote/ic_viewers_def_w.png"> {{sub.ballot_num | formatVotes}}
                                </span>
                            </div>
                            <p>{{sub.name}}</p>
                            <p>{{sub.brief}}</p>
                        </div>
                        <img v-show="sub.user_ballot_num<=0" src="~assets/img/vote/Button-vote.png" @click.prevent="handleVote(item.ticket_num,sub)">
                        <img v-show="sub.user_ballot_num>0" src="~assets/img/vote/Button-voted.png" @click.prevent="handleVote(item.ticket_num,sub)">
                    </li>
                </ul>
            </div>
        </div>
        <div v-show="appType!=2" ref="box" class="share-box" :style="{'left':left, 'top':top}" @click="toShare()" @touchstart="canMove=true" @touchmove.prevent="move" @touchend="canMove = false">
            <img src="~assets/img//vote/ic_Share.png">
        </div>
        <mCard v-show="aboutCard" :title="$store.state.lang.vote_about" class="card" @closeCard="aboutCard=false">
            <template v-slot:content>
                <div v-html="$store.state.lang.vote_about_word" />
            </template>
            <template v-if="appType==0" v-slot:buttons>
                <div class="download-btn" @click="loadConfirm('about')">
                    <p>{{$store.state.lang.vote_downloadbtn}}</p>
                    {{$store.state.lang.vote_downloadbtn_tips}}
                </div>
            </template>
        </mCard>
        <mCard v-show="shareCard" :title="$store.state.lang.vote_earnvote_tt" class="card" @closeCard="shareCard=false">
            <template v-slot:content>
                <div v-html="$store.state.lang.vote_rule_word" />
            </template>
            <template v-slot:buttons>
                <div class="share-way">
                    <span @click="shareWithFacebook">
                        <img src="~assets/img/vote/ic_facebook_def.png" />
                    </span>
                    <span @click="copyLink">
                        <img src="~assets/img/vote/ic_copylink_def copy.png" />
                    </span>
                    <span @click="shareWithTwitter">
                        <img src="~assets/img/vote/ic_ti_def.png" />
                    </span>
                </div>
                <div v-if="appType==0" class="download-btn" @click="loadConfirm('share')">
                    <p>{{$store.state.lang.vote_downloadbtn}}</p>
                    {{$store.state.lang.vote_downloadbtn_tips}}
                </div>
            </template>
        </mCard>
        <div v-show="voteSuccess" class="card-layer" />
        <div v-show="voteSuccess" class="vote-success">
            <img src="~assets/img/vote/ic_finish.png">
            <p>Vote Successful!</p>
            <div class="close-btn" @click="voteSuccess=false">
                <img src="~assets/img/vote/close_line.png"> CLOSE
            </div>
        </div>
    </div>
</template>
<script>
import mCard from '~/components/vote/card'
import { shareByFacebook, shareByTwitter, copyClipboard } from '~/functions/utils'
import { callApp, callMarket, shareInvite, downApk } from '~/functions/app'
import { Base64 } from 'js-base64'
import qs from 'qs'
export default {
    layout: 'base',
    components: {
        mCard
    },
    filters: {
        formatVotes(val) {
            return val.toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,')
        }
    },
    data() {
        return {
            appType: this.$store.state.appType || 0,
            tabList: ['Film', 'Televison', 'Special Awards'],
            tabIndex: 0,
            canMove: false,
            left: '',
            top: '',
            aboutCard: false,
            shareCard: false,
            voteSuccess: false,
            showDataList: [],
            voteTitle: 'KALASHA-PAOFF Film Festival'
        }
    },
    computed: {
        platform() {
            if (this.appType == 1) {
                return 'Android'
            } else if (this.appType == 2) {
                return 'iOS'
            } else {
                return 'web'
            }
        },
        voteId() {
            return this.tabIndex == 0 ? 18 : this.tabIndex == 1 ? 19 : this.tabIndex == 2 ? 20 : 18
        }
    },
    watch: {
        tabIndex(nv, ov) {
            const label = (nv == 0 && 'Film') || (nv == 1 && 'Televison') || (nv == 2 && 'Special Awards')
            this.mSendEvLog('tab_click', label)
            this.getAllList()
        },
        aboutCard(nv, ov) {
            if (nv) {
                document.body.style.overflow = 'hidden'
                document.body.style.position = 'fixed'
            } else {
                document.body.style.overflow = 'auto'
                document.body.style.position = 'static'
            }
        },
        shareCard(nv, ov) {
            if (nv) {
                document.body.style.overflow = 'hidden'
                document.body.style.position = 'fixed'
            } else {
                document.body.style.overflow = 'auto'
                document.body.style.position = 'static'
            }
        }
    },
    mounted() {
        this.mSendEvLog('homepage_show', 1)
        this.$nextTick(() => this.getAllList())
    },
    methods: {
        mSendEvLog(action, label = 1, value = 1) {
            this.sendEvLog({
                category: `vote_KenyaPAOFFVote_${this.platform}`,
                action: action,
                label: label,
                value: value
            })
        },
        handleVote(ticket, film) {
            this.mSendEvLog('votebtn_click', film.name)
            if (this.appType <= 0) {
                this.$confirm(
                    '	Open StarTimes ON App vote for your favorite content.',
                    () => {
                        this.callDownload('vote_btn')
                    },
                    () => {},
                    'OK',
                    'NOT NOW'
                )
                return
            }
            if (ticket <= 0) {
                this.$alert('You have already voted for this award. Please vote for other awards')
            } else {
                this.$axios({
                    url: '/voting/v1/ballot',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify({
                        candidate_id: film.id,
                        vote_id: this.voteId
                    })
                }).then(res => {
                    if (res.data.code === 0) {
                        this.voteSuccess = true
                        this.getAllList()
                    } else {
                        this.$toast(res.data.message)
                    }
                })
            }
        },
        toVideo(item) {
            this.mSendEvLog('votepic_click', item.name)
            const vod = item.link_vod_code
            if (vod && this.appType == 1) {
                window.getChannelId && window.getChannelId.toAppPage(3, 'com.star.mobile.video.player.PlayerVodActivity?vodId=' + vod, '')
            } else if (vod && this.appType == 2) {
                window.location.href = 'startimes://player?vodId=' + vod
            } else if (this.appType <= 0) {
                this.loadConfirm('vote_pic')
            }
        },
        callDownload(pos) {
            this.mSendEvLog('callApp', pos)
            callApp.call(this, `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin + window.location.pathname}`, () => {
                callMarket.call(this, () => {
                    this.mSendEvLog('downloadpopup_show', pos)
                    this.$confirm(
                        'Start downloading apk now?(12M)',
                        () => {
                            this.mSendEvLog('downloadpopup_clickok', pos)
                            downApk.call(this)
                        },
                        () => {
                            this.mSendEvLog('downloadpopup_clicknot', pos)
                        },
                        'OK',
                        'NOT NOW'
                    )
                })
            })
        },
        loadConfirm(pos) {
            this.shareCard = false
            this.aboutCard = false
            this.$confirm(
                'Open StarTimes ON App watch now,and explore more interesting.',
                () => {
                    this.callDownload(pos)
                },
                () => {},
                'OK',
                'NOT NOW'
            )
        },
        // 获取投票单元数据
        getAllList() {
            this.$nuxt.$loading.start()
            this.$axios
                .get(`/voting/v3/candidates-show?vote_id=${this.voteId}`)
                .then(res => {
                    this.$nuxt.$loading.finish()
                    if (res.data.code == 0) {
                        this.showDataList = res.data.data
                        this.sort()
                    } else {
                        this.$alert(this.$store.state.lang.error_network)
                    }
                })
                .catch(() => {
                    this.$nuxt.$loading.finish()
                    this.$alert(this.$store.state.lang.error_network)
                })
        },
        sort() {
            this.showDataList.forEach(item => {
                item.candidates.sort(function(a, b) {
                    if (b.ballot_num - a.ballot_num == 0) {
                        return a.index - b.index
                    } else {
                        return b.ballot_num - a.ballot_num
                    }
                })
            })
        },
        toShare() {
            this.mSendEvLog('share_click')
            if (this.appType === 1) {
                shareInvite(
                    `${window.location.href}?pin=${this.$store.state.user.id}&utm_source=VOTE&utm_medium=KenyaPAOFFVote&utm_campaign=${
                        this.platform
                    }`,
                    this.voteTitle,
                    this.$store.state.lang.vote_webshare_words,
                    'http://cdn.startimestv.com/banner/kenya.png'
                )
            } else if (this.appType === 0) {
                this.shareCard = true
            }
        },
        shareWithFacebook() {
            this.shareCard = false
            this.mSendEvLog('sharebtn_click', 'Facebook')
            shareByFacebook.call(this, window.location.origin + window.location.pathname)
        },
        copyLink() {
            this.shareCard = false
            this.mSendEvLog('sharebtn_click', 'copyLink')
            copyClipboard.call(this, window.location.origin + window.location.pathname)
        },
        shareWithTwitter() {
            this.shareCard = false
            this.mSendEvLog('sharebtn_click', 'Twitter')
            shareByTwitter.call(this, this.$store.state.lang.vote_appshare_words, window.location.origin + window.location.pathname)
        },
        move(event) {
            if (this.canMove) {
                let e
                if (event.touches) {
                    e = event.touches[0]
                } else {
                    e = event
                }
                const x = e.clientX - this.$refs.box.offsetWidth / 2
                const y = e.clientY - this.$refs.box.offsetHeight / 2
                const dw = document.body.clientWidth - this.$refs.box.offsetWidth
                const dh = document.body.clientHeight - this.$refs.box.offsetHeight
                if (x <= dw && x >= 0) {
                    this.left = x + 'px'
                } else if (x > dw) {
                    this.left = dw + 'px'
                } else {
                    this.left = 0
                }
                if (y <= dh && y >= 0) {
                    this.top = y + 'px'
                } else if (y > dh) {
                    this.top = dh + 'px'
                } else if (y < 0) {
                    this.top = 0
                }
            }
        }
    },
    head() {
        return {
            title: this.voteTitle,
            meta: [
                { name: 'description', property: 'description', content: this.$store.state.lang.vote_appshare_words },
                { name: 'og:description', property: 'og:description', content: this.$store.state.lang.vote_appshare_words },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: 'http://cdn.startimestv.com/banner/kenya.png'
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: this.voteTitle },
                {
                    name: 'al:android:url',
                    property: 'al:android:url',
                    content:
                        'starvideo://platformapi/webtoapp?channel=facebook&target=' +
                        Base64.encode(
                            `com.star.mobile.video.activity.BrowserActivity?loadUrl=http://m.startimestv.com/hybrid/vote/FilmKenya`.replace(
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
html {
    font-size: 20px;
    body {
        margin: 0;
        padding: 0;
        background-color: #000000;
        .page-wrapper {
            height: 100%;
            min-height: 100vh;
            margin: 0 auto;
            background-color: #000000;
        }
    }
    .download {
        position: fixed;
        top: 0;
        z-index: 99;
        width: 100%;
        text-align: center;
        background: #eeeeee;
        color: #333333;
        font-size: 0.9rem;
        height: 1.5rem;
        line-height: 1.5rem;
        font-weight: bold;
    }
    .topContain {
        position: relative;
        .about {
            color: #988c67;
            border: 1px solid rgba(152, 140, 103, 1);
            border-radius: 9px;
            font-size: 0.9rem;
            height: 1.2rem;
            padding: 0 0.5rem;
            position: absolute;
            right: 0.8rem;
            top: 0.8rem;
        }
        #nav {
            height: 2.4rem;
            background: #000000;
            padding: 0.4rem 0;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            a {
                text-align: center;
                height: 1.6rem;
                line-height: 1.6rem;
                width: 33.33%;
                color: #99844e;
                display: block;
                float: left;
                font-weight: 600;
                text-shadow: 1px 2px 0px rgba(0, 0, 0, 0.5);
                font-size: 0.92rem;
                p {
                    width: 100%;
                    height: 0.2rem;
                    background: rgba(153, 132, 78, 0.1);
                }
                &:link,
                &:active,
                &:visited,
                &:hover {
                    background: none;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                }
                &.on {
                    color: #ffdc82;
                    p {
                        background: linear-gradient(90deg, rgba(153, 132, 78, 0.1) 0%, rgba(255, 220, 130, 1) 50%, rgba(153, 132, 78, 0.1) 100%);
                    }
                }
            }
        }
        &.mtop {
            margin-top: 1.5rem;
        }
    }
    .container {
        background: url('~assets/img/vote/kenya_bg.png');
        background-size: 100%;
        padding-bottom: 2rem;
        .film-data {
            padding: 1.5rem 0 0 1rem;
            .group {
                color: #99844e;
                font-weight: bold;
                margin-bottom: 0.8rem;
                padding-right: 0.8rem;
                img {
                    width: 1.1rem;
                    height: 1.1rem;
                    margin-right: 0.3rem;
                    vertical-align: text-bottom;
                }
                span {
                    float: right;
                    color: rgba(255, 255, 255, 0.8);
                    font-weight: normal;
                }
            }
            ul {
                overflow-x: auto;
                white-space: nowrap;
                width: 100%;
                &::-webkit-scrollbar {
                    display: none;
                }
                li {
                    width: 40%;
                    display: inline-block;
                    margin-right: 0.7rem;
                    div.pic {
                        position: relative;
                        width: 100%;
                        &:before {
                            content: '';
                            display: inline-block;
                            padding-bottom: 56%;
                            width: 0.1px;
                            vertical-align: middle;
                        }
                        & > img {
                            width: 100%;
                            position: absolute;
                            height: 100%;
                            border-radius: 2px;
                        }
                        span {
                            position: absolute;
                            left: 0;
                            bottom: 0;
                            color: rgba(255, 255, 255, 0.8);
                            font-size: 0.8rem;
                            padding-right: 0.3rem;
                            background: rgba(0, 0, 0, 0.6);
                            border-radius: 2px;
                            img {
                                width: 1.2rem;
                                height: 1.2rem;
                                vertical-align: bottom;
                            }
                        }
                    }
                    p {
                        color: #aaaaaa;
                        font-size: 0.85rem;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        margin: 0.2rem 0;
                    }
                    & > img {
                        width: 4rem;
                    }
                }
            }
        }
    }

    .share-box {
        width: 4rem;
        height: 4rem;
        position: fixed;
        bottom: 3rem;
        right: 1.5rem;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .card {
        .share-btn {
            width: 70%;
            margin: 0 auto;
            color: #ffffff;
            height: 2.5rem;
            line-height: 2.5rem;
            background: #bc9525;
            font-size: 0.8rem;
            text-align: center;
            border-radius: 3px;
        }
        .download-btn {
            margin-top: 1rem;
            text-align: center;
            color: #979797;
            font-size: 0.88rem;
            p {
                color: #0087eb;
                margin: 0;
            }
        }
        .share-way {
            width: 95%;
            margin: 0 auto;
            text-align: center;
            span {
                display: inline-block;
                width: 30%;
                &:nth-child(2) {
                    margin: 0 2%;
                }
                img {
                    width: 65%;
                }
            }
        }
    }
    .card-layer {
        width: 100%;
        height: 100%;
        min-height: 100vh;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 998;
        background: rgba(0, 0, 0, 0.3);
    }
    .vote-success {
        width: 17rem;
        height: 13rem;
        line-height: 1.2rem;
        position: fixed;
        overflow: hidden;
        top: 50%;
        left: 50%;
        margin-left: -8.5rem;
        margin-top: -6.5rem;
        z-index: 999;
        border-radius: 4px;
        background: #ffffff url('~assets/img/vote/close_bg.png') no-repeat;
        background-size: 100%;
        p {
            color: #333333;
            font-weight: bold;
            text-align: center;
            margin-bottom: 1.5rem;
            height: 1rem;
        }
        & > img {
            display: block;
            margin: 2rem auto 1rem;
            width: 5rem;
        }
        .close-btn {
            img {
                width: 100%;
                height: 2px;
                display: block;
            }
            width: 100%;
            height: 2.5rem;
            text-align: center;
            line-height: 2.3rem;
            color: #99844e;
            background: #d8d8d8;
            font-weight: bold;
        }
    }
}
</style>
