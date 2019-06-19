<template>
    <img src="~assets/img/landpage/parter.jpeg">
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
    padding: 1.3rem 0 0;
}
</style>
