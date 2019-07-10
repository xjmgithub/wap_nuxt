<template>
    <div>
        <div class="count">{{index}}/{{postList.length}}</div>
        <div class="post-layer" @click="closePost()">
            <Swiper v-if="postList.length > 0" class="slide-bar-card" :auto-play="false" :show-indicator="false" @changeIndex="changeIndex">
                <Slide v-for="(item,i) in postList" :key="i">
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
        },
        pIndex: {
            type: Number,
            requred: false,
            default: 1
        }
    },
    data() {
        return {
            index: this.pIndex
        }
    },
    methods: {
        closePost() {
            this.$emit('closePost')
        },
        changeIndex(nv) {
            this.index = nv
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
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    align-items: center;
    .slide-bar-card {
        z-index: 1001;
    }
    .wh_slide {
        position: relative;
    }
    .wh_slide_box {
        width: 99%;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        z-index: 10;
        min-height: 100px;
        margin: 0 auto;
    }
}
.count {
    color: #cccccc;
    position: fixed;
    right: 1rem;
    top: 1rem;
    z-index: 100;
}
</style>
