<template>
    <div id="show-player">
        <div class="clearfix">
            <span class="leftvote">left vote：{{leftvote}}</span>
            <span class="invited" v-show="app==1" @click="handleInvite">invite friends to vote</span>
        </div>
        <ul class="clearfix">
            <li v-for="(item,index) in playerList" :key="index">
                <div class="img-box" @click="handlePlayVod(item.link_vod_code,item.name)">
                    <img :src="item.icon" class="icon">
                    <img src="~assets/img/vote/ic_play_sl_t.png" v-show="item.link_vod_code!=''" class="playbutton">
                </div>
                <span class="player-name">{{item.name}}</span>
                <span
                    class="vote-state"
                    :class="item.state | canVoteState(item.user_ballot_num)[0]"
                    @click="handleVote(item)"
                >{{item.state | canVoteState(item.user_ballot_num)[1]}}</span>
            </li>
        </ul>
        <loading v-show="playerList.length<=0"/>
    </div>
</template>
<script>
import loading from '~/components/loading'
import { toNativePage, shareInvite } from '~/functions/utils'
export default {
    props: {
        tab_msg: {
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
            playerList: [],
            leftvote: '-'
        }
    },
    mounted() {
        this.getVoteLeft()
        this.getPlayerList()
    },
    methods: {
        handleVote(player) {
            this.sendEvLog({
                category: 'vote_' + this.share.voteName,
                action: 'votebtn_click',
                label: 'tab_' + player.name,
                value: 10
            })
            if (!this.loginJudge()) return
            if (data.state == -1) {
                this.$alert('NOT START')
                return
            } else if (data.state == -2) {
                this.$alert('END')
                return
            } else if (this.leftvote == 0) {
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
                    vote_id: this.tab_msg.vote_id
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
        handleInvite() {
            this.sendEvLog({
                category: 'vote_' + this.share.voteName,
                action: 'share_click',
                label: '',
                value: 10
            })
            let link = window.location.href
            shareInvite(link, this.share.shareTitle, this.share.shareContent, this.tab_msg.name, this.share.voteName)
        },
        handlePlayVod(vod, name) {
            this.sendEvLog({
                category: 'vote_' + this.share.voteName,
                action: 'votepic_click',
                label: 'tab_' + name,
                value: 10
            })
            if (vod) {
                if (this.app == 2) {
                    window.location.href = 'startimes://player?vodId=' + vod
                } else if (this.app == 1) {
                    window.getChannelId.toAppPage(3, 'com.star.mobile.video.player.PlayerVodActivity?vodId=' + vod, '')
                }
            }
        },
        getVoteLeft() {
            if (this.isLogin) {
                this.$axios({
                    url: `/voting/v1/ballot/user-ballot-nums?vote_id=${this.tab_msg.vote_id}`,
                    method: 'get',
                    data: {}
                }).then(res => {
                    if (res.data.code == 0) {
                        this.leftvote = res.data.data + ''
                    } else {
                        this.leftvote = '-'
                    }
                })
            }
        },
        getPlayerList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=${this.tab_msg.vote_id}`).then(res => {
                if (res.data.code == 0) {
                    this.playerList = res.data.data
                    if (this.tab_msg.main_vote) {
                        // 是否是需要排行的投票
                        this.$store.commit('SET_RANKLIST', res.data.data)
                    }
                }
            })
        },
        loginJudge() {
            if (this.app <= 0) {
                this.gotoMarket()
                return
            }
            if (!this.isLogin) {
                if (this.app == 1) {
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
            let ua = window.navigator.userAgent
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
                        } else {
                            if (location.href.indexOf('utm_source') > 0) {
                                s = '&referrer=' + encodeURIComponent(location.search.substr(1))
                            } else {
                                s = '&' + location.search.substr(1)
                            }
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
    },
    filters: {
        canVoteState(state, user_ballot_num) {
            if (state == -2) {
                return ['unstart', 'END']
            } else if (state == -1) {
                return ['unstart', 'UNSTART']
            } else if (state <= 0 && user_ballot_num <= 0) {
                return ['unstart', 'VOTE']
            } else if (state > 0 && user_ballot_num <= 0) {
                return ['vote', 'VOTE']
            } else if (state <= 0 && user_ballot_num > 0) {
                return ['voted', 'VOTED ' + user_ballot_num]
            } else if (state > 0 && user_ballot_num > 0) {
                return ['vote', 'VOTED ' + user_ballot_num]
            }
        }
    },
    components: {
        loading
    }
}
</script>
