<template>
    <div class="bg">
        <div class="download" @click="down(1)">
            <div>
                <img src="~assets/img/web/app_icon.png">
                <div>
                    <p>StarTimes ON App</p>
                    <span>{{$store.state.lang.officialwebsitemobile_install_to_watch}}</span>
                </div>
                <span class="down">{{$store.state.lang.officialwebsitemobile_install}}</span>
            </div>
        </div>
        <div class="alt">&nbsp;</div>
        <div class="text">
            <div>
                I’m participating in Crazy Freekick for
                <span>{{$store.state.country.name}}</span>
            </div>
            <div>Join us and get the Champion !</div>
        </div>
        <div class="game-rule">
            <img src="~assets/img/landpage/game.png">
            <div class="btn" @click="down(2)">DETAIL RULES</div>
        </div>
        <img class="ball-btn" @click="down(3)" src="~assets/img/landpage/ball_btn.png">
    </div>
</template>
<script>
import { callApp, callMarket } from '~/functions/utils'
export default {
    layout: 'base',
    data() {
        return {}
    },
    methods: {
        down(num) {
            callApp.call(this, `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin + window.location.pathname}`, () => {
                this.sendEvLog({
                    category: `vote_soccercup`,
                    action: 'downloadpopup_show',
                    label: num,
                    value: 1
                })
                this.$confirm(
                    'Download StarTimes ON and join us and get the Champion !',
                    () => {
                        this.sendEvLog({
                            category: `vote_soccercup`,
                            action: 'downloadpopup_clickok',
                            label: num,
                            value: 1
                        })
                        this.sendEvLog({
                            category: `vote_soccercup`,
                            action: 'toMarket',
                            label: num,
                            value: 1
                        })
                        callMarket.call(this)
                    },
                    () => {
                        this.sendEvLog({
                            category: `vote_soccercup`,
                            action: 'downloadpopup_clicknot',
                            label: num,
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
            title: 'StarTimes ON Cup - Crazy Freekick',
            meta: [
                {
                    name: 'description',
                    property: 'description',
                    content: '【StarTimes ON Cup - Crazy Freekick】Join us as a Country Hero and score for the Team [Nigeria] to win the cup.'
                },
                {
                    name: 'og:description',
                    property: 'og:description',
                    content: '【StarTimes ON Cup - Crazy Freekick】Join us as a Country Hero and score for the Team [Nigeria] to win the cup.'
                },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: '/res_nuxt/img/soccercup.png'
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: 'StarTimes ON Cup - Crazy Freekick' }
            ]
        }
    }
}
</script>
<style>
html {
    background: #3a8956;
}
</style>
<style lang="less" scoped>
.bg {
    background: url('~assets/img/landpage/bg_last_level.jpg') no-repeat center 3.6rem;
    background-size: contain;
    min-height: 20rem;
}
.download {
    padding: 0.5rem 0.8rem;
    background-color: #216948;
    color: #333333;
    overflow: hidden;
    zoom: 1;
    position: fixed;
    width: 100%;
    z-index: 999;
    height: 3.6rem;
    & > div {
        position: relative;
        img {
            width: 2.6rem;
            border-radius: 4px;
        }
        div {
            width: 45%;
            font-size: 0.88rem;
            margin-left: 0.5rem;
            display: inline-block;
            vertical-align: middle;
            line-height: 1.3rem;
            color: #ffe050;
        }
        .down {
            background-color: #ffe050;
            font-weight: bold;
            width: 5rem;
            color: #bf7029;
            border-radius: 1rem;
            height: 2rem;
            position: absolute;
            right: 0;
            top: 0.4rem;
            line-height: 2rem;
            text-align: center;
        }
    }
}
.alt {
    height: 3.6rem;
}
.text {
    text-align: center;
    color: white;
    padding: 1rem 0.5rem 0.5rem;
    div:first-child {
        font-size: 0.9rem;
        span {
            color: #ffe23f;
        }
    }
    div:last-child {
        font-size: 1rem;
        line-height: 2rem;
        font-weight: bold;
    }
}
.game-rule {
    width: 95%;
    position: relative;
    margin: 0 auto;
    img {
        display: block;
        width: 100%;
    }
    .btn {
        width: 68%;
        border: solid 1px #94e6ac;
        height: 2.2rem;
        line-height: 2rem;
        bottom: 0.8rem;
        left: 50%;
        margin-left: -34%;
        border-radius: 1.2rem;
        text-align: center;
        position: absolute;
        color: #94e6ac;
        font-size: 0.9rem;
    }
}
.ball-btn {
    display: block;
    height: 3.5rem;
    margin: 0 auto;
    margin-top: 1rem;
}
</style>
