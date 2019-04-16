<template>
    <div class="Mr-Right">
        <div class="title">
            <img src="~assets/img/vote/pic_title.png">
            <div class="video">
                <img src="~assets/img/vote/full_eps.png">
                <img src="~assets/img/vote/trailer.png">
                <img src="~assets/img/vote/highlights.png">
            </div>
        </div>
        <div class="rule">
            <img src="~assets/img/vote/tv.png">
            <span class="share" @click="toShare">{{$store.state.lang.mrright_tell_my_friends}}</span>
            <nuxt-link :to="{path:'/hybrid/vote/rule'}">
                <div class="how-to-win">{{$store.state.lang.mrright_how_to_win}}</div>
            </nuxt-link>
        </div>
        <div class="vote">
            <p>
                <img class="heart" src="~assets/img/vote/heartpoint.png">
                <span class="title">{{$store.state.lang.mrright_weekly_candidates}}</span>
                <span class="voteleft">{{$store.state.lang.mrright_left_vote_today}} {{voteLeft}}</span>
            </p>
            <ul class="clearfix">
                <li v-for="(item,index) in coupleList" :key="index" :class="{'only-two':advisorList.length<3}" data-id="item.id">
                    <div class="img-box">
                        <img :src="item.icon.replace('http:','https:')" class="icon">
                        <img v-show="item.link_vod_code" src="~assets/img/vote/ic_play_small_white.png" class="player">
                    </div>
                    <span class="player-name">{{item.name.split('&')[0]}}</span>
                    <span class="player-name">{{item.name.split('&')[1]}}</span>
                    <div class="vote-btn">
                        <span class="votes">{{item.ballot_num}}</span>
                        <span v-if="item.user_ballot_num>0" class="btn" @click="handleViceVote(item)">{{$store.state.lang.mrright_voted}}</span>
                        <span v-else class="btn" @click="handleViceVote(item)">{{$store.state.lang.mrright_vote}}</span>
                    </div>
                </li>
            </ul>
        </div>
        <div v-show="advisorList.length>0" class="rank">
            <p>
                <img class="heart" src="~assets/img/vote/heartpoint.png">
                <span class="title">{{$store.state.lang.mrright_history_rank}}</span>
                <span class="voteleft">{{$store.state.lang.mrright_all_candidates}}</span>
            </p>
            <ul>
                <li v-for="(item,index) in showList" :key="index">
                    <div class="left">
                        <span class="rank-num" :class="{'top-three':index<3}">{{index+1}}</span>
                        <img v-show="index<3" :src="item.icon.replace('http:','https:')" class="icon">
                        <div v-if="index<3" class="name">
                            <p>{{item.name.split('&')[0]}}</p>
                            <p> & {{item.name.split('&')[1]}}</p>
                        </div>
                        <span v-else class="name">{{item.name.split('&')[0]}} & {{item.name.split('&')[1]}}</span>
                    </div>
                    <div class="right" :class="{'top-three':index<3}">
                        <span class="count">{{item.ballot_num}}</span>
                        <span class="votes">votes</span>
                        <span class="player">
                            <img v-show="item.link_vod_code" src="~assets/img/vote/ic_play_small_white.png">
                        </span>
                    </div>
                </li>
            </ul>
            <p class="toggleAll" @click="toggleAll">
                <span v-show="showList.length==6&&rankList.length>6">{{$store.state.lang.mrright_view_all}}</span>
                <span v-show="showList.length>6">{{$store.state.lang.mrright_view_less}}</span>
                <img v-show="rankList.length>6" :class="{updown:showAll}" src="~assets/img/vote/view more.png">
            </p>
        </div>
        <div class="clips">
            <p>
                <img class="heart" src="~assets/img/vote/heartpoint.png"> {{$store.state.lang.mrright_clips_you_cant_miss}}
            </p>
            <ul class="clearfix">
                <li v-for="(item,index) in clipsList" :key="index">
                    <div>
                        <img :src="item.link_url.replace('http:','https:')" class="url">
                        <img src="~assets/img/vote/ic_play_small_white.png" class="player">
                    </div>
                    <span class="title">{{item.description||item.name}}</span>
                </li>
            </ul>
        </div>
        <div class="title">
            <div class="video">
                <img src="~assets/img/vote/full_eps.png">
                <img src="~assets/img/vote/trailer.png">
                <img src="~assets/img/vote/highlights.png">
            </div>
        </div>
    </div>
</template>
<script>
// import { downApp } from '~/functions/utils'
import qs from 'qs'
export default {
    layout: 'base',
    data() {
        return {
            isLogin: this.$store.state.user.type || false,
            isApp: this.$store.state.appType,
            vote_id: 7,
            videoList: [],
            advisorList: [],
            rankList: [],
            voteLeft: '-',
            showAll: false,
            clipsList: []
        }
    },
    computed: {
        showList() {
            if (this.showAll) {
                return this.rankList
            } else {
                return this.rankList.slice(0, 6)
            }
        },
        coupleList() {
            if (this.advisorList.length > 0) {
                return this.advisorList
            } else {
                return this.rankList
            }
        }
    },
    mounted() {
        this.getVoteLeft()
        this.getAdvisorList()
        this.getRankList()
        this.getVideoList()
    },
    methods: {
        toShare() {
            // TODO 风险
        },

        // 获取投票单元数据
        getAdvisorList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=${this.vote_id}`).then(res => {
                if (res.data.data.length > 0) {
                    this.advisorList = res.data.data
                } else {
                }
            })
        },

        // 获取节目预告正片花絮等
        getVideoList() {
            this.$axios.get(`/voting/v1/program?vote_id=${this.vote_id}`).then(res => {
                if (res.data.code === 0) {
                    this.videoList = res.data.data.slice(0, 3)
                    this.clipsList = res.data.data.slice(3, 7)
                }
            })
        },

        // 获取剩余票数
        getVoteLeft() {
            this.$axios.get(`/voting/v1/ballot/user-ballot-nums?vote_id=${this.vote_id}`).then(res => {
                if (res.data.code === 0) {
                    this.voteLeft = res.data.data
                }
            })
        },

        // 获取所有获选人列表，及排行
        getRankList() {
            this.$axios.get(`/voting/v1/candidates-with-ballot-num?vote_id=${this.vote_id}`).then(res => {
                if (res.data.code === 0) {
                    this.rankList = res.data.data
                    this.rankList.sort(function(a, b) {
                        return b.ballot_num - a.ballot_num
                    })
                }
            })
        },
        // 投票提交
        handleViceVote(advisor) {
            // 浏览器打开判断用户终端，提示下载
            // if (this.isApp !== 1 && this.isApp !== 2) {
            //     const _this = this
            //     if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            //         console.log(navigator.userAgent)
            //         this.$confirm(
            //             this.$store.state.lang.mrright_download_ios,
            //             () => {
            //                 downApp.call(_this)
            //             },
            //             () => {},
            //             this.$store.state.lang.mrright_go,
            //             this.$store.state.lang.mrright_not_now
            //         )
            //     } else if (/(Android)/i.test(navigator.userAgent)) {
            //         console.log(navigator.userAgent)
            //         this.$confirm(
            //             this.$store.state.lang.mrright_download_android,
            //             () => {
            //                 downApp.call(_this)
            //             },
            //             () => {},
            //             this.$store.state.lang.mrright_go,
            //             this.$store.state.lang.mrright_not_now
            //         )
            //     }
            //     return
            // }

            if (this.voteLeft === 0 && this.isLogin) {
                this.$toast(this.$store.state.lang.mrright_vote_tomorrow_login)
            } else if (this.voteLeft === 0 && !this.isLogin) {
                this.$confirm(
                    this.$store.state.lang.mrright_vote_tomorrow,
                    () => {
                        this.$router.push('/hybrid/account/login')
                    },
                    () => {},
                    this.$store.state.lang.mrright_sign_in,
                    this.$store.state.lang.mrright_no
                )
            } else {
                advisor.ballot_num++
                // this.voteLeft--
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
                }).then(res => {
                    if (res.data.code === 0) {
                        this.getVoteLeft()
                        if (!this.isLogin) {
                            this.$confirm(
                                this.$store.state.lang.mrright_successfully_voted,
                                () => {
                                    this.$router.push('/hybrid/account/login')
                                },
                                () => {},
                                this.$store.state.lang.mrright_sign_in,
                                this.$store.state.lang.mrright_no
                            )
                        } else {
                            this.$toast(this.$store.state.lang.mrright_successfully_voted_signin + this.voteLeft)
                        }
                    } else {
                        this.$toast(res.data.message)
                    }
                })
            }
        },
        toggleAll() {
            this.showAll = !this.showAll
        }
    },
    head() {
        return {
            title: 'Hello, Mr Right'
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/vote/normal.less';
.Mr-Right {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background: #f5a189;
    padding-bottom: 2rem;
    .heart {
        width: 0.7rem;
        height: 0.6rem;
        margin-right: 0.2rem;
        vertical-align: inherit;
    }
    .rule {
        padding: 0 2%;
        position: relative;
        font-size: 0.88rem;
        font-weight: bold;
        img {
            width: 100%;
        }
        .share {
            position: absolute;
            right: 3%;
            top: 0.6rem;
            color: #ffffff;
            text-decoration: underline;
        }
        .how-to-win {
            color: #ffe8a4;
            text-decoration: underline;
            position: absolute;
            left: 3rem;
            bottom: 4rem;
        }
    }
    .title {
        & > img {
            display: block;
            width: 100%;
        }
        .video {
            padding: 0 2%;
            img {
                width: 33%;
                &:nth-child(2) {
                    width: 30%;
                }
            }
        }
    }
    .vote {
        padding: 0 2.5%;

        p {
            margin: 1rem 0;
            height: 1.25rem;
            line-height: 1.25rem;
            .title {
                color: #f93874;
                font-weight: bold;
                font-size: 1.25rem;
            }
            .voteleft {
                color: #ffffff;
                float: right;
                font-size: 0.8rem;
            }
        }
        li {
            list-style: none;
            width: 30%;
            float: left;
            margin: 0 1.5% 0.5rem;
            &.only-two {
                margin: 0 10% 0.5rem;
            }
            .img-box {
                position: relative;
                width: 100%;
                margin-bottom: 0.5rem;
                overflow: hidden;
                border-radius: 2px;
                opacity: 0.9262;
                border: 2px solid #ffffff;
                box-shadow: 0px 0px 10px #f7ebe2, 0px 0px 10px #f7ebe2 inset;
                &:before {
                    content: '';
                    display: inline-block;
                    padding-bottom: 100%;
                    width: 0.1px;
                    vertical-align: middle;
                }
                .icon {
                    width: 100%;
                    height: 100%;
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .player {
                    width: 1.5rem;
                    height: 1.5rem;
                    position: absolute;
                    right: 3px;
                    bottom: 3px;
                }
            }
            .player-name {
                height: 1.2rem;
                line-height: 1.2rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #ffffff;
                display: block;
                text-align: center;
            }
            .vote-btn {
                width: 100%;
                height: 2rem;
                line-height: 1.6rem;
                background: #fed56b;
                border-radius: 15px;
                font-size: 0.88rem;
                text-align: center;
                padding: 0.2rem 0.1rem;
                margin-top: 0.5rem;
                .votes {
                    display: inline-block;
                    width: 45%;
                    color: #ff598c;
                }
                .btn {
                    color: #ffffff;
                    font-weight: bold;
                    display: inline-block;
                    width: 50%;
                    background: #ff598c;
                    border-radius: 15px;
                }
            }
        }
    }
    .rank {
        padding: 0 2.5%;
        p {
            margin: 1rem 0;
            height: 1rem;
            line-height: 1rem;
            .title {
                color: #f93874;
                font-weight: bold;
            }
            .voteleft {
                color: #ffffff;
                float: right;
                font-size: 0.8rem;
            }
        }
        li {
            position: relative;
            margin: 1rem 0;
            .left {
                width: 70%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .rank-num {
                    font-size: 0.88rem;
                    color: #ffffff;
                    font-weight: bold;
                    display: inline-block;
                    width: 2rem;
                    text-align: center;
                    &.top-three {
                        color: #ff598c;
                    }
                }
                .name {
                    color: #ffffff;
                    display: inline-block;
                    vertical-align: middle;
                    p {
                        margin: 0.5rem;
                    }
                }
                img {
                    width: 3.75rem;
                    height: 3.75rem;
                }
            }
            .right {
                position: absolute;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                color: #ffffff;
                &.top-three {
                    color: #f93874;
                }
                .count {
                    font-size: 1.2rem;
                }
                .votes {
                    font-size: 0.88rem;
                }
                .player {
                    display: inline-block;
                    width: 1.25rem;
                    height: 1.25rem;
                    margin-left: 0.3rem;
                    img {
                        width: 100%;
                    }
                }
            }
        }
        .toggleAll {
            width: 100%;
            text-align: center;
            color: #ffffff;
            font-size: 0.75rem;
            img {
                width: 0.6rem;
                margin-left: 0.2rem;
                vertical-align: middle;
                transition: transform 0.3s;
                &.updown {
                    transform: rotate(180deg);
                }
            }
        }
    }
    .clips {
        padding: 0 2.5%;
        margin-bottom: 1rem;
        p {
            margin: 1rem 0;
            height: 1rem;
            line-height: 1rem;
            color: #f93874;
            font-weight: bold;
        }
        li {
            list-style: none;
            float: left;
            width: 48%;
            line-height: 1.1rem;
            color: #ffffff;
            margin-bottom: 0.3rem;
            &:nth-child(2n) {
                float: right;
            }
            div {
                position: relative;
                width: 100%;
                &:before {
                    content: '';
                    display: inline-block;
                    padding-bottom: 56%;
                    width: 0.1px;
                    vertical-align: middle;
                }
                .player {
                    position: absolute;
                    bottom: 5px;
                    right: 5px;
                    width: 1.5rem;
                }
                .url {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                }
            }
            span {
                font-size: 0.88rem;
                &.title {
                    display: -webkit-box;
                    overflow: hidden;
                    height: 3.6rem;
                    padding-top: 0.4rem;
                    -webkit-line-clamp: 3;
                    /* autoprefixer: off */
                    -webkit-box-orient: vertical;
                }
            }
        }
    }
}
</style>
