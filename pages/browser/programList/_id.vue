<template>
    <div class="wrapper">
        <program-category />
    </div>
</template>
<script>
import programCategory from '~/components/web/programCategory'
export default {
    data(){
        return {
            tagId:this.$route.params.id
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
