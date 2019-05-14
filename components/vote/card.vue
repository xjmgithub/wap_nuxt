<template>
    <div>
        <div class="card-layer" @click="closeCard"/>
        <div class="slide-bar-card">
            <img src="~assets/img/vote/ic_close.png" class="close" @click="closeCard">
            <h4 v-if="title">{{title}}</h4>
            <div class="content" @scroll.prevent>
                <slot name="content"/>
            </div>
            <div class="buttons">
                <slot name="buttons"/>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            required: false,
            type: String,
            default: ''
        }
    },
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
    top: 50%;
    left: 50%;
    margin-top: -12rem;
    margin-left: -37.5%;
    h4 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        margin-top: 0;
        text-align: center;
    }
    .content {
        margin-bottom: 0.4rem;
        max-height: 18rem;
        min-height: 12rem;
        overflow: auto;
        p {
            font-size: 0.9rem;
            line-height: 1.2rem;
            margin: 0.5rem 0;
        }
        img {
            width: 100%;
            display: block;
            margin: 0.3rem 0;
        }
    }

    .buttons {
        padding: 0.2rem 0 0.5rem;
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
