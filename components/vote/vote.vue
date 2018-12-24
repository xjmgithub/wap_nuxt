<template>
    <div id="show-player">
        <div class="clearfix">
            <span class="leftvote">left vote：{{leftvote}}</span>
            <span class="invited" v-show="app==1" @click="doInvite">invite friends to vote</span>
        </div>
        <ul class="clearfix">
            <li v-for="(item,index) in player" :key="index" data-id="item.id" data-vod="item.link_vod_code">
                <div class="img-box" @onclick="playerVodActivity(item.link_vod_code)">
                    <img :src="item.icon" class="icon">
                    <img src="~assets/img/vote/ic_play_sl_t.png" v-show="item.link_vod_code!=''" class="playbutton">
                </div>
                <span class="player-name">{{item.name}}</span>
                <span class="vote-state" :class="item.state | canVoteState(item.user_ballot_num)[0]" @click="doVote(item)">{{item.state | canVoteState(item.user_ballot_num)[1]}}</span>
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
        },
        leftvote:{
            type: String,
            default: '-'
        }
    },
    data(){
        return{
            app: 1 ||  this.$store.state.appType
        }
    },
    methods: {
        doVote(data) {
            this.$emit('onVote',data)
        },
        doInvite(){
            this.$emit('onInvite')
        },
        playerVodActivity(vod){
            if (vod) {
                if (this.$store.state.appType == 2) {
                    window.location.href = 'startimes://player?vodId=' + vod
                } else if(this.$store.state.appType == 1){
                    window.getChannelId.toAppPage(3, "com.star.mobile.video.player.PlayerVodActivity?vodId=" + vod, "");
                }
            }
        }
    },
    filters:{
        canVoteState(state,user_ballot_num ){
            if(state==-2){
                return ['unstart','END']
            }else if(state==-1){
                return ['unstart','UNSTART']
            }else if(state <=0 && user_ballot_num <=0){
                return ['unstart','VOTE']
            }else if(state >0 && user_ballot_num <=0){
                return ['vote','VOTE']
            }else if(state <=0 && user_ballot_num >0){
                return ['voted','VOTED '+ user_ballot_num]
            }else if(state >0 && user_ballot_num >0){
                return ['vote','VOTED '+user_ballot_num]
            }
        }
    }
}
</script>
<style lang="less">
</style>

