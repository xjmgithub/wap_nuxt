<template>
    <button :class="{disabled:disabled}" @click="click">{{text}}</button>
</template>
<script>
export default {
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: 'OK'
        }
    },
    methods: {
        click() {
            if (!this.disabled) {
                this.$emit('click')
            }
        }
    }
}
</script>
<style lang="less" scoped>
button {
    border: none;
    width: 100%;
    height: 2.25rem;
    display: block;
    margin: 0 auto;
    margin-top: 0.7rem;
    background: #0087eb;
    font-size: 1rem;
    color: white;
    border-radius: 3px;
    outline-style: none;
    &.disabled {
        background: #dddddd;
        color: #aaaaaa;
    }
}
</style>
