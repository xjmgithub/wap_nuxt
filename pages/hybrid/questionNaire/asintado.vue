<template>
    <div id="asintado">
        <div class="character">
            <p class="title">Who Are You In These Series?</p>
            <img src="~assets/img/naire/role.png">
        </div>
        <div class="container">
            <div class="box">
                <div v-for="(item,index) in quesList" v-show="currIndex==index" :key="index" class="question">
                    <div>
                        <span class="num">{{index+1}}.</span>
                        {{item.question}}
                    </div>
                    <p @click="answer(1)">{{item.A}}</p>
                    <p @click="answer(0)">{{item.B}}</p>
                </div>
                <div class="progress">
                    <div class="line">
                        <div
                            v-for="(item,index) in quesList.length"
                            :key="index"
                            :class="{'now':index==currIndex}"
                            :style="{left:100/(quesList.length-1)*index-2+'%'}"
                        >
                            <img src="~assets/img/naire/ic-point.png">
                            <span/>
                        </div>
                    </div>
                    <p>
                        <span class="now">{{currIndex+1}}</span>
                        /{{quesList.length}}
                    </p>
                </div>
            </div>
            <div v-show="appType!=2" class="share" @click="toShare()">
                <img src="~assets/img/naire/ic_share_def_g.png"> SHARE TO MY FRIENDS
            </div>
        </div>
        <mShare/>
    </div>
</template>
<script>
import mShare from '~/components/web/share.vue'
import { shareInvite } from '~/functions/utils'
export default {
    layout: 'base',
    components: {
        mShare
    },
    data() {
        return {
            appType: this.$store.state.appType || 0,
            currIndex: 0,
            from: this.$route.query.from || '',
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
    computed: {
        platform() {
            if (this.appType == 1) {
                return 'Android'
            } else if (this.appType == 2) {
                return 'iOS'
            } else {
                return 'web'
            }
        }
    },
    watch: {
        currIndex(nv, ov) {
            this.sendEvLog({
                category: 'Characteristic Test',
                action: 'qupage_show',
                label: this.platform,
                value: nv + 1,
                from: this.from
            })
        }
    },
    mounted() {
        this.sendEvLog({
            category: 'Characteristic Test',
            action: 'qupage_show',
            label: this.platform,
            value: 1,
            from: this.from
        })
    },
    methods: {
        answer(sex) {
            const index = this.currIndex
            if (index === 0) {
                this.userGender = sex
            }
            if (index + 1 <= this.quesList.length - 1) {
                this.currIndex++
            } else {
                this.$axios
                    .get(`/hybrid/api/episode/submit?sex=${this.userGender}`)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.$router.push(`/hybrid/questionNaire/asintadoResult?ikey=${res.data.data}&from=${this.from}`)
                        } else {
                            this.$alert('Try again later')
                        }
                    })
                    .catch(() => {
                        this.$alert('Try again later')
                    })
            }
        },
        toShare() {
            if (this.appType > 0) {
                this.sendEvLog({
                    category: 'Characteristic Test',
                    action: 'share_click',
                    label: `${this.platform}_in`,
                    value: '',
                })
                shareInvite(
                    `${location.origin + location.pathname}?utm_source=charplay`,
                    'Characteristic Test',
                    'Who am I in Asintado, Avengers and Game of Thrones?',
                    'https://static.startimestv.com/static/files/production/poster/2019/6/114124.jpg'
                )
            } else {
                this.$store.commit('SET_SHARE_STATE', true)
            }
        }
    },
    head() {
        return {
            title: 'Characteristic Test',
            meta: [
                { name: 'description', property: 'description', content: 'Who am I in Asintado, Avengers and Game of Thrones?' },
                { name: 'og:description', property: 'og:description', content: 'Who am I in Asintado, Avengers and Game of Thrones?' },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: 'https://static.startimestv.com/static/files/production/poster/2019/6/114124.jpg'
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: 'Characteristic Test' }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
#asintado {
    background: linear-gradient(180deg, rgba(85, 85, 85, 1) 0%, rgba(201, 183, 166, 1) 100%);
    min-height: 100vh;
    .character {
        background: url('~assets/img/naire/background2.png') no-repeat top center;
        background-size: cover;
        .title {
            color: #ffffff;
            font-size: 1.3rem;
            text-align: center;
            text-shadow: 0px 3px 4px rgba(0, 0, 0, 1);
            // background: linear-gradient(to bottom, #b7b7b7 0%, #eeeeee 52%, #d8d8d8 100%);
            // background-clip: text;
            // -webkit-text-fill-color: transparent;
            font-weight: bold;
            line-height: 4rem;
        }
        img {
            display: block;
            width: 95%;
            margin: 0 auto;
        }
    }
    .container {
        background: url('~assets/img/naire/background1.png') no-repeat bottom;
        background-size: contain;
        width: 100%;
        padding: 0 4%;
        text-align: center;
        height: 60vh;
        .box {
            padding: 0 4%;
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
            height: 3rem;
            padding: 0.5rem 0;
            width: 95%;
            margin: 0.5rem 2.5%;
            .line {
                width: 100%;
                position: relative;
                height: 1px;
                background: #cba543;
                div {
                    position: absolute;
                    top: -1.5rem;
                    span {
                        display: inline-block;
                        width: 0.7rem;
                        height: 0.7rem;
                        background: #d8d8d8;
                        border-radius: 100%;
                    }
                    img {
                        width: 1rem;
                        display: block;
                        opacity: 0;
                        margin-bottom: 0.2rem;
                    }
                    &.now {
                        span {
                            width: 0.9rem;
                            height: 0.9rem;
                            background: #c3a041;
                        }
                        img {
                            opacity: 1;
                        }
                    }
                }
            }
            p {
                text-align: right;
                font-size: 0.95rem;
                font-weight: bold;
                margin-top: 0.8rem;
                color: #af8006;
                .now {
                    color: #8451ae;
                }
            }
        }
    }
    .share {
        display: inline-block;
        padding: 0 1.5rem;
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
