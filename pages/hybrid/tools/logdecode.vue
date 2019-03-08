<template>
    <div style="width:1200px;margin:0 auto;padding:20px">
        <textarea v-model="text" />
        <div @click="decode" class="button">
            Decode
        </div>
        <textarea v-model="formatHTML" class="format" readonly="readonly" />
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
            const decodeText = window.decodeURIComponent(this.text)
            const start = decodeText.indexOf('=[') + 1
            const end = decodeText.indexOf(']&') + 1
            const jsonStr = decodeText.substring(start, end).replace(/\+{/g, '{')
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
