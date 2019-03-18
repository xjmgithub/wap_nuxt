<template>
    <div class="wrapper">
        <program-category ref="category"/>
        <div class="program-list">
            <div v-for="(item,index) in programList" :key="index" class="program">
                <nuxt-link :to="`/browser/program/detail/${item.id}`">
                    <div class="title">
                        <span>{{item.name}}</span>
                        <span v-show="item.subPrograms.length>3" class="more">MORE</span>
                    </div>
                </nuxt-link>
                <ul>
                    <li v-for="(subPro,i) in item.subPrograms" :key="i" v-show="i < 3">
                        <nuxt-link :to="`/browser/program/subdetail/${item.id}?subId=${subPro.id}`">
                            <span>{{subPro.name}}</span>
                            <span class="arrows">&gt;&gt;</span>
                        </nuxt-link>
                    </li>
                </ul>
            </div>
            <div v-show="!endedState" class="loading-end">loading…</div>
        </div>
    </div>
</template>
<script>
import programCategory from '~/components/web/programCategory'
export default {
    components: {
        programCategory
    },
    data() {
        return {
            tagId: this.$route.params.id,
            programList: [],
            perIndex: 1,
            perSize: 10,
            endedState: false,
            loadstate: false
        }
    },
    mounted() {
        this.loadData()
        this.$nextTick(() => {
            this.$nuxt.$loading.finish()
            const contain = document.querySelector('.wrapper')
            const navContain = document.querySelector('.wrapper .navContain')
            const list = document.querySelector('.wrapper .program-list')
            const _this = this
            contain.addEventListener('scroll', function() {
                if (navContain.offsetHeight + list.offsetHeight - contain.offsetHeight - contain.scrollTop < 200) {
                    if (_this.loadstate || _this.endedState) return false
                    _this.loadstate = true
                    _this.loadData()
                }
            })
        })
    },
    methods: {
        toProgramDetail(item) {
            sessionStorage.setItem('program', JSON.stringify(item))
            this.$router.push('/browser/programlist/program')
        },
        loadData() {
            const choosedId = this.$refs.category.choosedId
            this.$axios.get(`/vup/v1/programs/tag/${choosedId}?pageNumber=${this.perIndex}&perSize=${this.perSize}`).then(res => {
                const data = res.data.data
                this.loadstate = false
                if (data && data.length > 0) {
                    this.programList = this.programList.concat(data)
                    this.perIndex += 1
                }

                if (!data || data.length < 10) {
                    this.endedState = true
                }
            })
        },
        toSubProgramDetail(sId, pro) {
            sessionStorage.setItem('program', JSON.stringify(pro))
            this.$router.push(`/browser/programlist/subProgram?proId=${pro.id}&subId=${sId}`)
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.wrapper {
    padding-left: 0;
    padding-right: 0;
}
.program-list {
    padding: 0 0.8rem;
}
.program {
    margin: 0 auto;
    padding: 0.5rem 0;
    border-bottom: 1px solid #d8d8d8;
    overflow: visible;
    .title {
        font-weight: bold;
        color: #111111;
        position: relative;
        line-height: 2.3rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span:first-child {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 90%;
            display: block;
            float: left;
        }
        .more {
            position: absolute;
            right: 0;
            color: #0087eb;
            font-size: 0.8rem;
        }
    }
    ul {
        li {
            list-style: none;
            line-height: 2.3rem;
            position: relative;
            color: #0087eb;
            font-weight: bold;
            font-size: 0.9rem;

            span:first-child {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 94%;
                display: block;
            }
            .arrows {
                position: absolute;
                right: 0;
                bottom: 0;
            }
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
</style>
