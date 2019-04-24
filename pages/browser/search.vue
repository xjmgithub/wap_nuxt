<template>
    <div>
        <div class="page">
            <div class="search">
                <form @submit.prevent="search(keyword)">
                    <input v-model="keyword" type="text" :placeholder="$store.state.lang.officialwebsitemobile_tvguide_searchbox">
                    <img src="~assets/img/web/ic_search.png" @click="search(keyword)">
                </form>
            </div>
            <p class="select">SELECT FOR YOU</p>
            <ul class="select-word">
                <li v-for="(item,index) in hotKeyList" :key="index" @click="search(item)">
                    <img src="~assets/img/web/ic_search_b.png">
                    <span>{{item}}</span>
                </li>
            </ul>
        </div>
        <mShare :show="showShare"/>
    </div>
</template>
<script>
import mShare from '~/components/web/share.vue'
export default {
    components: {
        mShare
    },
    data() {
        return {
            hotKeyList: [],
            keyword: '',
            page_number: 1,
            page_size: 10,
            showShare: true
        }
    },
    mounted() {
        this.getHotKeyList()
        document.addEventListener('scroll', () => {
            const scollTop = document.body.scrollTop || document.documentElement.scrollTop
            this.$store.commit('SCROLL_PAGE', scollTop)
        })
        document.addEventListener(
            'touchmove',
            () => {
                if (document.activeElement) document.activeElement.blur()
            },
            { passive: false }
        )
    },
    methods: {
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
        search(hotkey) {
            this.$store.commit('SET_SHARE_STATE', true)
            // this.$nextTick(() => this.$nuxt.$loading.start())
            // this.$axios
            //     .get(
            //         `/v1/search-by-source-type?search_value=${hotkey}&page_number=${this.page_number}&page_size=${
            //             this.page_size
            //         }&source_type=PROGRAM&request_source=WEB`,
            //         {
            //             headers: {
            //                 UserCountryCode: 2
            //             }
            //         }
            //     )
            //     .then(res => {
            //         this.$nextTick(() => this.$nuxt.$loading.finish())
            //         console.log(res)
            //     })
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
}
</style>


