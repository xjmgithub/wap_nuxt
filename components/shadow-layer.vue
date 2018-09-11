<template>
    <div class="shadow-layer" @click="click"></div>
</template>
<script>
export default {
    methods:{
        click(){
            this.$emit('click')
        }
    }
}
</script>
<style>
.shadow-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
}
</style>