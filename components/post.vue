<template>
    <div v-show="visiable">
        <div class="count">{{realIndex}}/{{postList.length}}</div>
        <div class="post-layer">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div v-for="(item,i) in postList" :key="i" class="swiper-slide">
                        <div class="swiper-zoom-container">
                            <img :data-src="item" class="swiper-lazy" @load="imgLoaded" @error="imgError" />
                            <div class="swiper-lazy-preloader"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Swiper from 'swiper/dist/js/swiper.js'
export default {
    data() {
        return {
            mySwiper: null,
            index: 0,
            postList: [],
            visiable: false,
            id: this.$route.params.id,
            waitDoubleClick: false
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
            this.sendEvLog({
                category: `post_${this.id}`,
                action: 'page_show',
                label: this.id,
                value: 1,
                path: 0
            })
            if (this.mySwiper) {
                this.visiable = true
                this.mySwiper.zoom.out()
                this.mySwiper.slideTo(this.index)
            } else {
                this.postList = list

                this.$nextTick(() => {
                    this.imgRequest(this.index)
                    if (this.index - 1 >= 0) {
                        this.imgRequest(this.index - 1)
                    }
                    if (this.index + 1 < this.postList.length) {
                        this.imgRequest(this.index + 1)
                    }
                    this.init()
                })
            }
        },
        closePost(type) {
            this.visiable = false
            this.sendEvLog({
                category: `post_${this.id}`,
                action: 'img_tap',
                label: this.id + '-' + this.mySwiper.realIndex,
                value: type || 0,
                imgtype: this.postList[this.mySwiper.realIndex].indexOf('gif') >= 0 ? 0 : 1
            })
            this.$emit('close')
        },
        imgLoaded(event) {
            const index = this.postList.indexOf(event.target.src)
            this.sendEvLog({
                category: `post_${this.id}`,
                action: 'image_result',
                label: this.id + '-' + index,
                value: 1,
                imgtype: event.target.src.indexOf('gif') >= 0 ? 0 : 1
            })
        },
        imgError(event) {
            const index = this.postList.indexOf(event.target.src)
            this.sendEvLog({
                category: `post_${this.id}`,
                action: 'image_result',
                label: this.id + '-' + index,
                value: 0,
                imgtype: event.target.src.indexOf('gif') >= 0 ? 0 : 1
            })
        },
        imgRequest(index) {
            this.sendEvLog({
                category: `post_${this.id}`,
                action: 'image_request',
                label: this.id + '-' + index,
                value: 1,
                imgtype: this.postList[index].indexOf('gif') >= 0 ? 0 : 1
            })
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
            this.mySwiper.on('slidePrevTransitionEnd', () => {
                this.sendEvLog({
                    category: `post_${this.id}`,
                    action: 'img_swipe_left',
                    label: this.id + '-' + this.mySwiper.realIndex,
                    value: 1,
                    imgtype: this.postList[this.mySwiper.realIndex].indexOf('gif') >= 0 ? 0 : 1
                })
            })
            this.mySwiper.on('slideNextTransitionEnd', () => {
                this.sendEvLog({
                    category: `post_${this.id}`,
                    action: 'img_swipe_right',
                    label: this.id + '-' + this.mySwiper.realIndex,
                    value: 1,
                    imgtype: this.postList[this.mySwiper.realIndex].indexOf('gif') >= 0 ? 0 : 1
                })
            })
            this.mySwiper.on('zoomChange', (scale,img) => {
                this.sendEvLog({
                    category: `post_${this.id}`,
                    action: 'img_zoom',
                    label: this.id + '-' + this.postList.indexOf(img.getAttribute('src')),
                    value: scale > 1 ? 1 : 0,
                    imgtype: img.getAttribute('src').indexOf('gif') >= 0 ? 0 : 1
                })
            })
            this.mySwiper.on('click', event => {
                this.closePost(event.srcElement.tagName == 'IMG' ? 1 : 0)
            })
            this.mySwiper.on('lazyImageLoad', (slide, img) => {
                this.imgRequest(this.postList.indexOf(img.getAttribute('data-src')))
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
    .swiper-slide {
        overflow: hidden;
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
