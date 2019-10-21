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
            const width = document.body.clientWidth
            document.querySelector('iframe').height = width * 0.57
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
.page-main {
    padding: 1.4rem 0;
}
iframe {
    width: 100%;
}
</style>
