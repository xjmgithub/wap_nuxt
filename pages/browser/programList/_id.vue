<template>
    <div class="wrapper">
        <program-category ref="category"/>
        <!-- <div>
            <program-item v-for="item in list" :item="item" :key="item.id"/>
        </div>-->
        <div class="program-list">
            <div class="program" v-for="(item,index) in programList" :key="index">
                <div class="title" @click="toProgramDetail(item)">
                    <span>{{item.name}}</span>
                    <span class="more" v-show="item.subPrograms.length>3">MORE</span>
                </div>
                <ul>
                    <li v-for="(subPro,i) in item.subPrograms" :key="i" v-show="i < 3">
                        <span>{{item.name}}</span>
                        <span class="arrows">&gt;&gt;</span>
                    </li>
                </ul>
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
            list: [],
            programList: [],
            perIndex: 1,
            perSize: 10
        }
    },
    components: {
        programCategory,
        programItem
    },
    mounted() {
        if (this.tagId == 62) {
            this.list = [
                {
                    id: 4274,
                    name: 'Nigeria News'
                }
            ]
        }
        let choosedId = this.$refs.category.choosedId
        this.$axios.get(`/vup/v1/programs/tag/${choosedId}?perIndex=${this.perIndex}&perSize=${this.perSize}`).then(res => {
            let data = res.data.data
            if (data && data.length > 0) {
                this.programList = data
            }
        })
    },
    methods: {
        toProgramDetail(item) {
            sessionStorage.setItem('program', JSON.stringify(item))
            this.$router.push('/browser/programlist/program')
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
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
}
</style>
