<template>
    <div class="page-wrapper">
        <!-- <mVoteSwiper :vote_id="vote_id" /> -->
        <div>
            <div class="rules">
                <span>About</span>
                <span>Vote Rules</span>
            </div>
        </div>
        <nav id="nav">
            <a v-for="(item,index) in tabList" :key="index" :class="{on:tabIndex === index}" @click="handleTab(index)">
                <span>{{item.name}}</span>
            </a>
        </nav>
        <div class="leftvote">
            <span>Left vote:13</span>
        </div>
        <template v-for="(item,index) in tabList">
            <mFilm v-if="item.type=='normal_Film'" v-show="tabIndex==index" :key="index" :tab_msg="item" />
        </template>
    </div>
</template>
<script>
// import mVoteSwiper from '~/components/vote/vote_swiper'
import mFilm from '~/components/vote/film'
export default {
    layout: 'base',
    components: {
        mFilm
    },
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
.rules {
    height: 2rem;
    line-height: 2rem;
    background: linear-gradient(360deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
    font-size: 0.88rem;
    color: #ffffff;
    span {
        display: inline-block;
        text-align: center;
        width: 33%;
        text-decoration: underline;
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
        text-shadow: 1px 2px 0px rgba(0, 0, 0, 0.5);
        font-size: 0.88rem;
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
.leftvote {
    padding-right: 0.8rem;
    height: 2rem;
    line-height: 2rem;
    background: linear-gradient(to bottom, #000000, #4e4e4e);
    font-size: 0.88rem;
    color: #ffffff;
    text-align: right;
}
</style>
