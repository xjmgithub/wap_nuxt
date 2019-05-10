<template>
    <div class="page-wrapper">
        <mVoteSwiper :banners="banners" :name="'Film Festival Vote'" />
        <div>
            <div class="rules">
                <span @click="showAbout=true">About</span>
                <span>Vote Rules</span>
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
        <template v-for="(item,index) in tabList">
            <mFilm v-if="item.type=='normal_Film'" v-show="tabIndex==index" :key="index" :tab_msg="item"/>
            <sFilm v-if="item.type=='short_film'" v-show="tabIndex==index" :key="index" :tab_msg="item"/>
        </template>
        <div
            ref="box"
            class="share"
            :style="{'left':left, 'top':top}"
            @mousedown="canMove=true"
            @touchstart="canMove=true"
            @mousemove="move"
            @touchmove="move"
            @mouseup="canMove = false"
            @touchend="canMove = false"
        >
            <div>SHARE</div>
        </div>
        <div v-show="showAbout" class="share-layer" @click="showAbout=false"/>
        <div v-show="showAbout" class="about">
            <img src="~assets/img/vote/ic_close.png" class="close" @click="showAbout=false">
            <h4>ABOUT</h4>
            <p>Even though he is only 15 years old, when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for Even though he is only 15 years old, when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for --Even though he is only 15 years old, when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for Even though he is only 15 years old, when his father is injured in a road accident Abel takes up the responsibility of manning the family boda boda to provide for</p>
            <img src="~assets/img/vote/about.png">
        </div>
    </div>
</template>
<script>
import mVoteSwiper from '~/components/vote/vote_swiper'
import mFilm from '~/components/vote/film'
import sFilm from '~/components/vote/short_film'
export default {
    layout: 'base',
    components: {
        mFilm,
        sFilm,
        mVoteSwiper
    },

    data() {
        return {
            isLogin: this.$store.state.user.type || false,
            appType: this.$store.state.appType,
            tabList: [
                {
                    name: 'Film',
                    type: 'normal_Film',
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
                    type: 'normal_Film',
                    vote_id: 3
                }
            ],
            tabIndex: 0,
            vote_id: 8,
            leftVote: 13,
            canMove: false,
            left: '',
            top: '',
            showAbout: false
        }
    },
    async asyncData({ app: { $axios }, route, store }) {
        $axios.setHeader('token', store.state.token)
        let banners = []
        try {
            const { data } = await $axios.get(`/voting/v1/vote?vote_id=8`)
            if (data.data.banner) {
                banners = await $axios.get(`/adm/v1/units/${data.data.banner}/materials`)
            }
            return {
                banners: banners.data.data
            }
        } catch (e) {
            return {
                banners: banners
            }
        }
    },
    mounted() {
        console.log(this.banners)
    },
    methods: {
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
                } else if (x > dh) {
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
    .rules {
        height: 2rem;
        line-height: 2rem;
        background: linear-gradient(360deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
        font-size: 0.88rem;
        color: #ffffff;
        span {
            display: inline-block;
            text-align: center;
            width: 33%;
            text-decoration: underline;
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
    }
    .leftvote {
        padding-right: 0.8rem;
        height: 2rem;
        line-height: 2rem;
        background: linear-gradient(to bottom, #000000, #4e4e4e);
        font-size: 0.88rem;
        color: #ffffff;
        text-align: right;
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
        div {
            width: 3.6rem;
            height: 3.6rem;
            line-height: 3.6rem;
            margin: 0.2rem auto;
            background: linear-gradient(to bottom, #d8d8d8, #afafaf);
            border-radius: 100%;
        }
    }
}
.share-layer {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.3);
}
.about {
    padding: 1rem;
    z-index: 1001;
    color: #666666;
    width: 80%;
    background: #ffffff;
    position: absolute;
    height: 22rem;
    top: 50%;
    left: 50%;
    margin-top: -11rem;
    margin-left: -40%;
    h4 {
        font-size: 1rem;
        margin-bottom: 0.4rem;
        margin-top: 0;
        text-align: center;
    }
    p {
        font-size: 0.88rem;
        height: 10rem;
        overflow-y: scroll;
    }
    img {
        width: 100%;
        margin-top: 0.8rem;
        &.close {
            width: 1.5rem;
            position: absolute;
            right: 0.4rem;
            top: 0;
            margin-top: 0.4rem;
        }
    }
}
</style>
