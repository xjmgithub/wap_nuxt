<template>
    <div>
        <div class="poster" @click="confirmDown">
            <img :src="cdnPicSrc(pPoster)">
            <img v-show="pPoster" src="~assets/img/web/ic_play.png">
            <div class="clearfix">
                <span class="program-name title">{{pName}}</span>
                <div class="share" @click.stop="toShare">
                    <img src="~assets/img/web/ic_share_def_g.png">{{$store.state.lang.officialwebsitemobile_action_share}}
                </div>
            </div>
            <p>{{pDescription}}</p>
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
                        <span class="title">{{item.description || item.name}}</span>
                    </nuxt-link>
                </li>
            </ul>
        </div>
        <mShare :show="showShare" />
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
            subProgram: [],
            showShare: false
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
            pName: data.description || data.name || '',
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
        toSubProgramDetail(id) {
            this.$router.push(`/browser/programlist/subProgram?subId=${id}`)
        },
        confirmDown() {
            const _this = this
            this.$confirm(
                this.$store.state.lang.officialwebsitemobile_downloadpromo,
                () => {
                    downApp.call(_this)
                },
                () => {},
                this.$store.state.lang.officialwebsitemobile_downloadpopup_install,
                this.$store.state.lang.officialwebsitemobile_downloadpopup_cancel
            )
        }
    },
    head() {
        return {
            title: this.pName,
            meta: [
                { hid: 'description', name: 'description', content: this.pDescription },
                { property: 'og:description', content: this.pDescription + '#StarTimes ON Live TV & football' },
                { property: 'og:image', content: this.pPoster.replace('http:', 'https:') },
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
    padding: 0.8rem 0;
    position: relative;
    img {
        width: 100%;
        margin-bottom: 0.5rem;
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
        padding: 0.4rem 0;
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
        word-break: break-all;
    }
}
.clips {
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
                    position: absolute;
                    height: 100%;
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
