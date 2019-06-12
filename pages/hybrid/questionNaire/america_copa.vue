<template>
    <div id="america">
        <img src="~assets/img/naire/bg.png" class="bg-pic">
        <div class="contain">
            <div class="top">
                <span class="prize">VIEW PRIZE</span>
                <span class="share">SHARE</span>
            </div>
            <div v-for="(item,index) in quesList" :key="index" class="question">
                <div>
                    <span class="num">{{index+1}}.</span>
                    {{item.question}}
                </div>
                <p @click="answer(1)">{{item.A}}</p>
                <p @click="answer(0)">{{item.B}}</p>
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
</template>
<script>
import { shareInvite } from '~/functions/utils'
export default {
    layout: 'base',

    data() {
        return {
            quesList: [
                {
                    question: 'Are you a girl or a boy?',
                    A: 'Girl',
                    B: 'Boy'
                },
                {
                    question: 'How close are you with your family?',
                    A: 'We get along well',
                    B: "It's...complicated"
                },
                {
                    question: "If someone gets in your way, what's your first reaction?",
                    A: 'I will push back hard to get what I want.',
                    B: 'I will keep my temper well to find another way.'
                },
                {
                    question: 'Who are you to your friends?',
                    A: "I'm always loyal and helping them.",
                    B: 'I always point out their problems.'
                },
                {
                    question: 'What is your bigges fear?',
                    A: 'Hurting someone.',
                    B: 'Letting people down.'
                },
                {
                    question: "Who's your better date choice?",
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
        min-height: 100vh;
        font-size: 0.95rem;
        border: 1px solid transparent;
        position: fixed;
        top: 40%;
        overflow: auto;
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
        .question {
            padding: 1rem;
            background: #FFFFFF;
            margin-bottom:1.6rem;
            .num {
                color: #8451ae;
                font-size: 1rem;
                font-weight: bold;
            }
            p {
                border-radius: 20px;
                border: 1px solid #c9a23e;
                padding: 0.8rem;
                text-align: center;
                margin: 0.8rem 0;
                &:active {
                    background: #ebc956;
                    opacity: 0.6175;
                }
            }
        }
        .bot-down {
            width: 100%;
            color: #ffffff;
            margin-top: 0.8rem;
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
