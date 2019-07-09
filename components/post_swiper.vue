<template>
    <div>
        <div class="post-layer" @click="closePost()" />
        <Swiper v-if="postList.length > 0" class="slide-bar-card">
            <Slide v-for="(item,index) in postList" :key="index" @click="closePost()">
                <img :src="item.src" @click="closePost()">
            </Slide>
        </Swiper>
    </div>

</template>
<script>
import { Swiper, Slide } from '~/components/swiper'
export default {
    layout: 'base',
    components: {
        Swiper,
        Slide
    },
    props: {
        postList: {
            type: Array,
            requred: true,
            default: () => []
        }
    },
    methods: {
        closePost() {
            this.$emit('closePost')
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
}
</style>
