<template>
    <div class="page-wrapper">
        <mVoteSwiper v-if="banners.length" :banners="banners" :name="voteTitle" />
        <div class="sticky">
            <nav id="nav">
                <a v-for="(item,index) in tabList" :key="index" :class="{on:tabIndex===index}" @click="tabIndex=index">
                    <span>{{item.name}}</span>
                </a>
            </nav>
            <div v-if="appType" class="leftvote">
                <span>{{$store.state.lang.vote_leftvote}}:{{leftVote}}</span>
            </div>
            <template v-for="(item,index) in tabList">
                <mVote v-if="item.type=='vote'" v-show="tabIndex==index" :key="index" :data-list="playerList" />
                <mRank v-if="item.type=='rank'" v-show="tabIndex==index" :key="index" />
                <mAboutWord v-if="item.type=='about_word'" v-show="tabIndex==index" :key="index" :document="document" />
            </template>
        </div>
    </div>
</template>
<script>
import mVote from '~/components/vote/tab'
import mRank from '~/components/vote/rank'
import mVoteSwiper from '~/components/vote/vote_swiper'
import mAboutWord from '~/components/vote/about_word'
import { callApp, callMarket } from '~/functions/utils'
import qs from 'qs'
export default {
    layout: 'base',
    components: {
        mVote,
        mRank,
        mVoteSwiper,
        mAboutWord
    },
    data() {
        return {
            appType: this.$store.state.appType || 0,
            tabList: [
                {
                    name: 'vote',
                    type: 'vote',
                    vote_id: 2
                },
                {
                    name: 'rank',
                    type: 'rank',
                    vote_id: 2
                },
                {
                    name: 'about',
                    type: 'about_vod',
                    vote_id: 2
                }
            ],
            tabIndex: 0
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
                label: (nv == 0 && 'film') || (nv == 1 && 'short film') || (nv == 2 && 'MV'),
                value: 1
            })
        }
    },
    async asyncData({ app: { $axios }, store, req }) {
        let banners = []
        let leftVote = 0
        $axios.setHeader('token', store.state.token)
        try {
            const { data } = await $axios.get(`/voting/v1/vote?vote_id=8`)
            if (data.data.banner) banners = await $axios.get(`/adm/v1/units/${data.data.banner}/materials`)
            if (store.state.appType) {
                leftVote = await $axios({
                    url: `/voting/v1/ticket/sign-in`,
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    method: 'POST',
                    data: qs.stringify({
                        vote_id: 8
                    })
                })
                leftVote = leftVote.data.data || 0
            }
            return {
                banners: banners.data.data || [],
                vote_sign: (req && req.headers.vote_sign) || '', // 通过serverMiddleWare拿到的唯一标识
                leftVote: leftVote,
                voteTitle: data.data.name
            }
        } catch (e) {
            return {
                banners: [],
                vote_sign: (req && req.headers.vote_sign) || '',
                leftVote: 0,
                voteTitle: 'Pan Africa Online Film Festival'
            }
        }
    },
    mounted() {
        this.getAllList()
    },
    methods: {
        // handleVote(film) {
        //     if (this.appType <= 0) {
        //         this.loadConfirm(1, 'vote')
        //         return
        //     }
        //     if (film.state === -1) {
        //         this.$toast(this.$store.state.lang.vote_notstart_btn)
        //         return
        //     }

        //     this.sendEvLog({
        //         category: `vote_${this.voteTitle}_${this.platform}`,
        //         action: 'votebtn_click',
        //         label: film.name,
        //         value: 1
        //     })

        //     if (this.leftVote <= 0) {
        //         if (this.appType == 1) {
        //             this.$confirm(
        //                 this.$store.state.lang.vote_fail + this.$store.state.lang.vote_success_0,
        //                 () => {
        //                     this.toShare('votefail')
        //                 },
        //                 () => {},
        //                 this.$store.state.lang.vote_share,
        //                 this.$store.state.lang.vote_cancel
        //             )
        //         } else if (this.appType == 2) {
        //             this.$alert(this.$store.state.lang.vote_fail, () => {}, this.$store.state.lang.vote_ok)
        //         }
        //     } else {
        //         this.$axios({
        //             url: '/voting/v1/ballot',
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/x-www-form-urlencoded'
        //             },
        //             data: qs.stringify({
        //                 candidate_id: film.id,
        //                 vote_id: 8
        //             })
        //         }).then(res => {
        //             if (res.data.code === 0) {
        //                 this.getAllList()
        //                 this.leftVote--
        //                 if (this.leftVote < 1 && this.appType == 1) {
        //                     this.$confirm(
        //                         this.$store.state.lang.vote_success + this.$store.state.lang.vote_success_0,
        //                         () => {
        //                             this.toShare('0leftvote')
        //                         },
        //                         () => {},
        //                         this.$store.state.lang.vote_share,
        //                         this.$store.state.lang.vote_cancel
        //                     )
        //                 } else if (this.leftVote < 1 && this.appType == 2) {
        //                     this.$alert(this.$store.state.lang.vote_success, () => {}, this.$store.state.lang.vote_ok)
        //                 } else {
        //                     this.$toast(this.$store.state.lang.vote_success + this.$store.state.lang.vote_leftvote + ':' + this.leftVote)
        //                 }
        //             } else {
        //                 this.$toast(res.data.message)
        //             }
        //         })
        //     }
        // },
        // toVideo(item) {
        //     const vod = item.link_vod_code
        //     this.sendEvLog({
        //         category: `vote_${this.voteTitle}_${this.platform}`,
        //         action: 'votepic_click',
        //         label: item.name,
        //         value: 1
        //     })

        //     if (this.appType == 1 && vod) {
        //         window.getChannelId && window.getChannelId.toAppPage(3, 'com.star.mobile.video.player.PlayerVodActivity?vodId=' + vod, '')
        //     } else if (this.appType == 2 && vod) {
        //         window.location.href = 'startimes://player?vodId=' + vod
        //     } else {
        //         this.loadConfirm(1) // TODO 差一个pos
        //     }
        // },

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
        }
    },
    head() {
        return {
            title: 'Love Shooter'
        }
    }
}
</script>
<style lang="less">
@import '~assets/less/vote/normal.less';
@import '~assets/less/vote/love.less';
@navBackgound: #689e32;
@navActiveBackground: rgba(63, 109, 17, 0.5);
@navActiveColor: #fbc042;
@invitedColor: #0087eb;
</style>
