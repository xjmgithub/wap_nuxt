<template>
    <div class="download" @click="down">
        <div>
            <img src="~assets/img/web/app_icon.png">
            <div>
                <span> {{$store.state.lang.officialwebsitemobile_downloadpromo}}</span>
            </div>
            <span class="down">DOWNLOAD</span>
        </div>
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
    padding: 0.5rem 0.8rem;
    background-color: #b7b7b7;
    color: #333333;
    overflow: hidden;
    zoom: 1;
    top: 3.45rem;
    position: fixed;
    width: 100%;
    z-index: 999;
    height: 4rem;
    & > div {
        position: relative;
        img {
            width: 3rem;
        }
        div {
            font-weight: bold;
            width: 45%;
            font-size: 0.88rem;
            position: absolute;
            top: 50%;
            left: 3.5rem;
            margin-top: -1.2rem;
            line-height: 1.3rem;
        }
        .down {
            background-color: #0087eb;
            width: 6rem;
            color: #ffffff;
            border-radius: 2px;
            height: 2rem;
            position: absolute;
            right: 0;
            top: 0.5rem;
            line-height: 2rem;
            text-align: center;
        }
    }
}
</style>
