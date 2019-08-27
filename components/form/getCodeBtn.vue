<template>
    <div :class="{gray:gray}" class="btn" @click="click">
        {{codeDuring>0?`${codeDuring}s`:`${get_code}`}}</div>
</template>
<script>
export default {
    props: {
        disabled: {
            required: false,
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            codeDuring: 0,
            timer: null,
            waiting: false, // 等待回调,防止多次点击
            get_code: this.$store.state.lang.wallet_hint_get_code,
        }
    },
    computed: {
        gray() {
            return this.disabled || this.codeDuring > 0
        }
    },
    mounted() {
        this.timer = setInterval(() => {
            this.codeDuring--
        }, 1000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
        startTimer(second) {
            if (this.codeDuring < 0) {
                this.codeDuring = second || 60
            }
        },
        click() {
            if (!this.gray && !this.waiting) {
                this.waiting = true
                this.$emit('click', second => {
                    if (!second || (typeof second == 'number')) {
                        this.startTimer(second)
                    }
                    this.waiting = false
                })
            }
        }
    }
}
</script>
<style lang="less">
.btn {
    max-width: 10rem;
    background: #0087eb;
    color: white;
    font-size: 0.9rem;
    font-weight: bold;
    text-align: center;
    height: 2.4rem;
    line-height: 2.4rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    &.gray {
        background: #dddddd;
        color: #aaaaaa;
    }
}
</style>
