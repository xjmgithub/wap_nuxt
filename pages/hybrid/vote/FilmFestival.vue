<template>
    <div class="page-wrapper">
        <!-- 客户端或者浏览器端判断完开屏 -->
        <div v-show="appType||mounted">
            <download v-if="!appType" class="clearfix filmload" @onload="downloadBanner" />
            <div class="topContain" :class="{'mtop':!appType}">
                <mVoteSwiper v-if="banners.length" :banners="banners" :name="voteTitle" />
                <div class="sticky">
                    <div class="rules">
                        <span @click="aboutCard = true">{{$store.state.lang.vote_about}}</span>
                        <span @click="rulesCard = true">{{$store.state.lang.vote_voterules}}</span>
                    </div>
                    <nav id="nav">
                        <a v-for="(item,index) in tabList" :key="index" :class="{on:tabIndex===index}" @click="tabIndex=index">
                            <span>{{item.name}}</span>
                            <p />
                        </a>
                    </nav>
                    <div v-if="appType" class="leftvote">
                        <span>{{$store.state.lang.vote_leftvote}}:{{leftVote}}</span>
                    </div>
                </div>
            </div>
            <template v-for="(item,index) in tabList">
                <sFilm v-if="item.type=='film'" v-show="tabIndex==index" :key="index" :data-list="filmList" @onVote="handleVote" @toPlay="toVideo" />
                <sFilm
                    v-if="item.type=='short_film'"
                    v-show="tabIndex==index"
                    :key="index"
                    :data-list="sFilmList"
                    @onVote="handleVote"
                    @toPlay="toVideo"
                />
                <mFilm v-if="item.type=='mv'" v-show="tabIndex==index" :key="index" :data-list="mvList" @onVote="handleVote" @toPlay="toVideo" />
            </template>
            <div
                v-show="appType!=2"
                ref="box"
                class="share"
                :style="{'left':left, 'top':top}"
                @click="toShare()"
                @touchstart="canMove=true"
                @touchmove.prevent="move"
                @touchend="canMove = false"
            >{{$store.state.lang.vote_share}}</div>
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
            <mCard v-show="rulesCard" :title="$store.state.lang.vote_voterules" class="card" @closeCard="rulesCard=false">
                <template v-slot:content>
                    <div v-html="$store.state.lang.vote_rule_word" />
                </template>
                <template v-slot:buttons>
                    <div v-if="appType==1" class="share-btn" @click="toShare('voterules')">{{$store.state.lang.vote_sharebtn}}</div>
                    <div v-if="appType==0" class="download-btn" @click="loadConfirm('','rules')">
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
            <div v-show="showMore&&filmList.length>0" class="more" :style="{'bottom':0}" @click="loadMore">
                <span>{{$store.state.lang.vote_view_more}}</span>
            </div>
        </div>
        <div v-if="!appType&&mounted" class="open" :class="{showd:openPicShowd}">
            <div class="top">
                <img src="~assets/img/vote/open_top.png" @load="screenTimer" />
                <p>
                    <span v-show="time<5">{{time}}s</span>
                    <span @click="setVoteScreen('about')">{{$store.state.lang.vote_about}}</span>
                </p>
                <div class="btn" @click="setVoteScreen">{{$store.state.lang.vote_join_now}}</div>
            </div>
            <div class="bot">
                <img src="~assets/img/vote/open_bot.png" />
            </div>
        </div>
    </div>
</template>
<script>
import mVoteSwiper from '~/components/vote/vote_swiper'
import mFilm from '~/components/vote/film'
import sFilm from '~/components/vote/short_film'
import mCard from '~/components/vote/card'
import { setCookie, getCookie, shareByFacebook, shareByTwitter, copyClipboard } from '~/functions/utils'
import { callApp, callMarket, shareInvite, downApk } from '~/functions/app'
import download from '~/components/vote/download'
import { Base64 } from 'js-base64'
import qs from 'qs'
export default {
    layout: 'base',
    components: {
        mFilm,
        sFilm,
        mVoteSwiper,
        mCard,
        download
    },
    data() {
        return {
            appType: this.$store.state.appType || 0,
            tabList: [
                {
                    name: this.$store.state.lang.vote_tab_film,
                    type: 'film'
                },
                {
                    name: this.$store.state.lang.vote_tab_shortfilm,
                    type: 'short_film'
                },
                {
                    name: this.$store.state.lang.vote_tab_mv,
                    type: 'mv'
                }
            ],
            tabIndex: 0,
            canMove: false,
            left: '',
            top: '',
            aboutCard: false,
            rulesCard: false,
            shareCard: false,
            showMore: true,
            filmList: [],
            sFilmList: [],
            mvList: [],
            time: 5,
            openPicShowd: false,
            mounted: false,
            leftVote: 0,
            ipMax: false
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
        },
        aboutCard(nv, ov) {
            document.body.style.overflow = nv ? 'hidden' : 'auto'
            if (nv) {
                const t = document.body.scrollTop
                document.body.style.position = 'fixed'
                document.body.style.top = -t + 'px'
            } else {
                const t1 = document.body.style.top
                document.body.style.position = 'static'
                window.scrollTo(0, -parseInt(t1))
            }
        },
        rulesCard(nv, ov) {
            document.body.style.overflow = nv ? 'hidden' : 'auto'
            if (nv) {
                const t = document.body.scrollTop
                document.body.style.position = 'fixed'
                document.body.style.top = -t + 'px'
            } else {
                const t1 = document.body.style.top
                document.body.style.position = 'static'
                window.scrollTo(0, -parseInt(t1))
            }
        },
        shareCard(nv, ov) {
            document.body.style.overflow = nv ? 'hidden' : 'auto'
            if (nv) {
                const t = document.body.scrollTop
                document.body.style.position = 'fixed'
                document.body.style.top = -t + 'px'
            } else {
                const t1 = document.body.style.top
                document.body.style.position = 'static'
                window.scrollTo(0, -parseInt(t1))
            }
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
        this.sendEvLog({
            category: `vote_${this.voteTitle}_${this.platform}`,
            action: 'homepage_show',
            label: '',
            value: 1
        })

        if (this.appType > 0) {
            this.$axios({
                url: '/voting/v1/ticket/sign-in',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    vote_id: 8
                })
            })
                .then(res => {
                    this.leftVote = res.data.data || 0
                    this.ipMax = res.data.code == -5 && this.leftVote == 0
                    if (this.ipMax) {
                        this.$alert('The votes have been issued today, come back tomorrow.')
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }

        this.getAllList() // 获取投票单元

        this.mounted = true
        this.openPicShowd = getCookie('vote_screen_8') // 是否显示过开屏
        this.$route.query.pin && setCookie('vote_share_user', this.$route.query.pin) // 分享源用户记录
        !getCookie('vote_share_down') && setCookie('vote_share_down', this.vote_sign) // 是否点击过下载

        if (!this.openPicShowd) {
            this.sendEvLog({
                category: `vote_${this.voteTitle}_${this.platform}`,
                action: 'screen_show',
                label: '',
                value: 1
            })
        }

        this.$nextTick(() => {
            if (this.banners.length <= 0) {
                document.querySelector('.sticky').classList.add(this.appType ? 'fixed1' : 'fixed2') // 没有banner顶部自动吸顶
                if (this.appType) {
                    document.querySelector('.topContain').setAttribute('style', 'padding-bottom:7.2rem')
                } else {
                    document.querySelector('.topContain').setAttribute('style', 'padding-bottom:6rem')
                }
            }
        })

        document.addEventListener('scroll', () => {
            this.showMore = false
            const bannerContain = document.querySelector('.wh_content')
            if (bannerContain) {
                const stickyTop = bannerContain.getBoundingClientRect().bottom
                const h = document.querySelector('.rules').offsetHeight
                const dh = (!this.appType && document.querySelector('.filmload').offsetHeight) || 0
                const className = dh == 0 ? 'fixed1' : 'fixed2'
                if (stickyTop - dh - h <= 0) {
                    document.querySelector('.sticky').classList.add(className)
                } else {
                    document.querySelector('.sticky').classList.remove(className)
                }
            }
        })
    },
    methods: {
        screenTimer() {
            this.time--
            const t = setInterval(() => {
                if (this.time <= 0) {
                    clearInterval(t)
                    this.setVoteScreen()
                    return
                }
                this.time--
            }, 1000)
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

            this.sendEvLog({
                category: `vote_${this.voteTitle}_${this.platform}`,
                action: 'votebtn_click',
                label: film.name,
                value: 1
            })

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
            const vod = item.link_vod_code
            this.sendEvLog({
                category: `vote_${this.voteTitle}_${this.platform}`,
                action: 'votepic_click',
                label: item.name,
                value: 1
            })

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
        loadConfirm(vote, pos) {
            this.sendEvLog({
                category: `vote_${this.voteTitle}_${this.platform}`,
                action: 'callApp',
                label: pos,
                value: 1
            })
            callApp.call(this, `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin + window.location.pathname}`, () => {
                this.rulesCard = false
                this.aboutCard = false
                this.shareCard = false
                if (vote) {
                    this.sendEvLog({
                        category: `vote_${this.voteTitle}_${this.platform}`,
                        action: 'downloadpopup_show',
                        label: pos || '',
                        value: 1
                    })
                    this.$confirm(
                        this.$store.state.lang.vote_webshare_words,
                        () => {
                            this.sendEvLog({
                                category: `vote_${this.voteTitle}_${this.platform}`,
                                action: 'downloadpopup_clickok',
                                label: pos,
                                value: 1
                            })
                            this.sendEvLog({
                                category: `vote_${this.voteTitle}_${this.platform}`,
                                action: 'toMarket',
                                label: pos,
                                value: 1
                            })
                            callMarket.call(this, () => {
                                downApk.call(this)
                            })
                        },
                        () => {
                            this.sendEvLog({
                                category: `vote_${this.voteTitle}_${this.platform}`,
                                action: 'downloadpopup_clicknot',
                                label: pos,
                                value: 1
                            })
                        },
                        this.$store.state.lang.download_apk,
                        this.$store.state.lang.vote_cancel
                    )
                } else {
                    this.sendEvLog({
                        category: `vote_${this.voteTitle}_${this.platform}`,
                        action: 'toMarket',
                        label: pos,
                        value: 1
                    })
                    callMarket.call(this, () => {
                        downApk.call(this)
                    })
                }
            })
        },
        downloadBanner() {
            this.sendEvLog({
                category: `vote_${this.voteTitle}_${this.platform}`,
                action: 'callApp',
                label: 'download_tips',
                value: 1
            })
            this.$nuxt.$loading.start()
            callApp.call(this, `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin + window.location.pathname}`, () => {
                this.rulesCard = false
                this.aboutCard = false
                this.sendEvLog({
                    category: `vote_${this.voteTitle}_${this.platform}`,
                    action: 'toMarket',
                    label: 'download_tips',
                    value: 1
                })
                callMarket.call(this, () => {
                    downApk.call(this)
                })
            })
        },
        loadMore() {
            window.scrollBy(0, document.body.clientHeight) // 向下滚动一屏
        },
        setVoteScreen(type) {
            if (type == 'about') this.aboutCard = true
            setCookie('vote_screen_8', true)
            this.openPicShowd = true
        },
        // 获取投票单元数据
        getAllList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=8`).then(res => {
                if (res.data.data.length > 0) {
                    this.filmList = []
                    this.sFilmList = []
                    this.mvList = []
                    const data = res.data.data
                    data.forEach(ele => {
                        if (ele.type === 'FILM') {
                            this.filmList.push(ele)
                        } else if (ele.type === 'SHORT_FILM') {
                            this.sFilmList.push(ele)
                        } else if (ele.type === 'MV') {
                            this.mvList.push(ele)
                        }
                    })
                    this.sort(this.filmList)
                    this.sort(this.sFilmList)
                    this.sort(this.mvList)
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
            this.sendEvLog({
                category: `vote_${this.voteTitle}_${this.platform}`,
                action: 'share_click',
                label: pos || '',
                value: 1
            })

            if (this.appType === 1) {
                this.rulesCard = false
                shareInvite(
                    `${window.location.href}?pin=${this.$store.state.user.id}&utm_source=VOTE&utm_medium=PAOFF&utm_campaign=${this.platform}`,
                    this.voteTitle,
                    this.$store.state.lang.vote_webshare_words,
                    this.banners.length > 0 ? this.banners[0].materials : ''
                )
            } else if (this.appType === 0) {
                this.rulesCard = false
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
                    content: this.banners.length > 0 && this.banners[0].materials
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
        background-color: #4e4e4e;
        .page-wrapper {
            height: 100%;
            min-height: 100vh;
            margin: 0 auto;
            background-color: #4e4e4e;
        }
    }
    .filmload {
        top: 0;
        z-index: 11;
    }

    .topContain {
        padding-bottom: 4.8rem; /* 2.4 + 2.4 */
        position: relative;
        .sticky {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 7.2rem; /* 2.4 + 2.4 + 2.4 */
            z-index: 1;

            .rules {
                height: 2.4rem;
                line-height: 2.4rem;
                background: linear-gradient(360deg, rgba(0, 0, 0), rgba(0, 0, 0, 0.1));
                font-size: 0.9rem;
                color: #ffffff;
                width: 100%;
                span {
                    display: inline-block;
                    text-align: center;
                    width: 33.33%;
                    text-decoration: underline;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            #nav {
                height: 2.4rem;
                background: linear-gradient(to bottom, #9d802a, #c9ab6f);
                padding: 0.4rem 0;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                a {
                    text-align: center;
                    height: 1.6rem;
                    line-height: 1.6rem;
                    width: 33.33%;
                    color: #ffe189;
                    display: block;
                    float: left;
                    font-weight: 600;
                    text-shadow: 1px 2px 0px rgba(0, 0, 0, 0.5);
                    font-size: 0.92rem;
                    &:link,
                    &:active,
                    &:visited,
                    &:hover {
                        background: none;
                        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                    }
                    &:nth-child(2) {
                        border-right: 1px solid rgba(255, 255, 210, 0.5);
                        border-left: 1px solid rgba(255, 255, 210, 0.5);
                    }
                    &.on {
                        color: #ffffff;
                        p {
                            width: 1.5rem;
                            height: 0.2rem;
                            background: #ffffff;
                            border-radius: 3px;
                            margin: 0 auto;
                        }
                    }
                }
            }
            .leftvote {
                padding-right: 0.8rem;
                height: 2.4rem;
                line-height: 2.4rem;
                background: linear-gradient(to bottom, #000000, #4e4e4e);
                font-size: 0.95rem;
                color: #ffffff;
                text-align: right;
            }

            &.fixed1 {
                position: fixed;
                top: 0;
                .rules {
                    background: black;
                }
            }
            &.fixed2 {
                position: fixed;
                top: 4rem;
                .rules {
                    background: black;
                }
            }
        }

        &.mtop {
            margin-top: 4rem;
            padding-bottom: 3.6em; /* 2.4 + 1.2 */
            .sticky {
                height: 6rem; /* 2.4 + 2.4 + 1.2 */
            }
        }
    }
    .share {
        width: 5rem;
        height: 5rem;
        text-align: center;
        color: #666666;
        font-size: 0.65rem;
        font-weight: bold;
        position: fixed;
        bottom: 3rem;
        right: 1.5rem;
        border-radius: 100%;
        line-height: 5rem;
        background: url('~assets/img/vote/share.png') no-repeat center;
        background-size: cover;
        color: white;
        box-shadow: 0.6rem 0.6rem 0.6rem #222323;
        z-index: 10;
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
    .more {
        position: absolute;
        width: 100%;
        text-align: center;
        background: linear-gradient(180deg, rgba(78, 78, 78, 0) 0%, rgba(78, 78, 78, 1) 72%, rgba(78, 78, 78, 1) 100%);
        height: 3.8rem;
        line-height: 6rem;
        font-size: 0.8rem;
        span {
            color: white;
            animation-timing-function: ease-in-out;
            animation-name: breathe;
            animation-duration: 1000ms;
            animation-iteration-count: infinite;
            animation-direction: alternate;
        }
    }
    @keyframes breathe {
        0% {
            opacity: 0.3;
            text-shadow: 0px 0px 0px;
        }

        100% {
            opacity: 1;
            text-shadow: 0px 0px 10px;
        }
    }
}

.open {
    z-index: 100;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    position: fixed;
    left: 0;
    bottom: 0;
    background: #000000;
    transition: transform 400ms;
    &.showd {
        transform: translateY(-100%);
        -webkit-transform: translateY(-100%);
    }
    .top {
        position: fixed;
        top: 0;
        z-index: 1;
        width: 100%;
        p {
            position: fixed;
            top: 0;
            padding: 1rem;
            color: #ffffff;
            font-weight: bold;
            width: 100%;
            span {
                &:nth-child(2) {
                    float: right;
                    text-decoration: underline;
                }
            }
        }
        .btn {
            width: 80%;
            text-align: center;
            background: #c79e5f;
            color: #ffffff;
            height: 2.5rem;
            line-height: 2.5rem;
            margin: 0 auto;
        }
    }
    .bot {
        position: fixed;
        bottom: 0;
    }
    img {
        width: 100%;
    }
}
</style>
