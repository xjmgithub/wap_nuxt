<template>
    <div id="asintado">
        <div class="container">
            <div class="box">
                <div v-for="(item,index) in quesList" v-show="currIndex==index" :key="index" class="question">
                    <div>
                        <span class="num">{{index+1}}. </span>{{item.question}}
                    </div>
                    <p @click="answer(item.A)">{{item.A}}</p>
                    <p @click="answer(item.B)">{{item.B}}</p>
                </div>
                <div class="progress">
                    <div class="line">
                        <span v-for="(item,index) in quesList.length" :key="index" :class="{'now':index==currIndex}" :style="{left:100/(quesList.length-1)*index-1+'%'}" />
                    </div>
                    <p>
                        <span class="now">{{currIndex+1}}</span>/{{quesList.length}}
                    </p>
                </div>
            </div>
            <div class="share" @click="toShare()">
                <img src="~assets/img/naire/ic_share_def_g.png"> SHARE TO MY FRIENDS
            </div>
        </div>
        <img src="~assets/img/naire/background1.png" class="bg-bom">
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            currIndex: 0,
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
            ],
            userGender: ''
        }
    },
    methods: {
        answer(sex) {
            const index = this.currIndex
            if (index === 0) {
                this.userGender = sex.toLowerCase()
            }
            if (index + 1 <= this.quesList.length - 1) {
                this.currIndex++
            } else {
                this.$router.push(`/hybrid/questionNaire/asintadoResult?gender=${this.userGender}`)
            }
        },
        toShare() {}
    },
    head() {
        return {
            title: 'Characteristic Test'
        }
    }
}
</script>
<style lang="less" scoped>
#asintado {
    background: url("~assets/img/naire/background2.png") no-repeat,linear-gradient(180deg, rgba(85, 85, 85, 1) 0%, rgba(201, 183, 166, 1) 100%) ;
    background-size: contain;
    min-height:100vh;
    .bg-top{
        width:100%;
    }
    .bg-bom{
        width:100%;
        position: fixed;
        bottom:0;
    }
    .container {
        position: fixed;
        top: 43%;
        width: 90%;
        margin: 0 5%;
        text-align: center;
        z-index:99;
        .box {
            padding: 0 3%;
            background: #ffffff;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
            border-radius: 13px;
            color: #3c3c3c;
            font-size: 0.95rem;
        }
        .question {
            padding: 1rem 0;
            text-align: left;
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
        .progress {
            height: 4.5rem;
            padding: 0.5rem 0;
            width: 95%;
            margin: 0 2.5%;
            .line {
                width: 100%;
                position: relative;
                height: 1px;
                background: #cba543;
                span {
                    position: absolute;
                    width: 0.56rem;
                    height: 0.56rem;
                    background: #d8d8d8;
                    border-radius: 100%;
                    top: -0.22rem;
                    &.now {
                        width: 0.75rem;
                        height: 0.75rem;
                        background: #c3a041;
                        top: -0.37rem;
                    }
                }
            }
            p {
                text-align: right;
                font-size: 0.95rem;
                font-weight: bold;
                margin-top: 0.5rem;
                color: #af8006;
                .now {
                    color: #8451ae;
                }
            }
        }
    }
    .share {
        display: inline-block;
        padding: 0 1rem;
        color: #63428a;
        font-size: 0.95rem;
        vertical-align: middle;
        background: linear-gradient(180deg, rgba(235, 202, 77, 1) 0%, rgba(235, 200, 112, 1) 34%, rgba(188, 147, 43, 1) 100%);
        border-radius: 20px;
        font-weight: bold;
        margin-top: 1rem;
        height: 2.5rem;
        line-height: 2.5rem;
        img {
            width: 1.5rem;
        }
    }
}
</style>
