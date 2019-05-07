<template>
    <div class="page-wrapper">
        <!-- <mVoteSwiper :vote_id="vote_id" /> -->
        <nav id="nav">
            <a v-for="(item,index) in tabList" :key="index" :class="{on:tabIndex === index}" @click="handleTab(index)">
                <span>{{item.name}}</span>
            </a>
        </nav>
        <!-- <template v-for="(item,index) in tabList">
            <mVote
                v-if="item.type=='normal_vote'"
                v-show="boxIndex==index"
                :key="index"
                :tab_msg="item"
                :share="share"
            />
            <mRank
                v-if="item.type=='rank'"
                v-show="boxIndex==index"
                :key="index"
                :tab_msg="item"
                :share="share"
            />
            <mViceVote
                v-if="item.type=='vice_vote'"
                v-show="boxIndex==index"
                :key="index"
                :tab_msg="item"
                :share="share"
            />
        </template> -->
    </div>
</template>
<script>
// import mVoteSwiper from '~/components/vote/vote_swiper'
export default {
    layout: 'base',
    // components: {
    //     mVoteSwiper
    // },
    data() {
        return {
            isLogin: this.$store.state.user.type || false,
            appType: this.$store.state.appType,
            tabList: [
                {
                    name: 'Film',
                    type: 'normal_Film',
                    vote_id: 2,
                    main_vote: true
                },
                {
                    name: 'Short Film',
                    type: 'short_film',
                    vote_id: 2
                },
                {
                    name: 'MV',
                    type: 'normal_Film',
                    vote_id: 3
                }
            ],
            tabIndex: 0,
            vote_id: 2
        }
    },
    mounted() {},
    methods: {
        handleTab(index) {
            this.tabIndex = index
        }
    },
    head() {
        return {
            title: 'Film Festival Vote'
        }
    }
}
</script>
<style lang="less">
@import '~assets/less/vote/normal.less';
html {
    font-size: 20px;
    body {
        margin: 0;
        padding: 0;
        background-color: #4e4e4e;
        .page-wrapper {
            height: 100%;
            min-height: 100vh;
            margin: 0 auto;
            background-color: #4e4e4e;
        }
    }
}
#nav {
    height: 2rem;
    background: linear-gradient(to bottom, #9d802a, #c9ab6f);
    padding: 0.4rem 0;
    a {
        text-align: center;
        cursor: pointer;
        height: 1.2rem;
        line-height: 1.2rem;
        width: 33%;
        color: #ffe189;
        display: block;
        float: left;
        font-weight: 600;
        &:link,
        &:active,
        &:visited,
        &:hover {
            background: none;
            -webkit-tap-highlight-color: rgba(255, 255, 255, 0.2);
        }
        &:nth-child(2) {
            border-right: 1px solid rgba(255, 255, 210, 0.5);
            border-left: 1px solid rgba(255, 255, 210, 0.5);
        }
        &.on {
            span {
                border-bottom: 0.2rem solid #ffffff;
                padding-bottom: 0.1rem;
                color: #ffffff;
                border-radius: 10%;
            }
        }
    }
}
</style>
