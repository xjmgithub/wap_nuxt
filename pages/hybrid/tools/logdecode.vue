<template>
    <div style="width:1200px;margin:0 auto;padding:20px">
        <textarea v-model="text"/>
        <div class="button" @click="decode">Decode</div>
        <div v-show="logArr.length>0">
            <table>
                <tr>
                    <th>category</th>
                    <th>action</th>
                    <th>label</th>
                    <th>value</th>
                </tr>
                <tr v-for="(item,i) in logArr" :key="i">
                    <td>{{item.category}}</td>
                    <td>{{item.action}}</td>
                    <td>{{item.label}}</td>
                    <td>{{item.value}}</td>
                </tr>
            </table>
        </div>
        <textarea v-model="formatHTML" class="format" readonly="readonly"/>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            text: '',
            formatHTML: '',
            logArr: []
        }
    },
    methods: {
        decode() {
            const decodeText = window.decodeURIComponent(this.text)
            const start = decodeText.indexOf('=[') + 1
            const end = decodeText.indexOf(']&') + 1
            const jsonStr = decodeText.substring(start, end).replace(/\+{/g, '{')

            const parseArr = JSON.parse(jsonStr)

            parseArr.forEach(item => {
                this.logArr.push(item.msg)
            })

            this.formatHTML = JSON.stringify(JSON.parse(jsonStr), null, 4)
        }
    }
}
</script>
<style lang="less" scoped>
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
table {
    width: 100%;
    text-align: left;
    line-height: 3rem;
    border-left: 1px solid gray;
    border-top: 1px solid gray;
    font-size: 14px;
    margin: 1rem 0;
    tr {
        border-bottom: 1px solid gray;
        td,
        th {
            padding: 0 1rem;
            border-right: 1px solid gray;
        }
    }
}
</style>
