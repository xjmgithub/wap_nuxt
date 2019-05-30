<template>
    <div id="game">
        <div class="canvas">
            <canvas id="canvas" class="ani_hack" width="1360" height="640"/>
        </div>
        <div class="contain">
            <nav id="nav">
                <a v-for="(item,index) in tabList" :key="index" :class="{on:tabIndex===index}" @click="tabIndex=index">
                    <span>{{item.name}}</span>
                </a>
            </nav>
            <div v-show="tabIndex==0" class="cty-rank">
                <p>
                    <span class="cty">{{country.name}}</span>&nbsp;ranks
                    <b>NO.{{ctyRank}}</b> now.
                    <span class="rules" @click="awardsCard=true">TEAM AWARDS</span>
                </p>
                <div class="box">
                    <div
                        v-for="(item,index) in countryList"
                        :id="`c-${item.name}`"
                        :key="index"
                        :data-index="index"
                        :class="{'my-cty':item.code==country.id}"
                        class="cty-list"
                    >
                        <div class="left">
                            <span :class="{first:index==0 ,second:index==1,third:index==2}" class="ranking">{{index + 1}}</span>
                            <span v-if="item.logo">
                                <img :src="item.logo">
                            </span>
                            <span v-else>
                                <img src="~assets/img/flag_others.png">
                            </span>
                            <span class="cty-name">{{item.name}}</span>
                        </div>
                        <div class="right">
                            <img src="~assets/img/vote/soccer.png" class="soccer">
                            <span>x {{item.ballot_num}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <mCard v-show="awardsCard" :title="'AWARD RULES'" class="card" @closeCard="awardsCard=false">
            <template v-slot:content>
                <p>1. Activity time: 2019.5.29 00:00:00-2019.6.3 23:59:59</p>
                <p>2. Each user represents his own country, and each time he scores a goal, he scores 1 goal for the country.</p>
                <p>3. There is no limit on the number of times per person per day, can always play during the event</p>
                <p>4. After the event, 299 users in Champion country team will receive 1 FREE MAX VIP monthly coupon, 199 in the second country, 99 in the third country, and no more than 50 users in the 4th to 15th countries.</p>
                <p>5. The winning users will be randomly selected from the users who have scored for the country, only one per person. The winning probability will be based on the goals you contribute and the friends you invited to the game.</p>
                <p>6. Coupon issuance time: 2019-06-04.</p>
                <p>7. MAX VIP Coupon is specified to StarTimes ON MAX VIP, which contains all VIP contents on StarTimes ON that includes all the 30+ VIP live TV channels (ST World Football, AMC Movies, STAR LIFE, ST Swahili, BBC World News, NGW and many more).</p>
                <p>8. MAX VIP is only available for StarTimes ON APP.</p>
                <p>9. StarTimes ON reserves all the right for the final explanation.</p>
            </template>
        </mCard>
        <div class="bot-down">
            <div class="bot-down-text">The more friends you call, the higher winning probability will be.</div>
            <div class="bot-down-btn" @click="share">CALL NOW!</div>
        </div>
    </div>
</template>
<script>
import mCard from '~/components/vote/card'
import countrys from '~/functions/countrys.json'
import qs from 'qs'
import { shareInvite } from '~/functions/utils'
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
            awardsCard: false,
            ctyRank: '-'
        }
    },
    computed: {
        candidate() {
            let r = {}
            this.countryList.forEach(item => {
                if (item.code == this.country.id) {
                    r = item
                }
            })
            return r
        }
    },
    mounted() {
        /* eslint-disable */

        const first_in = localStorage.getItem('acon_first')
        if (!first_in) {
            this.$alert(
                `Welcome to the 'CRAZY FREEKICK'! As a country hero, You'll represent for Team ${
                    this.country.name
                }. Any goal you score will be added to your country. The higher ranking your team reaches, the more VIP FREE Coupons will be sent to people who have scored.`
            )
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
        this.getCountryList(1)

        window.soccer_cup_country = this.country.name
    },
    methods: {
        animateBall(callback) {
            const dest = document.querySelector('#c-' + this.country.name + ' .right img').getBoundingClientRect()
            const Contain = document.querySelector('.box').getBoundingClientRect()

            if (dest.top < Contain.top || dest.bottom > Contain.bottom) {
                callback && callback()
                return false
            }

            var box = document.createElement('img')
            box.setAttribute('src', '/res_nuxt/acon/sprites/ball_kick_left.png')
            box.style.setProperty('width', '1.5rem')
            box.style.setProperty('position', 'fixed')
            box.style.setProperty('z-index', '10000')
            document.querySelector('#game').appendChild(box)
            function animate(time) {
                requestAnimationFrame(animate)
                TWEEN.update(time)
            }
            requestAnimationFrame(animate)

            var coords = { x: dest.left, y: 150 }
            var tween = new TWEEN.Tween(coords)
                .to({ x: dest.left, y: dest.top }, 1500)
                .easing(TWEEN.Easing.Bounce.Out)
                .onUpdate(function() {
                    box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)')
                })
                .onComplete(function() {
                    document.querySelector('#game').removeChild(box)
                    callback()
                })
                .start()
        },
        getCountryList(init) {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=10`).then(res => {
                if (res.data.code == 0) {
                    let result = []
                    const vlist = res.data.data
                    vlist.sort(function(a, b) {
                        return b.ballot_num - a.ballot_num
                    })
                    vlist.forEach((item, index) => {
                        if (item.show) {
                            const country = this.countrys[item.name]
                            result.push({
                                name: country.name,
                                code: item.name,
                                logo: country.nationalFlag,
                                ballot_num: item.ballot_num,
                                candidate_id: item.id
                            })
                        }
                        if (this.country.id == item.name) {
                            this.ctyRank = index + 1
                        }
                    })
                    this.countryList = result
                    if (init) {
                        this.$nextTick(() => {
                            const t = document.querySelector('.my-cty')
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
                    this.animateBall(() => {
                        this.$axios({
                            url: '/voting/v1/ballot',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            data: qs.stringify({
                                candidate_id: this.candidate.candidate_id,
                                vote_id: 10,
                                weight: goal
                            })
                        }).then(res => {
                            if (res.data.code === 0) {
                                this.getCountryList()
                            }
                        })
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
    #nav {
        height: 2.3rem;
        a {
            background: #174427;
            text-align: center;
            cursor: pointer;
            height: 2.4rem;
            line-height: 2.6rem;
            width: 48%;
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
        border-top-right-radius: 15px;
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
            padding-bottom: 7rem;
            overflow-y: scroll;
            clear: both;
        }
        .cty-list {
            color: #66a578;
            height: 4rem;
            line-height: 4rem;
            &.my-cty {
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
                .soccer {
                    width: 1.5rem;
                }
            }
        }
    }
}

.bot-down {
    position: fixed;
    bottom: 0;
    height: 3rem;
    padding: 0.5rem 3%;
    display: -webkit-box;
    background: #3a8956;
    z-index: 200;
    box-shadow: 0 -2px 4px #232323cf;
    .bot-down-text {
        -webkit-box-flex: 4;
        font-size: 0.8rem;
        color: #ffd91f;
        margin-right: 0.3rem;
    }
    .bot-down-btn {
        -webkit-box-flex: 1;
        width: 8.2rem;
        height: 2rem;
        line-height: 2rem;
        font-size: 0.9rem;
        text-align: center;
        color: #ff5c05;
        background: #ffd91f;
        border-radius: 3px;
        font-weight: bold;
    }
}
</style>
