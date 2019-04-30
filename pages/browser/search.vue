<template>
    <div class="page">
        <div class="search">
            <form @submit.prevent="toSearch()">
                <input v-model="keyword" type="text" :placeholder="$store.state.lang.officialwebsitemobile_serarch_input" @input="changeWord">
                <img src="~assets/img/web/ic_search.png" @click="toSearch()">
            </form>
        </div>
        <div v-show="!oriKeyword">
            <p class="select">{{$store.state.lang.officialwebsitemobile_select_for_you}}</p>
            <ul class="select-word">
                <li v-for="(item,index) in hotKeyList" :key="index" @click="clickKeyword(item)">
                    <img src="~assets/img/web/ic_search_b.png">
                    <span>{{item}}</span>
                </li>
            </ul>
        </div>
        <div v-show="programList.length>0" class="clips">
            <p class="title">
                {{$store.state.lang.officialwebsitemobile_programs_for}}
                <span class="highlight">{{highlightValues.join(' ')}}</span>
            </p>
            <ul class="clearfix">
                <li v-for="(item,index) in programList" :key="index">
                    <nuxt-link v-show="item.fields.program_type=='PROGRAM'" :to="`/browser/program/detail/${item.fields.pro_id}`">
                        <div>
                            <img v-if="item.fields.pro_picture_url" :pre-src="item.fields.pro_picture_url">
                            <img v-else src="~assets/img/web/def.png">
                        </div>
                        <p class="title" v-html="highlight(getName(item))"/>
                    </nuxt-link>
                    <nuxt-link v-show="item.fields.program_type=='SUBPROGRAM'" :to="`/browser/program/subdetail/${item.fields.subpro_id}`">
                        <div>
                            <img v-if="item.fields.subpro_picture_url" :pre-src="item.fields.subpro_picture_url">
                            <img v-else src="~assets/img/web/def.png">
                            <span class="show-time">{{item | formatShowTime}}</span>
                        </div>
                        <p class="title" v-html="highlight(getName(item))"/>
                    </nuxt-link>
                </li>
            </ul>
            <div v-show="!endedState" class="loading-end">loading…</div>
        </div>
        <div v-show="oriKeyword&&programList.length==0&&noResult" class="noResult">
            <img src="~assets/img/web/noresult.png" alt>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
export default {
    filters: {
        formatShowTime(item) {
            const tmpHour = item.fields.subpro_duration_hour
            const tmpMin = item.fields.subpro_duration_minute
            const tmpSec = item.fields.subpro_duration_second
            const hour = tmpHour > 0 ? tmpHour : '0' + tmpHour
            const min = tmpMin > 0 ? tmpMin : '0' + tmpMin
            const sec = tmpSec > 0 ? tmpSec : '0' + tmpSec
            return hour + ':' + min + ':' + sec
        }
    },
    data() {
        return {
            hotKeyList: [],
            keyword: '',
            page_number: 1,
            page_size: 10,
            highlightValues: [],
            programList: [],
            endedState: false,
            loadstate: false,
            noResult: false
        }
    },
    computed: {
        oriKeyword() {
            return this.$route.query.keyword
        }
    },
    watch: {
        oriKeyword(nv, ov) {
            this.page_number = 1
            this.programList = []
            this.search(this.oriKeyword)
        }
    },
    mounted() {
        if (this.oriKeyword) {
            this.keyword = this.oriKeyword
            this.search()
        } else {
            this.getHotKeyList()
        }

        this.$nextTick(() => {
            document.addEventListener('scroll', this.listener)
        })
        document.addEventListener(
            'touchmove',
            () => {
                if (document.activeElement) document.activeElement.blur()
            },
            { passive: false }
        )
    },
    beforeRouteLeave(to, from, next) {
        document.removeEventListener('scroll', this.listener)
        next()
    },
    methods: {
        clickKeyword(item) {
            this.keyword = item
            this.toSearch()
        },
        toSearch() {
            // TODO KEYWORD FORMAT
            const keyword = this.keyword
            this.$router.replace(`/browser/search?keyword=${keyword}`)
        },
        changeWord() {
            if (this.keyword.length >= 100) {
                this.$toast(this.$store.state.lang.officialwebsitemobile_search_too_many)
                this.keyword = this.keyword.substr(0, 100)
            }
        },
        listener() {
            const bot = document.querySelector('.clips').getBoundingClientRect().bottom
            const screenHeight = window.screen.availHeight
            if (bot - screenHeight < 100) {
                if (this.loadstate || this.endedState || !this.programList.length) return false
                this.loadstate = true
                this.search()
            }
        },
        getName(obj) {
            const item = JSON.parse(JSON.stringify(obj))
            if (item.fields.program_type == 'PROGRAM') {
                return item.fields.pro_name.en
            } else if (item.fields.program_type == 'SUBPROGRAM') {
                return item.fields.subpro_name.en
            }
        },
        highlight(name) {
            if (name) {
                this.highlightValues.forEach(ele => {
                    const index = name.toLowerCase().indexOf(ele.toLowerCase())
                    let tmp
                    if (index >= 0) {
                        tmp = name.substr(index, ele.length)
                    }
                    const replaceString = '<span class="light" style="color:#0087eb">' + tmp + '</span>'
                    name = name.replace(tmp, replaceString)
                })
            }
            return name
        },
        getHotKeyList() {
            this.$nextTick(() => this.$nuxt.$loading.start())
            this.$axios
                .get(`/cms/search/hotkeys`, {
                    headers: {
                        appVersion: 51300
                    }
                })
                .then(res => {
                    this.$nextTick(() => this.$nuxt.$loading.finish())
                    this.hotKeyList = res.data
                })
        },
        search() {
            if (this.oriKeyword.replace(/\s/g, '').length === 0) {
                return
            }
            const time = dayjs.utc().format()
            this.$nextTick(() => this.$nuxt.$loading.start())
            this.$axios
                .get(
                    `/search-service/v1/search-by-source-type?search_value=${this.oriKeyword}&page_number=${this.page_number}&page_size=${
                        this.page_size
                    }&local_zero_utc=${time}&source_type=PROGRAM&request_source=WEB`
                )
                .then(res => {
                    
                    this.loadstate = false
                    const data = res.data.sources
                    if (data && data.length > 0) {
                        this.programList = this.programList.concat(data)
                        this.highlightValues = res.data.customHighlightValues
                        this.page_number += 1
                    } else {
                        this.noResult = true
                    }
                    if (!data || data.length < 10) {
                        this.endedState = true
                    }
                    this.$nextTick(() => {
                        this.$nuxt.$loading.finish()
                        this.lasyLoadImg()
                    })
                    
                })
        }
    }
}
</script>
<style lang="less" scoped>
.page {
    width: 100%;
    position: relative;
    .search {
        position: relative;
        margin: 0.5rem 0;
        input {
            width: 100%;
            padding-left: 1rem;
            padding-right: 2.5rem;
            border-radius: 4px;
            border: 1px solid #979797;
            height: 2.5rem;
            line-height: 1.25rem;
            outline-style: none;
            z-index: -1;
            &::-webkit-input-placeholder {
                color: #bdbdbd;
                font-size: 0.95rem;
            }
            & + img {
                position: absolute;
                right: 0.8rem;
                top: 50%;
                width: 1.5rem;
                height: 1.5rem;
                margin-top: -0.75rem;
            }
        }
    }
    .noResult {
        text-align: center;
        color: #333333;
        img {
            display: block;
            width: 65%;
            margin: 3rem auto 2rem;
        }
    }
    .select {
        color: #b7b7b7;
        margin-top: 0.7rem;
    }
    .select-word {
        li {
            padding: 1rem 0;
            img {
                width: 1.25rem;
                margin-right: 0.5rem;
            }
            span {
                color: #0087eb;
            }
        }
    }
    .clips {
        & > .title {
            color: #333333;
            font-weight: bold;
            margin: 1rem 0;
            .highlight {
                color: #0087eb;
            }
        }
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
            .title {
                font-size: 0.85rem;
                color: #666666;
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
    .loading-end {
        height: 2.8rem;
        line-height: 3rem;
        text-align: center;
        font-size: 0.8rem;
        color: #666666;
    }
}
</style>


