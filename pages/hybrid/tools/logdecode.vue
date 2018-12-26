<template>
    <div style="width:1200px;margin:0 auto;padding:20px">
        <textarea v-model="text"/>
        <div class="button" @click="decode">Decode</div>
        <textarea class="format" v-model="formatHTML" readonly="readonly"/>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            text: '',
            formatHTML: ''
        }
    },
    methods: {
        decode() {
            let decodeText = window.decodeURIComponent(this.text)
            let start = decodeText.indexOf('=[') + 1
            let end = decodeText.indexOf(']&') + 1
            let jsonStr = decodeText.substring(start, end).replace(/\+{/g, '{')
            this.formatHTML = JSON.stringify(JSON.parse(jsonStr), null, 4)
        }
    }
}
</script>
<style scoped>
textarea {
    width: 100%;
    height: 200px;
    display: block;
    font-size: 14px;
}

.format {
    height: 650px;
}

.button {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #0b8dff;
    text-align: center;
    color: white;
}
::-webkit-scrollbar {
    width: 7px;
}
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 10px;
}
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(100, 100, 100, 0.4);
}
</style>
