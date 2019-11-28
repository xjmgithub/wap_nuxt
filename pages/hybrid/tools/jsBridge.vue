<template>
    <div>{{headerInfo}}</div>
</template>
<script>
export default {
    layout: 'base',
    filters: {
        strtoJson(val) {
            return JSON.parse(val)
        }
    },
    data() {
        return {
            headerInfo: {}
        }
    },
    asyncData({ req }) {
        return {
            headers: req.headers
        }
    },
    mounted() {
        if (window.getChannelId && window.getChannelId.jsGetHeadInfo) {
            this.headerInfo = window.getChannelId.jsGetHeadInfo()
        } else {
            this.headerInfo = this.headers
        }
    }
}
</script>
