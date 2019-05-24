<template>
    <div id="game">
        <div class="canvas">
            <canvas id="canvas" class="ani_hack" width="1360" height="640" />
        </div>
        <div class="contain">
            <nav id="nav">
                <a v-for="(item,index) in tabList" :key="index" :class="{on:tabIndex===index}" @click="tabIndex=index">
                    <span>{{item.name}}</span>
                </a>
            </nav>
            <div v-show="tabIndex==0" class="cty-rank">
                <p>
                    <span class="cty">{{country.name}} </span>ranks
                    <b>NO.1</b> now.
                    <span class="rules" @click="awardsCard=true">TEAM AWARDS</span>
                </p>
                <div class="box">
                    <div v-for="(item,index) in countryList" :key="index" :class="{'my-cty':item.code==country.id}" class="cty-list">
                        <div class="left">
                            <span :class="{first:index==0 ,second:index==1,third:index==2}" class="ranking">{{index + 1}}</span>
                            <span><img :src="item.logo"></span>
                            <span class="cty-name">{{item.name}}</span>
                        </div>
                        <div class="right">
                            <img src="~assets/img/vote/soccer.png" class="soccer">
                            <span> x {{item.ballot_num}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <mCard v-show="awardsCard" :title="'TEAM AWARDS'" class="card" @closeCard="awardsCard=false">
            <template v-slot:content>
                <p>每个用户每天可以不限制的玩一次游戏，该游戏每轮有最低进球数要求，如果已经完成最低进球可以开始下一轮，直到无法完成最低进球数，用户无法继续玩游戏。除了最基本的每日一次游戏机会，每个用户在分享游戏后可拥有重新开始一次游戏的机会。玩游戏过程中产生的所有进球数，将为自己定位的国家进行投票，一个进球为一张票，每日票数不限，根据进球数进行累加。（进球数类等于票数）</p>
            </template>
        </mCard>
    </div>
</template>
<script>
import mCard from '~/components/vote/card'
import countrys from '~/functions/countrys.json'
export default {
    layout: 'base',
    components: {
        mCard
    },
    data() {
        const obj = {}
        countrys.forEach(item => {
            obj[item.id] = item
        })
        return {
            tabList: [{ type: 'country', name: 'TOP TEAMS' }],
            countrys: obj,
            country: this.$store.state.country,
            countryList: [],
            tabIndex: 0,
            awardsCard:false
        }
    },
    mounted() {
        /* eslint-disable */
        const game = new window.CMain({
            shot_indicator_spd: 1000,
            decrease_shot_indicator_spd: 100
        })
        window.sizeHandler()

        $(game).on('save_score', function(evt, a) {
            alert(a)
        })
        $(game).on('level_end', function(evt, goal, score) {
            alert(score)
            alert(goal)
        })
        $(game).on('goal', function(evt, goal, score) {
            // alert(score)
            // alert(goal)
        })
        this.getCountryList()
    },
    methods: {
        getCountryList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=10`).then(res => {
                if (res.data.code == 0) {
                    let result = []
                    const vlist = res.data.data
                    vlist.forEach(item => {
                        if (item.show) {
                            const country = this.countrys[item.name]
                            result.push({
                                name: country.name,
                                code: item.name,
                                logo: country.nationalFlag,
                                ballot_num: item.ballot_num
                            })
                        }
                    })
                    result.sort(function(a, b) {
                        return b.ballot_num - a.ballot_num
                    })
                    this.countryList = result
                } else {
                    this.$alert('Top Team get error')
                }
            })
        }
    },
    head() {
        return {
            title: 'Hello Mr. Right',
            script: [{ src: '/res_nuxt/jquery-3.4.1.min.js' }, { src: '/res_nuxt/createjs-2014.12.12.min.js' }, { src: '/res_nuxt/main.js' }]
        }
    }
}
</script>
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
    #nav {
        height: 2rem;
        a {
            background: #174427;
            text-align: center;
            cursor: pointer;
            height: 2.4rem;
            line-height: 2.4rem;
            width: 45%;
            color: #66a578;
            display: block;
            border-radius: 15px 15px 0 0;
            &:link,
            &:active,
            &:visited,
            &:hover {
                background: none;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            }
            &.on {
                font-weight: 600;
                background: #252e28;
            }
        }
    }
    .cty-rank {
        background: #252e28;
        border-top: 1px solid #252e28;
        p {
            margin: 0.2rem;
            color: #94e6ac;
            height: 2.4rem;
            line-height: 2.4rem;
            padding: 0 5%;
            .cty {
                color: #ffe050;
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
            padding-bottom: 4.8rem;
            overflow-y: scroll;
        }
        .cty-list {
            color: #66a578;
            height: 4.8rem;
            line-height: 4.8rem;
            &.my-cty {
                border-left: 5px solid #94e6ac;
                background: rgba(148, 230, 172, 0.1);
                .left {
                    .ranking {
                        margin-left: 0.6rem;
                    }
                }
            }
            .left {
                float: left;
                width: 65%;
                span {
                    float: left;
                    img {
                        width: 2.5rem;
                        margin-right: 1rem;
                    }
                }
                .ranking {
                    width: 2rem;
                    box-sizing: border-box;
                    color: #94e6ac;
                    background: url('~assets/img/vote/others.png') no-repeat center;
                    background-size: contain;
                    text-align: center;
                    margin: 0 1rem;
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
                    width: 35%;
                }
            }

            .right {
                float: right;
                width: 34%;
                .soccer {
                    width: 1.5rem;
                }
            }
        }
    }
}
</style>
