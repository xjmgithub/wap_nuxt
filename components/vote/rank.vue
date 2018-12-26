<template>
    <div id="show-rank">
        <div class="line clearfix">
            <span class="invited" v-show="app==1" @click="handleInvite">invite friends to vote</span>
        </div>
        <div v-show="rankListData.length>0" class="ranking-list" v-for="(item,index) in rankListData" :key="index">
            <span class="ranking" :class="{first:index==0 ,second:index==1,third:index==2}">{{index + 1}}</span>
            <span class="ranking-name">{{item.name}}</span>
            <span class="ranking-poll">{{item.ballot_num}}</span>
        </div> 
        <loading v-show="rankListData.length<=0" />
    </div>
</template>
<script>
import loading from '~/components/loading'
export default {
    layout: 'base',
    data(){
        return{
            app: this.$store.state.appType,
        }
    },
    mounted() {
    },
    methods:{
        handleInvite() {
            this.sendEvLog({
                category: 'vote_Bongostar',
                action: 'share_click',
                label: '',
                value: 10
            })
            let link = window.location.href
            let shareTitle = 'Vote & Win Coupons Now!'
            let shareContent = 'Vote for your favorite Bongo Star in StarTimes ON! Win coupons easily!'
            if (link.indexOf('?') > 0) {
                link += '&utm_source=startimes_app&utm_medium=share&utm_campaign=bongo_' + this.tabList[this.boxIndex]
            } else {
                link += '?utm_source=startimes_app&utm_medium=share&utm_campaign=bongo_' + this.tabList[this.boxIndex]
            }
            // TODO  分享链接
            if(window.getChannelId&&window.getChannelId.showCustorm){
                var content = '【' + shareTitle + '】' + shareContent  + link
                window.getChannelId.showCustorm(content,link,link,link,link,link,link,shareLink,'BongoStar')
            }
        },
    },
    computed: {
        rankListData(){
            let rankList = this.$store.state.rankList  || []
            rankList.sort(function(a, b) {
                return b.ballot_num - a.ballot_num
            })
            return rankList
        }
    },
    components:{
        loading
    }
}
</script>
<style lang="less">
</style>

