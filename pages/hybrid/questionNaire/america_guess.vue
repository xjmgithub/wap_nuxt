<template>
    <div id="america">
        <div class="top">
            <img src="~assets/img/naire/bg_guess.png" class="bg-pic">
            <div>
                <p>EXCLUSIVE ON STARTIMES</p>
                <span>GUESS NOW</span>
            </div>
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
</template>
<script>
import { shareInvite } from '~/functions/utils'
export default {
    layout: 'base',
    methods: {
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
            title: 'Crazy Guess'
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
            bottom: 0;
            width: 100%;
            p {
                color: #ffffff;
                margin-bottom: 0.8rem;
            }
            span {
                display: block;
                background: #fffefe;
                color: #204db2;
                height: 2.5rem;
                line-height: 2.5rem;
                width: 45%;
                margin: 0 auto;
                border-radius: 2px;
            }
        }
    }
    .bot-down {
        width: 90%;
        margin: 0 auto;
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
</style>
