<template>
    <div class="page-wrapper">
        <Swiper>
            <Slide>
                1
            </Slide>
            <Slide>
                2
            </Slide>
            <Slide>
                3
            </Slide>
        </Swiper>
        <mTab :tab="tabList" @onChange="handleTab" />
        <mVote :player="playerList" v-show="boxIndex==0" @onVote="handleVote" :leftvote="leftvote" @onInvite="handleInvite"/>
        <mRank :rank="rankList" v-show="boxIndex==1" />
        <mViceVote :advisor="advisorList" v-show="boxIndex==2" @onVote="handleViceVote" :leftvote="leftvote" :leftflower="leftflower" />
    </div>
</template>
<script>
import mTab from '~/components/vote/tab'
import mVote from '~/components/vote/vote'
import mRank from '~/components/vote/rank'
import mViceVote from '~/components/vote/vice_vote'
import qs from 'qs'
import { Swiper, Slide } from 'vue-swiper-component'
// import Swiper from 'vue-swiper-component/swiper.vue'
// import Slide from 'vue-swiper-component/slide.vue'
export default {
    layout: 'base',
    data() {
        return {
            isLogin: this.$store.state.user.type || false,
            appType:this.$store.state.appType,
            tabList: ['vote', 'rank', 'judgevote', 'about'],
            rankList: [],
            boxIndex: 0,
            playerList: [],
            advisorList: [],
            leftvote: '-',
            leftflower: '-'
        }
    },
    mounted() {
        this.getVote()
        this.getVoteLeft(2)
        this.getVoteLeft(3)
        this.getPlayerList()
        this.getAdvisorList()
    },
    methods: {
        handleTab(index) {
            this.boxIndex = index
        },
        handleVote(player) {
            if(!this.loginJudge()) return 
            if(data.state ==-1){ 
                this.$alert('NOT START')
                return
            }else if(data.state ==-2){
                this.$alert('END')
                return
            }else if(this.leftvote ==0){
                this.$alert('vote left: 0 \n Remember to vote tomorrow!')
                return
            }
            this.$axios({
                url: '/voting/v1/ballot',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    candidate_id: player.id,
                    vote_id: 2
                })
            }).then(res => {
                if (res.data.code == 0) {
                    if (this.leftvote == 0) {
                        this.$alert('Vote success, vote left: 0 \n Remember to vote tomorrow! Now you can invite friends to vote')
                    } else {
                        this.$alert('Vote success')
                    }
                    this.getPlayerList()
                } else {
                    this.$alert(res.data.message)
                }
            })
        },
        handleViceVote(advisor) {
            if(!this.loginJudge()) return 
            if(data.state ==-1){ 
                this.$alert('NOT START')
                return
            }else if(data.state ==-2){
                this.$alert('END')
                return
            }else if(this.leftflower ==0){
                this.$alert('flower left: 0 \n Remember to vote tomorrow!')
                return
            }
            this.$axios({
                url: '/voting/v1/ballot',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    candidate_id: advisor.id,
                    vote_id: 3
                })
            }).then(res => {
                if (res.data.code == 0) {
                    if (this.leftvote == 0) {
                        this.$alert('Vote success, vote left: 0 \n Remember to vote tomorrow! Now you can invite friends to vote')
                    }
                    this.getAdvisorList()
                } else {
                    this.$alert(res.data.message)
                }
            })
        },
        handleInvite(){
            let link = window.location.href 
            let shareTitle = "Vote & Win Coupons Now!"
            let shareContent = "Vote for your favorite Bongo Star in StarTimes ON! Win coupons easily!"
            if(link.indexOf('?')>0){
                link += '&utm_source=startimes_app&utm_medium=share&utm_campaign=bongo_' + this.tabList[this.boxIndex]
            }else{
                link += '?utm_source=startimes_app&utm_medium=share&utm_campaign=bongo_' + this.tabList[this.boxIndex]
            }
                // TODO  分享链接
                // if(getChannelId&&getChannelId.showCustorm){
                //     var content = '【' + shareTitle + '】' + shareContent  + link
                //     window.getChannelId.showCustorm(content,link,link,link,link,link,link,shareLink,'BongoStar')
                // }
        },
        loginJudge() {
            if (this.$store.state.appType <= 0) {
                this.gotoMarket()
                return 
            }
            if (!this.isLogin) {
                if (this.$store.state.appType == 1) {
                    toNativePage('com.star.mobile.video.account.LoginActivity')
                } else {
                    toNativePage('startimes://login')
                }
                return 
            }
            return true
        },
        getVote() {
            this.$axios({
                url: '/voting/v1/vote?vote_id=2',
                method: 'get',
                data: {}
            }).then(res => {
                if (res.data.code == 0) {
                    if (res.data.data.banner) {
                        let bannerUUID = res.data.data.banner
                        this.getBanner(bannerUUID)
                    }
                }
            })
        },
        getBanner(bannerUUID) {
             this.$axios({
                    url: `/adm/v1/units/${bannerUUID}/materials`,
                    method: 'get',
                    data: {}
                }).then(res => {
                    console.log(res)
                    // if (res.data.code == 0) {
                    //     let shareLink = res.data.data[0].materials
                    //     for (var i = 0; i < result.length; i++) {
                    //         var  bannerName = result[i].name;
                    //     }
                    // } 
                })
        },
        getVoteLeft(id) {
            if (this.isLogin) {
                this.$axios({
                    url: `/voting/v1/ballot/user-ballot-nums?vote_id=${id}`,
                    method: 'get',
                    data: {}
                }).then(res => {
                    if (res.data.code == 0) {
                        if (id == 2) {
                            this.leftvote = res.data.data + ''
                        } else if (id == 3) {
                            this.leftflower = res.data.data + ''
                        }
                    } else {
                        this.leftvote = '-'
                        this.leftflower = '-'
                    }
                })
            }
        },
        getPlayerList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=2`).then(res => {
                if (res.data.code == 0) {
                    this.playerList = res.data.data
                    this.getRankList(this.playerList)
                }
            })
        },
        getAdvisorList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=3`).then(res => {
                if (res.data.code == 0) {
                    this.advisorList = res.data.data
                }
            })
        },
        getRankList(rankData){
            this.rankList = rankData || [];
            this.rankList.sort(function (a, b) {
                return b.ballot_num - a.ballot_num;
            })
        },
        gotoMarket() {
            let ua = window.navigator.userAgent
            if (ua.indexOf('iPhone') >= 0 || ua.indexOf('iPad') >= 0) {
                this.$confirm(
                    'Download StarTimes ON to vote! Go to App Store now',
                    () => {
                        window.location.href = 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'
                    },
                    () => {},
                    'Go',
                    'Not now'
                )
            } else {
                this.$confirm(
                    'Download StarTimes ON to vote! Go to Google Play now',
                    () => {
                        let s
                        if (location.href.indexOf('referrer') > 0) {
                            s = location.search
                        } else {
                            if (location.href.indexOf('utm_source') > 0) {
                                s = '&referrer=' + encodeURIComponent(location.search.substr(1))
                            } else {
                                s = '&' + location.search.substr(1)
                            }
                        }
                        window.location.href = 'market://details?id=com.star.mobile.video' + s
                    },
                    () => {},
                    'Go',
                    'Not now'
                )
            }
        }
    },
    components: {
        mTab,
        mVote,
        mRank,
        mViceVote,
        Swiper,
        Slide
    }
}
</script>
<style lang="less">
@import '~assets/less/vote/index.less';
</style>
<style lang="less" scoped>
</style>

