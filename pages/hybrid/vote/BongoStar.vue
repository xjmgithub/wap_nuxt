<template>
    <div class="page-wrapper">
        <mVoteSwiper :vote_id="vote_id"/>
        <mTab :tab="tabList" @onChange="handleTab"/>
        <template v-for="(item,index) in tabList" >
            <mVote 
                :key="index"
                :vote_id="item.vote_id"
                v-if="item.type=='normal_vote'"
                v-show="boxIndex==index"
            />
            <mRank 
                :key="index"
                v-if="item.type=='rank'" 
                v-show="boxIndex==index" 
            />
            <mViceVote
                :key="index"
                :vote_id="item.vote_id"
                v-if="item.type=='vice_vote'" 
                v-show="boxIndex==index"
            />
        </template>
    </div>
</template>
<script>
import mTab from '~/components/vote/tab'
import mVote from '~/components/vote/vote'
import mRank from '~/components/vote/rank'
import mViceVote from '~/components/vote/vice_vote'
import mVoteSwiper from '~/components/vote/vote_swiper'
import qs from 'qs'
export default {
    layout: 'base',
    data() {
        return {
            isLogin: this.$store.state.user.type || false,
            appType: this.$store.state.appType,
            tabList: [
                {
                    name: 'vote',
                    type: 'normal_vote',
                    vote_id: 2,
                    main_vote:true
               },
                {
                    name: 'rank',
                    type: 'rank',
                    vote_id: 2,
               },
               {
                    name: 'judgevote',
                    type: 'vice_vote',
                    vote_id: 3,
               },
               {
                    name: 'about',
                    type: 'about',
               }
            ],
            boxIndex: 0,
            vote_id:2
        }
    },
    mounted() {
        this.sendEvLog({
            category: 'vote_Bongostar',
            action: 'homepage_show',
            label: '',
            value: 10
        })
    },
    methods: {
        handleTab(item,index) {
            this.boxIndex = index
            if (item.type=='normal_vote') {
                this.sendEvLog({
                    category: 'vote_Bongostar',
                    action: 'tab_click',
                    label: 'tab_vote',
                    value: 10
                })
            } else if (item.type=='rank') {
                this.sendEvLog({
                    category: 'vote_Bongostar',
                    action: 'tab_click',
                    label: 'tab_rank',
                    value: 10
                })
            } else if (item.type=='vice_vote') {
                this.sendEvLog({
                    category: 'vote_Bongostar',
                    action: 'tab_click',
                    label: 'tab_judges',
                    value: 10
                })
            } else if(item.type=='about'){
                this.sendEvLog({
                    category: 'vote_Bongostar',
                    action: 'tab_click',
                    label: 'tab_about',
                    value: 10
                })
            }
        },
    },
    components: {
        mTab,
        mVote,
        mRank,
        mViceVote,
        mVoteSwiper
    },
     head() {
        return {
            title: 'BongoStar'
        }
    }
}
</script>
<style lang="less">
@import '~assets/less/vote/index.less';
</style>
<style lang="less" scoped>
</style>

