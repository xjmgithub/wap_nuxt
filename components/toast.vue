<template>
    <div v-show="tip" class="toast" :style="{'margin-top':offsetTop}">
        <span>{{tip}}</span>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tip: '',
            timer: null,
            offsetTop: 0
        }
    },
    methods: {
        show(text, duration = 2000) {
            clearInterval(this.timer)
            const _this = this
            this.tip = text
            this.$nextTick(() => {
                const dialog = _this.$el
                const dh = dialog.offsetHeight
                _this.offsetTop = -dh / 2 + 'px'
                this.timer = setTimeout(() => {
                    _this.tip = ''
                }, duration)
            })
        }
    }
}
</script>
<style lang="less" scoped>
.toast {
    position: fixed;
    left: 0;
    top: 50%;
    width: 100%;
    color: #fff;
    z-index: 9999;
    text-align: center;
    span {
        display: inline-block;
        padding: 0.6rem 1.5rem;
        background: rgba(0, 0, 0, 0.65);
        border-radius: 3px;
        max-width: 65%;

    }
}
</style>
