<template>
    <div class="wrapper" style="padding-top:4rem;">
        <div v-if="logo&&nickname">
            <download style="top:0;z-index:99"></download>
            <div class="user">
                <div class="user-head" :style="{background:`url(${logo}) no-repeat center center`,'background-size':'cover'}"></div>
                <span class="name">{{nickname}}</span>
                <span class="time">{{publishTime}}</span>
            </div>
            <iframe
                id="news-content"
                frameborder="0"
                scrolling="no"
                src="http://10.0.63.127:8001/newstpl/index.html"
                width="100%"
                @load="iframeLoaded=true"
            ></iframe>
            <div v-show="iframeLoaded" :class="{'show-pic':sharePost}" class="opeartion">
                <div class="left">
                    <div class="like" :class="{actived:voteState==1}" @click="like()">{{ likeCount|formatCount }}</div>
                    <div class="unlike" :class="{actived:voteState==2}" @click="unlike()">{{ disLikeCount|formatCount }}</div>
                </div>
                <img src="~assets/img/web/ic_share_def_g.png" class="share" @click="toShare()" />
            </div>
        </div>
        <div v-else class="fail">
            <img src="~assets/img/pay/img_failed_def_b.png" />
            <div class="alert-title">Sorry, this page is not available.</div>
            <div class="alert-context">The link may be broken, or the page has been removed. Find more funny videos and images on StarTimes ON</div>
        </div>
        <mShare />
        <mPost ref="mySwiper" :img-type="imgType" @close="sharePost=false" />
    </div>
</template>
<script>
import mShare from '~/components/web/share.vue'
import mPost from '~/components/post'
import dayjs from 'dayjs'
import qs from 'qs'
import download from '~/components/web/download.vue'
export default {
    layout: 'base',
    filters: {
        formatCount(val) {
            if (val == 0 || isNaN(val)) {
                return '--'
            } else if (val < 10000) {
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
        mPost,
        download
    },
    data() {
        return {
            iframeLoaded: false,
            sharePost: false,
            postList: []
        }
    },
    computed: {
        publishTime() {
            return dayjs(parseInt(this.time)).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    async asyncData({ app: { $axios }, store, route }) {
        $axios.setHeader('token', store.state.token)
        try {
            const res = await $axios.get(`/feed/v1/posts/${route.params.id}/details`)
            const data = res.data
            const posters = data.posters
            let imgtype = posters.length > 1 ? 2 : 1
            posters.forEach(item => {
                if (item.type.indexOf('GIF') >= 0) imgtype = 0
            })

            return {
                id: route.params.id,
                likeCount: data.upvote,
                disLikeCount: data.downvote,
                logo: data.logo,
                nickname: data.nick,
                time: data.publish_time,
                detailUrl: data.detailed_url,
                title: data.title || '',
                voteState: data.vote_state, // 0 无，1赞，2踩，
                postPic: data.posters[0].url,
                imgType: imgtype
            }
        } catch (e) {
            return {
                id: route.params.id,
                likeCount: '',
                disLikeCount: '',
                logo: '',
                nickname: '',
                time: '',
                datailUrl: '',
                title: '',
                voteState: 0,
                postPic: '',
                imgType: ''
            }
        }
    },
    mounted() {
        window.addEventListener('message', event => {
            if (event.data.type == 'updateHeight') {
                const iframe = document.getElementById('news-content')
                iframe.style.height = event.data.value + 'px'
            } else if (event.data.type == 'showPic') {
                this.sharePost = true
                this.sendEvLog({
                    category: `post_${this.id}`,
                    action: 'post_image_tap',
                    label: this.id,
                    value: 1,
                    imgtype: this.imgtype
                })
                this.$refs.mySwiper.show(event.data.value.list, Number(event.data.value.index))
            }
        })
    },
    methods: {
        toShare() {
            this.$store.commit('SET_SHARE_STATE', true)
        },
        like() {
            this.postLike(this.voteState == 1 ? 3 : 1)
            this.sendEvLog({
                category: `post_${this.id}`,
                action: 'upvote_tap',
                label: this.id,
                value: 1,
                imgtype: this.imgtype
            })
        },
        unlike() {
            this.postLike(this.voteState == 2 ? 3 : 2)
            this.sendEvLog({
                category: `post_${this.id}`,
                action: 'downvote_tap',
                label: this.id,
                value: 1,
                imgtype: this.imgtype
            })
        },
        postLike(num) {
            this.$axios({
                url: '/like/v1/vote',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    post_id: this.id,
                    state: num
                })
            }).then(res => {
                if (res.data.code === 0) {
                    if (num == 1) {
                        this.likeCount++
                        this.voteState == 2 && this.disLikeCount--
                    } else if (num == 2) {
                        this.disLikeCount++
                        this.voteState == 1 && this.likeCount--
                    } else {
                        if (this.voteState == 1) {
                            this.likeCount--
                        }
                        if (this.voteState == 2) {
                            this.disLikeCount--
                        }
                    }
                    this.voteState = num
                } else {
                    this.$alert('network error')
                }
            })
        }
    },
    head() {
        return {
            title: this.title || 'StarTimes ON',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1' },
                { name: 'description', property: 'description', content: this.title || 'StarTimes ON' },
                { name: 'og:description', property: 'og:description', content: this.title || 'StarTimes ON' },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: this.postPic
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: this.title || 'StarTimes ON' }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    width: 100%;
    .user {
        line-height: 2.5rem;
        margin-bottom: 0.3rem;
        padding: 1rem 1rem 0rem;
        .user-head {
            width: 2.5rem;
            height: 2.5rem;
            background-size: contain;
            border-radius: 2.5rem;
            float: left;
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
    .opeartion {
        border-bottom: 1px solid #eeeeee;
        color: #666666;
        font-size: 0.85rem;
        padding: 0.5rem 0;
        position: relative;
        margin: 0 1rem 1.2rem;
        .left {
            display: inline-block;
            > div {
                display: inline-block;
                height: 1.5rem;
                line-height: 1.5rem;
                padding-left: 1.7rem;
                margin-right: 1rem;
            }
            .like {
                background: url('~assets/img/others/like.png') no-repeat left center;
                background-size: contain;
                &.actived {
                    background: url('~assets/img/others/like_sl.png') no-repeat left center;
                    background-size: contain;
                }
            }
            .unlike {
                background: url('~assets/img/others/dislike.png') no-repeat left center;
                background-size: contain;
                &.actived {
                    background: url('~assets/img/others/dislike_sl.png') no-repeat left center;
                    background-size: contain;
                }
            }
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
            bottom: 0rem;
            z-index: 1001;
            width: 100%;
            margin: 0;
            padding: 1rem;
        }
    }
}
.fail {
    padding: 2rem;
    img {
        display: block;
        width: 14rem;
        margin: 0 auto;
        margin-top: 5rem;
    }
    .alert-title {
        font-size: 1.2rem;
        font-weight: bold;
        text-align: center;
        margin: 2rem 0 1rem;
    }
    .alert-context {
        line-height: 1.3rem;
        text-align: left;
    }
}
</style>
