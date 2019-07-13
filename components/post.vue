<template>
    <div v-show="visiable" @click.stop="closePost()">
        <div class="count">{{realIndex}}/{{postList.length}}</div>
        <div class="post-layer">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div v-for="(item,i) in postList" :key="i" class="swiper-slide">
                        <div class="swiper-zoom-container">
                            <img :data-src="item" class="swiper-lazy" />
                            <div class="swiper-lazy-preloader"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Swiper from 'swiper'
export default {
    data() {
        return {
            mySwiper: null,
            index: 0,
            postList: [],
            visiable: false
        }
    },
    computed: {
        realIndex() {
            return this.index + 1
        }
    },
    methods: {
        show(list, index) {
            this.index = index
            if (this.mySwiper) {
                this.visiable = true
                this.mySwiper.slideTo(this.index)
            } else {
                this.postList = list
                this.$nextTick(() => {
                    this.init()
                })
            }
        },
        closePost() {
            this.visiable = false
            this.$emit('close')
        },
        init() {
            this.visiable = true
            this.mySwiper = new Swiper('.swiper-container', {
                loop: false,
                zoom: true,
                initialSlide: this.index,
                width: document.body.scrollWidth,
                height: document.body.scrollHeight,
                preloadImages: false,
                lazy: {
                    loadPrevNext: true
                }
            })
            this.mySwiper.on('slideChangeTransitionEnd', () => {
                this.index = this.mySwiper.activeIndex
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import 'swiper/dist/css/swiper.css';
.post-layer {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 99;
    background: #000000;
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    align-items: center;
    .swiper-container {
        width: 100%;
        height: 100%;
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
