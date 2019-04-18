<template>
    <div class="wrap" :style="{display:style}" v-html="tip" />
</template>
<script>
export default {
    data() {
        return {
            tip: '',
            style: 'none',
            timer:null
        }
    },
    methods: {
        show(text, duration = 2000) {
            clearInterval(this,timer)
            const _this = this
            this.style = 'block'
            this.tip = text
            this.$nextTick(() => {
                this.timer = setTimeout(() => {
                    _this.style = 'none'
                }, duration)
            })
        }
    }
}
</script>
<style scoped>
.wrap {
    position: fixed;
    left: 50%;
    top: 50%;
    background: rgba(0, 0, 0, 0.65);
    padding: 10px;
    border-radius: 5px;
    transform: translate(-50%, -50%);
    color: #fff;
}
</style>
