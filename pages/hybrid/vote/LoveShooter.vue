<template>
    <div class="page-wrapper">
        <mVoteSwiper v-if="banners.length" :banners="banners" :name="voteTitle" />
        <div class="sticky">
            <nav id="nav">
                <a v-for="(item,index) in tabList" :key="index" :class="{on:tabIndex===index}" @click="tabIndex=index">
                    <span>{{item.name}}</span>
                </a>
            </nav>
            <template v-for="(item,index) in tabList">
                <mRank v-if="item.type=='rank'" v-show="tabIndex==index" :key="index" :data-list="rankList" />
            </template>
        </div>
    </div>
</template>
<script>
import mRank from '~/components/vote/rank'
import mVoteSwiper from '~/components/vote/vote_swiper'
export default {
    layout: 'base',
    components: {
        mRank,
        mVoteSwiper
    },
    data() {
        return {
            appType: this.$store.state.appType || 0,
            tabList: [
                {
                    name: 'Rank',
                    type: 'rank'
                }
            ],
            tabIndex: 0,
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
    },
    methods: {
        getAllList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=9`).then(res => {
                if (res.data.data.length > 0) {
                    const data = res.data.data
                    this.rankList = data.concat([])
                    this.rankList.sort(function(a, b) {
                        return b.ballot_num - a.ballot_num
                    })
                }
            })
        },
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
#nav a{
    width: 100%;
}
</style>
