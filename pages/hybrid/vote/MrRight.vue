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
        <div class="vote">
            <p>
                <span class="heart" />
                <span class="title">Weekly Candidates</span>
                <span class="voteleft">Left vote today:{{voteLeft}}</span>
            </p>
            <ul class="clearfix">
                <li v-for="(item,index) in advisorList" :key="index" data-id="item.id">
                    <div class="img-box">
                        <img :src="item.icon.replace('http:','https:')" class="icon">
                    </div>
                    <span class="player-name">{{item.name.split('&')[0]}}</span>
                    <span class="player-name">{{item.name.split('&')[1]}}</span>
                    <div class="vote-btn">
                        <span class="votes">{{item.ballot_num}}</span>
                        <span class="btn">VOTE</span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="rank">
            <p>
                <span class="title">History Rank</span>
                <span class="voteleft">All candidates encore on 14th Jul!</span>
            </p>
            <ul>
                <li v-for="(item,index) in showList" :key="index">
                    <div class="left">
                        <span class="rank-num" :class="{topThree:index<3}">{{index+1}}</span>
                        <img v-show="index<3" :src="item.icon.replace('http:','https:')"  class="icon">
                        <span class="name">{{item.name}}</span>
                    </div>
                    <div class="right" :class="{topThree:index<3}">
                        <span class="count">{{item.ballot_num}}</span>
                        <span class="votes">votes</span>
                        <img src="~assets/img/vote/ic_play_small_white.png" alt="">
                    </div>
                </li>
            </ul>
        </div>
        <div class="video">
            <p>Clips You Can't Miss</p>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            isLogin: this.$store.state.user.type || false,
            vote_id: 4,
            videoList: [],
            advisorList: [],
            rankList: [],
            voteLeft: '-',
            showAll:false
        }
    },
    computed: {
        showList() {
            if (this.showAll) {
                return this.rankList
            } else {
                return this.rankList.slice(0, 6)
            }
        }
    },
    mounted() {
        this.getVoteLeft()
        this.getVideoList()
        this.getAdvisorList()
    },
    methods: {
        // 获取投票单元数据
        getAdvisorList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=${this.vote_id}`).then(res => {
                if (res.data.code === 0 && res.data.data.length > 0) {
                    this.advisorList = res.data.data.slice(0, 3)
                    this.rankList = res.data.data
                    this.rankList.sort(function(a, b) {
                        return b.ballot_num - a.ballot_num
                    })
                } else {
                }
            })
        },

        // 获取节目预告正片花絮等
        getVideoList() {
            this.$axios.get(`/voting/v1/program?vote_id=${this.vote_id}`).then(res => {
                if (res.data.code === 0) {
                    this.videoList = res.data.data
                }
            })
        },

        // 获取剩余票数
        getVoteLeft() {
            this.$axios.get(`/voting/v1/ballot/user-ballot-nums?vote_id=${this.vote_id}`).then(res => {
                if (res.data.code === 0) {
                    this.voteLeft = res.data.data + ''
                }
            })
        }

        // 获取所有获选人列表，及排行
        // getRankList() {
        //     this.$axios.get(`/v1/candidates-with-ballot-num?vote_id=${this.vote_id}`).then(res => {
        //         if (res.data.code === 0) {
        //             this.rankList = res.data.data
        //         }
        //     })
        // },

        // 投票提交
        // handleViceVote(advisor) {
        //     this.sendEvLog({
        //         category: 'vote_' + this.share.voteName,
        //         action: 'flowerbtn_click',
        //         label: 'flower_' + advisor.name,
        //         value: 10
        //     })
        //   if (this.leftflower === 0) {
        //     this.$alert('flower left: 0 \n Remember to vote tomorrow!')
        //     return
        // }
        // this.$axios({
        //     url: '/voting/v1/ballot',
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     data: qs.stringify({
        //         candidate_id: advisor.id,
        //         vote_id: this.tab_msg.vote_id
        //     })
        // }).then(res => {
        //     if (res.data.code === 0) {
        //         if (this.leftvote === 0) {
        //             this.$alert('Vote success, vote left: 0 \n Remember to vote tomorrow! Now you can invite friends to vote')
        //         }
        //         this.getAdvisorList()
        //     } else {
        //         this.$alert(res.data.message)
        //     }
        // })
        // },
    },
    head() {
        return {
            title: 'Hello, Mr Right'
        }
    }
}
</script>
<style lang="less" scoped>
.Mr-Right {
    width: 100%;
    height: 100%;
    background: #f5a189;
    .heart{
        width: .8rem;
        height: .8rem;
        display: inline-block;
        position: relative;
        margin-right:.2rem;
    }
    .heart::before,.heart::after{
        position: absolute;
        display: block;
        content:"";
        width: .4rem;
        height: .67rem;
        background-color: #F93874;
        border-top-left-radius: 50%;
        border-top-right-radius: 50%;
        left: .2rem;
        top: 0px;
        transform: rotate(-45deg);
    }
    .heart::after{
        transform: rotate(45deg);
        left: .4rem;
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
            width: 32.1%;
            float: left;
            margin: 0 0.6% 0.5rem;
            .img-box {
                width: 100%;
                margin-bottom: 0.5rem;
                overflow: hidden;
                border-radius: 2px;
                opacity: 0.9262;
                border: 2px solid rgba(255, 255, 255, 1);
                box-shadow: 2px 0px 10px white, 10px 10px 10px white inset;
                // background: url('~assets/img/vote/pic_outline.png') no-repeat ;
                .icon {
                    width: 100%;
                    display: block;
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
                height: 1.8rem;
                line-height: 1.4rem;
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
                .rank-num {
                    font-size: 0.88rem;
                    color: #ffffff;
                    font-weight: bold;
                    display: inline-block;
                    width: 2rem;
                    text-align: center;
                    &.topThree {
                        color: #ff598c;
                    }
                }
                .name {
                    color: #ffffff;
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
                &.topThree {
                    color: #f93874;
                }
                .count {
                    font-size: 1.2rem;
                }
                .votes {
                    font-size: 0.88rem;
                }
                img {
                    width: 1.25rem;
                    margin-left:0.3rem;
                }
            }
        }
    }
    .video{
        padding: 0 2.5%;
        p {
            margin: 1rem 0;
            height: 1rem;
            line-height: 1rem;
            color: #f93874;
            font-weight: bold;
        }
    }
}
.clearfix:after {
    display: block;
    visibility: hidden;
    clear: both;
    height: 0;
    content: '';
}

.clearfix {
    zoom: 1;
}

.clear {
    clear: both;
}
</style>
