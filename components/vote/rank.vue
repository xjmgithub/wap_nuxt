<template>
    <div id="show-rank">
        <div class="line clearfix">
            <span class="invited" v-show="app==1" @click="doInvite">invite friends to vote</span>
        </div>
        <div class="ranking-list" v-for="(item,index) in rank" :key="index">
            <span class="ranking" :class="{first:index==0 ,second:index==1,third:index==2}">{{index + 1}}</span>
            <span class="ranking-name">{{item.name}}</span>
            <span class="ranking-poll">{{item.ballot_num}}</span>
        </div> 
    </div>
</template>
<script>
export default {
    layout: 'base',
    props: {
        rank: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data(){
        return{
            app: this.$store.state.appType
        }
    },
    methods:{
        doInvite(){
            this.$emit('onInvite')
        }
    }
}
</script>
<style lang="less">
</style>

