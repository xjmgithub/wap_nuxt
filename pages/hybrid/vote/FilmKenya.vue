<template>
    <div class="page-wrapper">
        <!-- 客户端或者浏览器端判断完开屏 -->
        <div v-if="!appType" class="download" @onload="downloadBanner">Download StarTimes ON</div>
        <div class="topContain" :class="{'mtop':!appType}">
            <mVoteSwiper v-if="banners.length" :banners="banners" :name="voteTitle" />
            <img src="~assets/img/vote/kenya.png" style="width:100%">
            <!-- <span class="about" @click="aboutCard = true">about</span> -->
            <span class="about" @click="voteSuccess = true">about</span>
            <div class="sticky">
                <nav id="nav">
                    <a v-for="(item,index) in tabList" :key="index" :class="{on:tabIndex===index}" @click="getData(index)">
                        <span>{{item}}</span>
                        <p />
                    </a>
                </nav>
            </div>
        </div>
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
                            <span>{{sub.ballot_num | formatVotes}}</span>
                        </div>
                        <p>{{sub.name}}</p>
                        <p>{{sub.brief}}</p>
                    </div>
                    <img v-show="sub.user_ballot_num<=0" src="~assets/img/vote/Button-vote.png" @click.prevent="handleViceVote(item)">
                    <img v-show="sub.user_ballot_num>0" src="~assets/img/vote/Button-voted.png" @click.prevent="handleViceVote(item)">
                </li>
            </ul>
        </div>
        <div v-show="appType!=2" ref="box" class="share-box" :style="{'left':left, 'top':top}" @click="toShare()" @touchstart="canMove=true" @touchmove.prevent="move" @touchend="canMove = false">
            <div class="share">{{$store.state.lang.vote_share}}</div>
        </div>
        <mCard v-show="aboutCard" :title="$store.state.lang.vote_about" class="card" @closeCard="aboutCard=false">
            <template v-slot:content>
                <div v-html="$store.state.lang.vote_about_word" />
            </template>
            <template v-if="appType==0" v-slot:buttons>
                <div class="download-btn" @click="loadConfirm('','about')">
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
                <div v-if="appType==0" class="download-btn" @click="loadConfirm('','share')">
                    <p>{{$store.state.lang.vote_downloadbtn}}</p>
                    {{$store.state.lang.vote_downloadbtn_tips}}
                </div>
            </template>
        </mCard>
        <div v-show="voteSuccess" class="vote-success">
            <img src="~assets/img/vote/ic_finish.png">
            <div class="line" />
            <div class="close-btn" @click="voteSuccess=false">CLOSE</div>
        </div>
    </div>
</template>
<script>
import mVoteSwiper from '~/components/vote/vote_swiper'
import mCard from '~/components/vote/card'
import { shareByFacebook, shareByTwitter, copyClipboard } from '~/functions/utils'
import { callApp, callMarket, shareInvite, downApk } from '~/functions/app'
import { Base64 } from 'js-base64'
import qs from 'qs'
export default {
    layout: 'base',
    components: {
        mVoteSwiper,
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
            tabList: ['film', 'Televison', 'Special Awards'],
            tabIndex: 0,
            canMove: false,
            left: '',
            top: '',
            aboutCard: false,
            shareCard: false,
            voteSuccess: false,
            leftVote: 0,
            ipMax: false,
            showDataList: [
                {
                    group_name: 'Best Lead Actor',
                    ticket_num: '0',
                    candidates: [
                        {
                            name: 'The Missing God',
                            brief: 'Ubaka Joseph Ugochukwu',
                            ballot_num: '132412',
                            user_ballot_num: '0',
                            icon: 'http://cdn.startimestv.com/banner/The-Missing-God%28PAOFF-M%29_2.jpg'
                        },
                        {
                            name: 'Blood Dinner',
                            brief: 'Emmanuel Akaemeh',
                            ballot_num: '74665',
                            user_ballot_num: '1',
                            icon: 'http://cdn.startimestv.com/banner/Blood-Dinner%28PAOFF-M%29_2.jpg'
                        },
                        {
                            name: 'The Missing God',
                            brief: 'Ubaka Joseph Ugochukwu',
                            ballot_num: '132412',
                            user_ballot_num: '0',
                            icon: 'http://cdn.startimestv.com/banner/Aftermath%28PAOFF-M%29_2.jpg'
                        },
                        {
                            name: 'Blood Dinner',
                            brief: 'Emmanuel Akaemeh',
                            ballot_num: '74665',
                            user_ballot_num: '0',
                            icon: 'http://cdn.startimestv.com/banner/So-In-Love%28PAOFF-M%29_2.jpg'
                        },
                        {
                            name: 'Blood Dinner',
                            brief: 'Emmanuel Akaemeh',
                            ballot_num: '74665',
                            user_ballot_num: '0',
                            icon: 'http://cdn.startimestv.com/banner/UNwheel%28PAOFF-M%29_2.jpg'
                        }
                    ]
                },
                {
                    group_name: 'Best Supporting Actor',
                    ticket_num: '0',
                    candidates: [
                        {
                            name: 'The Missing God',
                            brief: 'Ubaka Joseph Ugochukwu',
                            ballot_num: '132412',
                            user_ballot_num: '1',
                            icon: 'http://cdn.startimestv.com/banner/Mide%20Martins.png'
                        },
                        {
                            name: 'Blood Dinner',
                            brief: 'Emmanuel Akaemeh',
                            ballot_num: '74665',
                            user_ballot_num: '0',
                            icon: 'http://cdn.startimestv.com/banner/Charles%20Okocha.png'
                        },
                        {
                            name: 'The Missing God',
                            brief: 'Ubaka Joseph Ugochukwu',
                            ballot_num: '132412',
                            user_ballot_num: '0',
                            icon: 'http://cdn.startimestv.com/banner/Nkechi%20Blessing%20Sunday.png'
                        },
                        {
                            name: 'Blood Dinner',
                            brief: 'Emmanuel Akaemeh',
                            ballot_num: '74665',
                            user_ballot_num: '0',
                            icon: 'http://cdn.startimestv.com/banner/Yakubu%20Mohammed.png'
                        }
                    ]
                }
            ]
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
        }
    },
    watch: {
        tabIndex(nv, ov) {
            this.sendEvLog({
                category: `vote_${this.voteTitle}_${this.platform}`,
                action: 'tab_click',
                label: (nv == 0 && 'film') || (nv == 1 && 'short film') || (nv == 2 && 'MV'),
                value: 1
            })
        }
    },
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
                voteTitle: data.data.name
            }
        } catch (e) {
            return {
                banners: [],
                vote_sign: (req && req.headers.vote_sign) || '',
                voteTitle: 'Pan Africa Online Film Festival'
            }
        }
    },
    mounted() {
        this.getAllList(18) // 获取投票单元
    },
    methods: {
        getData(index) {
            this.tabIndex = index
            switch (index) {
                case 0:
                    this.getAllList(18)
                    break
                case 1:
                    this.getAllList(19)
                    break
                case 2:
                    this.getAllList(20)
                    break
            }
        },
        handleVote(film) {
            if (film.state === -1) {
                this.$toast(this.$store.state.lang.vote_notstart_btn)
                return
            }
            if (this.appType <= 0) {
                this.loadConfirm(1, 'vote')
                return
            }

            if (this.leftVote <= 0) {
                if (this.appType == 1) {
                    this.$confirm(
                        this.$store.state.lang.vote_fail + this.$store.state.lang.vote_success_0,
                        () => {
                            this.toShare('votefail')
                        },
                        () => {},
                        this.$store.state.lang.vote_share,
                        this.$store.state.lang.vote_cancel
                    )
                } else if (this.appType == 2) {
                    this.$alert(this.$store.state.lang.vote_fail, () => {}, this.$store.state.lang.vote_ok)
                }
            } else {
                this.$axios({
                    url: '/voting/v1/ballot',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify({
                        candidate_id: film.id,
                        vote_id: 8
                    })
                }).then(res => {
                    if (res.data.code === 0) {
                        this.getAllList()
                        this.leftVote--
                        if (this.leftVote < 1 && this.appType == 1) {
                            this.$confirm(
                                this.$store.state.lang.vote_success + this.$store.state.lang.vote_success_0,
                                () => {
                                    this.toShare('0leftvote')
                                },
                                () => {},
                                this.$store.state.lang.vote_share,
                                this.$store.state.lang.vote_cancel
                            )
                        } else if (this.leftVote < 1 && this.appType == 2) {
                            this.$alert(this.$store.state.lang.vote_success, () => {}, this.$store.state.lang.vote_ok)
                        } else {
                            this.$toast(this.$store.state.lang.vote_success + this.$store.state.lang.vote_leftvote + ':' + this.leftVote)
                        }
                    } else {
                        this.$toast(res.data.message)
                    }
                })
            }
        },
        toVideo(item) {
            this.$confirm(
                'Open StarTimes ON App watch now,and explore more interesting.',
                () => {
                    const vod = item.link_vod_code
                    if (vod && this.appType > 0) {
                        if (this.appType == 1) {
                            window.getChannelId && window.getChannelId.toAppPage(3, 'com.star.mobile.video.player.PlayerVodActivity?vodId=' + vod, '')
                        } else if (this.appType == 2) {
                            window.location.href = 'startimes://player?vodId=' + vod
                        }
                    } else if (this.appType <= 0) {
                        this.loadConfirm(1, 'pic') // TODO 差一个pos
                    }
                },
                () => {},
                'OK',
                'NOT NOW'
            )
        },
        loadConfirm(vote, pos) {
            callApp.call(this, `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin + window.location.pathname}`, () => {
                this.aboutCard = false
                this.shareCard = false
                if (vote) {
                    this.$confirm(
                        this.$store.state.lang.vote_webshare_words,
                        () => {
                            callMarket.call(this, () => {
                                downApk.call(this)
                            })
                        },
                        () => {},
                        this.$store.state.lang.download_apk,
                        this.$store.state.lang.vote_cancel
                    )
                } else {
                    callMarket.call(this, () => {
                        downApk.call(this)
                    })
                }
            })
        },
        downloadBanner() {
            this.$nuxt.$loading.start()
            callApp.call(this, `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin + window.location.pathname}`, () => {
                this.aboutCard = false
                callMarket.call(this, () => {
                    downApk.call(this)
                })
            })
        },

        // 获取投票单元数据
        getAllList(id) {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=${id}`).then(res => {
                if (res.data.data.length > 0) {
                    this.showDataList = res.data.data
                    this.sort(this.showDataList)
                }
            })
        },
        sort(list) {
            list.sort(function(a, b) {
                if (b.ballot_num - a.ballot_num == 0) {
                    return a.index - b.index
                } else {
                    return b.ballot_num - a.ballot_num
                }
            })
        },
        toShare(pos) {
            if (this.appType === 1) {
                shareInvite(
                    `${window.location.href}?pin=${this.$store.state.user.id}&utm_source=VOTE&utm_medium=PAOFF&utm_campaign=${this.platform}`,
                    this.voteTitle,
                    this.$store.state.lang.vote_webshare_words,
                    this.banners.length > 0 ? this.banners[0].materials : ''
                )
            } else if (this.appType === 0) {
                this.shareCard = true
            }
        },
        shareWithFacebook() {
            this.shareCard = false
            shareByFacebook.call(this, window.location.origin + window.location.pathname)
        },
        copyLink() {
            this.shareCard = false
            copyClipboard.call(this, window.location.origin + window.location.pathname)
        },
        shareWithTwitter() {
            this.shareCard = false
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
                    content: this.banners.length > 0 && this.banners[0].materials.replace('http:', 'https:')
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: this.voteTitle },
                {
                    name: 'al:android:url',
                    property: 'al:android:url',
                    content:
                        'starvideo://platformapi/webtoapp?channel=facebook&target=' +
                        Base64.encode(
                            `com.star.mobile.video.activity.BrowserActivity?loadUrl=http://m.startimestv.com/hybrid/vote/FilmFestival`.replace(
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
            line-height: 1.2rem;
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
                        background: linear-gradient(90deg, rgba(152, 140, 103, 0) 0%, rgba(255, 220, 130, 1) 50%, rgba(152, 140, 103, 0) 100%);
                    }
                }
            }
        }
        &.mtop {
            margin-top: 1.5rem;
        }
    }
    .film-data {
        padding: 1rem 0 0 1rem;
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
                color: #ffffff;
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
                width: 9rem;
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
                    img {
                        width: 100%;
                        position: absolute;
                        height: 100%;
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
    .share-box {
        width: 5rem;
        height: 5rem;
        position: fixed;
        bottom: 3rem;
        right: 1.5rem;
        box-sizing: border-box;
        padding: 0.25rem;
        border-radius: 100%;
        background: linear-gradient(42deg, rgba(201, 162, 43, 1), rgba(185, 147, 30, 1), rgba(255, 249, 230, 1));
        .share {
            width: 100%;
            height: 100%;
            line-height: 4.5rem;
            text-align: center;
            color: #000000;
            font-size: 0.85rem;
            font-weight: bold;
            border-radius: 100%;
            z-index: 10;
            background: #fac868;
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
        background: #ffffff;
        border-radius: 4px;
        img {
            display: block;
            margin: 0 auto;
            width: 5rem;
        }
        .line {
            background: linear-gradient(90deg, rgba(152, 140, 103, 0) 0%, rgba(255, 220, 130, 1) 50%, rgba(152, 140, 103, 0) 100%);
            width: 100%;
            height: 2px;
        }
        .close-btn {
            width: 100%;
            height: 2rem;
            text-align: center;
            line-height: 1.8rem;
            color: #99844e;
            background: #d8d8d8;
        }
    }
}
</style>
