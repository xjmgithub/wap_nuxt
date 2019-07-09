<template>
    <div>
        <div class="post-layer" @click="closeCard" />
        <div class="slide-bar-card">
            <div :style="{width:100 * postList.length+'%'}">
                <div v-for="(item,index) in postList" :key="index" :style="{width:100 / postList.length+'%'}" class="box">
                    <img :src="item.src" @click="closeCard">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        postList: {
            repostListquired: false,
            type: Array,
            default: () => {
                return []
            }
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
.post-layer {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1000;
    background: #000000;
}
.slide-bar-card {
    z-index: 1001;
    position: fixed;
    top: 50%;
    margin-top: -12rem;
    .box {
        float: left;
        padding-right: 0.85rem;
        img {
            width: 100%;
        }
    }
}
</style>
