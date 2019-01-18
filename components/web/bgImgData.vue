<template>
    <div class="package">
        <img v-if="imgPath" :src="imgPath">
        <div v-else class="nopic">
            {{packageName}}
        </div>
    </div>
</template>
<script>
export default {
    props:{
        imgPath:{
            required:true,
            type:String,
            default:''
        },
        packageName:{
            required:true,
            type:String,
            default:''
        }
    },

}
</script>
<style lang="less" scoped>
.package{
    width:100%;
    img{
        display:block;
        width:100%;
    }
    .nopic{
        background:#e6e6e6;
        border-radius: 3px;
        text-align: center;
        font-size:0.9rem;
        &::before{
            content: '';
            display: inline-block;
            padding-bottom: 56%;
            width: 0.1px;
            vertical-align: middle;
        }
    }
}
</style>
