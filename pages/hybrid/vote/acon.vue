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
                    <span class="cty">Nigeria </span>ranks
                    <b>NO.1</b> now.
                    <span class="rules">TEAM AWARDS</span>
                </p>
                <div class="box">
                    <div v-for="(item,index) in countryList" :key="index" class="cty-list">
                        <span :class="{first:index==0 ,second:index==1,third:index==2}" class="ranking">{{index + 1}}</span>
                        <img :src="item.logo">
                        <span>{{item.name}}</span>
                        <div class="right">
                            <img src="~assets/img/vote/soccer.png" class="soccer">
                            <span> x {{item.ballot_num}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import countrys from '~/functions/countrys.json'
import { cdnPicSrc } from '~/functions/utils'
export default {
    layout: 'base',
    data() {
        return {
            tabList: [{ type: 'country', name: 'TOP TEAMS' }],
            countrys: countrys,
            country: this.$store.state.country,
            countryList: [
                {
                    name: 'Nigeria',
                    code: '2',
                    logo: 'http://cdn.startimestv.com/static/image/flag_nigera.png',
                    ballot_num: 189
                },
                {
                    name: 'Tanzania',
                    code: '1',
                    logo: 'http://cdn.startimestv.com/static/image/flag_tanzania.png',
                    ballot_num: 829
                },
                {
                    name: 'Uganda',
                    code: '3',
                    logo: 'http://cdn.startimestv.com/static/image/flag_uganda.png',
                    ballot_num: 859
                },
                {
                    name: 'Rwanda',
                    code: '5',
                    logo: 'http://cdn.startimestv.com/static/image/flag_rwanda.png',
                    ballot_num: 389
                },
                {
                    name: 'Kenya',
                    code: '6',
                    logo: 'http://cdn.startimestv.com/static/image/flag_kenya.png',
                    ballot_num: 89
                }
            ],
            tabIndex: 0
        }
    },
    mounted() {
        /* eslint-disable */
        const game = new window.CMain({
            shot_indicator_spd: 1000,
            decrease_shot_indicator_spd: 100
        })
        window.sizeHandler()

        $(game).on('game_start', function(evt) {
            // alert('game_start')
        })
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
    },
    methods: {
        getCountryMsg(item) {
            this.countrys.forEach(ele => {
                if (ele.code == item.code) {
                    item.logo = cdnPicSrc.call(this, ele.nationalFlag)
                    item.name = ele.name
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
    min-height: 100vh;
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
    background: #3a8956;
    top: 44%;
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
        padding: 0 5%;
        p {
            margin: 0.2rem;
            color: #94e6ac;
            height: 2.4rem;
            line-height: 2.4rem;
            .cty {
                color: #ffe050;
            }
            .rules {
                color: #f34c02;
                text-decoration: underline;
                float: right;
                font-size: 0.8rem;
                font-weight: bold;
            }
        }
        .box {
            overflow-y: scroll;
        }
        .cty-list {
            color: #66a578;
            height: 4.8rem;
            line-height: 4.8rem;
            span {
                display: inline-block;
            }
            .ranking {
                width: 2rem;
                box-sizing: border-box;
                color: #94e6ac;
                background: url('~assets/img/vote/others.png') no-repeat center;
                background-size: contain;
                text-align: center;
                margin-right: 1rem;
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
                & + img {
                    width: 2.5rem;
                    margin-right: 1rem;
                }
            }
            .right {
                float: right;
                width: 30%;
                .soccer {
                    width: 1.5rem;
                }
            }
        }
    }
}
</style>
