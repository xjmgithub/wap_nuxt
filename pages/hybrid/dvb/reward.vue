<template>
    <div class="wrapper">
        <div>
            <img src="~assets/img/dvb/one.png" class="one" @click="goToLink" />
            <img src="~assets/img/dvb/two.png" class="two" @click="getReward" />
            <nuxt-link to="/hybrid/dvb/bind.vue">
                <img src="~assets/img/dvb/three.png" class="three">
            </nuxt-link>
            <img src="~assets/img/dvb/word.png" class="word">
        </div>
    </div>
</template>
<script>
import { toNativePage } from '~/functions/app'
export default {
    layout: 'base',

    data() {
        return {
            getRewarding: false
        }
    },
    methods: {
        goToLink() {
            toNativePage('com.star.mobile.video.dvbservice.DvbServiceActivity')
        },
        getReward() {
            if (this.getRewarding) return false
            this.getRewarding = true
            this.$axios
                .post('/self/v1/gift-award/after-link')
                .then(res => {
                    this.getRewarding = false
                    const data = res.data
                    if (data.code === 200) {
                        this.$alert('Congratulations! Redeem succesfully.')
                    } else if (data.code === '402') {
                        this.$alert('You need link first.')
                    } else if (data.code === '201') {
                        this.$alert('Your account has redeemed once.')
                    } else if (data.code === '202') {
                        this.$alert('Your smartcard has redeemed once.')
                    } else if (data.code === '203') {
                        this.$alert('Your phone has redeemed once.')
                    } else if (data.code === '403') {
                        this.$alert('Smartcard exception, please contact call center.')
                    } else {
                        this.$alert('Network erro, please try again. Or contact call center.')
                    }
                })
                .catch(() => {
                    this.$alert('Network erro, please try again. Or contact call center.')
                })
        }
    },
    head() {
        return {
            title: "*Decoder Users' Gift"
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    background: url('~assets/img/dvb/bg_huoji.png') no-repeat;
    background-size: 100%;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
    &>div{
        position: fixed;
        bottom:1rem;
        width: 100%;
        padding:1rem;
    }
    img {
        display: block;
        width: 100%;
        margin: .8rem auto;
    }
}
</style>
