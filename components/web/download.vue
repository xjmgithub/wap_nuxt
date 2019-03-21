<template>
    <div @click="down" class="download">
        <div class="max-width">{{$store.state.lang.officialwebsitemobile_downloadpromo}}</div>
        <span>{{$store.state.lang.officialwebsitemobile_go}} &gt;</span>
    </div>
</template>
<script>
import { downApp } from '~/functions/utils'
export default {
    methods: {
        down() {
            downApp.call(this)
        }
    }
}
</script>
<style lang="less" scoped>
.download {
    padding: 0rem 0.8rem;
    background-color: #ffbe19;
    font-weight: bold;
    color: #333333;
    overflow: hidden;
    zoom: 1;
    top: 3.45rem;
    position: fixed;
    width: 100%;
    z-index: 999;
    height: 2.5rem;
    line-height: 2.5rem;
    div {
        width: auto;
        float: left;
    }
    span {
        color: #0087eb;
        float: right;
    }
}
</style>
