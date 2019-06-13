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
                    <span class="state" :class="{'closed':item.state=='closed'||item.state=='not started','progress':item.state=='in progress','ended':item.state=='ended'}">{{item.state }}
                        <span class="triangle" /></span>
                    <span class="topic">{{index+1}}.{{item.question}}</span>
                    <span class="joined">{{item.people | formatPeople}} people joined</span>
                    <p @click="answer(1)">A. {{item.A}}</p>
                    <p @click="answer(0)">B. {{item.B}}</p>
                    <span class="close">Close at
                        <a href="#"> 2019.06.15 02:10:00</a>
                    </span>
                </div>

            </div>
        </div>
        <div v-show="showRule==true||showPrize==true" class="card-layer" @click="showRule=false,showPrize=false" />
        <div v-show="showRule==true" class="card-rule">
            <img src="~assets/img/naire/ic_popup_close.png" @click="showRule=false">
            <div class="rule">
                <div class="dot">‧</div>
                <p>You will get free VIP coupon if you select the correct answer to each question.</p>
                <div class="dot">‧</div>
                <p>If you select all correct answers of questions today, you would get a free 1-day MAX VIP!</p>
                <div class="dot">‧</div>
                <p>With the VIP, you will be able to watch more wonderful contents when they start.</p>
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
                    <p class="total">In total 147233 people won this guess, and you will get:</p>
                    <img src="~assets/img/naire/ic_MAX.png" class="max">
                    <p class="vip">MAX VIP</p>
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
        }
    },
    data() {
        return {
            showRule: false,
            showPrize: false,
            quesList: [
                {
                    question: 'Are you a girl or a boy?',
                    people: 7564,
                    state: 'not started',
                    A: 'Girl',
                    B: 'Boy'
                },
                {
                    question: 'How close are you with your family?',
                    people: 22331,
                    state: 'in progress',
                    A: 'We get along well',
                    B: "It's...complicated"
                },
                {
                    question: "If someone gets in your way, what's your first reaction?",
                    people: 234,
                    state: 'in progress',
                    A: 'I will push back hard to get what I want.',
                    B: 'I will keep my temper well to find another way.'
                },
                {
                    question: 'Who are you to your friends?',
                    people: 5634,
                    state: 'closed',
                    A: "I'm always loyal and helping them.",
                    B: 'I always point out their problems.'
                },
                {
                    question: 'What is your bigges fear?',
                    people: 42323,
                    state: 'ended',
                    A: 'Hurting someone.',
                    B: 'Letting people down.'
                },
                {
                    question: "Who's your better date choice?",
                    people: 54787,
                    state: 'ended',
                    A: 'Someone who is smart.',
                    B: 'Someone who is good-looking.'
                }
            ]
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
        z-index: 100;
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
                padding: 0.3rem 0.5rem;
                font-weight: bold;
                border-radius: 2px;
                margin-left: 0.5rem;
                span {
                    vertical-align: middle;
                }
            }
        }
        .box {
            height: 60vh;
            overflow-y: scroll;
            padding: 1rem 0 7rem;
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
                        font-size: 0.8rem;
                        color: #999999;
                    }
                    &.close {
                        font-size: 0.8rem;
                        color: #999999;
                        a {
                            color: #62a6e6;
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
                    width: 6rem;
                    height: 2rem;
                    line-height: 2rem;
                    padding: 0 0.5rem;
                    position: absolute;
                    top: -1rem;
                    left: 0;
                    text-align: center;
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
                p {
                    border-radius: 2px;
                    padding: 0.8rem;
                    background: #f5f5f5;
                    margin: 0.8rem 0;
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
            padding: 1rem 0.8rem 0.5rem;
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
