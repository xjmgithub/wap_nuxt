<template>
    <div class="page-wrapper">
        <mVoteSwiper v-if="banners.length" :banners="banners" :name="voteTitle" />
        <div class="sticky">
            <nav id="nav">
                <a v-for="(item,index) in tabList" :key="index" :class="{on:tabIndex===index}" @click="tabIndex=index">
                    <span>{{item.name}}</span>
                </a>
            </nav>
            <div v-if="tabIndex!=2" id="leftvote" :class="{'line':tabIndex==1 }" class="clearfix">
                <span>Votes left:{{leftVote}}</span>
            </div>
            <template v-for="(item,index) in tabList">
                <mVote v-if="item.type=='vote'" v-show="tabIndex==index" :key="index" :data-list="playerList" @onVote="handleVote" @toPlay="toVideo" />
                <mRank v-if="item.type=='rank'" v-show="tabIndex==index" :key="index" :data-list="rankList" />
            </template>
        </div>
    </div>
</template>
<script>
import mVote from '~/components/vote/vote'
import mRank from '~/components/vote/rank'
import mVoteSwiper from '~/components/vote/vote_swiper'
import qs from 'qs'
export default {
    layout: 'base',
    components: {
        mVote,
        mRank,
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
                    name: 'Rank',
                    type: 'rank'
                }
            ],
            tabIndex: 0,
            leftVote: '-',
            playerList: [],
            rankList: [],
            voteTitle: 'Love Shooter'
        }
    },
    async asyncData({ app: { $axios }, store, req }) {
        let banners = []
        $axios.setHeader('token', store.state.token)
        try {
            const { data } = await $axios.get(`/voting/v1/vote?vote_id=9`)
            if (data.data.banner) banners = await $axios.get(`/adm/v1/units/${data.data.banner}/materials`)
            return {
                banners: banners.data.data || [],
            }
        } catch (e) {
            return {
                banners: [],
            }
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
                    const data = res.data.data
                    this.playerList = data.concat([])
                    this.rankList = data.concat([])
                    this.rankList.sort(function(a, b) {
                        return b.ballot_num - a.ballot_num
                    })
                }
            })
        },
        handleVote(item) {
            if (this.leftVote <= 0) {
                this.$toast('Left vote not enough')
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
                        this.$toast('Vote success' + ':' + this.leftVote)
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
