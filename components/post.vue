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
    props: {
        imgType: {
            required: true,
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            mySwiper: null,
            index: 0,
            postList: [],
            visiable: false,
            id: this.$route.params.id
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
            const value = event.target.tagName == 'IMG' ? 1 : 0
            this.sendEvLog({
                category: `post_${this.id}`,
                action: 'img_tap',
                label: this.id,
                value: value,
                imgtype: this.imgType
            })
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
            this.mySwiper.on('slidePrevTransitionEnd', () => {
                this.sendEvLog({
                    category: `post_${this.id}`,
                    action: 'img_swipe_left',
                    label: this.id,
                    value: 1,
                    imgtype: this.imgType
                })
            })
            this.mySwiper.on('slideNextTransitionEnd', () => {
                this.sendEvLog({
                    category: `post_${this.id}`,
                    action: 'img_swipe_right',
                    label: this.id,
                    value: 1,
                    imgtype: this.imgType
                })
            })
            this.mySwiper.on('zoomChange', scale => {
                this.sendEvLog({
                    category: `post_${this.id}`,
                    action: 'img_zoom',
                    label: this.id,
                    value: scale > 1 ? 1 : 0,
                    imgtype: this.imgType
                })
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
