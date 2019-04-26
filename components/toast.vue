<template>
    <div class="wrap" :style="{display:style,'margin-left':offsetLeft,'margin-top':offsetTop}" v-html="tip"/>
</template>
<script>
export default {
    data() {
        return {
            tip: '',
            style: 'none',
            timer: null,
            offsetLeft: 0,
            offsetTop: 0
        }
    },
    methods: {
        show(text, duration = 2000) {
            clearInterval(this.timer)
            const _this = this
            this.style = 'block'
            this.tip = text
            this.$nextTick(() => {
                const dialog = _this.$el
                const dh = dialog.offsetHeight
                const dw = dialog.offsetWidth
                _this.offsetLeft = -dw / 2 + 'px'
                _this.offsetTop = -dh / 2 + 'px'
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
    width: 15rem;
    color: #fff;
}
</style>
