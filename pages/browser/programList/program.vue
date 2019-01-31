<template>
    <div class="wrapper">
        <download class="clearfix"/>
        <div class="poster">
            <img :src="pPoster.replace('http:','https:')" alt>
            <span class="program-name">{{pName}}</span>
            <p>{{pDescription}}</p>
        </div>
        <div class="clips">
            <p>{{$store.state.lang.officialwebsitemobile_subprogramdetails_clips}}</p>
            <ul class="clearfix">
                <li v-for="(item,index) in subProgram" :key="index" @click="toSubProgramDetail(item.id)">
                    <div>
                        <img :src="item.poster.resources[0].url.replace('http:','https:')">
                        <span class="show-time">{{item.durationSecond | formatShowTime}}</span>
                    </div>
                    <span class="title">{{item.name}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import download from '~/components/web/download'
export default {
    layout: 'default',
    data() {
        return {
            pPoster: '',
            pId: '',
            pName: '',
            pDescription: '',
            subProgram: []
        }
    },
    mounted() {
        let msg = sessionStorage.getItem('program')
        if (msg) {
            let info = JSON.parse(msg)
            this.pPoster = info.poster
            this.pId = info.id
            this.pName = info.name
            this.pDescription = info.programSummary
            this.$nextTick(() => this.$nuxt.$loading.start())
            this.$axios.get(`/vup/v1/program/${this.pId}/sub-vods`).then(res => {
                let data = res.data.data
                this.$nextTick(() => this.$nuxt.$loading.finish())
                if (data && data.length > 0) {
                    this.subProgram = data
                }
            })
        }
    },
    methods: {
        toSubProgramDetail(id) {
            this.$router.push(`/browser/programlist/subProgram?subId=${id}`)
        }
    },
    filters: {
        formatShowTime(val) {
            if (val < 60) {
                let tmp = val < 10 ? '0' + val : val
                return '00:' + val
            } else if (val >= 60 && val < 360) {
                let min = Math.floor(val / 60) < 10 ? '0' + Math.floor(val / 60) : Math.floor(val / 60)
                let sec = Math.floor(val % 60) < 10 ? '0' + Math.floor(val % 60) : Math.floor(val % 60)
                return min + ':' + sec
            } else if (val >= 360) {
                let hour = Math.floor(val / 360) < 10 ? '0' + Math.floor(val / 360) : Math.floor(val / 360)
                let min = Math.floor((val % 360) / 60) < 10 ? '0' + Math.floor((val % 360) / 60) : Math.floor((val % 360) / 60)
                let sec = Math.floor(val % 60) < 10 ? '0' + Math.floor(val % 60) : Math.floor(val % 60)
                return hour + ':' + min + ':' + sec
            }
        }
    },
    components: {
        download
    },
    head() {
        return {
            title: 'List'
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.wrapper {
    img {
        border-radius: 2px;
    }
    .poster {
        width: 94%;
        margin: 0.5rem auto;
        border-bottom: 1px solid #d8d8d8;
        padding-bottom: 0.5rem;
        img {
            width: 100%;
            height: 11rem;
            margin-bottom: 0.5rem;
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
            word-break: break-all;
        }
    }
    .clips {
        width: 94%;
        margin: 0.5rem auto;
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
                        display: block;
                    }
                }
                span {
                    font-size: 0.85rem;
                    color: #666666;
                    &.title {
                        display: -webkit-box;
                        overflow: hidden;
                        height: 2.6rem;
                        -webkit-line-clamp: 2;
                        /* autoprefixer: off */
                        -webkit-box-orient: vertical;
                    }
                }
            }
        }
    }
}
</style>
