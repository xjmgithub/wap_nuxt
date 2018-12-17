<template>
    <div id="show-player">
        <ul>
            <li v-for="(item,index) in player" :key="index" data-id="item.id" data-vod="item.link_vod_code">
                <div class="img-box">
                    <img :src="item.icon" class="icon">
                    <img src="~assets/img/vote/ic_play_sl_t.png" v-show="item.link_vod_code!=''" class="playbutton">
                </div>
                <span class="player-name">{{item.name}}</span>
                <span class="vote-state vote">vote</span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    layout: 'base',
    props: {
        player: {
            type: Array,
            default: function() {
                return []
            }
        }
    }
}
</script>
<style lang="less">
</style>

