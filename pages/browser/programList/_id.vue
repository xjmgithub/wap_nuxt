<template>
    <div class="wrapper">
        <program-category />
        <div>
            <program-item v-for="item in list" :item="item" :key="item.id" />
        </div>
        <div class="program">
            <p class="title">King Kong <span class="more" v-show="programList.length>3">MORE</span></p>
            <ul>
                <li v-for="(item,index) in programList" :key="index" >
                    {{item.title}}
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
            programList:[
                {
                    id:1,
                    title:'King Kong Mc Dancing to One Rand S2'
                },
                {
                    id:2,
                    title:'King Kong walking on street S2'
                },
                {
                    id:3,
                    title:'King kong won the champion finally'
                }
            ]
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
    }
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
                padding:.5rem 0 ;
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
