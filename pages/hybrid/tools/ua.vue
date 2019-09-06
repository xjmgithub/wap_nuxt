<template>
    <div>userAgent{{ua}}</div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            ua: ''
        }
    },
    mounted() {
        this.ua = window.navigator.userAgent
    }
}
</script>
