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
    mounted() {
        if (window.getChannelId && window.getChannelId.jsGetHeadInfo) {
            this.headerInfo = window.getChannelId.jsGetHeadInfo()
            
        }
    }
}
</script>
