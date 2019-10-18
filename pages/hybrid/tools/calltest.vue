<template>
    <div class="calltest">
        <div class="blue" @click="callUp">intent唤醒</div>
        <div class="ua">{{ua}}</div>
    </div>
</template>
<script>
import { callApp, callMarket, downApk } from '~/functions/app.js'
export default {
    layout: 'base',
    data() {
        return {
            ua: ''
        }
    },
    mounted() {
        this.ua = window.navigator.userAgent
    },
    methods: {
        callUp() {
            callApp.call(this, '', () => {
                callMarket.call(this, () => {
                    downApk.call(this)
                })
            })
        }
    }
}
</script>
<style lang="less" scoped>
.calltest {
    div {
        width: 100%;
        height: 5rem;
        text-align: center;
        line-height: 5rem;
    }
    .blue {
        background: blue;
    }
    .green {
        background: green;
    }
    .ua {
        line-height: 1.5rem;
        text-align: left;
    }
}
</style>

