<template>
    <div class="wrapper">
        <img src="~assets/img/dvb/bg_top.png" />
        <div>
            <img src="~assets/img/dvb/one.png" @click="goToLink" />
            <img src="~assets/img/dvb/two.png" @click="getReward" />
            <div @click="toPup">
                <nuxt-link to="/hybrid/dvb/bind">
                    <img src="~assets/img/dvb/three.png">
                </nuxt-link>
            </div>
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
        mSendEvLog(action, value) {
            this.sendEvLog({
                category: "Decoder Users' Gift",
                action: action,
                label: 1,
                value: value
            })
        },
        goToLink() {
            this.mSendEvLog('NG-LINK', 1)
            toNativePage('com.star.mobile.video.dvbservice.DvbServiceActivity')
        },
        toPup() {
            this.mSendEvLog('NG-TOPUP', 1)
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
                        this.mSendEvLog('NG-GET_REWARD', 1)
                        this.$alert("Congratulations! Redeem successful. ₦300 bonus has been recharge to the decoder account you've linked with.")
                    } else if (data.code == '402') {
                        this.mSendEvLog('NG-GET_REWARD', 402)
                        this.$alert('Oops, redeem failed. You can get ₦300 bonus only by linking decoder first.')
                    } else if (data.code == '201') {
                        this.mSendEvLog('NG-GET_REWARD', 201)
                        this.$alert('Your StarTimes ON account has redeemed before. Every account can only get ₦300 bonus for once.')
                    } else if (data.code == '202') {
                        this.mSendEvLog('NG-GET_REWARD', 202)
                        this.$alert('Your decoder account has redeemed before. Every decoder can only get ₦300 bonus for once.')
                    } else if (data.code == '203') {
                        this.mSendEvLog('NG-GET_REWARD', 203)
                        this.$alert('Your phone has redeemed before. Every device can only get ₦300 bonus for once.')
                    } else if (data.code == '205') {
                        this.mSendEvLog('NG-GET_REWARD', 205)
                        this.$alert('Oops, redeem failed. The bonus is only available in Nigeria.')
                    } else if (data.code == '403') {
                        this.mSendEvLog('NG-GET_REWARD', 403)
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
    background: url('~assets/img/dvb/bg_all.png') no-repeat;
    background-size: 100%;
    width: 100%;
    min-height: 100vh;
    padding-bottom: 2rem;
    & > img {
        display: block;
        width: 100%;
    }
    & > div {
        width: 100%;
        padding: 0 1rem;
        margin-top: -1.3rem;
        img {
            display: block;
            width: 100%;
        }
        .word {
            margin-top: 1.5rem;
        }
    }
}
</style>
