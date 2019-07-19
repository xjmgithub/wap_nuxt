<template>
    <div id="game">
        <div class="canvas">
            <canvas id="canvas" class="ani_hack" width="1360" height="640" />
        </div>
        <div class="contain">
            <div class="my-coins-box">
                <div class="my-coins">
                    My Coins:27
                    <img src="~assets/img/vote/ic_gift.png">
                    <img src="~assets/img/vote/ic_gift_go.png">
                </div>
            </div>
            <div class="cty-rank">
                <p class="time">
                    TOP SOCCERS:
                    <span>Ends in 124h 37m 2s</span>
                </p>
                <p>
                    You've scored
                    <b>{{goals}}</b> goals.
                    <span class="rules" @click="showResult=true">Last week result</span>
                </p>
                <div class="box">
                    <div v-for="(item,index) in rankList" :id="`c-${item.name}`" :key="index" :data-index="index" :class="{'my-rank':item.code==userId}" class="per-list">
                        <div class="left">
                            <span :class="{first:index==0 ,second:index==1,third:index==2}" class="ranking">{{index + 1}}</span>
                            <span v-if="item.logo">
                                <img :src="item.logo" />
                            </span>
                            <span v-else>
                                <img src="~assets/img/flag_others.png" />
                            </span>
                            <span class="cty-name">{{item.name}}</span>
                        </div>
                        <div class="right">
                            <span>Pts: {{item.ballot_num}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bot-down">
            <span>
                <img src="~assets/img/vote/button_games.png">
            </span>
            <span>
                <img src="~assets/img/vote/button_bonus.png" @click="showMissions=true">
            </span>
            <span>
                <img src="~assets/img/vote/button_friends.png">
            </span>
        </div>
        <div v-show="showRewards==true||showGames==true || showMissions==true" class="card-layer" />
        <!-- 点击开始提示-50coins弹窗 -->
        <div v-show="showRewards==true" class="card">
            <div class="close">
                <img src="~assets/img/naire/ic_close.png" @click="showRewards=false" />
            </div>
            <div class="rewards">
                <p>WINNING REWARDS</p>
                <div class="re-item">
                    <img src="~assets/img/vote/ic_football_winning_rewards.png" class="ball"> x 10
                    <div>
                        <img src="~assets/img/vote/coins0.png" class="coins">
                    </div>
                    <span>+100 coins</span>
                </div>
                <div class="re-item">
                    <img src="~assets/img/vote/ic_football_winning_rewards.png" class="ball"> x 30
                    <div>
                        <img src="~assets/img/vote/coins1.png" class="coins">
                    </div>
                    <span>+400 coins</span>
                </div>
                <div class="re-item">
                    <img src="~assets/img/vote/ic_football_winning_rewards.png" class="ball"> x 60
                    <div>
                        <img src="~assets/img/vote/coins2.png" class="coins">
                    </div>
                    <span>+800 coins</span>
                </div>
                <div class="entry">
                    ENTRY REE:
                    <span>-50 coins</span>
                    <p>START</p>
                </div>
            </div>
        </div>
        <!-- 点击bonus 提示Daily Missions 弹窗 -->
        <div v-show="showMissions==true" class="card">
            <div class="close">
                <img src="~assets/img/naire/ic_close.png" @click="showMissions=false" />
            </div>
            <div class="missions">
                <p>Daily Missions</p>
                <div class="mis-item">
                    <div class="mis-name">
                        <span>Daily Playing</span>
                        <div class="total">2/3
                            <p/>
                        </div>
                    </div>
                    <div class="mis-prize">
                        <p>
                            <span>100</span> coins
                        </p>
                    </div>
                    <div class="mis-redeem">
                        <img src="~assets/img/vote/button_redeem.png">
                    </div>
                </div>
                <div class="mis-item">
                    <div class="mis-name">
                        <span>3 Games Played</span>
                        <div class="total">2/3
                            <p/>
                        </div>
                    </div>
                    <div class="mis-prize">
                        <p>
                            <span>100</span> coins
                        </p>
                    </div>
                    <div class="mis-redeem">
                        <img src="~assets/img/vote/button_redeem.png">
                    </div>
                </div>
                <div class="mis-item">
                    <div class="mis-name">
                        <span>80 Freekick Shots</span>
                        <div class="total">51/80
                            <p/>
                        </div>
                    </div>
                    <div class="mis-prize">
                        <p>
                            <span>180</span> coins
                        </p>
                    </div>
                    <div class="mis-redeem">
                        <img src="~assets/img/vote/button_redeem.png">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
import { shareInvite } from '~/functions/app'
export default {
    layout: 'base',
    data() {
        return {
            // userId: this.$store.state.user.id,
            userId: 9893,

            rankList: [
                {
                    name: 'lilysony',
                    ballot_num: '9611',
                    code: 6
                },
                {
                    name: 'Orange tata',
                    ballot_num: '8006',
                    code: 5
                },
                {
                    name: 'Ninaomysan',
                    ballot_num: '6512',
                    code: 9893
                },
                {
                    name: 'Johnnasa@gmail.com',
                    ballot_num: '5543',
                    code: 4
                },
                {
                    name: 'Giantsir1990@yahoo.com',
                    ballot_num: '2210',
                    code: 3
                },
                {
                    name: 'lilysony',
                    ballot_num: '1110',
                    code: 2
                },
                {
                    name: 'lilysony',
                    ballot_num: '961',
                    code: 1
                }
            ],
            showResult: false,
            showGames: false,
            showRewards: false,
            showMissions: false,
            goals: '-'
        }
    },
    mounted() {
        /* eslint-disable */
        const first_in = localStorage.getItem('acon_first')
        if (!first_in) {
            this.$alert(`Welcome to the 'CRAZY FREEKICK'!弹窗提示用户能应得coins并兑换奖品，文案待定!`)
            localStorage.setItem('acon_first', 1)
        }

        const game = new window.CMain({
            shot_indicator_spd: 1000,
            decrease_shot_indicator_spd: 100
        })
        window.sizeHandler()

        document.querySelector('.contain').style.top = document.querySelector('canvas').style.height

        $(game).on('save_score', (evt, goal, score) => {
            this.vote(goal)
        })

        $(game).on('level_end', (evt, goal, score) => {
            this.vote(goal)
        })
        // $(game).on('goal', function(evt, goal, score) {})
        // this.getRankList(1)
    },
    methods: {
        getRankList(init) {
            // cycle 0查询当期，1查询上一期
            this.$axios.get(`/hybrid/api/games/getRanks?cycle=0&gameId=1 `).then(res => {
                if (res.data.code == 0) {
                    let result = []
                    const vlist = res.data.data
                    vlist.sort(function(a, b) {
                        return b.ballot_num - a.ballot_num
                    })
                    vlist.forEach((item, index) => {
                        if (item.show) {
                            result.push({
                                name: country.name,
                                code: item.name,
                                logo: country.nationalFlag,
                                ballot_num: item.ballot_num,
                                candidate_id: item.id
                            })
                        }
                    })
                    this.rankList = result
                    if (init) {
                        this.$nextTick(() => {
                            const t = document.querySelector('.my-rank')
                            document.querySelector('.box').scrollTop = t.getAttribute('data-index') * t.getBoundingClientRect().height
                        })
                    }
                } else {
                    this.$alert('Top Team get error')
                }
            })
        },
        vote(goal) {
            if (goal > 0) {
                this.$alert(`You've scroed ${goal} goals for ${this.country.name}. Thanks for the contribution for your country, Hero.`, () => {
                    this.$axios({
                        url: '/voting/v1/ballot',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: qs.stringify({
                            candidate_id: this.candidate.candidate_id,
                            vote_id: 12,
                            weight: goal
                        })
                    }).then(res => {
                        if (res.data.code === 0) {
                            // this.getRankList()
                        }
                    })
                })
            }
        },
        share() {
            shareInvite(
                `${window.location.origin}/hybrid/lands/soccercup?utm_source=startimes_app&utm_medium=activity&utm_campaign=soccercup1`,
                'StarTimes ON Cup - Crazy Freekick',
                `Join us as a Country Hero and score for the Team ${this.country.name} to win the cup.`,
                `${window.location.origin}/res_nuxt/img/soccercup.png`
            )
        }
    },
    head() {
        return {
            title: 'StarTimes ON Cup - Crazy Freekick',
            script: [
                { src: '/res_nuxt/jquery-3.4.1.min.js' },
                { src: '/res_nuxt/createjs-2014.12.12.min.js' },
                { src: '/res_nuxt/main.js' },
                { src: 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js' }
            ]
        }
    }
}
</script>
<style>
html {
    background: #3a8956;
}
</style>
<style lang="less" scoped>
#game {
    width: 100vw;
    height: 100vh;
    background: #3a8956;
}
#canvas,
.canvas {
    width: 1920px;
    height: 1080px;
    position: fixed;
}
canvas {
    image-rendering: optimizeSpeed;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    -ms-interpolation-mode: nearest-neighbor;
    -ms-touch-action: none;
}

.ani_hack {
    -webkit-perspective: 1000;
    -webkit-backface-visibility: hidden;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    outline: none;
    -webkit-tap-highlight-color: transparent; /* mobile webkit */
}

.contain {
    position: fixed;
    top: 43%;
    width: 95%;
    margin: 0 2.5%;
    .my-coins-box {
        width: 100%;
        text-align: center;
        margin-bottom: 0.5rem;
        .my-coins {
            display: inline-block;
            padding: 0.4rem 0.6rem;
            background: rgba(37, 46, 40, 0.8);
            color: #e4ffc6;
            border: 2px solid #6dc60e;
            border-radius: 30px;
            img {
                width: 1.5rem;
                margin-left: 0.5rem;
                & + img {
                    width: 0.5rem;
                    margin-left: 0.2rem;
                }
            }
        }
    }

    .cty-rank {
        background: #252e28;
        border-top: 1px solid #252e28;
        border-radius: 4px;
        p {
            margin: 0.2rem;
            color: #94e6ac;
            height: 2.4rem;
            line-height: 2.4rem;
            padding: 0 5%;
            &.time {
                color: #e4ffc6;
                border-bottom: 1px solid #66a578;
                margin: 0;
                font-size: 0.9rem;
                span {
                    float: right;
                    font-size: 0.75rem;
                }
            }
            .rules {
                color: #f34c02;
                text-decoration: underline;
                float: right;
                font-size: 0.7rem;
                font-weight: bold;
            }
        }
        .box {
            height: 50vh;
            padding-bottom: 7rem;
            overflow-y: scroll;
            clear: both;
        }
        .per-list {
            color: #66a578;
            height: 4rem;
            line-height: 4rem;
            &.my-rank {
                border-left: 3px solid #94e6ac;
                background: rgba(148, 230, 172, 0.1);
                .left {
                    .ranking {
                        margin-left: 0.6rem;
                    }
                }
            }
            .left {
                float: left;
                width: 68%;
                span {
                    float: left;
                    img {
                        width: 2.2rem;
                        margin-right: 0.5rem;
                    }
                }
                .ranking {
                    width: 1.7rem;
                    line-height: 4.1rem;
                    height: 4rem;
                    font-size: 0.9rem;
                    box-sizing: border-box;
                    color: #94e6ac;
                    background: url('~assets/img/vote/others.png') no-repeat center;
                    background-size: contain;
                    text-align: center;
                    margin: 0 0.8rem;
                    &.first {
                        color: #ffffff;
                        background: url('~assets/img/vote/first.png') no-repeat center;
                        background-size: contain;
                    }
                    &.second {
                        color: #ffffff;
                        background: url('~assets/img/vote/second.png') no-repeat center;
                        background-size: contain;
                    }
                    &.third {
                        color: #ffffff;
                        background: url('~assets/img/vote/third.png') no-repeat center;
                        background-size: contain;
                    }
                }
                .cty-name {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    width: 53%;
                    font-weight: bold;
                }
            }

            .right {
                float: right;
                width: 32%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
.bot-down {
    position: fixed;
    bottom: 0;
    height: 3rem;
    background: #3a8956;
    z-index: 200;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    width: 100%;
    box-shadow: 0px -1px 4px 0px rgba(0, 61, 21, 1);
    span {
        display: inline-block;
        width: 32.4%;
        text-align: center;
        img {
            width: 4.5rem;
            position: relative;
            top: -1.5rem;
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
    z-index: 1000;
    background: rgba(0, 0, 0, 0.3);
}
.card {
    font-size: 0.95rem;
    z-index: 1001;
    width: 90%;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -12rem;
    margin-left: -45%;
    .close {
        width: 100%;
        height: 3rem;
        img {
            width: 2rem;
            float: right;
        }
    }
    .rewards {
        width: 100%;
        padding: 1rem 0.8rem;
        background: #398754;
        & > p {
            font-weight: bold;
            color: #ffd91f;
            margin-bottom: 1rem;
        }
        .re-item {
            width: 100%;
            background: #489f66;
            padding: 0 1rem;
            height: 4rem;
            line-height: 4rem;
            margin-bottom: 0.3rem;
            border-radius: 5px;
            color: #235a36;
            font-weight: bold;
            div {
                float: right;
                width: 15%;
                padding: 1.1rem 0;
                .coins {
                    height: 1.8rem;
                    float: right;
                }
            }
            .ball {
                width: 1.8rem;
            }
            span {
                color: #ffd91f;
                font-weight: bold;
                float: right;
                margin-right: 0.5rem;
            }
        }
        .entry {
            text-align: center;
            color: #235a36;
            font-weight: bold;
            margin-top: 0.8rem;
            span {
                color: #ffd91f;
            }
            p {
                width: 45%;
                color: #bf7029;
                margin: 0 auto;
                height: 2.5rem;
                line-height: 2.5rem;
                box-shadow: 0px 1px 4px 2px #666666;
                background: #ffe050;
                border-radius: 30px;
                margin-top: 0.5rem;
            }
        }
    }
    .missions {
        width: 100%;
        padding: 1rem 0.8rem;
        background: #398754;
        & > p {
            font-weight: bold;
            color: #ffd91f;
            margin-bottom: 1rem;
        }
        .mis-item {
            width: 100%;
            background: #489f66;
            padding: 0.5em 0.5rem 1rem;
            margin-bottom: 0.3rem;
            border-radius: 5px;
            color: #235a36;
            font-weight: bold;
            display: -webkit-box;
            font-size: 0.9rem;
            .mis-name {
                -webkit-box-flex: 3;
                .total {
                    width: 100%;
                    height: 15px;
                    line-height: 15px;
                    background: #215b35;
                    color: #82d39e;
                    text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.5);
                    font-size: 0.6rem;
                    text-align: center;
                    margin-top: 0.5rem;
                    border-radius: 4px;
                    position: relative;
                    &.half {
                        color: #bf7029;
                        text-shadow: 0px 1px 0px rgba(33, 91, 53, 1);
                    }
                    p {
                        width: 50%;
                        background: #ffe050;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        border-radius: 4px;
                    }
                }
            }
            .mis-prize {
                text-align: center;
                color: #fff1ad;
                // -webkit-box-flex: 2;
                padding-top: 0.5rem;
                width: 3rem;
                span {
                    color: #ffd91f;
                }
            }
            .mis-redeem {
                // -webkit-box-flex: 1;
                width: 4rem;
                margin-top: 0.5rem;
                // color: #bf7029;
                // box-shadow: 0px 1px 4px 1px #666666;
                // background: #ffe050;
                // border-radius: 5px;
                // text-align: center;
                // font-size: 0.7rem;
                img {
                    width: 100%;
                    display: block;
                }
            }
        }
    }
}
</style>
