<template>
    <div v-show="tip" class="toast" :style="{'margin-left':offsetLeft,'margin-top':offsetTop}">{{tip}}</div>
</template>
<script>
export default {
    data() {
        return {
            tip: '',
            timer: null,
            offsetLeft: 0,
            offsetTop: 0
        }
    },
    updated(){
        const dialog = this.$el
        const dh = dialog.offsetHeight
        const dw = dialog.offsetWidth
        this.offsetLeft = -dw / 2 + 'px'
        this.offsetTop = -dh / 2 + 'px'
    },
    methods: {
        show(text, duration = 2000) {
            clearInterval(this.timer)
            const _this = this
            this.tip = text
            this.$nextTick(() => {
                this.timer = setTimeout(() => {
                    _this.tip = ''
                }, duration)
            })
        }
    }
}
</script>
<style scoped>
.toast {
    position: fixed;
    left: 50%;
    top: 50%;
    background: rgba(0, 0, 0, 0.65);
    padding: 0.6rem 1.5rem;
    border-radius: 3px;
    max-width: 15rem;
    color: #fff;
}
</style>
