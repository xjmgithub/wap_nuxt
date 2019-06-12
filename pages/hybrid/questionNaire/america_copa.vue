<template>
    <div id="america">
        <img src="~assets/img/naire/bg.png" class="bg-pic">
        <div class="contain">
            <div class="top">
                <span class="prize">VIEW PRIZE</span>
                <span class="share">SHARE</span>
            </div>
            <div class="box">
                <div v-for="(item,index) in quesList" :key="index" class="question">
                    <span class="state" :class="{'closed':item.state=='closed'||item.state=='not started','progress':item.state=='in progress','ended':item.state=='ended'}">{{item.state }} </span>
                    <span class="topic">{{index+1}}.{{item.question}}</span>
                    <span class="joined">{{item.people | formatPeople}} people joined</span>
                    <p @click="answer(1)">A. {{item.A}}</p>
                    <p @click="answer(0)">B. {{item.B}}</p>
                    <span class="close">Close at 
                        <a href="#"> 2019.06.15 02:10:00</a>
                    </span>
                </div>
                <div class="bot-down">
                    <div class="bot-down-rule">
                        <div class="dot">‧</div>
                        <p>You will get free VIP coupon if you select the correct answer to each question.</p>
                        <div class="dot">‧</div>
                        <p>If you select all correct answers of questions today, you would get a free 1-day MAX VIP!</p>
                        <div class="dot">‧</div>
                        <p>With the VIP, you will be able to watch more wonderful contents when they start.</p>
                    </div>
                    <div class="bot-down-btn" @click="share">Click here and share to your friends</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { shareInvite } from '~/functions/utils'
export default {
    layout: 'base',
    filters: {
        formatPeople(val) {
            return val.toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,')
        }
        // ,
        // formatstate(val) {
        //     return val.toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,')
        // }
    },
    data() {
        return {
            quesList: [
                {
                    question: 'Are you a girl or a boy?',
                    people: 7564,
                    state:'not started',
                    A: 'Girl',
                    B: 'Boy'
                },
                {
                    question: 'How close are you with your family?',
                    people: 22331,
                    state:'in progress',
                    A: 'We get along well',
                    B: "It's...complicated"
                },
                {
                    question: "If someone gets in your way, what's your first reaction?",
                    people: 234,
                    state:'in progress',
                    A: 'I will push back hard to get what I want.',
                    B: 'I will keep my temper well to find another way.'
                },
                {
                    question: 'Who are you to your friends?',
                    people: 5634,
                    state:'closed',
                    A: "I'm always loyal and helping them.",
                    B: 'I always point out their problems.'
                },
                {
                    question: 'What is your bigges fear?',
                    people: 42323,
                    state:'ended',
                    A: 'Hurting someone.',
                    B: 'Letting people down.'
                },
                {
                    question: "Who's your better date choice?",
                    people: 54787,
                    state:'ended',
                    A: 'Someone who is smart.',
                    B: 'Someone who is good-looking.'
                }
            ]
        }
    },
    mounted() {},
    methods: {
        getCountryList(init) {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=12`).then(res => {})
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
    }
    .contain {
        width: 96%;
        background: rgba(3, 3, 3, 0.5);
        border-radius: 2px 2px 0px 0px;
        margin: 0 auto;
        left: 2%;
        padding: 0 2%;
        min-height: 100vh;
        border: 1px solid transparent;
        position: fixed;
        top: 40%;
        overflow-y: scroll;
        .top {
            text-align: right;
            padding: 0.5rem 0;
            .prize {
                font-size: 0.95rem;
                color: #ffcf49;
                font-weight: bold;
                text-decoration: underline;
            }
            .share {
                color: #ffffff;
                background: #2fb2f8;
                padding: 0.2rem;
                font-weight: bold;
                border-radius: 2px;
                display: inline-block;
                margin-left: 0.5rem;
            }
        }
        .box {
            height: 60vh;
            overflow-y: scroll;
            padding:1rem 0 7rem;
            .question {
                padding: 1rem;
                background: #ffffff;
                margin-bottom: 1.6rem;
                position: relative;
                span {
                    display: block;
                    &.topic {
                        color: #333333;
                        font-weight: bold;
                        margin: 0.2rem 0;
                    }
                    &.joined {
                        font-size: .8rem;
                        color: #999999;
                    }
                    &.close {
                        font-size: .8rem;
                        color: #999999;
                        a{
                            color:#62A6E6;
                        }
                    }
                }
                .state{
                    color:#ffffff;
                    width:6rem;
                    height:2rem;
                    line-height: 2rem;
                    padding:0 .5rem;
                    position: absolute;
                    top:-1rem;
                    left:0;
                    text-align: center;
                    &.ended{
                        background: #969BA3;
                    }
                    &.closed{
                        background: #F49B1E;
                    }
                    &.progress{
                        background: #89C712;
                    }
                }
                p {
                    border-radius: 2px;
                    padding: 0.8rem;
                    background: #f5f5f5;
                    margin: 0.8rem 0;
                }
            }
        }

        .bot-down {
            width: 100%;
            color: #ffffff;
            margin-top: 0.8rem;
            font-size: 0.95rem;
            .bot-down-rule {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                padding: 0.8rem 0.8rem 0.1rem;
            }
            p {
                margin: 0 0 0.8rem 0.8rem;
            }
            .dot {
                font-size: 2.5rem;
                height: 2.5rem;
                line-height: 1rem;
                float: left;
            }
            .bot-down-btn {
                background: linear-gradient(225deg, rgba(241, 175, 31, 1) 0%, rgba(240, 118, 41, 1) 100%);
                border-radius: 2px;
                width: 85%;
                margin: 0 auto;
                text-align: center;
                font-size: 0.95rem;
                height: 2.5rem;
                line-height: 2.5rem;
                margin-top: 1rem;
            }
        }
    }
}
</style>
