<template>
    <div class="wrapper" :style="{'padding-top':($store.state.appType==0? '4rem': '0')}">
        <div v-if="logo&&nickname">
            <download
                v-if="$store.state.appType==0"
                style="top:0;z-index:99"
                :page="`com.star.mobile.video.activity.BrowserActivity?loadUrl=${shareUrl}`"
            ></download>
            <div class="user">
                <div class="user-head" :style="{background:`url(${logo}) no-repeat center center`,'background-size':'cover'}"></div>
                <span class="name">{{nickname}}</span>
                <span class="time">{{time}}</span>
            </div>
            <div class="news-main" v-html="detailHtml"></div>
            <div :class="{'show-pic':sharePost}" class="opeartion">
                <div class="left">
                    <div class="like" :class="{actived:voteState==1}" @click="like()">{{ likeCount|formatCount }}</div>
                    <div class="unlike" :class="{actived:voteState==2}" @click="unlike()">{{ disLikeCount|formatCount }}</div>
                </div>
                <img v-show="!sharePost" src="~assets/img/web/ic_share_def_g.png" class="share" @click="toShare()" />
                <img v-show="sharePost" src="~assets/img/web/ic_share_white.png" class="share" @click="toShare()" />
            </div>
        </div>
        <div v-else class="fail">
            <img src="~assets/img/pay/img_failed_def_b.png" />
            <div class="alert-title">Sorry, this page is not available.</div>
            <div class="alert-context">The link may be broken, or the page has been removed. Find more funny videos and images on StarTimes ON</div>
        </div>
        <mShare />
        <mPost ref="mySwiper" @close="sharePost=false" />
    </div>
</template>
<script>
import { Base64 } from 'js-base64'
import mShare from '~/components/web/share.vue'
import mPost from '~/components/post'
import download from '~/components/web/download.vue'
import { callApp, shareInApp } from '~/functions/app'
import qs from 'qs'
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
            sharePost: false,
            pageStart: new Date().getTime()
        }
    },
    async asyncData({ app: { $axios }, store, route, req }) {
        let shareUrl = ''
        if (req) {
            shareUrl = 'http://' + req.headers.host + route.path
        } else {
            shareUrl = window.location.href
        }

        $axios.setHeader('token', store.state.token)
        try {
            const res = await $axios.get(`/feed/v1/posts/${route.params.id}/details`)

            const data = res.data
            console.log(route.params.id)
            const posters = data.posters
            let imgType = posters.length > 1 ? 2 : 1
            posters.forEach(item => {
                if (item.type.indexOf('GIF') >= 0) imgType = 0
            })
            const now = new Date().getTime()
            const diff = parseInt(now - data.publish_time)
            let time = 'just now'
            if (diff <= 60 * 1000) {
                time = 'just now'
            } else if (diff <= 60 * 1000 * 60) {
                time = Math.ceil(diff / 60000) + ' mins ago'
            } else if (diff <= 60 * 1000 * 60 * 24) {
                time = Math.ceil(diff / (60 * 1000 * 60)) + ' hours ago'
            } else if (diff <= 60 * 1000 * 60 * 24 * 30) {
                time = Math.ceil(diff / (60 * 1000 * 60 * 24)) + ' days ago'
            } else if (diff <= 60 * 1000 * 60 * 24 * 30 * 12) {
                time = Math.ceil(diff / (60 * 1000 * 60 * 24 * 30)) + ' months ago'
            } else {
                time = Math.ceil(diff / (60 * 1000 * 60 * 24 * 30 * 12)) + ' years ago'
            }

            const dom = await $axios.get(data.detailed_url)
            const startStr = dom.data.indexOf('<div class="news_main">')
            const endStr = dom.data.indexOf('</div><script')
            let detailHtml = dom.data.substring(startStr + 23, endStr)
            detailHtml = detailHtml.replace(/data-src/g, 'src')
            // 处理相对路径的图文显示
            detailHtml = detailHtml.replace(/src="(\S+)"/gm, function(match, p1) {
                let result = p1
                posters.forEach(item => {
                    if (item.url.indexOf(p1) >= 0) {
                        result = item.url
                    }
                })
                return `src="${result}"`
            })
            return {
                id: route.params.id,
                likeCount: data.upvote,
                disLikeCount: data.downvote,
                logo: data.logo || 'http://cdn.startimestv.com/banner/ic_male.png',
                nickname: data.nick || 'StarTimes Entertainment',
                time: time,
                detailHtml: detailHtml,
                title: data.title || '',
                voteState: data.vote_state, // 0 无，1赞，2踩，
                postPic: data.posters[0].url,
                imgType: imgType,
                postPics: data.posters,
                shareUrl: shareUrl
            }
        } catch (e) {
            return {
                id: route.params.id,
                likeCount: '',
                disLikeCount: '',
                logo: '',
                nickname: '',
                time: '',
                detailHtml: '',
                title: '',
                voteState: 0,
                postPic: '',
                imgType: '',
                postPics: [],
                shareUrl: shareUrl
            }
        }
    },
    mounted() {
        // 从缓存中读取点赞状态
        if (this.$store.state.appType <= 0) {
            callApp.call(this, `com.star.mobile.video.activity.BrowserActivity?loadUrl=${this.shareUrl}`)
            const voteSateCache = localStorage.getItem(`post_${this.id}`)
            this.voteState = voteSateCache
        }

        this.sendEvLog({
            category: `post_${this.id}`,
            action: 'page_show',
            label: this.id,
            value: this.logo ? 1 : 0,
            path: 0
        })

        const imgList = document.querySelectorAll('.news-main img')
        const imgSrcList = []
        for (let i = 0; i < imgList.length; i++) {
            imgSrcList.push(imgList[i].src)
            imgList[i].addEventListener('click', () => {
                this.sharePost = true
                this.sendEvLog({
                    category: `post_${this.id}`,
                    action: 'post_image_tap',
                    label: this.id + '-' + i,
                    value: imgList.length,
                    imgtype: imgList[i].src.indexOf('gif') >= 0 ? 0 : 1
                })
                this.$refs.mySwiper.show(imgSrcList, i)
            })
        }
    },
    methods: {
        toShare() {
            if (this.$store.state.appType == 1) {
                shareInApp(window.location.href, this.title || this.$store.state.lang.post_share_title, this.postPic)
            } else {
                this.$store.commit('SET_SHARE_STATE', true)
                this.sendEvLog({
                    category: `post_${this.id}`,
                    action: 'share_tap',
                    label: this.id,
                    value: this.postPics.length,
                    imgtype: this.imgType
                })
            }
        },
        like() {
            if (this.$store.state.appType <= 0) {
                this.postLike(this.voteState == 1 ? 3 : 1)
            } else {
                this.postLikeClient(this.voteState == 1 ? 3 : 1)
            }
        },
        unlike() {
            if (this.$store.state.appType <= 0) {
                this.postLike(this.voteState == 2 ? 3 : 2)
            } else {
                this.postLikeClient(this.voteState == 2 ? 3 : 2)
            }
        },
        postLike(num) {
            if (num == 1) {
                this.likeCount++
                if (this.voteState == 2) {
                    this.disLikeCount--
                    this.sendEvLog({
                        category: `post_${this.id}`,
                        action: 'upvote_tap',
                        label: this.id,
                        value: -1,
                        imgtype: this.imgType
                    })
                } else {
                    this.sendEvLog({
                        category: `post_${this.id}`,
                        action: 'upvote_tap',
                        label: this.id,
                        value: 1,
                        imgtype: this.imgType
                    })
                }
            } else if (num == 2) {
                this.disLikeCount++
                if (this.voteState == 1) {
                    this.likeCount--
                    this.sendEvLog({
                        category: `post_${this.id}`,
                        action: 'downvote_tap',
                        label: this.id,
                        value: -1,
                        imgtype: this.imgType
                    })
                } else {
                    this.sendEvLog({
                        category: `post_${this.id}`,
                        action: 'downvote_tap',
                        label: this.id,
                        value: 1,
                        imgtype: this.imgType
                    })
                }
            } else {
                if (this.voteState == 1) {
                    this.likeCount--
                    this.sendEvLog({
                        category: `post_${this.id}`,
                        action: 'upvote_tap',
                        label: this.id,
                        value: 0,
                        imgtype: this.imgType
                    })
                }
                if (this.voteState == 2) {
                    this.disLikeCount--
                    this.sendEvLog({
                        category: `post_${this.id}`,
                        action: 'downvote_tap',
                        label: this.id,
                        value: 0,
                        imgtype: this.imgType
                    })
                }
            }
            this.voteState = num
            localStorage.setItem(`post_${this.id}`, num)
        },
        postLikeClient(num) {
            this.postLike(num)
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
            })
        }
    },
    head() {
        return {
            title: this.title || this.$store.state.lang.post_share_title,
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1' },
                { name: 'description', property: 'description', content: this.title || this.$store.state.lang.post_share_title },
                { name: 'og:description', property: 'og:description', content: this.title || this.$store.state.lang.post_share_title },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: this.postPic
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: this.title || this.$store.state.lang.post_share_title },
                {
                    name: 'al:android:url',
                    property: 'al:android:url',
                    content:
                        'starvideo://platformapi/webtoapp?channel=facebook&target=' +
                        Base64.encode(`com.star.mobile.video.activity.BrowserActivity?loadUrl=${this.shareUrl}`.replace(/&/g, '**'))
                },
                { name: 'al:android:app_name', property: 'al:android:app_name', content: 'StarTimes' },
                { name: 'al:android:package', property: 'al:android:package', content: 'com.star.mobile.video' },
                { name: 'al:web:url', property: 'al:web:url', content: 'http://m.startimestv.com' }
            ]
        }
    }
}
</script>
<style lang="less">
.news-main {
    width: 100%;
    padding: 1rem 1rem 0.1rem;
    img {
        display: block;
        margin: 0.5rem 0;
        width: 100%;
        position: relative;
    }
    img::before {
        content: '';
        display: inline-block;
        padding-bottom: 30%;
        width: 0.1px;
        vertical-align: middle;
    }
    img::after {
        content: '';
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: url('~assets/img/water-logo.png') #686b6e no-repeat center;
    }
}
</style>
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
            padding: 0.8rem 1rem;
            color: white;
            background: rgba(0, 0, 0, 0.64);
            .like {
                background: url('~assets/img/others/like_white.png') no-repeat left center;
                background-size: contain;
            }
            .unlike {
                background: url('~assets/img/others/dislike_white.png') no-repeat left center;
                background-size: contain;
            }
        }
    }
}
.fail {
    padding: 0 2rem;
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
