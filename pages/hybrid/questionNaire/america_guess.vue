<template>
    <div id="america">
        <div class="top">
            <img src="~assets/img/naire/bg_guess.png" class="bg-pic">
            <div>
                <span><img src="~assets/img/naire/ic_crown.png" class="crown"> EXCLUSIVE ON STARTIMES</span>
                <p @click="toApp()">GUESS NOW</p>
            </div>
        </div>
        <div class="bot-down">
            <div class="bot-down-rule">
                <div class="dot">‧</div>
                <p>There are several questions in each match day, the more questions you guess correctly, the more prizes you will get;</p>
                <div class="dot">‧</div>
                <p>If you guess the correct answer to some of the questions in a match day, you will get a discount coupon. </p>
                <div class="dot">‧</div>
                <p>If you guess the correct answer to all questions in a match day, you will get a 1-day FREE VIP coupon.</p>
            </div>
            <div class="bot-down-btn" @click="toShare()">Click here and share to your friends</div>
        </div>
        <mShare/>
    </div>
</template>
<script>
import mShare from '~/components/web/share.vue'
import {callApp,callMarket} from '~/functions/utils'
export default {
    layout: 'base',
    components: {
        mShare
    },
    methods: {
        toShare() {
            this.$store.commit('SET_SHARE_STATE', true)
        },
        toApp(){
            callApp.call(this, `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin}/hybrid/questonNaire/america_bet`, () => {
                this.sendEvLog({
                    category: `vote_soccercup`,
                    action: 'downloadpopup_show',
                    label: 'usacup',
                    value: 1
                })
                this.$confirm(
                    'Download StarTimes ON and join us and get the Champion !',
                    () => {
                        this.sendEvLog({
                            category: `vote_soccercup`,
                            action: 'downloadpopup_clickok',
                            label: 'usacup',
                            value: 1
                        })
                        this.sendEvLog({
                            category: `vote_soccercup`,
                            action: 'toMarket',
                            label: 'usacup',
                            value: 1
                        })
                        callMarket.call(this)
                    },
                    () => {
                        this.sendEvLog({
                            category: `vote_soccercup`,
                            action: 'downloadpopup_clicknot',
                            label: 'usacup',
                            value: 1
                        })
                    },
                    this.$store.state.lang.download_apk,
                    this.$store.state.lang.vote_cancel
                )
            })
        }
    },
    head() {
        return {
            title: 'COPA AMERICA 2019 CRAZY GUESS',
            meta: [
                { name: 'description', property: 'description', content: 'Win 1,000,000 VIPs! Get them free in StarTimes ON Crazy Guess!' },
                { name: 'og:description', property: 'og:description', content: 'Win 1,000,000 VIPs! Get them free in StarTimes ON Crazy Guess!' },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: 'http://cdn.startimestv.com/banner/bg_guess.jpg'
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: 'COPA AMERICA 2019 CRAZY GUESS' }
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
    background: #042c85;
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
            position: absolute;
            bottom: 1rem;
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
