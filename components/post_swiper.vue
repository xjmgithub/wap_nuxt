<template>
    <div>
        <div class="post-layer" @click="closePost()">
            <Swiper v-if="postList.length > 0" class="slide-bar-card" :auto-play="false" :show-indicator="false">
                <Slide v-for="(item,index) in postList" :key="index">
                    <div class="wh_slide_box">
                        <img :src="item" @click="closePost()">
                    </div>
                </Slide>
            </Swiper>
        </div>
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
<style lang="less">
.post-layer {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 99;
    background: #000000;
    padding: 0.8rem;
}
.slide-bar-card {
    z-index: 1001;
}
.wh_slide_box {
    width: 99%;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    z-index: 10;
    min-height: 100px;
    margin: 0 auto;
}
</style>
