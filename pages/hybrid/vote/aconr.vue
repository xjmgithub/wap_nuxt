<template>
    <div @click="showgif=false">
        <div class="pannel">
            <img class="result" src="~assets/img/vote/game_result.png">
            <img class="rules" @click.stop="showgif=true" src="~assets/img/vote/showgif.png">
        </div>
        <div class="bot-down">
            <div class="bot-down-text">Eid Mubarak!! Share to more friends for the great honor of your country.</div>
            <div class="bot-down-btn" @click="share">SHARE NOW!</div>
        </div>
        <sharePannel/>
        <div v-show="showgif" class="gif" @click.stop>
            <img class="pic" src="~assets/img/vote/shuoming.gif">
            <img class="close" @click="showgif=false" src="~assets/img/dvb/delete.png">
        </div>
    </div>
</template>
<script>
import { shareInvite } from '~/functions/utils'
import sharePannel from '~/components/web/share'
export default {
    layout: 'base',
    components: {
        sharePannel
    },
    data() {
        return {
            showgif: false
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
        }
    },
    head() {
        return {
            title: 'StarTimes ON Cup - Crazy Freekick',
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
.pannel {
    max-width: 1080px;
    margin: 0 auto;
    position: relative;
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
</style>
