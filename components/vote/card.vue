<template>
    <div>
        <div class="card-layer" @click="closeCard" />
        <div class="slide-bar-card">
            <img src="~assets/img/vote/ic_close.png" class="close" @click="closeCard">
            <slot/>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        closeCard() {
            this.$emit('closeCard')
        }
    }
}
</script>
<style lang="less" scoped>
.card-layer {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.3);
}
.slide-bar-card {
    padding: 1rem;
    z-index: 1001;
    color: #666666;
    width: 75%;
    background: #ffffff;
    position: fixed;
    max-height: 22rem;
    top: 50%;
    left: 50%;
    margin-top: -11rem;
    margin-left: -37.5%;
    overflow-y: auto;
    h4 {
        font-size: 1rem;
        margin-bottom: 0.4rem;
        margin-top: 0;
        text-align: center;
    }
    p {
        font-size: 0.8rem;
        max-height: 10rem;
        overflow-y: auto;
        line-height: 1rem;
        margin-bottom: 0.4rem;
    }
    img {
        &.poster {
            width: 100%;
            display: block;
        }
        &.close {
            width: 1.5rem;
            position: absolute;
            right: 0.4rem;
            top: 0;
            margin-top: 0.4rem;
        }
    }
}
</style>
