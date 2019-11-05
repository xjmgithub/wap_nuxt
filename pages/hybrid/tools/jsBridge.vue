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
        const jsGetHeadInfo = window.getChannelId && window.getChannelId.jsGetHeadInfo
        if (jsGetHeadInfo) {
            this.headerInfo = jsGetHeadInfo()
            console.log(this.headerInfo)
        }
    }
}
</script>
