<template>
    <div>
        <div class="poster" @click="confirmDown">
            <img :src="cdnPicSrc(sPoster)" alt class="cover">
            <img v-show="sPoster" src="~assets/img/web/ic_play.png">
            <div class="clearfix">
                <span class="program-name title">{{sName}}</span>
                <div class="share" @click.stop="toShare">
                    <img src="~assets/img/web/ic_share_def_g.png"> Share
                </div>
            </div>
            <p>{{sDescription}}</p>
        </div>
        <div class="poster father">
            <nuxt-link :to="`/browser/program/detail/${pid}`">
                <span class="program-name">{{pName}}</span>
                <div class="clearfix">
                    <p>{{pDescription}}</p>
                    <img :src="cdnPicSrc(pPoster)">
                </div>
            </nuxt-link>
        </div>
        <div class="clips">
            <p>{{$store.state.lang.officialwebsitemobile_subprogramdetails_clips}}</p>
            <ul class="clearfix">
                <li v-for="(item,index) in subProgram" :key="index">
                    <nuxt-link :to="`/browser/program/subdetail/${pid}?subId=${item.id}`">
                        <div>
                            <img :src="cdnPicSrc(item.poster.resources[0].url)">
                            <span class="show-time">{{item.durationSecond | formatShowTime}}</span>
                        </div>
                        <span class="title">{{item.description||item.name}}</span>
                    </nuxt-link>
                </li>
            </ul>
        </div>
        <mShare :show="showShare"/>
    </div>
</template>
<script>
import mShare from '~/components/web/share.vue'
import { formatTime, downApp, initFacebookLogin, shareFacebook } from '~/functions/utils'
export default {
    components: {
        mShare
    },
    filters: {
        formatShowTime(val) {
            return formatTime(val)
        }
    },
    data() {
        return {
            pid: this.$route.params.id,
            sPoster: '',
            sName: '',
            sDescription: '',
            subProgram: [],
            showShare: false
        }
    },
    computed: {
        sid() {
            return this.$route.query.subId
        }
    },
    watch: {
        sid(nv, ov) {
            this.$router.go(0)
        }
    },
    async asyncData({ app: { $axios }, route, store }) {
        $axios.setHeader('token', store.state.token)
        let data = {}
        try {
            const res = await $axios.get(`/cms/program_detail/${route.params.id}`)
            data = res.data
        } catch (e) {
            data = {}
        }
        return {
            pPoster: data.poster || '',
            pName: data.name || '',
            pDescription: data.programSummary || ''
        }
    },
    mounted() {
        initFacebookLogin()
        if (this.pid) {
            this.$nextTick(() => this.$nuxt.$loading.start())
            this.$axios.get(`/vup/v1/program/${this.pid}/sub-vods`).then(res => {
                this.$nextTick(() => this.$nuxt.$loading.finish())
                const data = res.data.data
                if (data && data.length > 0) {
                    this.subProgram = data
                    this.subProgram.forEach(ele => {
                        if (ele.id == this.sid) {
                            this.sPoster = ele.poster.resources[0].url
                            this.sName = ele.description || ele.name
                            this.sDescription = ele.summary
                        }
                    })
                }
            })
        }
    },
    methods: {
        share() {
            shareFacebook()
        },
        toShare() {
            this.$store.commit('SET_SHARE_STATE', true)
        },
        confirmDown() {
            this.$confirm(
                this.$store.state.lang.officialwebsitemobile_downloadpromo,
                () => {
                    downApp.call(this)
                },
                () => {},
                this.$store.state.lang.officialwebsitemobile_downloadpopup_install,
                this.$store.state.lang.officialwebsitemobile_downloadpopup_cancel
            )
        }
    },
    head() {
        return {
            title: this.sName,
            meta: [
                { hid: 'description', name: 'description', content: this.sDescription },
                { property: 'og:description', content: this.sDescription + '#StarTimes ON Live TV & football' },
                { property: 'og:image', content: this.sPoster.replace('http:', 'https:') },
                { property: 'twitter:card', content: 'summary' }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
img {
    border-radius: 2px;
}
.poster {
    border-bottom: 1px solid #d8d8d8;
    margin: 0.8rem 0 0.5rem;
    position: relative;
    .cover {
        width: 100%;
        & + img {
            position: absolute;
            width: 3rem;
            top: 50%;
            height: 3rem;
            left: 50%;
            margin-left: -1.5rem;
            margin-top: -3rem;
        }
    }
    .program-name {
        font-weight: bold;
        color: #333333;
        line-height: 2rem;
        &.title {
            display: block;
            width: 85%;
            float: left;
        }
    }
    .share {
        float: right;
        width: 14%;
        color: #666666;
        font-size: 0.8rem;
        line-height: 0.8rem;
        padding: 0.3rem 0;
        text-align: center;
        img {
            display: block;
            width: 1.5rem;
            margin: 0 auto;
        }
    }
    p {
        color: #666666;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        font-size: 0.9rem;
    }
    &.father {
        padding-bottom: 0.5rem;
        margin-top: 0;
        p {
            width: 60%;
            float: left;
            font-size: 0.85rem;
            height: auto;
            word-break: break-all;
        }
        img {
            display: block;
            width: 38%;
            float: right;
        }
    }
}
.clips {
    margin: 0.8rem 0;
    p {
        color: #111111;
        margin: 0.5rem 0;
        font-weight: bold;
    }
    ul {
        li {
            list-style: none;
            float: left;
            width: 48%;
            line-height: 1.1rem;
            &:nth-child(2n) {
                float: right;
            }
            div {
                position: relative;
                width: 100%;
                &:before {
                    content: '';
                    display: inline-block;
                    padding-bottom: 56%;
                    width: 0.1px;
                    vertical-align: middle;
                }
                .show-time {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    padding: 0 0.2rem;
                    background: rgba(0, 0, 0, 1);
                    color: #ffffff;
                    font-size: 0.8rem;
                }
                img {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                }
            }
            span {
                font-size: 0.85rem;
                color: #666666;
                &.title {
                    display: -webkit-box;
                    overflow: hidden;
                    height: 2.6rem;
                    padding-top: 0.4rem;
                    -webkit-line-clamp: 2;
                    /* autoprefixer: off */
                    -webkit-box-orient: vertical;
                }
            }
        }
    }
}
</style>
