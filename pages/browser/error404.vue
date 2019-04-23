<template>
    <div class="error">
        <img src="~assets/img/web/error404.png" alt> 404 error
    </div>
</template>
<script>
export default {
    mounted() {
        this.$nextTick(() => this.$nuxt.$loading.finish())
    }
}
</script>
<style lang="less" scoped>
.error {
    width: 100%;
    text-align: center;
    color: #666666;
    img {
        display: block;
        width: 65%;
        margin: 4rem auto 2rem;
    }
}
</style>


