<template>
    <div>
        <div class="count">{{realIndex}}/{{postList.length}}</div>
        <div class="post-layer" @click.stop="closePost()">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div v-for="(item,i) in postList" :key="i" class="swiper-slide">
                        <div class="swiper-zoom-container">
                            <img :src="item" @click.stop="zoom()">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Swiper from 'Swiper'
import 'Swiper/dist/css/swiper.css'
export default {
    props: {
        postList: {
            required: false,
            type: Array,
            default: () => {
                return []
            }
        },
        pIndex: {
            required: false,
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            mySwiper: null,
            realIndex: this.pIndex
        }
    },
    methods: {
        closePost() {
            this.$emit('closePost')
        },
        zoom(){},
        init() {
            this.mySwiper = new Swiper('.swiper-container', {
                loop: false, // 循环模式选项
                observer: true, // 修改swiper自己或子元素时，自动初始化swiper
                observeParents: true, // 修改swiper的父元素时，自动初始化swiper
                on: {
                    slideChangeTransitionEnd: () => {
                        this.realIndex = this.mySwiper.activeIndex + 1
                    },
                    slideChange: () => {
                        this.realIndex = this.mySwiper.activeIndex + 1
                    }
                },
                zoom: true
            })
        },
        slide() {
            this.$nextTick(() => {
                this.init()
                this.mySwiper.slideTo(this.pIndex - 1, 1, false)
            })
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
}
.swiper-slide {
    width: 100%;
    img {
        width: 100%;
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
