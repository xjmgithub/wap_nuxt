<template>
    <div id="america">
        <div class="top">
            <img src="~assets/img/naire/bet21.jpg" class="bg-pic" />
            <div>
                <span>
                    <img src="~assets/img/naire/ic_crown.png" class="crown" /> EXCLUSIVE ON STARTIMES
                </span>
                <p @click="toApp()">ANSWER NOW</p>
            </div>
        </div>
        <div class="bot-down">
            <div class="bot-down-rule">
                <div class="dot">‧</div>
                <p>1. There is only one correct answer to each question.</p>
                <div class="dot">‧</div>
                <p>2. Every day we will update a question and answer to previous question will be announced.</p>
                <div class="dot">‧</div>
                <p>3. Users who answer correctly every single day will get a coupon, with which you will get a 50% discount on our Weekly VIP. Please also be noted, this coupon shall be used within 24 hours.</p>
                <div class="dot">‧</div>
                <p>4. For each natural month, 5 users randomly selected from those who answer at least 10 questions correctly in a row, will be awarded with free coupons of our Monthly VIP; 2 users randomly selected from those who answer at least 20 questions correctly in a row, will be awarded with Star signature football</p>
            </div>
            <div class="bot-down-btn" @click="toShare()">Click here and share to your friends</div>
        </div>
        <mShare />
    </div>
</template>
<script>
import mShare from '~/components/web/share.vue'
import { callApp, callMarket } from '~/functions/app'
import { Base64 } from 'js-base64'
export default {
    layout: 'base',
    components: {
        mShare
    },
    methods: {
        toShare() {
            this.$store.commit('SET_SHARE_STATE', true)
        },
        toApp() {
            this.sendEvLog({
                category: 'guess_event',
                action: 'download_act',
                label: '',
                value: 1
            })
            callApp.call(
                this,
                `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin}/hybrid/questionNaire/america_bet`,
                () => {
                    this.$confirm(
                        'Download StarTimes ON and join us and get the Champion !',
                        () => {
                            callMarket.call(this)
                        },
                        () => {
                            // cancel
                        },
                        this.$store.state.lang.download_apk,
                        this.$store.state.lang.vote_cancel
                    )
                }
            )
        }
    },
    head() {
        return {
            title: 'Challengers Crazy Guess',
            meta: [
                { name: 'description', property: 'description', content: 'Win 1,000,000 VIPs! Get them free in StarTimes ON Crazy Guess!' },
                { name: 'og:description', property: 'og:description', content: 'Win 1,000,000 VIPs! Get them free in StarTimes ON Crazy Guess!' },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: 'http://cdn.startimestv.com/banner/Uganda.jpg'
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: 'Hisense Challengers Uganda Crazy Guess' },
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
<style>
html {
    background: #042c85;
}
</style>
<style lang="less" scoped>
#america {
    width: 100vw;
    min-height: 100vh;
    background: -webkit-linear-gradient(270deg, #042c85 0%, #042c85 50%, #325ab1 100%);
    padding-bottom: 2rem;
    .top {
        text-align: center;
        font-size: 0.95rem;
        font-weight: bold;
        position: relative;
        padding-bottom: 0.8rem;
        .bg-pic {
            display: block;
            width: 100%;
        }
        div {
            // position: absolute;
            // bottom: 1rem;
            margin-top: 1rem;
            width: 100%;
            span {
                color: #ffffff;
                margin-bottom: 0.5rem;
                position: relative;
                img {
                    width: 1rem;
                    position: absolute;
                    left: -0.8rem;
                    top: -0.4rem;
                }
            }
            p {
                background: #fffefe;
                color: #204db2;
                height: 2.5rem;
                line-height: 2.5rem;
                width: 45%;
                margin: 0.8rem auto 0;
                border-radius: 2px;
            }
        }
    }
    .bot-down {
        width: 90%;
        margin: 0 auto;
        color: #ffffff;
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
</style>
