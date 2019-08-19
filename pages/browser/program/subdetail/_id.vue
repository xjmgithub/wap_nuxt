<template>
    <div>
        <div class="poster">
            <div v-if="sPoster" class="pic" @click="confirmDown">
                <img :src="sPoster&&cdnPicSrc(sPoster)" class="cover" />
                <img src="~assets/img/web/ic_play.png" />
            </div>
            <div class="clearfix">
                <span class="program-name title">{{sName}}</span>
                <div class="share" @click="toShare">
                    <img src="~assets/img/web/ic_share_def_g.png" />
                    {{$store.state.lang.officialwebsitemobile_action_share}}
                </div>
            </div>
            <p>{{sDescription}}</p>
        </div>
        <div class="poster father clearfix">
            <nuxt-link :to="`/browser/program/detail/${pid}`">
                <span class="program-name">{{pName}}</span>
                <p>
                    <img :src="pPoster&&cdnPicSrc(pPoster)" align="right" hspace="8" vspace="8" />
                    {{pDescription}}
                </p>
            </nuxt-link>
        </div>
        <div class="clips">
            <p>{{$store.state.lang.officialwebsitemobile_subprogramdetails_clips}}</p>
            <ul class="clearfix">
                <li v-for="(item,index) in subProgram" :key="index">
                    <nuxt-link :to="`/browser/program/subdetail/${item.id}`">
                        <div>
                            <img :src="item.poster.resources&&cdnPicSrc(item.poster.resources[0].url)" />
                            <span class="show-time">{{item.durationSecond | formatShowTime}}</span>
                        </div>
                        <span class="title">{{item.description||item.name}}</span>
                    </nuxt-link>
                </li>
            </ul>
        </div>
        <mShare :show="showShare" />
    </div>
</template>
<script>
import mShare from '~/components/web/share.vue'
import { formatTime, initDB, cacheDateUpdate } from '~/functions/utils'
import { callupFlow } from '~/functions/app'
import localforage from 'localforage'
import { Base64 } from 'js-base64'
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
            id: this.$route.params.id,
            sPoster: '',
            sName: '',
            sDescription: '',
            subProgram: [],
            pPoster: '',
            pName: '',
            pDescription: '',
            showShare: false
        }
    },
    async asyncData({ app: { $axios }, route, store }) {
        $axios.setHeader('token', store.state.gtoken)
        try {
            const { data } = await $axios.get(`/cms/program_detail/byvod/${route.params.id}`)
            const res2 = await $axios.get(`/adm/v1/sharing/custom-contents?target_type=2&target_id=${route.params.id}`)
            return {
                pid: data.id,
                seoData: data,
                cusShareTitle: (res2.data.data && res2.data.data.copywriting) || '',
                cusShareImg: (res2.data.data && res2.data.data.image_url) || ''
            }
        } catch (e) {
            return {
                pid: '',
                seoData: {},
                cusShareTitle: '',
                cusShareImg: ''
            }
        }
    },
    mounted() {
        if (this.pid) {
            initDB()
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
                            this.subProgram.forEach(ele => {
                                if (ele.id == this.id) {
                                    this.sPoster = ele.poster && ele.poster.resources[0].url
                                    this.sName = ele.description || ele.name
                                    this.sDescription = ele.summary
                                }
                            })
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
                        this.subProgram.forEach(ele => {
                            if (ele.id == this.id) {
                                this.sPoster = ele.poster && ele.poster.resources[0].url
                                this.sName = ele.description || ele.name
                                this.sDescription = ele.summary
                            }
                        })
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
                    callupFlow.call(this, `com.star.mobile.video.player.PlayerVodActivity?vodId=${this.id}`)
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
            title: this.seoData.name,
            meta: [
                { name: 'description', property: 'description', content: this.seoData.programSummary },
                { name: 'og:description', property: 'og:description', content: this.seoData.programSummary + '#StarTimes ON Live TV & football' },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: this.cusShareImg || (this.seoData.poster && this.seoData.poster.replace('http:', 'https:'))
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: this.seoData.name },
                {
                    name: 'al:android:url',
                    property: 'al:android:url',
                    content:
                        'starvideo://platformapi/webtoapp?channel=facebook&target=' +
                        Base64.encode(`com.star.mobile.video.player.PlayerVodActivity?vodId=${this.id}`.replace(/&/g, '**'))
                },
                { name: 'al:android:app_name', property: 'al:android:app_name', content: 'StarTimes' },
                { name: 'al:android:package', property: 'al:android:package', content: 'com.star.mobile.video' },
                { name: 'al:web:url', property: 'al:web:url', content: 'http://m.startimestv.com' },
                {
                    name: 'al:ios:url',
                    property: 'al:ios:url',
                    content: 'startimes://?target=' + Base64.encode('startimes://player?vodId=' + this.$route.params.id)
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
    margin: 0.8rem 0 0.5rem;
    .pic {
        position: relative;
    }
    .cover {
        width: 100%;
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
        padding: 0 0 0.5rem 0;
    }
    &.father {
        padding-bottom: 0.5rem;
        margin-top: 0;
        font-size: 0.85rem;
        line-height: 1.2rem;
        img {
            width: 40%;
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
