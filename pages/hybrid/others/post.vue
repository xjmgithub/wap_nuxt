<template>
    <div class="wrapper">
        <div class="user">
            <img src="~assets/img/naire/girl.png" />
            <span class="name">Funnie</span>
            <span class="time">Just now</span>
        </div>
        <iframe id="news-content" frameborder="0" scrolling="no" src="http://localhost:8001/newstpl/index.html" width="100%"></iframe>
        <div :class="{'show-pic':sharePost}" class="opeartion">
            <div class="left">
                <span>
                    <img v-show="likeIcon=='likeDef'" src="~assets/img/faq/ic_like_def_g.png" @click="dealIcon('like')" />
                    <img v-show="likeIcon=='like'" src="~assets/img/faq/ic_like_def_b.png" @click="dealIcon('likeDef')" /> {{ likeCount|formatCount }}
                </span>
                <span>
                    <img v-show="disLikeIcon=='disLikeDef'" src="~assets/img/faq/ic_dislike_def_g.png" @click="dealIcon('disLike')" />
                    <img v-show="disLikeIcon=='disLike'" src="~assets/img/faq/ic_dislike_def_b.png" @click="dealIcon('disLikeDef')" /> {{ disLikeCount|formatCount }}
                </span>
            </div>
            <img src="~assets/img/web/ic_share_def_g.png" class="share" @click="toShare()" />
        </div>
        <mShare />
        <mPost v-show="sharePost" ref="mySwiper" :post-list="postList" :p-index="index" @closePost="sharePost=false" />
    </div>
</template>
<script>
import mShare from '~/components/web/share.vue'
import mPost from '~/components/post'
export default {
    layout: 'base',
    filters: {
        formatCount(val) {
            if (val < 10000) {
                // 1w
                return val.toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,')
            } else if (val >= 10000 && val < 1000000) {
                // 1w-100w (K)
                const x = (val / 1000).toFixed(1) % 1000
                return x == 0 ? '1.0M' : x + 'K'
            } else if (val >= 1000000) {
                // 100w (M)
                return (val / 1000000).toFixed(1) + 'M'
            }
        }
    },
    components: {
        mShare,
        mPost
    },
    data() {
        return {
            likeIcon: 'likeDef',
            disLikeIcon: 'disLikeDef',
            likeCount: 1288398,
            disLikeCount: 1323,
            sharePost: false,
            // postList: [{ src: '/res_nuxt/img/soccercup.png' }, { src: '/res_nuxt/img/mrshare.jpg' }]
            postList: [],
            index: 1
        }
    },
    mounted() {
        window.addEventListener('message', event => {
            if (event.data.type == 'updateHeight') {
                const iframe = document.getElementById('news-content')
                iframe.style.height = event.data.value + 'px'
            } else if (event.data.type == 'showPic') {
                // TODO showPic
                this.sharePost = true
                this.postList = event.data.value.list
                this.index = Number(event.data.value.index) + 1
                this.$refs.mySwiper.slide()
            }
        })
    },
    methods: {
        toShare() {
            this.$store.commit('SET_SHARE_STATE', true)
        },
        dealIcon(type) {
            switch (type) {
                case 'like':
                    if (this.disLikeIcon == 'disLike') this.disLikeCount--
                    this.likeIcon = 'like'
                    this.disLikeIcon = 'disLikeDef'
                    this.likeCount++
                    break
                case 'likeDef':
                    this.likeIcon = 'likeDef'
                    this.likeCount--
                    break
                case 'disLike':
                    if (this.likeIcon == 'like') this.likeCount--
                    this.disLikeIcon = 'disLike'
                    this.likeIcon = 'likeDef'
                    this.disLikeCount++
                    break
                case 'disLikeDef':
                    this.disLikeIcon = 'disLikeDef'
                    this.disLikeCount--
                    break
            }
        }
    },
    head() {
        return {
            title: 'Post'
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    min-height: 100vh;
    width: 100%;
    padding: 0.85rem;
    .user {
        line-height: 2.5rem;
        margin-bottom: 0.3rem;
        img {
            width: 2.5rem;
        }
        .name {
            color: #333333;
            font-size: 0.95rem;
            margin: 0 0.8rem 0 0.5rem;
            font-weight: bold;
        }
        .time {
            color: #999999;
            font-size: 0.85rem;
        }
    }
    .title {
        color: #333333;
        font-size: 0.85rem;
        margin-bottom: 0.3rem;
    }
    .image {
        width: 100%;
        margin-bottom: 0.3rem;
        img {
            width: 100%;
            display: block;
            margin-bottom: 0.5rem;
        }
    }
    .des {
        margin-bottom: 0.3rem;
        p {
            color: #333333;
            font-size: 0.85rem;
            margin-bottom: 0.3rem;
        }
    }
    .opeartion {
        border-bottom: 1px solid #eeeeee;
        color: #666666;
        font-size: 0.85rem;
        padding-bottom: 0.3rem;
        position: relative;
        margin-top: 0.3rem;
        width: 100%;
        .left {
            display: inline-block;
        }
        span {
            margin-right: 0.5rem;
        }
        img {
            width: 1.6rem;
            &.share {
                float: right;
                margin-top: -2px;
            }
        }
        &.show-pic {
            position: fixed;
            bottom: 0.5rem;
            width: 96%;
            left: 2%;
            z-index: 1001;
            border-bottom: 1px solid #666666;
        }
    }
}
</style>
