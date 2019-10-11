<template>
    <div class="error">
        <img src="~assets/img/web/error404.png" alt>
        <router-link to="/browser">Return to Home</router-link>
    </div>
</template>
<script>
export default {
    layout:'base',
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


