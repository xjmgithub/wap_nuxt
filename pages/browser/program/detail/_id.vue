<template>
    <div>
        <div class="poster" @click="confirmDown">
            <div v-if="pPoster" class="pic" @click="confirmDown">
                <img :src="cdnPicSrc(pPoster)" />
                <img src="~assets/img/web/ic_play.png" />
            </div>
            <div class="clearfix">
                <span class="program-name title">{{pName}}</span>
                <div class="share" @click.stop="toShare">
                    <img src="~assets/img/web/ic_share_def_g.png" />
                    {{$store.state.lang.officialwebsitemobile_action_share}}
                </div>
            </div>
            <p>{{pDescription}}</p>
        </div>
        <div class="clips">
            <p>{{$store.state.lang.officialwebsitemobile_subprogramdetails_clips}}</p>
            <ul class="clearfix">
                <li v-for="(item,index) in subProgram" :key="index">
                    <nuxt-link :to="`/browser/program/subdetail/${item.id}`">
                        <div>
                            <img :src="item.poster && cdnPicSrc(item.poster.resources[0].url)" />
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
import localforage from 'localforage'
import { Base64 } from 'js-base64'
import mShare from '~/components/web/share.vue'
import { formatTime, initDB, cacheDateUpdate } from '~/functions/utils'
import { callupFlow } from '~/functions/app'
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
        console.log(this.$route.params.id)
        return {
            pid: this.$route.params.id,
            subProgram: [],
            pPoster: '',
            pName: '',
            pDescription: '',
            showShare: false
        }
    },
    async asyncData({ app: { $axios }, route, store }) {
        if (process.server) {
            try {
                $axios.setHeader('token', store.state.gtoken)
                const res = await $axios.get(`/cms/program_detail/${route.params.id}`)
                const res2 = await $axios.get(`/adm/v1/sharing/custom-contents?target_type=2&target_id=${route.params.id}`)
                return {
                    pData: res.data,
                    cusShareTitle: (res2.data.data && res2.data.data.copywriting) || '',
                    cusShareImg: (res2.data.data && res2.data.data.image_url) || ''
                }
            } catch (e) {
                return {
                    pData: {},
                    cusShareTitle: '',
                    cusShareImg: ''
                }
            }
        } else {
            return {
                pData: {},
                cusShareTitle: '',
                cusShareImg: ''
            }
        }
    },
    mounted() {
        if (this.pid) {
            initDB()
            if (this.pData.name) {
                localforage.setItem('program_' + this.pid, this.pData)
            }
            cacheDateUpdate.call(this, this.getData)
        }
    },
    methods: {
        getData() {
            this.$nextTick(() => this.$nuxt.$loading.start())
            let loadNum = 2

            localforage.getItem('program_' + this.pid).then(val => {
                if (!val) {
                    this.$axios.get(`/cms/program_detail/${this.pid}`).then(res => {
                        loadNum--
                        if (loadNum <= 0) {
                            this.$nextTick(() => this.$nuxt.$loading.finish())
                        }
                        this.pPoster = res.data.poster || ''
                        this.pName = res.data.name || ''
                        this.pDescription = res.data.programSummary || ''
                        localforage.setItem('program_' + this.pid, res.data)
                    })
                } else {
                    loadNum--
                    if (loadNum <= 0) {
                        this.$nextTick(() => this.$nuxt.$loading.finish())
                    }
                    this.pPoster = val.poster || ''
                    this.pName = val.name || ''
                    this.pDescription = val.programSummary || ''
                }
            })

            localforage.getItem('subprograms_' + this.pid).then(val => {
                if (!val) {
                    this.$axios.get(`/vup/v1/program/${this.pid}/sub-vods`).then(res => {
                        loadNum--
                        if (loadNum <= 0) {
                            this.$nextTick(() => this.$nuxt.$loading.finish())
                        }
                        const data = res.data.data
                        if (data && data.length > 0) {
                            this.subProgram = data
                        }
                        localforage.setItem('subprograms_' + this.pid, data)
                    })
                } else {
                    loadNum--
                    if (loadNum <= 0) {
                        this.$nextTick(() => this.$nuxt.$loading.finish())
                    }
                    if (val && val.length > 0) {
                        this.subProgram = val
                    }
                }
            })
        },
        toShare() {
            this.$store.commit('SET_SHARE_STATE', true)
        },
        confirmDown() {
            this.$confirm(
                this.$store.state.lang.officialwebsitemobile_downloadpromo,
                () => {
                    this.$nuxt.$loading.start()
                    callupFlow.call(this, `com.star.mobile.video.player.PlayerVodActivity?programDetailId=${this.pid}`)
                },
                () => {
                    // cancel
                },
                this.$store.state.lang.officialwebsitemobile_downloadpopup_install,
                this.$store.state.lang.officialwebsitemobile_downloadpopup_cancel
            )
        }
    },
    head() {
        return {
            title: this.pData.name,
            meta: [
                { name: 'description', property: 'description', content: this.pData.programSummary },
                { name: 'og:description', property: 'og:description', content: this.pData.programSummary + '#StarTimes ON Live TV & football' },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: this.cusShareImg || (this.pData.poster && this.pData.poster.replace('http:', 'https:'))
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: this.pData.name },
                {
                    name: 'al:android:url',
                    property: 'al:android:url',
                    content:
                        'starvideo://platformapi/webtoapp?channel=facebook&target=' +
                        Base64.encode(`com.star.mobile.video.player.PlayerVodActivity?programDetailId=${this.pid}`.replace(/&/g, '**'))
                },
                { name: 'al:android:app_name', property: 'al:android:app_name', content: 'StarTimes' },
                { name: 'al:android:package', property: 'al:android:package', content: 'com.star.mobile.video' },
                { name: 'al:web:url', property: 'al:web:url', content: 'http://m.startimestv.com' },
                {
                    name: 'al:ios:url',
                    property: 'al:ios:url',
                    content: 'startimes://?target=' + Base64.encode('startimes://player?prgId=' + this.pid)
                },
                { name: 'al:ios:app_store_id', property: 'al:ios:app_store_id', content: '1168518958' }
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
    .pic {
        position: relative;
    }
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
            margin-top: -1.5rem;
        }
    }
    .program-name {
        font-weight: bold;
        color: #333333;
        line-height: 1.5rem;
        padding: 0.5rem 0;
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
        padding: 0 0 0.5rem 0;
        line-height: 1.2rem;
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
