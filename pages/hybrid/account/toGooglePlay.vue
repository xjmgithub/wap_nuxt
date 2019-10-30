<template>
    <div class="wrapper">
        <div class="title">{{$store.state.lang.tips_register_successful}}</div>
        <div class="msg">{{$store.state.lang.tips_register_successful_tip}}</div>
        <img src="~assets/img/pic_gift.png" />
        <div class="down-now" @click="callMarket">{{$store.state.lang.download_now}}</div>
    </div>
</template>
<script>
import { downApk, callMarket } from '~/functions/app'
export default {
    layout: 'base',
    data() {
        return {
            invide_code: ''
        }
    },
    mounted() {
        this.invide_code = sessionStorage.getItem('invite_code')
        this.mSendEvLog('register_success_show', this.invide_code, 1)
    },
    methods: {
        mSendEvLog(action, label, value) {
            this.sendEvLog({
                category: 'tell_friends',
                action: action,
                label: label,
                value: value
            })
            console.log(action, label, value)
        },
        callMarket() {
            this.mSendEvLog('callMarket', this.invide_code, 1)
            callMarket.call(this, () => {
                this.mSendEvLog('downApk', this.invide_code, 1)
                downApk.call(this)
            })
        }
    },
    head() {
        return {
            title: this.$store.state.lang.tips_register_successful
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    position: static;
    min-height: 100%;
    padding-top: 17%;
    color: #333333;
    .title {
        text-align: center;
        margin: 0 auto;
        font-size: 1.25rem;
        font-weight: 600;
    }
    .msg {
        margin: 2rem auto 0;
        padding: 0 2rem;
        font-size: 0.9rem;
        font-weight: 400;
    }
    img {
        display: block;
        height: 65%;
        width: 65%;
        margin: 0 auto;
    }
    .down-now {
        width: 80%;
        height: 2.3rem;
        line-height: 2.3rem;
        font-size: 0.9rem;
        text-align: center;
        color: #ffffff;
        font-weight: 600;
        background-color: #0087eb;
        margin: 0.8rem 10%;
        border-radius: 0.2rem;
    }
}
</style>
