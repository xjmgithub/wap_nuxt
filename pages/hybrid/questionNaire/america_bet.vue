<template>
    <div id="america">
        <img src="~assets/img/naire/bg_bet.png" class="bg-pic">
        <div class="contain">
            <div class="top">
                <p class="prize" @click="showRule=true">
                    <img src="~assets/img/naire/ic_prize.png">
                    <span>VIEW PRIZE</span>
                </p>
                <p class="share" @click="showPrize=true">
                    <img src="~assets/img/naire/ic_share.png">
                    <span>SHARE</span>
                </p>
            </div>
            <div class="box">
                <div v-for="(item,index) in quesList" :key="index" class="question">
                    <span
                        class="state"
                        :class="{'closed':item.state=='closed'||item.state=='unstart','progress':item.state=='progress','ended':item.state=='ended'}"
                    >
                        {{item.state | formatState}}
                        <span class="triangle"/>
                    </span>
                    <span class="topic">{{index+1}}.{{item.title}}</span>
                    <span class="joined">{{item.total | formatPeople}} people joined</span>

                    <div
                        v-for="(a,i) in item.anwsers"
                        :key="i"
                        :class="{'unstart':item.state=='unstart','pn':(item.state=='progress'||item.state=='closed')&&!item.userResult,'pa':item.userResult,}"
                        @click="answer(a.label)"
                    >
                        <p :style="{'width':(a.count/item.total) * 100 +'%'}"/>
                        <span class="vaule">
                            {{a.label}}. {{a.value}}
                            <img
                                v-if="item.result==item.userResult && item.state=='ended'"
                                src="~assets/img/naire/ic_right.png"
                            >
                            <img v-else-if="item.result!=item.userResult && item.state=='ended'" src="~assets/img/naire/ic_wrong.png">
                        </span>
                        <span v-if="item.state=='unstart'"/>
                        <span v-else-if="item.state!='unstart' && item.total>0" class="percent">{{(a.count/item.total).toFixed(3) * 100 +'%'}}</span>
                        <span v-else class="percent">0%</span>
                        <!-- <span v-if="item.total>0" class="percent">{{(a.count/item.total).toFixed(3) * 100 +'%'}}</span> -->
                    </div>

                    <span class="close">
                        Close at
                        <a href="#" :class="{'close':item.state=='closed' || item.state=='ended'}">{{item.end_time | formatTime}}</a>
                    </span>
                </div>
            </div>
        </div>
        <div v-show="showRule==true||showPrize==true" class="card-layer" @click="showRule=false,showPrize=false"/>
        <div v-show="showRule==true" class="card-rule">
            <img src="~assets/img/naire/ic_popup_close.png" @click="showRule=false">
            <div class="rule">
                <div class="dot">‧</div>
                <p>There are several questions in each match day, the more questions you guess correctly, the more prizes you will get;</p>
                <div class="dot">‧</div>
                <p>If you guess the correct answer to some of the questions in a match day, you will get a discount coupon.</p>
                <div class="dot">‧</div>
                <p>If you guess the correct answer to all questions in a match day, you will get a 1-day FREE VIP coupon.</p>
            </div>
        </div>
        <div v-show="showPrize==true" class="card-prize">
            <img src="~assets/img/naire/ic_close.png" class="close" @click="showPrize=false">
            <div class="prize">
                <img src="~assets/img/naire/bg_popup.png" class="bg" @click="showPrize=false">
                <div class="receive">
                    <img src="~assets/img/naire/Daenerys.png" class="photo">
                    <p class="user">Daenerys</p>
                    <p class="congra">Congratulations!</p>
                    <p class="total">In total 147233 people won this guess, and you have got:</p>
                    <img src="~assets/img/naire/ic_MAX.png" class="max">
                    <p class="vip">Already sent to your account</p>
                    <div class="btn">CHECK PRIZE</div>
                    <span>How to redeem my prize?</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    filters: {
        formatPeople(val) {
            return val.toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,')
        },
        formatState(val) {
            const ss =
                val == 'closed'
                    ? 'Waiting Result'
                    : val == 'unstart'
                        ? 'Not Start'
                        : val == 'progress'
                            ? 'In Progress'
                            : val == 'ended'
                                ? 'ended'
                                : ''
            return ss
        },
        formatTime(val) {
            const t = new Date(val)
            const yy = t.getFullYear()
            const mm = t.getMonth() + 1 < 10 ? '0' + (t.getMonth() + 1) : t.getMonth() + 1
            const dd = t.getDate() < 10 ? '0' + t.getDate() : t.getDate()
            const hh = t.getHours() < 10 ? '0' + t.getHours() : t.getHours()
            const mi = t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes()
            const ss = t.getSeconds() < 10 ? '0' + t.getSeconds() : t.getSeconds()
            return ' ' + yy + '.' + mm + '.' + dd + ' ' + hh + ':' + mi + ':' + ss
        }
    },
    data() {
        return {
            showRule: false,
            showPrize: false,
            userId: this.$store.state.user.id,
            quesList: [],
            quizId: this.$route.query.quizId || 1
        }
    },
    async asyncData({ app: { $axios }, store, route }) {
        try {
            let data = {}
            if (process.client) {
                const res = await $axios.get(`/hybrid/api/quiz/list?quizId=${route.query.quizId || 1}&userId=${store.state.user.id}`)
                data = res.data
            } else {
                const res = await $axios.get(
                    `http://localhost:3000/hybrid/api/quiz/list?quizId=${route.query.quizId || 1}&userId=${store.state.user.id}`
                )
                data = res.data
            }
            if (data.code == 200) {
                const result = data.data
                result.forEach(ques => {
                    let total = 0
                    ques.anwsers.forEach(ans => {
                        total = total + ans.count
                    })
                    ques.total = total
                })

                return {
                    quesList: result
                }
            } else {
                return {
                    quesList: []
                }
            }
        } catch (e) {
            return {
                quesList: []
            }
        }
    },
    mounted() {
        console.log(this.quesList)
        // this.getQuestion()
    },
    methods: {
        getQuestion() {
            this.$axios
                .get(`/hybrid/api/quiz/list?quizId=1&userid=${this.userId}`)
                .then(res => {
                    if (res.data.code == 200) {
                        const data = res.data.data
                        data.forEach(ques => {
                            let total = 0
                            ques.anwsers.forEach(ans => {
                                total = total + ans.count
                            })
                            ques.total = total
                        })
                        this.quesList = res.data.data
                        console.log(this.quesList)
                    } else {
                        this.$alert('Try again later')
                    }
                })
                .catch(() => {
                    this.$alert('Try again later')
                })
        },
        answer(ans) {}
    },
    head() {
        return {
            title: 'Crazy Bet'
        }
    }
}
</script>
<style>
html {
    background: #042c85;
}
</style>
<style lang="less" scoped>
#america {
    width: 100vw;
    min-height: 100vh;
    background: #042c85;
    .bg-pic {
        display: block;
        width: 100%;
        z-index: 100;
    }
    .contain {
        width: 96%;
        background: rgba(3, 3, 3, 0.5);
        border-radius: 3px 3px 0px 0px;
        margin: 0 auto;
        left: 2%;
        padding: 0 2%;
        border: 1px solid transparent;
        position: fixed;
        top: 30%;
        overflow-y: scroll;
        .top {
            text-align: right;
            p {
                display: inline-block;
            }
            padding-top: 0.5rem;
            img {
                width: 1rem;
            }
            .prize {
                font-size: 0.95rem;
                color: #ffcf49;
                font-weight: bold;
                text-decoration: underline;
            }
            .share {
                color: #ffffff;
                background: #2fb2f8;
                padding: 0.1rem 0.6rem;
                font-weight: bold;
                border-radius: 2px;
                margin-left: 0.5rem;
                img{
                    width:1.5rem;
                }
                span {
                    vertical-align: middle;
                    font-size:0.98rem;
                }
            }
        }
        .box {
            height: 60vh;
            overflow-y: scroll;
            padding: 1rem 0;
            .question {
                padding: 1rem;
                background: #ffffff;
                margin-bottom: 1.6rem;
                position: relative;
                border-radius: 3px;
                span {
                    display: block;
                    &.topic {
                        color: #333333;
                        font-weight: bold;
                        margin: 0.5rem 0;
                        line-height:1.3rem;
                    }
                    &.joined {
                        font-size: 0.9rem;
                        color: #999999;
                    }
                    &.close {
                        font-size: 0.8rem;
                        color: #999999;
                        a {
                            color: #62a6e6;
                            &.close {
                                color: #999999;
                            }
                        }
                    }
                }
                .triangle {
                    width: 0;
                    height: 0;
                    border: 0.5rem solid;
                    border-color: transparent transparent #8f4c09 #8f4c09;
                    position: absolute;
                    top: 0;
                    left: 100%;
                }
                .state {
                    color: #ffffff;
                    width: 8rem;
                    height: 2rem;
                    line-height: 2rem;
                    padding: 0 0.5rem;
                    position: absolute;
                    top: -1rem;
                    left: 0;
                    text-align: center;
                    box-shadow: 0 1px 0px rgba(0,0,0,0.2);
                    border-bottom-left-radius: 3px;
                    border-bottom-right-radius: 3px;
                    &.ended {
                        background: #969ba3;
                        .triangle {
                            border-color: transparent transparent #565a61 #565a61;
                        }
                    }
                    &.closed {
                        background: #f49b1e;
                        .triangle {
                            border-color: transparent transparent #8f4c09 #8f4c09;
                        }
                    }
                    &.progress {
                        background: #89c712;
                        .triangle {
                            border-color: transparent transparent #507903 #507903;
                        }
                    }
                }
                div {
                    border-radius: 2px;
                    background: #f5f5f5;
                    margin: 0.8rem 0;
                    position: relative;
                    height: 2.6rem;
                    line-height: 2.6rem;
                    &.unstart {
                        p {
                            background: none;
                        }
                    }
                    &.pn {
                        p {
                            background: #e3e3e3;
                        }
                    }
                    &.pa {
                        background: #d5ecfa;
                        p {
                            background: #58bbf7;
                        }
                    }
                    p {
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                    .vaule {
                        position: absolute;
                        top: 0;
                        left: 0.5rem;
                        color: #333333;
                        img {
                            width: 1rem;
                            margin-left: 0.8rem;
                        }
                    }
                    .percent {
                        position: absolute;
                        top: 0;
                        right: 0.5rem;
                        color: #999999;
                    }
                }
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
    .card-rule {
        font-size: 0.95rem;
        z-index: 1001;
        color: #333333;
        width: 75%;
        position: fixed;
        top: 50%;
        left: 50%;
        margin-top: -12rem;
        margin-left: -37.5%;
        img {
            width: 2rem;
            float: right;
        }
        .rule {
            padding: 1rem 1.2rem 0.5rem 1rem;
            background: #ffffff;
            margin-top: 3rem;
            border-radius: 4px;
            p {
                margin: 0 0 0.8rem 1rem;
            }
            .dot {
                font-size: 2.5rem;
                height: 2.5rem;
                line-height: 1rem;
                float: left;
            }
        }
    }
    .card-prize {
        font-size: 0.95rem;
        z-index: 1001;
        width: 80%;
        position: fixed;
        top: 50%;
        left: 50%;
        margin-top: -12rem;
        margin-left: -40%;
        text-align: right;
        .close {
            width: 2rem;
            margin-right: 1rem;
        }
        .prize {
            font-size: 0.95rem;
            position: relative;
            text-align: center;
            .bg {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
            .receive {
                position: absolute;
                width: 80%;
                left: 10%;
                /* bottom: -20rem; */
                margin-top: 3rem;
                .photo {
                    width: 3rem;
                }
                .user {
                    color: #ffffff;
                    margin-bottom: 0.5rem;
                }
                .congra {
                    color: #ffbe19;
                    font-weight: bold;
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                }
                .total,
                .vip {
                    color: #ffffff;
                    margin-bottom: 0.5rem;
                }
                .max {
                    width: 3rem;
                    margin-bottom: 0.5rem;
                }
                .btn {
                    width: 65%;
                    color: #248c6f;
                    font-weight: bold;
                    background: #ffffff;
                    border-radius: 2px;
                    margin: 0 auto;
                    margin-bottom: 0.5rem;
                    height: 2.2rem;
                    line-height: 2.2rem;
                }
                span {
                    color: #0d4e3c;
                    text-decoration: underline;
                }
            }
        }
    }
}
</style>
