<template>
    <div class="wrapper">
        <program-category />
        <div>
            <program-item v-for="item in list" :item="item" :key="item.id" />
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
            list:[]
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
