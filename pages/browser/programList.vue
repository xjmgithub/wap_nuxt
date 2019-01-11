<template>
    <div>
        <program-category />
    </div>
</template>
<script>
import programCategory from '~/components/web/programCategory'
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
