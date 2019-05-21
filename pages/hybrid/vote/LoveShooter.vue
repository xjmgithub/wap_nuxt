<template>
    <div class="page-wrapper">
        <mVoteSwiper v-if="banners.length" :banners="banners" :name="voteTitle" />
        <div class="sticky">
            <nav id="nav">
                <a v-for="(item,index) in tabList" :key="index" :class="{on:tabIndex===index}" @click="tabIndex=index">
                    <span>{{item.name}}</span>
                </a>
            </nav>
            <div v-if="tabIndex!=1" id="leftvote" :class="{'line':tabIndex==2 }" class="clearfix">
                <span>Votes left:{{leftVote}}</span>
                <!-- <span class="invited">invite friends to vote</span> -->
            </div>
            <template v-for="(item,index) in tabList">
                <mVote v-if="item.type=='vote'" v-show="tabIndex==index" :key="index" :data-list="playerList" @onVote="handleVote" @toPlay="toVideo" />
                <mRank v-if="item.type=='rank'" v-show="tabIndex==index" :key="index" :data-list="playerList" />
                <mAboutWord v-if="item.type=='about'" v-show="tabIndex==index" :key="index">
                    <template v-slot:content>
                        <p>Vote for your favorite Miss Mama Africa! You could vote ONCE per day whereas you are welcome to vote every day</p>
                        <p> Each Saturday evening we’ll open voting channels of weekly candidates. In mid-September, final stage of voting, we’ll open voting channels of all candidates. Note: The online voting process is completely independent from TV show, and the voting results are irrelevant to the results on TV show and the results DO NOT affect each other. </p>
                        <p> Each Saturday evening we’ll open voting channels of weekly candidates. In mid-September, final stage of voting, we’ll open voting channels of all candidates. Note: The online voting process is completely independent from TV show, and the voting results are irrelevant to the results on TV show and the results DO NOT affect each other. </p>
                    </template>
                </mAboutWord>
            </template>
        </div>
    </div>
</template>
<script>
import mVote from '~/components/vote/vote'
import mRank from '~/components/vote/rank'
import mVoteSwiper from '~/components/vote/vote_swiper'
import mAboutWord from '~/components/vote/about_word'
import qs from 'qs'
export default {
    layout: 'base',
    components: {
        mVote,
        mRank,
        mAboutWord,
        mVoteSwiper
    },
    data() {
        return {
            appType: this.$store.state.appType || 0,
            tabList: [
                {
                    name: 'Vote',
                    type: 'vote'
                },
                {
                    name: 'About',
                    type: 'about'
                },
                {
                    name: 'Rank',
                    type: 'rank'
                }
            ],
            tabIndex: 0,
            leftVote: '-',
            playerList: [],
            banners: [],
            voteTitle: 'Love Shooter'
        }
    },
    computed: {
        platform() {
            if (this.appType == 1) {
                return 'Android'
            } else if (this.appType == 2) {
                return 'iOS'
            } else {
                return 'web'
            }
        }
    },
    watch: {
        tabIndex(nv, ov) {
            this.sendEvLog({
                category: `vote_${this.voteTitle}_${this.platform}`,
                action: 'tab_click',
                label: (nv == 0 && 'vote') || (nv == 1 && 'about') || (nv == 2 && 'rank'),
                value: 1
            })
        }
    },
    mounted() {
        this.getAllList()
        this.getvoteLeft()
    },
    methods: {
        getvoteLeft() {
            this.$axios.get(`/voting/v1/ballot/user-ballot-nums?vote_id=9`).then(res => {
                if (res.data.code === 0) {
                    this.leftVote = res.data.data
                }
            })
        },
        // 获取投票单元数据
        getAllList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=9`).then(res => {
                if (res.data.data.length > 0) {
                    this.playerList = res.data.data
                    this.playerList.sort(function(a, b) {
                        return b.ballot_num - a.ballot_num
                    })
                }
            })
        },
        handleVote(item) {
            if (item.state === -1) {
                this.$toast('not start yet')
            } else if (this.leftVote <= 0) {
                this.$toast('left vote not enough')
            } else {
                this.$axios({
                    url: '/voting/v1/ballot',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify({
                        candidate_id: item.id,
                        vote_id: 9
                    })
                }).then(res => {
                    if (res.data.code === 0) {
                        this.getAllList()
                        this.leftVote--
                        this.$toast('vote_success' + ':' + this.leftVote)
                    } else {
                        this.$toast(res.data.message)
                    }
                })
            }
        },
        toVideo(item) {
            const vod = item.link_vod_code
            if (this.appType == 1 && vod) {
                window.getChannelId && window.getChannelId.toAppPage(3, 'com.star.mobile.video.player.PlayerVodActivity?vodId=' + vod, '')
            } else if (this.appType == 2 && vod) {
                window.location.href = 'startimes://player?vodId=' + vod
            } else {
                // TODO 处理浏览器逻辑
            }
        }
    },
    head() {
        return {
            title: this.voteTitle
        }
    }
}
</script>
<style lang="less">
@import '~assets/less/vote/normal.less';
@import '~assets/less/vote/love.less';
@navBackgound: linear-gradient(to bottom, #fd7d63, #cf2181);
@navActiveBackground: rgba(253, 125, 99, 0.11);
@navActiveColor: #ffffff;
@invitedColor: #0087eb;
@voteleftColor: #fd60a1;
</style>
