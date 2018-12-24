<template>
    <nav id="nav">
        <a v-for="(item,index) in tab" :key="index" :class="{on:tabIndex == index}" @click="doChange(index)">{{item}}</a>
    </nav>
</template>
<script>
export default {
    layout: 'base',
    props: {
        tab: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data(){
        return{
            tabIndex:0
        }
    },
    methods: {
        doChange(data) {
            this.tabIndex = data
            this.$emit('onChange',data)
        }
    }
}
</script>
<style lang="less">
</style>

