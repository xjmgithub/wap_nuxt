<template>
    <div class="page-wrapper">
        <div class="top">
            <mVoteSwiper :banners="banners" :name="'Film Festival Vote'" />
            <div class="rules">
                <span @click="aboutCard = true">About</span>
                <span @click="rulesCard = true">Vote Rules</span>
            </div>
        </div>
        <nav id="nav">
            <a v-for="(item,index) in tabList" :key="index" :class="{on:tabIndex === index}" @click="tabIndex = index">
                <span>{{item.name}}</span>
                <p/>
            </a>
        </nav>
        <div class="leftvote">
            <span>Left vote:{{leftVote}}</span>
        </div>
        <div class="pit" />
        <template v-for="(item,index) in tabList">
            <sFilm v-if="item.type=='film'" v-show="tabIndex==index" :key="index" :data-list="filmList" />
            <sFilm v-if="item.type=='short_film'" v-show="tabIndex==index" :key="index" :data-list="sFilmList" />
            <mFilm v-if="item.type=='mv'" v-show="tabIndex==index" :key="index" :data-list="mvList" />
        </template>
        <!-- <div 
            v-show="appType!=2" 
            ref="box" 
            class="share" 
            :style="{'left':left, 'top':top}" 
            @click="toShare" 
            @mousedown="canMove=true" 
            @touchstart="canMove=true" 
            @mousemove="move" 
            @touchmove="move" 
            @mouseup="canMove = false" 
            @touchend="canMove = false"
        > -->
        <div v-show="appType!=2" ref="box" class="share" :style="{'left':left, 'top':top}" @click="toShare" @touchstart="canMove=true" @touchmove.prevent="move" @touchend="canMove = false">
            <div>
                SHARE
            </div>
        </div>
        <mCard v-show="aboutCard" class="card" @closeCard="aboutCard=false">
            <h4>ABOUT</h4>
            <p>Even though he is only 15 years old, when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for Even though he is only 15 years old, when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for --Even though he is only 15 years old, when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for Even though he is only 15 years old, when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for</p>
            <img src="~assets/img/vote/about.png" class="poster">
            <div v-show="appType==0" class="download-btn">
                <p>DOWNLOAD APP</p>
                vote for you favourite content
            </div>
        </mcard>
        <mCard v-show="rulesCard" class="card" @closeCard="rulesCard=false">
            <h4>VOTE RULES</h4>
            <p>Even though he is only 15 years old, when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for Even though he is only 15 years old, </p>
            <p>when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for </p>
            <p>manning the family boda boda to provide for </p>
            <div v-show="appType==1" class="share-btn" @click="rulesCard=false,shareCard=true">SHARE NOW</div>
            <div v-show="appType==0" class="download-btn">
                <p>DOWNLOAD APP</p>
                vote for you favourite content
            </div>
        </mcard>
        <mCard v-show="shareCard" class="card" @closeCard="shareCard=false">
            <h4>Tell friends earn vote</h4>
            <p>点击Facebook按钮，调起h5页面Facebook分享流程</p>
            <p>点击Twitter按钮，调起h5页面Twitter分享流程</p>
            <p>点击copy link按钮，复制分享链接至剪贴板，弹出toast：copied</p>
            <div v-show="appType==1" class="share-way">
                <span><img src="~assets/img/vote/ic_facebook_def.png"></span>
                <span><img src="~assets/img/vote/ic_copylink_def copy.png"></span>
                <span><img src="~assets/img/vote/ic_ti_def.png"></span>
            </div>
        </mcard>
        <div v-show="showMore&&filmList.length>0" class="more" :style="{'bottom':clientHeight}" @click="loadMore">
            <span>View More</span>
        </div>
        <div class="open">
            <div class="top">
                <img src="~assets/img/vote/open_top.png">
                <p>
                    <span>{{time}}s</span>
                    <span @click="aboutCard = true">About</span>
                </p>
                <div class="btn">JOIN NOW!</div>
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
import { shareInvite } from '~/functions/utils'

export default {
    layout: 'base',
    components: {
        mFilm,
        sFilm,
        mVoteSwiper,
        mCard
    },

    data() {
        return {
            isLogin: this.$store.state.user.type || false,
            appType: this.$store.state.appType || 0,
            tabList: [
                {
                    name: 'Film',
                    type: 'film',
                    vote_id: 2,
                    main_vote: true
                },
                {
                    name: 'Short Film',
                    type: 'short_film',
                    vote_id: 2
                },
                {
                    name: 'MV',
                    type: 'mv',
                    vote_id: 3
                }
            ],
            tabIndex: 0,
            vote_id: 8,
            leftVote: 13,
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
            time: 4
        }
    },
    async asyncData({ app: { $axios }, route, store, req }) {
        $axios.setHeader('token', store.state.token)
        let banners = []
        try {
            const { data } = await $axios.get(`/voting/v1/vote?vote_id=8`)
            if (data.data.banner) {
                banners = await $axios.get(`/adm/v1/units/${data.data.banner}/materials`)
            }
            return {
                banners: banners.data.data,
                vote_sign: req.headers.vote_sign
            }
        } catch (e) {
            return {
                banners: banners,
                vote_sign: req.headers.vote_sign
            }
        }
    },
    mounted() {
        this.clientHeight = document.body.clientHeight
        document.addEventListener('scroll', () => {
            const scollTop = document.body.scrollTop || document.documentElement.scrollTop
            if (scollTop > 0) {
                this.showMore = false
            }

            const stickyTop = document.querySelector('.wh_content').getBoundingClientRect().bottom
            const h = document.querySelector('.rules').offsetHeight
            if (stickyTop - h <= 0) {
                document.querySelector('.top').classList.add('unfixed')
                document.querySelector('#nav').classList.add('fixed')
                document.querySelector('.leftvote').classList.add('fixed')
                document.querySelector('.pit').classList.add('fixed')
            } else {
                document.querySelector('.top').classList.remove('unfixed')
                document.querySelector('#nav').classList.remove('fixed')
                document.querySelector('.leftvote').classList.remove('fixed')
                document.querySelector('.pit').classList.remove('fixed')
            }
        })
        const timer = setInterval(() => {
            if (this.time <= 0) {
                clearInterval(timer)
                return
            }
            this.time--
        }, 1000)

        this.getAllList()
    },
    methods: {
        loadMore() {},
        // 获取投票单元数据
        getAllList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=${this.vote_id}`).then(res => {
                if (res.data.data.length > 0) {
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
                }
            })
        },
        toShare() {
            if (this.appType === 1) {
                process.client &&
                    shareInvite(
                        window.location.href,
                        'Film Festival Vote',
                        'Vote & Win Big Prizes',
                        window.location.origin + '/res_nuxt/img/mrshare.jpg',
                        'Film Festival Vote'
                    )
            } else if (this.appType === 0) {
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
        getVoteLeft() {
            if (this.isLogin) {
                this.$axios({
                    url: `/voting/v1/ballot/user-ballot-nums?vote_id=${this.vote_id}`,
                    method: 'get',
                    data: {}
                }).then(res => {
                    if (res.data.code === 0) {
                        this.leftVote = res.data.data + ''
                    } else {
                        this.leftVote = '-'
                    }
                })
            }
        }
    },
    head() {
        return {
            title: 'Film Festival Vote'
        }
    }
}
</script>
<style lang="less">
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
    .top {
        position: relative;
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
        &.unfixed {
            position: static;
            .rules {
                top: 0;
                position: fixed;
                background: rgba(0, 0, 0);
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
