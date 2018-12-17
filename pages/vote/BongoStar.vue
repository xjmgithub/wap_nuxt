<template>
    <div class="page-wrapper">
        <mTab :tab="tabList" @changeTab="handleMessage" />
        <mVote :player="playerList" v-show="boxIndex==0"/>
        <mRank :rank="rankList" v-show="boxIndex==1" />
    </div>
</template>
<script>
import mTab from '~/components/vote/tab'
import mVote from '~/components/vote/vote'
import mRank from '~/components/vote/rank'
export default {
    layout: 'base',
    data() {
        return {
            tabList: [
                {
                    title: 'vote',
                    check: true
                },
                {
                    title: 'rank',
                    check: false
                },
                {
                    title: 'judgevote',
                    check: false
                },
                {
                    title: 'about',
                    check: false
                }
            ],
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
            playerList:[]
        }
    },
    mounted() {
        this.getCandidatesList()
    },
    methods:{
        handleMessage(index) {
            this.boxIndex = index
        },
        getCandidatesList() {
            //       this.$axios.get(`/voting/v1/candidates-show?vote_id=2`,{
            //             headers: {
            //                 token: this.$store.state.token
            //             }
            //         }).then(res => {
            //         if (res.data.code == 0) {
            //             this.buttonShow = data.data;
            //         }
            //     })
            // }
            this.playerList =  [
                {
                    ballot_num:0,
                    created_time:"2018-10-31T09:49:16",
                    icon:"http://cdn.startimestv.com/banner/JULIUSMACHA7.JPG",
                    id:46,
                    index:1,
                    link_vod_code:"15302",
                    name:"JULIUS MACHA",
                    state:5,
                    updated_time:"2018-10-31T09:49:22",
                    user_ballot_num:0
                }
            ]
        }
    },
    components: {
        mTab,
        mVote,
        mRank
    }
}
</script>
<style lang="less">
@import '~assets/less/vote/index.less';
</style>
<style lang="less" scoped>
</style>

