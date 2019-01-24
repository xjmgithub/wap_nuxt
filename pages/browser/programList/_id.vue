<template>
    <div class="wrapper">
        <program-category ref="category"/>
        <div class="program-list">
            <div class="program" v-for="(item,index) in programList" :key="index">
                <div class="title" @click="toProgramDetail(item)">
                    <span>{{item.name}}{{item.subPrograms.length}}</span>
                    <span class="more" v-show="item.subPrograms.length>3">MORE</span>
                </div>
                <ul>
                    <li v-for="(subPro,i) in item.subPrograms" :key="i" v-show="i < 3" @click="toSubProgramDetail(subPro.id,item)">
                        <span>{{item.name}}</span>
                        <span class="arrows">&gt;&gt;</span>
                    </li>
                </ul>
            </div>
            <div class="loading-end" v-show="!endedState">
                loading…
            </div>
        </div>
    </div>
</template>
<script>
import programCategory from '~/components/web/programCategory'
import programItem from '~/components/web/programItem'
export default {
    data() {
        return {
            tagId: this.$route.params.id,
            programList: [],
            perIndex: 1,
            perSize: 10,
            endedState: false,
            loadstate:false
        }
    },
    components: {
        programCategory,
        programItem
    },
    mounted() {
        this.loadData()
        this.$nextTick(() => {
            let contain = document.querySelector('#__layout')
            let scroll = document.querySelector('#__layout>div')
            let _this = this
            contain.addEventListener('scroll', function() {
                if (scroll.offsetHeight - contain.offsetHeight - contain.scrollTop < 200) {
                    if(_this.loadstate) return false
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
            let choosedId = this.$refs.category.choosedId
            this.$axios.get(`/vup/v1/programs/tag/${choosedId}?pageNumber=${this.perIndex}&perSize=${this.perSize}`).then(res => {
                let data = res.data.data
                this.loadstate = false
                if (data && data.length > 0) {
                    this.programList = this.programList.concat(data)
                    this.perIndex += 1
                } else {
                    this.endedState = true
                }
            })
        },
        toSubProgramDetail(sId,pro){
            sessionStorage.setItem('program', JSON.stringify(pro))
            this.$router.push(`/browser/programlist/subProgram?proId=${pro.id}&subId=${sId}`)
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
#__layout {
    overflow: auto;
}
.wrapper {
    .program {
        width: 94%;
        margin: 0 auto;
        padding: 0.5rem 0;
        border-bottom: 1px solid #d8d8d8;
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
                float:left;
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
    .loading-end{
        height:2.8rem;
        line-height:3rem;
        text-align: center;
        font-size:0.8rem;
        color:#666666;
    }
}
</style>
