<template>
    <div class="download" @click="down">
        <div>
            <img src="~assets/img/web/app_icon.png">
            <div>
                <p>StarTimes ON App</p>
                <span>{{$store.state.lang.officialwebsitemobile_install_to_watch}}</span>
            </div>
            <span class="down">{{$store.state.lang.officialwebsitemobile_install}}</span>
        </div>
    </div>
</template>
<script>
import { normalToAppStore } from '~/functions/utils'
import localforage from 'localforage'
export default {
    methods: {
        down() {
            if (this.$route.path.indexOf('program/subdetail/') >= 0) {
                normalToAppStore.call(this, 'com.star.mobile.video.player.PlayerVodActivity?vodId=' + this.$route.params.id)
            } else if (this.$route.path.indexOf('program/detail/') >= 0) {
                localforage
                    .getItem('program_' + this.$route.params.id)
                    .then(val => {
                        if (val.defaultVod.id) {
                            normalToAppStore.call(this, 'com.star.mobile.video.player.PlayerVodActivity?vodId=' + val.defaultVod.id)
                        } else {
                            normalToAppStore.call(this)
                        }
                    })
                    .catch(e => {
                        normalToAppStore.call(this)
                    })
            }else{
                normalToAppStore.call(this)
            }
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
            margin-left: 0.5rem;
            display: inline-block;
            vertical-align: middle;
            line-height: 1.3rem;
        }
        .down {
            background-color: #0087eb;
            width: 4.5rem;
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
