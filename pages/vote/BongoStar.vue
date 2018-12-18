<template>
    <div class="page-wrapper">
        <mTab :tab="tabList" @onChange="handleTab" />
        <mVote :player="playerList" v-show="boxIndex==0" @onVote="handleVote" :leftvote="leftvote" />
        <mRank :rank="rankList" v-show="boxIndex==1" />
        <mViceVote :advisor="advisorList" v-show="boxIndex==2" @onVote="handleViceVote" :leftvote="leftvote" :leftflower="leftflower" />
    </div>
</template>
<script>
import mTab from '~/components/vote/tab'
import mVote from '~/components/vote/vote'
import mRank from '~/components/vote/rank'
import mViceVote from '~/components/vote/vice_vote'
export default {
    layout: 'base',
    data() {
        return {
            isLogin: this.$store.state.user.type || false,
            token:this.$store.state.token,
            tabList: ['vote','rank','judgevote','about'],
            rankList:[
                {
                    name:'SARAPHINA MICHAEL',
                    ballot_num:'77'
                },
                {
                    name:'JULIUS MACHA',
                    ballot_num:'66'
                },
                {
                    name:'REGINA LEONARD',
                    ballot_num:'55'
                },
                {
                    name:'ASWAGILE MWASONGO',
                    ballot_num:'44'
                }
            ],
            boxIndex:0,
            playerList:[],
            advisorList:[],
            leftvote:1,
            leftflower:1
        }
    },
    mounted() {
        this.getPlayerList()
        this.getAdvisorList()
    },
    methods:{
        handleTab(index) {
            this.boxIndex = index
        },
        handleVote(player){
            // this.loginJudge()
            let params = {
                candidate_id: player.id,
                vote_id: 2,
                token:this.token
            }
            this.$axios.post(`/voting/v1/ballot`,params).then(res => {
                if (res.data.code == 0) {
                    if(this.leftvote == 0){
                        this.$alert('Vote success, vote left: 0 \n Remember to vote tomorrow! Now you can invite friends to vote')
                    } else{
                        this.$alert('Vote success')
                    }
                } else {
                    this.$alert('vote fail')
                }
            })
        },
        handleViceVote(advisor){
            // this.loginJudge()
            let params = {
                candidate_id: advisor.id,
                vote_id: 3,
                token:this.token
            }
            this.$axios.post(`/voting/v1/ballot`,params).then(res => {
                if (res.data.code == 0) {
                   
                } 
            })
        },
        loginJudge(){
            if (this.$store.state.appType <= 0) {
                this.gotoMarket()
                return false
            }
            if (!this.isLogin) {
                if (this.$store.state.appType == 1) {
                    toNativePage('com.star.mobile.video.account.LoginActivity')
                } else {
                    toNativePage('startimes://login')
                }
                return false
            }
        },
        getPlayerList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=2`).then(res => {
                if (res.data.code == 0) {
                    this.playerList = res.data.data;
                }
            })
        },
        getAdvisorList(){
            this.$axios.get(`/voting/v1/candidates-show?vote_id=3`).then(res => {
                if (res.data.code == 0) {
                    this.advisorList = res.data.data;
                }
            })
        },
        gotoMarket(){}
    },
    components: {
        mTab,
        mVote,
        mRank,
        mViceVote
    }
}
</script>
<style lang="less">
@import '~assets/less/vote/index.less';
</style>
<style lang="less" scoped>
</style>

