<template>
    <div>{{headerInfo | jsontoString}}</div>
</template>
<script>
export default {
    layout: 'base',
    filters: {
        jsontoString(val) {
            return JSON.stringify(val)
        }
    },
    data() {
        return {
            headerInfo: {}
        }
    },
    mounted() {
        if (window.getChannelId && window.getChannelId.jsGetHeadInfo) {
            this.headerInfo = window.getChannelId.jsGetHeadInfo()
            alert('调用了')
        }
    }
}
</script>
