<template>
    <div>
        <a :href="link">点击</a>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            link: this.$route.query.link
        }
    }
}
</script>
