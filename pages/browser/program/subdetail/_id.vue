<template>
    <div class="wrapper">
        <div class="poster" @click="confirmDown">
            <img :src="sPoster.replace('http:','https:')" alt class="cover">
            <img v-show="sPoster" src="~assets/img/web/ic_play.png">
            <span class="program-name">{{sName}}</span>
            <p>{{sDescription}}</p>
        </div>
        <div class="poster father">
            <nuxt-link :to="`/browser/program/detail/${pid}`">
                <span class="program-name">{{pName}}</span>
                <div class="clearfix">
                    <p>{{pDescription}}</p>
                    <img :src="pPoster.replace('http:','https:')">
                </div>
            </nuxt-link>
        </div>
        <div class="clips">
            <p>{{$store.state.lang.officialwebsitemobile_subprogramdetails_clips}}</p>
            <ul class="clearfix">
                <li v-for="(item,index) in subProgram" :key="index">
                    <nuxt-link :to="`/browser/program/subdetail/${pid}?subId=${item.id}`">
                        <div>
                            <img :src="item.poster.resources[0].url.replace('http:','https:')">
                            <span class="show-time">{{item.durationSecond | formatShowTime}}</span>
                        </div>
                        <span class="title">{{item.name}}</span>
                    </nuxt-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import {formatTime, downApp} from '~/functions/utils'
export default {
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
            subProgram: []
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
                            this.sName = ele.name
                            this.sDescription = ele.summary
                        }
                    })
                }
            })
        }
    },
    methods:{
        confirmDown(){
            this.$confirm(
                this.LANG.officialwebsitemobile_downloadpromo,
                () => {
                    downApp.call(this)
                },
                () => {},
                'Go',
                'Not now'
            )
        }
    },
    head() {
        return {
            title: this.sName
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    width: 100%;
    padding: 3rem 0 0;
    background: white;
    overflow-y: auto;
}
img {
    border-radius: 2px;
}
.poster {
    border-bottom: 1px solid #d8d8d8;
    margin: 0.8rem;
    padding-bottom: 0.8rem;
    position: relative;
    .cover {
        width: 100%;
        height: 11rem;
        margin-bottom: 0.5rem;
        & + img {
            position: absolute;
            width: 3rem;
            top: 4rem;
            height: 3rem;
            left: 50%;
            margin-left: -1.5rem;
        }
    }
    .program-name {
        font-weight: bold;
        color: #333333;
        margin: 0.5rem 0;
        line-height: 2rem;
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
            height: 5rem;
        }
    }
}
.clips {
    margin: 0.8rem;
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
                &:before{
                    content: '';
                    display: inline-block;
                    padding-bottom: 50%;
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
                    height:100%;
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
