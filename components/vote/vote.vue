<template>
    <div id="show-player">
        <div class="clearfix">
            <span class="leftvote">left vote：{{leftvote}}</span>
            <span class="invited" v-show="app==1" @click="doInvite">invite friends to vote</span>
        </div>
        <ul class="clearfix">
            <li v-for="(item,index) in player" :key="index" data-id="item.id" data-vod="item.link_vod_code">
                <div class="img-box" @onclick="doPlayVod(item.link_vod_code,item.name)">
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
            app:this.$store.state.appType
        }
    },
    methods: {
        doVote(data) {
            this.$emit('onVote',data)
        },
        doInvite(){
            this.$emit('onInvite')
        },
        doPlayVod(data){
            this.$emit('onPlayVod',data)
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

