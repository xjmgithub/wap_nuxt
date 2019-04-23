<template>
    <div>
        <div class="page">
            <div class="search">
                <form @submit.prevent="search">
                    <input v-model="keyword" type="text" :placeholder="$store.state.lang.officialwebsitemobile_tvguide_searchbox">
                    <img src="~assets/img/web/ic_search.png" @click="search">
                </form>
            </div>
            <p class="select">SELECT FOR YOU</p>
            <ul class="select-word">
                <li v-for="(item,index) in channelList" :key="index">
                    <img src="~assets/img/web/ic_search_b.png">
                    <span >{{item}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            channelList: [
                'ST NOVELA PLUS','ADOM TV','KYN HOME','Wildflower S2','KYN HOME'
            ],
            keyword: ''
        }
    },
    mounted() {
        this.$nextTick(() => this.$nuxt.$loading.finish())

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
        search() {},
        getChannels() {
            // this.$nextTick(() => this.$nuxt.$loading.start())
        }
    }
}
</script>
<style lang="less" scoped>
.page {
    width: 100%;
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
    .select{
        color:#B7B7B7;
        margin-top: 0.7rem;
    }
    .select-word{
        li{
            padding:1rem 0;
            img{
                width:1.25rem;
                margin-right:.5rem;
            }
            span{
                color:#0087EB;
            }
        }
    }
}
</style>


