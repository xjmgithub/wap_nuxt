<template>
    <div class="wrapper">
        <div class="poster">
            <img :src="sPoster.replace('http:','https:')" alt class="cover">
            <img v-show="sPoster" src="~assets/img/web/ic_play.png" alt="">
            <span class="program-name">{{sName}}</span>
            <p>{{sDescription}}</p>
        </div>
        <div class="poster father">
            <nuxt-link to="/browser/programlist/program">
                <span class="program-name">{{pName}}</span>
                <div class="clearfix">
                    <p>{{pDescription}}</p>
                    <img :src="pPoster.replace('http:','https:')" alt>
                </div>
            </nuxt-link>
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
export default {
    filters: {
        formatShowTime(val) {
            if (val < 60) {
                return '00:' + val
            } else if (val >= 60 && val < 360) {
                const min = Math.floor(val / 60) < 10 ? '0' + Math.floor(val / 60) : Math.floor(val / 60)
                const sec = Math.floor(val % 60) < 10 ? '0' + Math.floor(val % 60) : Math.floor(val % 60)
                return min + ':' + sec
            } else if (val >= 360) {
                const hour = Math.floor(val / 360) < 10 ? '0' + Math.floor(val / 360) : Math.floor(val / 360)
                const min = Math.floor((val % 360) / 60) < 10 ? '0' + Math.floor((val % 360) / 60) : Math.floor((val % 360) / 60)
                const sec = Math.floor(val % 60) < 10 ? '0' + Math.floor(val % 60) : Math.floor(val % 60)
                return hour + ':' + min + ':' + sec
            }
        }
    },
    data() {
        return {
            pPoster: '',
            pId: this.$route.query.proId,
            pName: '',
            pDescription: '',
            sPoster: '',
            sId: this.$route.query.subId,
            sName: '',
            sDescription: '',
            subProgram: []
        }
    },
    mounted() {
        const program = sessionStorage.getItem('program')
        if (program) {
            const info = JSON.parse(program)
            this.pPoster = info.poster
            this.pId = info.id
            this.pName = info.name
            this.pDescription = info.programSummary
        }
        if (this.pId) {
            this.$nextTick(() => this.$nuxt.$loading.start())
            this.$axios.get(`/vup/v1/program/${this.pId}/sub-vods`).then(res => {
                const data = res.data.data
                this.$nextTick(() => this.$nuxt.$loading.finish())
                if (data && data.length > 0) {
                    this.subProgram = data
                    this.toSubProgramDetail(this.sId)
                }
            })
        }
    },
    methods: {
        getSubProgram() {
            this.$axios.get(`/vup/v1/program/${this.pId}/sub-vods`).then(res => {
                const data = res.data.data
                if (data && data.length > 0) {
                    this.subProgram = data
                    this.toSubProgramDetail(this.sId)
                }
            })
        },
        toSubProgramDetail(id) {
            this.subProgram.forEach(ele => {
                if (ele.id === id) {
                    this.sPoster = ele.poster.resources[0].url
                    this.sName = ele.name
                    this.sDescription = ele.summary
                }
            })
        }
    },
    head() {
        return {
            title: 'List'
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
    margin: 0.8rem;
    padding-bottom: 0.8rem;
    position: relative;
    .cover {
        width: 100%;
        height: 11rem;
        margin-bottom: 0.5rem;
         &+img{
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
