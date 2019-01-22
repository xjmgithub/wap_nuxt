<template>
    <div class="wrapper">
        <program-category ref="category" />
        <div>
            <program-item v-for="item in list" :item="item" :key="item.id" />
        </div>
        <div class="program" v-for="(item,index) in programList" :key="index">
            <p class="title" @click="toProgramDetail(item)">{{item.name}}<span class="more" v-show="item.subPrograms.length>3">MORE</span></p>
            <ul>
                <li v-for="(subPro,i) in item.subPrograms" :key="i" v-show="i < 3" >
                    {{item.name}}
                    <span class="arrows">&gt;&gt;</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import programCategory from '~/components/web/programCategory'
import programItem from '~/components/web/programItem'
export default {
    data(){
        return {
            tagId:this.$route.params.id,
            list:[],
            programList:[],
            perIndex:1,
            perSize:10
        }
    },
    components:{
        programCategory,
        programItem
    },
    mounted(){
        if(this.tagId==62){
            this.list = [
                {
                    id:4274,
                    name:'Nigeria News'
                }
            ]
        }
        let choosedId = this.$refs.category.choosedId
        this.$axios.get(`/vup/v1/programs/tag/${choosedId}?perIndex=${this.perIndex}&perSize=${this.perSize}`).then(res => {
            let data = res.data.data
            if(data && data.length > 0){
                this.programList = data
            }
        })
    },
    methods: {
        toProgramDetail(item){
            sessionStorage.setItem('program',JSON.stringify(item))
            this.$router.push('/browser/programlist/program')
        }
    },
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.wrapper{
    .program{
        width: 94%;
        margin: 0 auto;
        .title{
            font-weight: bold;
            padding-top:.5rem;
            color:#111111;
            position: relative;
            .more{
                position: absolute;
                right:0;
                color:#0087EB;
                font-size: .8rem;
            }
        }
        ul{
            border-bottom:1px solid #D8D8D8;
            li{
                list-style: none;
                padding:.3rem 0 ;
                position: relative;
                color:#0087EB;
                font-weight: bold;
                font-size: .9rem;
                .arrows{
                    position: absolute;
                    right:0;
                }
            }
        }
    }
}
</style>
