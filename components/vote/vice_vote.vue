<template>
    <div id="show-advisor">
        <div class="clearfix">
            <span class="leftflower">left flower：{{leftflower}}</span>
            <span v-show="app==1" @click="handleInvite" class="invited">invite friends to vote</span>
        </div>
        <ul class="clearfix">
            <li v-for="(item,index) in advisorList" :key="index" data-id="item.id">
                <div class="img-box">
                    <img :src="item.icon.replace('http:','https:')" class="icon">
                </div>
                <span class="player-name">{{item.name}}</span>
                <div class="flowers">
                    <img src="~assets/img/vote/flower.png" class="send-flower">
                    <img src="~assets/img/vote/btn_flower.png" class="bgt">
                    <span class="flower-count">{{item.ballot_num }}</span>
                    <span>flowers</span>
                </div>
                <span
                    @click="handleViceVote(item)"
                    :class="{'send':item.state === 1,'sent':item.state <=0}"
                    class="flower-state"
                >{{item.state | canVoteState}}</span>
            </li>
        </ul>
        <loading v-show="advisorList.length<=0" />
    </div>
</template>
<script>
import loading from '~/components/loading'
import { toNativePage } from '~/functions/utils'
export default {
    filters: {
        canVoteState(state) {
            if (state === -1) {
                return 'UNSTART'
            } else if (state === -2) {
                return 'END'
            } else if (state === 0) {
                return 'SENT'
            } else if (state === 1) {
                return 'SEND'
            }
        }
    },
    components: {
        loading
    },
    props: {
        tabMsg: {
            type: Object,
            default: () => {
                return {}
            }
        },
        share: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            isLogin: this.$store.state.user.type || false,
            app: this.$store.state.appType,
            advisorList: [],
            leftflower: '-'
        }
    },
    mounted() {
        this.getVoteLeft()
        this.getAdvisorList()
    },
    methods: {
        handleViceVote(advisor) {
            this.sendEvLog({
                category: 'vote_' + this.share.voteName,
                action: 'flowerbtn_click',
                label: 'flower_' + advisor.name,
                value: 10
            })
            // if (!this.loginJudge()) return
            // if (data.state === -1) {
            //     this.$alert('NOT START')
            //     return
            // } else if (data.state === -2) {
            //     this.$alert('END')
            //     return
            // } else if (this.leftflower === 0) {
            //     this.$alert('flower left: 0 \n Remember to vote tomorrow!')
            //     return
            // }
            // this.$axios({
            //     url: '/voting/v1/ballot',
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded'
            //     },
            //     data: qs.stringify({
            //         candidate_id: advisor.id,
            //         vote_id: this.tab_msg.vote_id
            //     })
            // }).then(res => {
            //     if (res.data.code === 0) {
            //         if (this.leftvote === 0) {
            //             this.$alert('Vote success, vote left: 0 \n Remember to vote tomorrow! Now you can invite friends to vote')
            //         }
            //         this.getAdvisorList()
            //     } else {
            //         this.$alert(res.data.message)
            //     }
            // })
        },
        handleInvite() {
            this.sendEvLog({
                category: 'vote_' + this.share.voteName,
                action: 'share_click',
                label: '',
                value: 10
            })
            // const link = window.location.href
            // shareInvite(link, this.share.shareTitle, this.share.shareContent, this.tab_msg.name, this.share.voteName)
        },
        getAdvisorList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=${this.tab_msg.vote_id}`).then(res => {
                if (res.data.code === 0) {
                    this.advisorList = res.data.data
                }
            })
        },
        getVoteLeft() {
            if (this.isLogin) {
                this.$axios({
                    url: `/voting/v1/ballot/user-ballot-nums?vote_id=${this.tab_msg.vote_id}`,
                    method: 'get',
                    data: {}
                }).then(res => {
                    if (res.data.code === 0) {
                        this.leftflower = res.data.data + ''
                    } else {
                        this.leftflower = '-'
                    }
                })
            }
        },
        loginJudge() {
            if (this.app <= 0) {
                this.gotoMarket()
                return
            }
            if (!this.isLogin) {
                if (this.app === 1) {
                    toNativePage('com.star.mobile.video.account.LoginActivity')
                } else {
                    toNativePage('startimes://login')
                }
                return
            }
            return true
        },
        gotoMarket() {
            this.sendEvLog({
                category: 'vote_' + this.share.voteName,
                action: 'downloadpopup_show',
                label: '',
                value: 10
            })
            const ua = window.navigator.userAgent
            if (ua.indexOf('iPhone') >= 0 || ua.indexOf('iPad') >= 0) {
                this.$confirm(
                    'Download StarTimes ON to vote! Go to App Store now',
                    () => {
                        this.sendEvLog({
                            category: 'vote_' + this.share.voteName,
                            action: 'downloadpopup_click',
                            label: 'go',
                            value: 10
                        })
                        window.location.href = 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'
                    },
                    () => {
                        this.sendEvLog({
                            category: 'vote_' + this.share.voteName,
                            action: 'downloadpopup_click',
                            label: 'not now',
                            value: 10
                        })
                    },
                    'Go',
                    'Not now'
                )
            } else {
                this.$confirm(
                    'Download StarTimes ON to vote! Go to Google Play now',
                    () => {
                        this.sendEvLog({
                            category: 'vote_' + this.share.voteName,
                            action: 'downloadpopup_click',
                            label: 'go',
                            value: 10
                        })
                        let s
                        if (location.href.indexOf('referrer') > 0) {
                            s = location.search
                        } else if (location.href.indexOf('utm_source') > 0) {
                            s = '&referrer=' + encodeURIComponent(location.search.substr(1))
                        } else {
                            s = '&' + location.search.substr(1)
                        }
                        window.location.href = 'market://details?id=com.star.mobile.video' + s
                    },
                    () => {
                        this.sendEvLog({
                            category: 'vote_' + this.share.voteName,
                            action: 'downloadpopup_click',
                            label: 'not now',
                            value: 10
                        })
                    },
                    'Go',
                    'Not now'
                )
            }
        }
    }
}
</script>
