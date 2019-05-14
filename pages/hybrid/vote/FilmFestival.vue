<template>
    <div class="page-wrapper">
        <!-- 客户端或者浏览器端判断完开屏 -->
        <div v-show="appType||mounted">
            <download v-if="!appType" class="clearfix filmload" @onload="loadConfirm" />
            <div class="top" :class="{mtop:!appType}">
                <mVoteSwiper v-if="banners.length" :banners="banners" :name="'Film Festival Vote'" />
                <div class="rules">
                    <span @click="aboutCard = true">{{$store.state.lang.vote_about}}</span>
                    <span @click="rulesCard = true">{{$store.state.lang.vote_voterules}}</span>
                </div>
            </div>
            <nav id="nav">
                <a v-for="(item,index) in tabList" :key="index" :class="{on:tabIndex === index}" @click="tabIndex = index">
                    <span>{{item.name}}</span>
                    <p/>
                </a>
            </nav>
            <div v-if="appType" class="leftvote">
                <span>{{$store.state.lang.vote_leftvote}}:{{leftVote}}</span>
            </div>
            <div class="pit" />
            <template v-for="(item,index) in tabList">
                <sFilm v-if="item.type=='film'" v-show="tabIndex==index" :key="index" :data-list="filmList" @onVote="handleVote" />
                <sFilm v-if="item.type=='short_film'" v-show="tabIndex==index" :key="index" :data-list="sFilmList" @onVote="handleVote" />
                <mFilm v-if="item.type=='mv'" v-show="tabIndex==index" :key="index" :data-list="mvList" @onVote="handleVote" />
            </template>
            <div v-show="appType!=2" ref="box" class="share" :style="{'left':left, 'top':top}" @click="toShare" @touchstart="canMove=true" @touchmove.prevent="move" @touchend="canMove = false">
                <div>{{$store.state.lang.vote_share}}</div>
            </div>
            <mCard v-show="aboutCard" :title="$store.state.lang.vote_about" class="card" @closeCard="aboutCard=false">
                <template v-slot:content>
                    <p>Even though he is only 15 years old, when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for Even though he is only 15 years old</p>
                    <p>when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for</p>
                    <img src="https://s3-eu-west-1.amazonaws.com/tenbreportal/cms_back/html/files/img/group1/M00/04/C5/wKggGVtxpsqAXvq1AAJLZ725Yeo216.JPG">
                    <p>Even though he is only 15 years old, when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for Even though he is only 15 years old, when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for</p>
                </template>
                <template v-if="appType==0" v-slot:buttons>
                    <div class="download-btn" @click="loadConfirm">
                        <p>{{$store.state.lang.vote_downloadbtn}}</p>
                        {{$store.state.lang.vote_downloadbtn_tips}}
                    </div>
                </template>
            </mCard>
            <mCard v-show="rulesCard" :title="$store.state.lang.vote_voterules" class="card" @closeCard="rulesCard=false">
                <template v-slot:content>
                    <p>Even though he is only 15 years old, when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for Even though he is only 15 years old,</p>
                    <p>when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for</p>
                    <p>manning the family boda boda to provide for</p>
                </template>
                <template v-slot:buttons>
                    <div v-if="appType==1" class="share-btn" @click="toShare">{{$store.state.lang.vote_sharebtn}}</div>
                    <div v-if="appType==0" class="download-btn" @click="loadConfirm">
                        <p>{{$store.state.lang.vote_downloadbtn}}</p>
                        {{$store.state.lang.vote_downloadbtn_tips}}
                    </div>
                </template>
            </mCard>
            <mCard v-show="shareCard" :title="$store.state.lang.vote_earnvote_tt" class="card" @closeCard="shareCard=false">
                <template v-slot:content>
                    <p>{{$store.state.lang.vote_appshare_words}}</p>
                </template>
                <template v-slot:buttons>
                    <div class="share-way">
                        <span @click="shareWithFacebook">
                            <img src="~assets/img/vote/ic_facebook_def.png">
                        </span>
                        <span @click="copyLink">
                            <img src="~assets/img/vote/ic_copylink_def copy.png">
                        </span>
                        <span @click="shareWithTwitter">
                            <img src="~assets/img/vote/ic_ti_def.png">
                        </span>
                    </div>
                    <div v-if="appType==0" class="download-btn" @click="loadConfirm">
                        <p>{{$store.state.lang.vote_downloadbtn}}</p>
                        {{$store.state.lang.vote_downloadbtn_tips}}
                    </div>
                </template>
            </mCard>
            <div v-show="showMore&&filmList.length>0" class="more" :style="{'bottom':clientHeight}" @click="loadMore">
                <span>{{$store.state.lang.vote_view_more}}</span>
            </div>
        </div>
        <div v-if="!appType&&mounted" class="open" :class="{showd:openPicShowd}">
            <div class="top">
                <img src="~assets/img/vote/open_top.png">
                <p>
                    <span>{{time}}s</span>
                    <span @click="setVoteScreen('about')">{{$store.state.lang.vote_about}}</span>
                </p>
                <div class="btn" @click="setVoteScreen">{{$store.state.lang.vote_join_now}}</div>
            </div>
            <div class="bot">
                <img src="~assets/img/vote/open_bot.png">
            </div>
        </div>
    </div>
</template>
<script>
import mVoteSwiper from '~/components/vote/vote_swiper'
import mFilm from '~/components/vote/film'
import sFilm from '~/components/vote/short_film'
import mCard from '~/components/vote/card'
import { shareInvite, setCookie, getCookie, callApp, downloadApk } from '~/functions/utils'
import download from '~/components/vote/download'
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
            isLogin: this.$store.state.user.type || false,
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
            clientHeight: 0,
            filmList: [],
            sFilmList: [],
            mvList: [],
            time: 4,
            openPicShowd: false,
            mounted: false
        }
    },
    async asyncData({ app: { $axios }, route, store, req }) {
        $axios.setHeader('token', store.state.token)
        let banners = []
        let leftVote = 0
        try {
            const { data } = await $axios.get(`/voting/v1/vote?vote_id=8`)
            if (data.data.banner) {
                banners = await $axios.get(`/adm/v1/units/${data.data.banner}/materials`)
            }
            if (store.state.appType) {
                leftVote = await $axios({
                    url: `/voting/v1/ticket/sign-in`,
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    method: 'POST',
                    data: qs.stringify({
                        vote_id: 8
                    })
                })
                leftVote = leftVote.data.data || 0
            }

            return {
                banners: banners.data.data || [],
                vote_sign: req.headers.vote_sign,
                leftVote: leftVote
            }
        } catch (e) {
            return {
                banners: banners || [],
                vote_sign: req.headers.vote_sign,
                leftVote: 0
            }
        }
    },

    mounted() {
        this.clientHeight = document.body.clientHeight
        this.openPicShowd = getCookie('vote_screen_8')
        this.mounted = true

        document.addEventListener('scroll', () => {
            const scollTop = document.body.scrollTop || document.documentElement.scrollTop
            if (scollTop > 0) {
                this.showMore = false
            }
            const bannerContain = document.querySelector('.wh_content')
            if (bannerContain) {
                const stickyTop = bannerContain.getBoundingClientRect().bottom

                const h = document.querySelector('.rules').offsetHeight
                const dh = (!this.appType && document.querySelector('.filmload').offsetHeight) || 0
                let className = 'fixed'
                if (dh == 0) {
                    className = 'fixedapp'
                }
                if (stickyTop - dh - h <= 0) {
                    document.querySelector('.top').classList.add(className)
                    document.querySelector('#nav').classList.add(className)
                    this.appType && document.querySelector('.leftvote').classList.add(className)
                    document.querySelector('.pit').classList.add(className)
                } else {
                    document.querySelector('.top').classList.remove(className)
                    document.querySelector('#nav').classList.remove(className)
                    this.appType && document.querySelector('.leftvote').classList.remove(className)
                    document.querySelector('.pit').classList.remove(className)
                }
            }
        })
        if (this.banners.length <= 0) {
            this.$nextTick(() => {
                if (this.appType) {
                    document.querySelector('.top').classList.add('fixedapp')
                    document.querySelector('#nav').classList.add('fixedapp')
                    this.appType && document.querySelector('.leftvote').classList.add('fixedapp')
                    document.querySelector('.pit').classList.add('fixedapp')
                } else {
                    document.querySelector('.top').classList.add('fixed')
                    document.querySelector('#nav').classList.add('fixed')
                    this.appType && document.querySelector('.leftvote').classList.add('fixed')
                    document.querySelector('.pit').classList.add('fixed')
                }
            })
        }

        const timer = setInterval(() => {
            if (this.time <= 0) {
                clearInterval(timer)
                this.setVoteScreen()
                return
            }
            this.time--
        }, 1000)

        this.getAllList()
    },
    methods: {
        handleVote(film) {
            // if (this.appType <= 0) {
            //     // 判断是否安装app 否则弹出下载提示框  loadConfirm
            //     return
            // }
            if (this.leftVote <= 0) {
                this.$confirm(
                    this.$store.state.lang.vote_fail + this.$store.state.lang.vote_success_0,
                    () => {
                        this.toShare()
                    },
                    () => {},
                    this.$store.state.lang.vote_share,
                    this.$store.state.lang.vote_cancel
                )
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
                })
                    .then(res => {
                        if (res.data.code === 0) {
                            this.getAllList()
                            if (this.leftVote <= 1) {
                                this.leftVote--
                                this.$confirm(
                                    this.$store.state.lang.vote_success + this.$store.state.lang.vote_success_0,
                                    () => {
                                        this.toShare()
                                    },
                                    () => {},
                                    this.$store.state.lang.vote_share,
                                    this.$store.state.lang.vote_cancel
                                )
                            } else {
                                this.leftVote--
                                this.$toast(this.$store.state.lang.vote_success + ',' + this.$store.state.lang.vote_leftvote + ':' + this.leftVote)
                            }
                        } else {
                            this.$toast(res.data.message)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        loadConfirm() {
            callApp.call(this, `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin + window.location.pathname}`, () => {
                this.rulesCard = false
                this.aboutCard = false
                this.$confirm(
                    this.$store.state.lang.vote_apk,
                    () => {
                        downloadApk.call(this)
                    },
                    () => {},
                    this.$store.state.lang.vote_ok,
                    this.$store.state.lang.vote_cancel
                )
            })
        },
        loadMore() {
            window.scrollBy(0, document.body.clientHeight) // 向下滚动一屏
        },
        setVoteScreen(type) {
            if (type === 'about') {
                this.aboutCard = true
            }
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
                return b.ballot_num - a.ballot_num
            })
        },
        toShare() {
            if (this.appType === 1) {
                this.rulesCard = false // 弹层消失
                const img = this.banners.length > 0 ? this.banners[0].materials : ''
                process.client &&
                    shareInvite(
                        `${window.location.href}?pin=${this.$store.state.user.id}`,
                        'Film Festival Vote',
                        'Vote & Win Big Prizes',
                        img,
                        'Film Festival Vote'
                    )
            } else if (this.appType === 0) {
                this.rulesCard = false
                this.shareCard = true
            }
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
        },
        shareWithFacebook() {
            this.shareCard = false
            // eslint-disable-next-line no-undef
            FB.ui(
                {
                    method: 'share',
                    display: 'popup',
                    href: window.location.href
                },
                function(response) {}
            )
        },
        copyLink() {
            this.shareCard = false
            this.$nextTick(() => {
                const input = document.createElement('input')
                input.setAttribute('readOnly', true)
                document.body.appendChild(input)
                input.setAttribute('value', window.location.href)
                input.select()
                const successful = document.execCommand('copy')
                document.body.removeChild(input)
                window.getSelection().removeAllRanges()
                if (successful) {
                    this.$toast(this.$store.state.lang.officialwebsitemobile_copylink_copied)
                } else {
                    this.$toast('Copylink is not support on your browser')
                }
                this.$store.commit('SET_SHARE_STATE', false)
            })
        },
        shareWithTwitter() {
            this.shareCard = false
            window.location.href =
                'http://twitter.com/share?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent(document.title)
        }
    },
    head() {
        return {
            title: 'Film Festival Vote',
            meta: [
                { name: 'description', property: 'description', content: this.$store.state.lang.vote_appshare_words },
                { name: 'og:description', property: 'og:description', content: this.$store.state.lang.vote_appshare_words },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: this.banners.length > 0 && this.banners[0].materials.replace('http:', 'https:')
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: 'Film Festival Vote' }
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
    .mtop {
        margin-top: 4rem;
    }
    .top {
        position: relative;
        min-height: 2rem;
        .rules {
            height: 2rem;
            line-height: 2rem;
            background: linear-gradient(360deg, rgba(0, 0, 0), rgba(0, 0, 0, 0.1));
            font-size: 0.88rem;
            color: #ffffff;
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 10;
            width: 100%;
            span {
                display: inline-block;
                text-align: center;
                width: 33%;
                text-decoration: underline;
            }
        }
        &.fixed {
            position: static;
            .rules {
                top: 4rem;
                position: fixed;
                background: black;
            }
        }
        &.fixedapp {
            position: static;
            .rules {
                top: 0;
                position: fixed;
                background: black;
            }
        }
    }
    #nav {
        height: 2rem;
        background: linear-gradient(to bottom, #9d802a, #c9ab6f);
        padding: 0.4rem 0;
        a {
            text-align: center;
            cursor: pointer;
            height: 1.2rem;
            line-height: 1.2rem;
            width: 33%;
            color: #ffe189;
            display: block;
            float: left;
            font-weight: 600;
            text-shadow: 1px 2px 0px rgba(0, 0, 0, 0.5);
            font-size: 0.88rem;
            &:link,
            &:active,
            &:visited,
            &:hover {
                background: none;
                -webkit-tap-highlight-color: rgba(255, 255, 255, 0.2);
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
        &.fixed {
            position: fixed;
            top: 6rem;
            width: 100%;
            z-index: 1;
        }
        &.fixedapp {
            position: fixed;
            top: 2rem;
            width: 100%;
            z-index: 1;
        }
    }
    .leftvote {
        padding-right: 0.8rem;
        height: 2rem;
        line-height: 2rem;
        background: linear-gradient(to bottom, #000000, #4e4e4e);
        font-size: 0.88rem;
        color: #ffffff;
        text-align: right;
        &.fixed {
            position: fixed;
            top: 8rem;
            width: 100%;
            z-index: 1;
        }
        &.fixedapp {
            position: fixed;
            top: 4rem;
            width: 100%;
            z-index: 1;
        }
    }
    .pit {
        height: 0;
        &.fixed {
            height: 4rem;
        }
        &.fixedapp {
            height: 4rem;
        }
    }
    .share {
        width: 4rem;
        height: 4rem;
        text-align: center;
        color: #666666;
        font-size: 0.8rem;
        font-weight: bold;
        position: fixed;
        bottom: 3rem;
        right: 1rem;
        border-radius: 100%;
        background: linear-gradient(to top, #c8c8c8, #979797);
        z-index: 10;
        div {
            width: 3.6rem;
            height: 3.6rem;
            line-height: 3.6rem;
            margin: 0.2rem auto;
            background: linear-gradient(to bottom, #d8d8d8, #afafaf);
            border-radius: 100%;
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
    }
    .top {
        position: fixed;
        top: 0;
        z-index: 1;
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
