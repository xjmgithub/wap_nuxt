<template>
    <div id="game">
        <div class="canvas">
            <canvas id="canvas" class="ani_hack" width="1360" height="640" />
        </div>
        <div class="contain">
            <div v-show="showMyCoins" class="my-coins-box">
                <div class="my-coins" :class="{animation:showMyCoins}" @click="toMyCoins">
                    My Coins: {{myCoins}}
                    <img src="~assets/img/vote/ic_gift.png" />
                    <img src="~assets/img/vote/ic_gift_go.png" />
                </div>
            </div>
            <div class="cty-rank">
                <p class="time">
                    TOP SOCCERS:
                    <span>
                        <img src="~assets/img/vote/ic_count_down.png" />
                        Ends in {{endTime}}
                    </span>
                </p>
                <p class="your-score">
                    You've scored
                    <b>{{goals}}</b> goals.
                    <span v-if="latest && preGameId" class="rules" @click="getLastWeekResult()">Last week result</span>
                    <span v-if="!latest && preGameId" class="rules" @click="getRankList()">Back to latest</span>
                </p>
                <div class="box">
                    <div
                        v-for="(item,index) in rankList"
                        :id="`c-${item.user_name}`"
                        :key="index"
                        :data-index="index"
                        :class="{'my-rank':item.user_id==userId}"
                        class="per-list"
                    >
                        <div class="left">
                            <span :class="{first:index==0 ,second:index==1,third:index==2}" class="ranking">{{index + 1}}</span>
                            <span v-if="item.user_avatar">
                                <img :src="cdnPicSrc(item.user_avatar)" />
                            </span>
                            <span v-else>
                                <img src="http://cdn.startimestv.com/head/h_d.png" />
                            </span>
                            <span class="cty-name">{{item.user_name}}</span>
                        </div>
                        <div class="right" :class="{'top-three':index<=2}">
                            <div v-show="index<=2">
                                <span class="prize">
                                    <i />
                                    {{index|formatPrize}}
                                </span>
                                <img v-show="index==0" src="~assets/img/vote/crank1.png" />
                                <img v-show="index==1" src="~assets/img/vote/crank2.png" />
                                <img v-show="index==2" src="~assets/img/vote/crank3.png" />
                            </div>
                            <span>Pts: {{item.goals}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bot-down">
            <span>
                <img src="~assets/img/vote/button_games.png" @click="showGames=true" />
            </span>
            <span>
                <img src="~assets/img/vote/button_bonus.png" @click="getTaskByGame()" />
            </span>
            <span>
                <img src="~assets/img/vote/button_friends.png" @click="share()" />
            </span>
        </div>
        <div v-show="showRewards==true||showGames==true || showMissions==true" class="card-layer" />
        <!-- 点击开始提示-50coins弹窗 -->
        <div v-show="showRewards==true" class="card">
            <div class="close">
                <img src="~assets/img/vote/close.png" @click="showRewards=false" />
            </div>
            <div class="rewards">
                <p>WINNING REWARDS</p>
                <div class="re-item">
                    <img src="~assets/img/vote/ic_football_winning_rewards.png" class="ball" /> x 10
                    <div>
                        <img src="~assets/img/vote/coins0.png" class="coins" />
                    </div>
                    <span>+100 coins</span>
                </div>
                <div class="re-item">
                    <img src="~assets/img/vote/ic_football_winning_rewards.png" class="ball" /> x 30
                    <div>
                        <img src="~assets/img/vote/coins1.png" class="coins" />
                    </div>
                    <span>+400 coins</span>
                </div>
                <div class="re-item">
                    <img src="~assets/img/vote/ic_football_winning_rewards.png" class="ball" /> x 60
                    <div>
                        <img src="~assets/img/vote/coins2.png" class="coins" />
                    </div>
                    <span>+800 coins</span>
                </div>
                <div class="entry">
                    ENTRY REE:
                    <span :class="{'played':!DailyPlayed}">-50 coins</span>
                    <img src="~assets/img/vote/button_start.png" class="start" @click="startGame()" />
                </div>
            </div>
        </div>
        <!-- 点击bonus 提示Daily Missions 弹窗 -->
        <div v-show="showMissions==true" class="card">
            <div class="close">
                <img src="~assets/img/vote/close.png" @click="showMissions=false" />
            </div>
            <div class="missions">
                <p>Daily Missions</p>
                <div v-for="(item,index) in taskList" :key="index" class="mis-item">
                    <div class="mis-name">
                        <span>{{item.label}}</span>
                        <div class="total">
                            <p :style="{width:getProcess(item)}" />
                            <span :class="{'over-half':(item.process/item.threshold).toFixed(2) * 100>45}">{{item|formatProcess}}/{{item.threshold}}</span>
                        </div>
                    </div>
                    <div class="mis-prize">
                        <p>
                            <span>{{item.award}}</span> coins
                        </p>
                    </div>
                    <div class="mis-redeem">
                        <img v-if="item.overTask" src="~assets/img/vote/button_redeemed.png" />
                        <img v-else src="~assets/img/vote/button_redeem.png" @click="taskOver(item)" />
                    </div>
                </div>
            </div>
        </div>
        <!-- 点击games 提示选择游戏弹窗 -->
        <div v-show="showGames==true" class="card">
            <div class="close">
                <img src="~assets/img/vote/close.png" @click="showGames=false" />
            </div>
            <div class="games">
                <div class="gam-item">
                    <img src="~assets/img/vote/popup_game.png" />
                    <img src="~assets/img/vote/popup_game_mask.png" class="mask" />
                </div>
                <div class="operation">
                    <img src="~assets/img/vote/button_forward.png" class="forward" />
                    <a href="/hybrid/questionNaire/america_bet">
                        <img src="~assets/img/vote/button_start.png" class="start" />
                    </a>
                    <img src="~assets/img/vote/button_next.png" class="next" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { shareInvite, toNativePage } from '~/functions/app'
import dayjs from 'dayjs'
export default {
    layout: 'base',
    filters: {
        formatProcess(item) {
            return item.process >= item.threshold ? item.threshold : item.process
        },
        formatPrize(index) {
            return index == 0 ? '+30,000' : index == 1 ? '+20,000' : index == 2 ? '+10,000' : ''
        }
    },
    data() {
        const user = this.$store.state.user
        return {
            userId: this.$store.state.user.id,
            rankList: [],
            taskList: [],
            showGames: false,
            showRewards: false,
            showMissions: false,
            showMyCoins: true,
            goals: '-',
            myCoins: '-',
            latest: true,
            preGameId: '',
            DailyPlayed: false,
            levelGoal: [],
            gameId: this.$route.query.gameId || 1,
            endTime: '',
            isLogin: user.roleName && user.roleName.toUpperCase() !== 'ANONYMOUS',
            isPlaying: false
        }
    },
    mounted() {
        /* eslint-disable */
        if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL)
            window.addEventListener(
                'popstate',
                () => {
                    if (this.showMissions) {
                        // 如果任务面板打卡，点击返回则直接关闭关闭任务面板
                        this.showMissions = false
                        history.pushState(null, null, document.URL)
                    } else if (this.isPlaying) {
                        // 如果正在游戏中
                        this.$confirm(
                            'Are you sure you want to quit the game?',
                            () => {
                                window.getChannelId && window.getChannelId.finish()
                            },
                            () => {
                                history.pushState(null, null, document.URL)
                            },
                            'Yes',
                            'No'
                        )
                    }
                    // else  如果判断当前页面则
                    else window.getChannelId && window.getChannelId.finish()
                },
                false
            )
        }

        const game = new window.CMain({
            shot_indicator_spd: 1000,
            decrease_shot_indicator_spd: 100
        })
        window.sizeHandler()

        document.querySelector('.contain').style.top = parseInt(document.querySelector('canvas').style.height) - 20 + 'px'

        $(game).on('save_score', (evt, goal, score) => {
            this.getAward(goal)
        })
        $(game).on('level_end', (evt, goal, score) => {
            this.setGoal(goal)
        })
        $(game).on('start_btn_click', (evt, goal, score) => {
            if (this.isLogin) {
                this.showRewards = this.isPlaying ? false : true
            } else {
                this.$confirm('Please sign in first', () => {
                    toNativePage(
                        'com.star.mobile.video.account.LoginActivity?returnClass=com.star.mobile.video.activity.BrowserActivity?loadUrl=' +
                            encodeURIComponent(window.location.href)
                    )
                })
            }
        })
        $(game).on('game_begin', () => {
            this.showMyCoins = false
        })
        $(game).on('game_exit', () => {
            this.showMyCoins = true
            this.isPlaying = false
        })
        this.getRankList(1)
    },
    methods: {
        toMyCoins() {
            if (this.isLogin) {
                toNativePage('com.star.mobile.video.me.mycoins.MyCoinsActivity')
            } else {
                this.$confirm('Please sign in first', () => {
                    toNativePage(
                        'com.star.mobile.video.account.LoginActivity?returnClass=com.star.mobile.video.activity.BrowserActivity?loadUrl=' +
                            encodeURIComponent(window.location.href)
                    )
                })
            }
        },
        getProcess(item) {
            const tmp = (item.process / item.threshold).toFixed(2) * 100
            return tmp >= 100 ? '100%' : tmp + '%'
        },
        // 获取游戏当期个人排行 用户coins
        getRankList(init) {
            this.latest = true
            this.$axios.get(`/hybrid/api/games/getRanks?gameId=${this.gameId}`).then(res => {
                if (res.data.code == 200) {
                    const data = res.data.data
                    this.myCoins = data.myCoins
                    this.DailyPlayed = data.DailyPlayed
                    this.preGameId = data.preGameId
                    this.endTime = dayjs(data.gameInfo.end_time).format('YYYY-MM-DD HH:mm:ss')
                    const vlist = data.list
                    vlist.sort(function(a, b) {
                        return b.goals - a.goals
                    })
                    this.rankList = vlist
                    try {
                        this.rankList.forEach(ele => {
                            if (ele.user_id === this.userId) {
                                this.goals = ele.goals
                                throw new Error('EndIterative')
                            }
                        })
                    } catch (e) {
                        if (e.message !== 'EndIterative') throw e
                    }
                    if (init) {
                        this.$nextTick(() => {
                            const t = document.querySelector('.my-rank')
                            if (t) document.querySelector('.box').scrollTop = t.getAttribute('data-index') * t.getBoundingClientRect().height
                        })
                    }
                }
            })
        },
        // 获取游戏上一期个人排行
        getLastWeekResult() {
            this.latest = false
            this.$axios.get(`/hybrid/api/games/getRanks?gameId=${this.preGameId}`).then(res => {
                if (res.data.code == 200) {
                    const data = res.data.data
                    const vlist = data.list
                    vlist.sort(function(a, b) {
                        return b.goals - a.goals
                    })
                    this.rankList = vlist
                }
            })
        },
        // 获取游戏任务
        getTaskByGame() {
            if (this.isLogin) {
                this.$nuxt.$loading.start()
                this.$axios.get(`/hybrid/api/games/getTaskByGame?gameId=${this.gameId}`).then(res => {
                    if (res.data.code == 200) {
                        this.showMissions = true
                        this.$nuxt.$loading.finish()
                        this.taskList = res.data.data
                    }
                })
            } else {
                this.$confirm('Please sign in first', () => {
                    toNativePage(
                        'com.star.mobile.video.account.LoginActivity?returnClass=com.star.mobile.video.activity.BrowserActivity?loadUrl=' +
                            encodeURIComponent(window.location.href)
                    )
                })
            }
        },
        // 游戏结束 获取奖励
        getAward(goal) {
            this.showMyCoins = true
            this.isPlaying = false
            this.setGoal(goal)
            let totalGoal = 0
            this.levelGoal.forEach(ele => {
                totalGoal += ele
            })
            if (totalGoal >= 10) {
                this.$axios.get(`/hybrid/api/games/getAward?gameId=${this.gameId}&goals=${totalGoal}`).then(res => {
                    if (res.data.code == 200) {
                        if (res.data.data.operatorCoins >= 100) {
                            this.$toast(`You get ${res.data.data.operatorCoins} coins in this round of game.`, 4000)
                            this.myCoins = res.data.data.afterCoins
                        }
                    } else {
                        this.$toast(res.data.message, 3000)
                    }
                })
            }
            this.levelGoal = []
        },
        // 关卡结束，添加goal进球数
        setGoal(goal) {
            if (goal > 0) {
                this.levelGoal.push(goal)
                this.$alert(`You've scroed ${goal} goals, Hero.`, () => {
                    this.$axios.get(`/hybrid/api/games/setGoal?goals=${goal}&gameId=${this.gameId}`).then(res => {
                        if (res.data.code == 200) {
                            this.getRankList()
                        } else {
                            this.$toast(res.data.message, 3000)
                        }
                    })
                })
            }
        },
        // 任务完成
        taskOver(item) {
            const taskId = item.id
            this.$axios.get(`/hybrid/api/games/taskOver?taskId=${taskId}`).then(res => {
                if (res.data.code == 200) {
                    item.overTask = true
                    this.$toast(`You get ${item.award} coins by task.`, 4000)
                    this.myCoins += item.award
                    this.getTaskByGame()
                } else {
                    this.$toast(res.data.message, 3000)
                }
            })
        },
        // 开始游戏
        startGame() {
            this.showRewards = false
            this.isPlaying = true
            this.$axios.get(`/hybrid/api/games/startGame?gameId=${this.gameId}`).then(res => {
                if (res.data.code == 200) {
                    window.s_oMenu._onButPlayRelease()
                    this.myCoins = res.data.data.afterCoins
                } else {
                    this.$toast(res.data.message, 3000)
                    this.isPlaying = false
                }
            })
        },
        share() {
            shareInvite(
                `${window.location.origin}/hybrid/lands/soccercup?utm_source=startimes_app&utm_medium=activity&utm_campaign=soccercup1`,
                'StarTimes ON Cup - Crazy Freekick',
                `Join us as a Country Hero and score for the Team to win the cup.`,
                `${window.location.origin}/res_nuxt/img/soccercup.png`
            )
        }
    },
    head() {
        return {
            title: 'StarTimes ON Cup - Crazy Freekick',
            script: [{ src: '/res_nuxt/jquery-3.4.1.min.js' }, { src: '/res_nuxt/createjs.min.js' }, { src: '/res_nuxt/main.js' }]
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
@keyframes moves {
    from {
        transform: rotate(-9deg);
    }
    50% {
        transform: rotate(9deg);
    }
    to {
        transform: rotate(0deg);
    }
}
.contain {
    position: fixed;
    top: 43%;
    width: 95%;
    margin: 0 2.5%;
    .my-coins-box {
        width: 100%;
        text-align: center;
        margin-bottom: 0.1rem;
        .my-coins {
            display: inline-block;
            padding: 0.3rem 0.6rem;
            background: rgba(37, 46, 40, 0.8);
            color: #e4ffc6;
            border: 2px solid #6dc60e;
            border-radius: 30px;
            font-size: 0.9rem;
            img {
                width: 1.3rem;
                margin-left: 0.5rem;
                & + img {
                    width: 0.5rem;
                    margin-left: 0.2rem;
                }
            }
            &.animation {
                -webkit-animation: moves 0.4s ease-out;
                animation: moves 0.4s ease-out;
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
            height: 2.2rem;
            line-height: 2.2rem;
            padding: 0 4%;
            &.time {
                color: #e4ffc6;
                border-bottom: 1px solid #66a578;
                margin: 0;
                font-size: 0.9rem;
                span {
                    float: right;
                    font-size: 0.75rem;
                }
                img {
                    width: 0.7rem;
                    margin-top: -0.1rem;
                }
            }
            &.your-score {
                height: 1.4rem;
                line-height: 1.9rem;
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
            padding-bottom: 11rem;
            overflow-y: scroll;
            clear: both;
        }
        .per-list {
            color: #66a578;
            height: 3.5rem;
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
                line-height: 3.5rem;
                span {
                    float: left;
                    img {
                        width: 2.2rem;
                        margin-right: 0.5rem;
                    }
                }
                .ranking {
                    width: 1.7rem;
                    line-height: 3.5rem;
                    height: 3.5rem;
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
                    font-size: 0.9rem;
                }
            }

            .right {
                float: right;
                width: 32%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 3.5rem;
                &.top-three {
                    line-height: 1.5rem;
                }
                .prize {
                    background: #9aee3f;
                    padding: 0 0.3rem;
                    font-size: 0.9rem;
                    position: relative;
                    border-radius: 2px;
                    margin-right: 0.2rem;
                    i {
                        position: absolute;
                        border: 0.3rem solid #9aee3f;
                        border-color: #9aee3f transparent transparent transparent;
                        left: 50%;
                        bottom: -0.6rem;
                        margin-left: -0.15rem;
                    }
                }
                img {
                    width: 0.8rem;
                }
            }
        }
    }
}
.bot-down {
    position: fixed;
    bottom: 0;
    height: 2.4rem;
    background: #3a8956;
    z-index: 200;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    width: 100%;
    box-shadow: 0px -1px 4px 0px rgba(0, 61, 21, 1);
    padding: 0 5%;
    span {
        display: inline-block;
        width: 32.4%;
        text-align: center;
        img {
            width: 4rem;
            position: relative;
            top: -1.3rem;
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
    margin-top: -14rem;
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
                &.played {
                    text-decoration: line-through;
                }
            }
            img {
                width: 8.6rem;
                display: block;
                margin: 0.5rem auto 0;
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
                    span {
                        position: absolute;
                        &.over-half {
                            color: #bf7029;
                            text-shadow: 0px 1px 0px rgba(33, 91, 53, 1);
                        }
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
    .games {
        width: 100%;
        background: #398754;
        padding-bottom: 2rem;
        position: relative;
        .gam-item {
            position: relative;
            img {
                width: 100%;
                &.mask {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                }
            }
        }
        .operation {
            position: absolute;
            bottom: 1rem;
            left: 0;
            width: 100%;
            text-align: center;
            .forward {
                width: 3rem;
            }
            .start {
                width: 8.6rem;
                margin: 0 0.5rem;
            }
            .next {
                width: 3rem;
            }
        }
    }
}
</style>
