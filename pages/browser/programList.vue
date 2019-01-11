<template>
    <div>
        <program-category />
    </div>
</template>
<script>
import programCategory from '~components/programCategory'
export default {
    data(){
        return {
            tagId:this.$route.query.tagId
        }
    },
    components:{
        programCategory
    },
    mounted(){
        // TODO ajax 获取
    }
}
</script>
