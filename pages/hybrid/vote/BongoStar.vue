<template>
    <div class="page-wrapper">
        <mVoteSwiper :vote_id="vote_id"/>
        <mTab :tab="tabList" @onChange="handleTab"/>
        <template v-for="(item,index) in tabList" >
            <mVote 
                :key="index"
                :tab_msg="item"
                :share="share"
                v-if="item.type=='normal_vote'"
                v-show="boxIndex==index"
            />
            <mRank 
                :key="index"
                :tab_msg="item"
                :share="share"
                v-if="item.type=='rank'" 
                v-show="boxIndex==index" 
            />
            <mViceVote
                :key="index"
                :tab_msg="item"
                :share="share"
                v-if="item.type=='vice_vote'" 
                v-show="boxIndex==index"
            />
            <mAboutWord 
                :key="index"
                :document="document"
                :tab_msg="item"
                :share="share"
                v-if="item.type=='about_word'" 
                v-show="boxIndex==index"
            />
            <mAboutVod 
                :key="index"
                :vod_msg="vodMsg"
                :tab_msg="item"
                :share="share"
                v-if="item.type=='about_vod'" 
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
import mAboutWord from '~/components/vote/about_word'
import mAboutVod from '~/components/vote/about_vod'
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
                    type: 'about_vod',
                    vote_id: 2,
               }
            ],
            boxIndex: 0,
            vote_id:2,
            document:[
                {
                    word:'Predict which participants become a couple.',
                    class:''
                },
                {
                    word:'Everyone has one chance to predict which participants become a couple everyday and can only predict one couple per time. The fastest ten users who guess right can win a monthly sports bouquet on StarTimes ON app',
                    class:'predict'
                },
                {
                    word:'Vote for your favorite couple',
                    class:''
                },
                {
                    word:'Everyone only has one chance to vote for your favorite couple after each episode and can only vote for one couple. And we will reward the top 3 favorite couples a package of solar products after ten episodes. Join us and help your favorite couple to get the gift.',
                    class:''
                }
            ],
            vodMsg:{
                programdetails:'Bongo Star Search presents a unique platform to the youths whose talent lacks exposure or the funds to support and advance it.',
                vodTime: [
                    '2018/11/11 18:30:00', 
                    '2018/11/18 18:30:00', 
                    '2018/11/25 18:30:00',
                    '2018/12/2 18:30:00',
                    '2018/12/9 18:30:00'
                ],
                description:[
                    'Win StarTimes ON coupon by daily voting for your Bongo Star!',
                    'Vote period: 11 Nov- 22 Dec,2018',
                    '1. You have 5 votes each day, vote to the Bongo Stars you support.',
                    '2. Judge will integrate rank results during the finals. Help your Bongo Star win!',
                    '3. The 1st ranked Bongo Star will be awarded "Most popular Bongo Star".',
                    '4. You can also send a flower to your favorite judge.',
                    ],
            },
            share:{
                voteName:'BongoStar',
                shareTitle:'Vote & Win Coupons Now!',
                shareContent:'Vote for your favorite Bongo Star in StarTimes ON! Win coupons easily!'
            }
        }
    },
    mounted() {
        this.sendEvLog({
            category: 'vote_'+this.share.voteName,
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
                    category: 'vote_'+this.share.voteName,
                    action: 'tab_click',
                    label: 'tab_vote',
                    value: 10
                })
            } else if (item.type=='rank') {
                this.sendEvLog({
                    category: 'vote_'+this.share.voteName,
                    action: 'tab_click',
                    label: 'tab_rank',
                    value: 10
                })
            } else if (item.type=='vice_vote') {
                this.sendEvLog({
                    category: 'vote_'+this.share.voteName,
                    action: 'tab_click',
                    label: 'tab_judges',
                    value: 10
                })
            } else if(item.type=='about'){
                this.sendEvLog({
                    category: 'vote_'+this.share.voteName,
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
        mVoteSwiper,
        mAboutWord,
        mAboutVod

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

