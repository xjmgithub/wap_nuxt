<template>
    <div class="download" @click="down">
        <div>
            <img src="~assets/img/web/app_icon.png">
            <div> {{$store.state.lang.officialwebsitemobile_downloadpromo}}</div>
        </div>
        <span class="down">DOWNLOAD</span>
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
    background-color: #b7b7b7;
    font-weight: bold;
    color: #333333;
    overflow: hidden;
    zoom: 1;
    top: 3.45rem;
    position: fixed;
    width: 100%;
    z-index: 999;
    height: 4rem;
    line-height: 4rem;
    &>div {
        width: 60%;
        vertical-align: middle;
        font-size: 0.88rem;
        float: left;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        img {
            width: 3rem;
            margin-right: 0.5rem;
        }
        div{
            display: inline-block;
        }
    }
    .down {
        background-color: #0087eb;
        width: 6rem;
        color: #ffffff;
        border-radius: 2px;
        height: 2rem;
        position: absolute;
        right: 0.8rem;
        top: 1rem;
        line-height: 2rem;
        text-align: center;
    }
}
</style>
