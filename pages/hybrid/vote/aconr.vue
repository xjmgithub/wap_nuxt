<template>
    <div @click="showgif=false">
        <div v-if="appType==0" class="download" @click="down(1)">
            <div>
                <img src="~assets/img/web/app_icon.png" />
                <div>
                    <p>StarTimes ON App</p>
                    <span>{{$store.state.lang.officialwebsitemobile_install_to_watch}}</span>
                </div>
                <span class="down">{{$store.state.lang.officialwebsitemobile_install}}</span>
            </div>
        </div>
        <div v-if="appType==0" class="holder">&nbsp;</div>
        <div class="pannel">
            <img class="result" src="~assets/img/vote/game_result.png" />
            <img class="rules" src="~assets/img/vote/showgif.png" @click.stop="showgif=true" />
        </div>
        <div class="bot-down">
            <div class="bot-down-text">Eid Mubarak!! Share to more friends for the great honor of your country.</div>
            <div class="bot-down-btn" @click="share">SHARE NOW!</div>
        </div>
        <sharePannel />
        <div v-show="showgif" class="gif" @click.stop>
            <img class="pic" src="~assets/img/vote/shuoming.gif" />
            <img class="close" src="~assets/img/dvb/delete.png" @click="showgif=false" />
        </div>
    </div>
</template>
<script>
import { shareInvite, callMarket, callApp } from '~/functions/utils'
import sharePannel from '~/components/web/share'
import { Base64 } from 'js-base64'
export default {
    layout: 'base',
    components: {
        sharePannel
    },
    data() {
        return {
            showgif: false,
            appType: this.$store.state.appType
        }
    },
    methods: {
        share() {
            if (this.$store.state.appType == 1) {
                shareInvite(
                    `${window.location.href}?utm_source=startimes_app&utm_medium=activity&utm_campaign=soccercup2`,
                    'Eid Mubarak!',
                    `Final result of StarTimes ON Soccer Cup game comes out. Check it out and get reward.`,
                    `${window.location.origin}/res_nuxt/img/soccercup.png`
                )
            } else if (this.$store.state.appType == 0) {
                this.showShare = true
                this.$store.commit('SET_SHARE_STATE', true)
            }
        },
        down() {
            callApp.call(this, `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin}/hybrid/vote/acon`, () => {
                this.sendEvLog({
                    category: `vote_soccercup`,
                    action: 'downloadpopup_show',
                    label: 1,
                    value: 1
                })
                this.$confirm(
                    'Download StarTimes ON and join us and get the Champion !',
                    () => {
                        this.sendEvLog({
                            category: `vote_soccercup`,
                            action: 'downloadpopup_clickok',
                            label: 1,
                            value: 1
                        })
                        this.sendEvLog({
                            category: `vote_soccercup`,
                            action: 'toMarket',
                            label: 1,
                            value: 1
                        })
                        callMarket.call(this)
                    },
                    () => {
                        this.sendEvLog({
                            category: `vote_soccercup`,
                            action: 'downloadpopup_clicknot',
                            label: 1,
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
            title: 'Result Of Soccer Game',
            meta: [
                {
                    name: 'description',
                    property: 'description',
                    content: '【Eid Mubarak!】Final result of StarTimes ON Soccer Cup game comes out. Check it out and get reward.'
                },
                {
                    name: 'og:description',
                    property: 'og:description',
                    content: '【Eid Mubarak!】Final result of StarTimes ON Soccer Cup game comes out. Check it out and get reward.'
                },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: 'http://cdn.startimestv.com/banner/soccercup.png'
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: 'StarTimes ON Cup - Crazy Freekick' },
                {
                    name: 'al:android:url',
                    property: 'al:android:url',
                    content:
                        'starvideo://platformapi/webtoapp?target=' +
                        Base64.encode(
                            `com.star.mobile.video.activity.BrowserActivity?loadUrl=http://m.startimestv.com/hybrid/vote/acon`.replace(/&/g, '**')
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
    background: #3a8956;
}
</style>
<style lang="less" scoped>
.pannel {
    max-width: 1080px;
    margin: 0 auto;
    position: relative;
    padding-bottom: 3rem;
    .result {
        display: block;
        width: 100%;
    }
    .rules {
        position: absolute;
        top: 1%;
        right: 1.8%;
        display: block;
        width: 14%;
    }
}
.bot-down {
    position: fixed;
    width: 100%;
    bottom: 0;
    height: 3rem;
    padding: 0.5rem 3%;
    display: -webkit-box;
    background: #3a8956;
    z-index: 200;
    box-shadow: 0 -2px 4px #232323cf;
    .bot-down-text {
        -webkit-box-flex: 4;
        font-size: 0.8rem;
        color: #ffd91f;
        margin-right: 0.3rem;
    }
    .bot-down-btn {
        -webkit-box-flex: 1;
        width: 8.2rem;
        height: 2rem;
        line-height: 2rem;
        font-size: 0.9rem;
        text-align: center;
        color: #ff5c05;
        background: #ffd91f;
        border-radius: 3px;
        font-weight: bold;
    }
}
.gif {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 15rem;
    height: 27rem;
    margin-left: -7.5rem;
    margin-top: -13.5rem;
    z-index: 100;
    .pic {
        display: block;
        width: 100%;
    }
    .close {
        position: absolute;
        top: 0;
        right: 0;
        display: block;
        width: 2rem;
    }
}
.holder {
    height: 3.6rem;
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
</style>
