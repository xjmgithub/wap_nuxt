<template>
    <div>
        <iframe
            src="https://www.youtube.com/embed/lJQIoiW2KBs"
            frameborder="0"
            allow="accelerometer;fullscreen; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        ></iframe>
    </div>
</template>
<script>
export default {
    layout: 'default',
    mounted() {
        this.$nextTick(() => {
            this.$nuxt.$loading.finish()
        })
    },
    head() {
        return {
            title: 'StarTimes player'
        }
    }
}
</script>
<style>
iframe {
    width: 100%;
    height: 15rem;
    margin-top: 4rem;
}
</style>
