<template>
    <div id="america">
        <img v-if="quizId==21" src="~assets/img/naire/bet21.jpg" class="bg-pic" />
        <img v-else src="~assets/img/naire/Uganda.jpg" class="bg-pic" />
        <div class="contain">
            <div class="top">
                <p class="prize" @click="showRule=true">
                    <img src="~assets/img/naire/ic_prize.png" />
                    <span v-if="quizId==21">RULES</span>
                    <span v-else>VIEW PRIZE</span>
                </p>
                <p class="share" @click="share()">
                    <img src="~assets/img/naire/ic_share.png" />
                    <span>SHARE</span>
                    <img class="corner" src="~assets/img/naire/bonus.png" />
                </p>
            </div>
            <div class="box">
                <div style="padding:1rem 0 2rem;">
                    <div v-for="(item,index) in quesList" :key="index" :class="{'end-miss':!item.guess && item.state=='ended','end-win':item.guess==item.result && item.state=='ended','end-lost':item.guess!=''&&item.guess!=item.result && item.state=='ended'}" class="question">
                        <span class="state" :class="{'closed':item.state=='closed'||item.state=='unstart','progress':item.state=='progress','ended':item.state=='ended'}">
                            {{item.state | formatState}}
                            <span class="triangle" />
                        </span>
                        <span class="topic">{{item.title}}</span>
                        <span class="joined">{{item.total | formatPeople}} people joined</span>
                        <div v-for="(a,i) in item.anwsers" :key="i" :class="{'answer':true,'unstart':item.state=='unstart','default-scale':item.state!='unstart'&&!a.clicked,'my-choose-scale':item.guess==a.id,'clicked':a.clicked,'end-right':item.result==a.id && item.state=='ended'}" @click="showBetBtn(item,a)">
                            <p v-if="!(item.result==a.id && item.state=='ended')" :style="{'width':percent(a.count,item.total)}" />
                            <span class="vaule">
                                {{a.label}}. {{a.value}}
                                <img v-if="item.result==a.id && item.state=='ended'" src="~assets/img/naire/ic_right.png" />
                                <img v-else-if="item.result!=a.id && a.id==item.guess && item.state=='ended'" src="~assets/img/naire/ic_wrong.png" />
                            </span>
                            <span v-if="item.state=='ended'&& item.result==a.id " :class="{'won':item.guess==a.id}" class="percent right">
                                {{a.count}} people won!
                                <img v-show="item.guess==item.result" src="~assets/img/naire/ic_gift.png" @click="showPrizeDialog(a.count)" />
                            </span>
                            <span v-else-if="item.state!='unstart' && !a.clicked" class="percent">{{percent(a.count,item.total)}}</span>
                        </div>
                        <span class="close">
                            Close at
                            <a href="javascript:void(0)" :class="{'close':item.state=='closed' || item.state=='ended'}">{{item.end_time | formatTime}}</a>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="showRule==true||showPrize==true" class="card-layer" @click="showRule=false,showPrize=false" />
        <div v-show="showRule==true" :class="{bet21:quizId==21}" class="card-rule">
            <img src="~assets/img/naire/ic_popup_close.png" @click="showRule=false" />
            <div v-show="quizId==11" class="rule">
                <div class="dot">‧</div>
                <p>There are several questions in each episode, you will get prize if all questions are answered correctly ;</p>
                <div class="dot">‧</div>
                <p>If you guess the correct answer to all questions , you will get a 1-week FREE VIP coupon.</p>
            </div>
            <div v-show="quizId==21" class="rule">
                <div class="dot">‧</div>
                <p>1. There is only one correct answer to each question.</p>
                <div class="dot">‧</div>
                <p>
                    <b>2. Every day we will update a question and answer to previous question will be announced.</b>
                </p>
                <div class="dot">‧</div>
                <p>3. Users who answer correctly every single day will get a coupon, with which you will get a 50% discount on our Weekly VIP. Please also be noted, this coupon shall be used within 24 hours.</p>
                <div class="dot">‧</div>
                <p>4. For each natural month, 5 users randomly selected from those who answer at least 10 questions correctly in a row, will be awarded with free coupons of our Monthly VIP; 2 users randomly selected from those who answer at least 20 questions correctly in a row, will be awarded with Star signature football</p>
            </div>
        </div>
        <div v-show="showPrize==true" class="card-prize">
            <img src="~assets/img/naire/ic_close.png" class="close" @click="showPrize=false" />
            <div class="prize">
                <img src="~assets/img/naire/bg_popup.png" class="bg" @click="showPrize=false" />
                <div class="receive">
                    <img v-if="$store.state.user.head" :src="cdnPicSrc($store.state.user.head)" class="photo" />
                    <img v-else src="http://cdn.startimestv.com/head/h_d.png" />
                    <p class="user">{{$store.state.user.nickName||$store.state.user.userName}}</p>
                    <p class="congra">Congratulations!</p>
                    <p class="total">In total {{prizeNum}} people won this guess, and you have got:</p>
                    <img src="~assets/img/naire/ic_MAX.png" class="max" />
                    <p class="vip">Already sent to your account</p>
                    <div class="btn" @click="checkPrize()">CHECK PRIZE</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { toNativePage, shareInvite } from '~/functions/app'
import BScroll from 'better-scroll'
import { Base64 } from 'js-base64'
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
                    : val == 'unstart' ? 'Not Start' : val == 'progress' ? 'In Progress' : val == 'ended' ? 'Ended' : ''
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
            quizId: this.$route.query.quizId || 1,
            prizeNum: 0,
            title: '',
            shareTitle:'',
            shareContent:''
        }
    },
    watch: {
        showRule(nv, ov) {
            if (nv) {
                this.sendEvLog({
                    category: 'guess_event',
                    action: 'view_prize',
                    label: '',
                    value: 1
                })
            }
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
                        ans.clicked = false
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
        this.sendEvLog({
            category: 'guess_event',
            action: 'guess_event_show',
            label: '',
            value: 1
        })
        this.title = this.quizId == 21 ? 'Challenge Of Football Knowledge' : 'Challengers Crazy Guess'
        this.shareTitle = this.quizId == 21 ? '' : 'Hisense Challengers Uganda Crazy Guess'
        this.shareContent = this.quizId == 21 ? '' : 'Win 1,000,000 VIPs! Get them free in StarTimes ON Crazy Guess!'
        document.querySelector('#america').height = document.body.clientHeight
        if (this.$store.state.appType == 1) {
            if (
                navigator.userAgent.indexOf('Android 6') > 0 ||
                navigator.userAgent.indexOf('Android 7') > 0 ||
                navigator.userAgent.indexOf('Android 8') > 0 ||
                navigator.userAgent.indexOf('Android 9') > 0
            ) {
                this.$nextTick(() => {
                    this.bscroll = new BScroll('.box', {
                        startY: 0,
                        bounce: {
                            top: false,
                            bottom: false,
                            left: false,
                            right: false
                        },
                        click: true,
                        tap: true,
                        observeDOM: false
                    })
                })
            }
        }
    },
    methods: {
        showPrizeDialog(num) {
            this.prizeNum = num
            this.showPrize = true
            this.sendEvLog({
                category: 'guess_event',
                action: 'gift_click',
                label: '',
                value: 1
            })
        },
        percent(count, total) {
            if (total <= 0) return '0%'
            const scale = (count / total).toFixed(3)
            let m = 0
            const s1 = scale.toString()
            const s2 = '100'
            try {
                m += s1.split('.')[1].length
            } catch (e) {}
            try {
                m += s2.split('.')[1].length
            } catch (e) {}
            return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m) + '%'
        },
        showBetBtn(question, answer) {
            if (question.state != 'progress') return
            if (question.guess) return
            this.sendEvLog({
                category: 'guess_event',
                action: 'guess_select',
                label: question.id,
                value: 1
            })
            if (question.state == 'progress' && !question.guess) {
                question.anwsers.forEach(item => {
                    item.clicked = false
                })
                answer.clicked = true
            }
            this.$confirm(
                'Confirm to select this option?',
                () => {
                    this.answer(question, answer)
                },
                () => {
                    this.sendEvLog({
                        category: 'guess_event',
                        action: 'selection_cancel',
                        label: question.id,
                        value: 1
                    })
                },
                'Confirm',
                'Cancel'
            )
        },
        answer(question, answer) {
            this.sendEvLog({
                category: 'guess_event',
                action: 'guess_click',
                label: question.id,
                value: 1
            })
            const isLogin = this.$store.state.user.roleName && this.$store.state.user.roleName.toUpperCase() !== 'ANONYMOUS'
            if (!isLogin) {
                this.sendEvLog({
                    category: 'guess_event',
                    action: 'login_dialog_show',
                    label: '',
                    value: 1
                })
                this.$confirm('Login is required for you to get prizes, please login', () => {
                    if (this.$store.state.appType === 1) {
                        toNativePage('com.star.mobile.video.account.LoginActivity')
                    } else {
                        toNativePage('startimes://login')
                    }
                })
                return false
            }
            this.$axios
                .get(`/hybrid/api/quiz/bet?userId=${this.userId}&quizId=${this.quizId}&questionId=${question.id}&answerId=${answer.id}`)
                .then(res => {
                    if (res.data.code == 200) {
                        answer.clicked = false
                        answer.count = answer.count + 1
                        question.total = question.total + 1
                        question.guess = answer.id
                    } else {
                        this.$alert(res.data.message)
                    }
                })
                .catch(e => {
                    this.$alert('Try again later')
                })
        },
        share() {
            this.sendEvLog({
                category: 'guess_event',
                action: 'guess_share',
                label: '',
                value: 1
            })
            const shareUrl = this.quizId == '21' ? 'america_guess21' : 'america_guess'
            shareInvite(
                `${location.origin}/hybrid/questionNaire/${shareUrl}?utm_source=usacup`,
                'COPA AMERICA 2019 CRAZY GUESS',
                'Win 1,000,000 VIPs! Get them free in StarTimes ON Crazy Guess!',
                'http://cdn.startimestv.com/banner/bg_guess.jpg'
            )
        },
        checkPrize() {
            this.sendEvLog({
                category: 'guess_event',
                action: 'check_prize_click',
                label: '',
                value: 1
            })
            toNativePage('com.star.mobile.video.me.coupon.OttCouponsActivity?needLogin=true')
        }
    },
    head() {
        return {
            title: this.title,
            meta: [
                { name: 'description', property: 'description', content: this.shareContent },
                { name: 'og:description', property: 'og:description', content: this.shareContent },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: 'http://cdn.startimestv.com/banner/Uganda.jpg'
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: this.shareTitle },
                {
                    name: 'al:android:url',
                    property: 'al:android:url',
                    content:
                        'starvideo://platformapi/webtoapp?channel=facebook&target=' +
                        Base64.encode(
                            `com.star.mobile.video.activity.BrowserActivity?loadUrl=http://m.startimestv.com/hybrid/questionNaire/america_bet`.replace(
                                /&/g,
                                '**'
                            )
                        )
                },
                { name: 'al:android:app_name', property: 'al:android:app_name', content: 'StarTimes' },
                { name: 'al:android:package', property: 'al:android:package', content: 'com.star.mobile.video' },
                { name: 'al:web:url', property: 'al:web:url', content: 'http://m.startimestv.com' }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
#america {
    width: 100%;
    min-height: 100vh;
    background: -webkit-linear-gradient(270deg, #042c85 0%, #042c85 50%, #325ab1 100%);
    .bg-pic {
        display: block;
        width: 100%;
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
        top: 33%;
        .top {
            text-align: right;
            p {
                display: inline-block;
            }
            padding: 0.5rem 0;
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
                padding: 0.3rem 1rem;
                font-weight: bold;
                border-radius: 2px;
                margin-left: 0.5rem;
                position: relative;
                img {
                    width: 1.1rem;
                }
                span {
                    vertical-align: middle;
                    font-size: 0.98rem;
                }
                .corner {
                    position: absolute;
                    right: 0;
                    height: 1.5rem;
                    width: 1.5rem;
                    top: 0;
                }
            }
        }
        .box {
            height: 66vh;
            overflow-y: scroll;
            padding-top: 1rem;
            padding-bottom: 1rem;
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
                        line-height: 1.3rem;
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
                    box-shadow: 0 1px 0px rgba(0, 0, 0, 0.2);
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
                .answer {
                    border-radius: 2px;
                    background: #f5f5f5;
                    margin: 0.8rem 0;
                    position: relative;
                    height: 2.6rem;
                    line-height: 2.6rem;
                    .bet-btn {
                        background: #58bbf7;
                        width: 4rem;
                        text-align: center;
                        height: 1.8rem;
                        line-height: 1.8rem;
                        position: absolute;
                        right: 0.35rem;
                        top: 0.35rem;
                        z-index: 100;
                        display: none;
                        font-size: 0.95rem;
                        border-radius: 3px;
                    }
                    &.unstart {
                        p {
                            background: none;
                        }
                    }
                    &.default-scale {
                        p {
                            background: #e3e3e3;
                        }
                    }
                    &.my-choose-scale {
                        background: #d5ecfa;
                        p {
                            background: #58bbf7;
                        }
                    }
                    &.clicked {
                        border: #58bbf7 solid 1px;
                        background: #d5ecfa;
                        .bet-btn {
                            display: block;
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
                        img {
                            width: 1rem;
                            margin-left: 0.3rem;
                        }
                    }
                    .percent {
                        position: absolute;
                        top: 0;
                        right: 0.5rem;
                        color: #999999;
                        &.right {
                            color: #ffffff;
                            padding-right: 1rem;
                            &.won {
                                padding-right: 2.7rem;
                            }
                            img {
                                position: absolute;
                                width: 3.6rem;
                                top: -0.4rem;
                                right: -1.2rem;
                                animation: gift 0.4s ease-out;
                                animation-direction: alternate;
                                animation-iteration-count: infinite;
                            }
                        }
                    }
                }
                &.end-miss {
                    background: #ffffff url('~assets/img/naire/stamp_missed.png') no-repeat right 8%;
                    background-size: 25%;
                    .answer {
                        &.end-right {
                            background: rgba(157, 217, 15, 1) url('~assets/img/naire/button_pattern.png') no-repeat right center / 15%;
                            p {
                                background: rgba(0, 0, 0, 0);
                            }
                        }
                    }
                }
                &.end-win {
                    background: #ffffff url('~assets/img/naire/stamp_won.png') no-repeat right 8%;
                    background-size: 25%;
                    .answer {
                        &.end-right {
                            background: rgba(157, 217, 15, 1);
                            // background: -webkit-linear-gradient(180deg, rgba(157, 217, 15, 1) 0%, rgba(68, 168, 0, 1) 100%);
                            color: white;
                            position: relative;
                        }
                        &.my-choose-scale {
                            p {
                                background: #58bbf7;
                            }
                        }
                    }
                }
                &.end-lost {
                    background: #ffffff url('~assets/img/naire/stamp_lost.png') no-repeat right 8%;
                    background-size: 25%;
                    .answer {
                        &.end-right {
                            background: rgba(157, 217, 15, 1) url('~assets/img/naire/button_pattern.png') no-repeat right center / 15%;
                            p {
                                background: rgba(0, 0, 0, 0);
                            }
                        }
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
        &.bet21 {
            margin-top: -15rem;
        }
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
@keyframes gift {
    from {
        top: -0.6rem;
        opacity: 0.7;
    }
    to {
        top: -0.3rem;
        opacity: 1;
    }
}
</style>
