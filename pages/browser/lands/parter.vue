<template>
    <img src="~assets/img/landpage/process.png">
</template>
<script>
export default {
    mounted() {
        this.$nextTick(() => {
            this.$nuxt.$loading.finish()
        })
    }
}
</script>
<style scoped>
img {
    display: block;
    width: 100%;
    padding: 2.3rem 1rem;
}
</style>
