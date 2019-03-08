<template>
    <div @click="click" class="shadow-layer" />
</template>
<script>
export default {
    methods: {
        click() {
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
    background: rgba(183, 183, 183, 0.48);
    z-index: 100;
}
</style>
