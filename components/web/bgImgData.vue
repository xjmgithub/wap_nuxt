<template>
    <img :src="imgPath">
</template>
<script>
export default {
    props:{
        imgPath:{
            required:true,
            type:String,
            default:''
        }
    }
}
</script>
