<template>
    <div>
        <div class="count">{{index}}/{{postList.length}}</div>
        <div class="post-layer" @click="closePost()">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div v-for="(item,i) in postList" :key="i" class="swiper-slide">
                        <img :src="item" @click="closePost()">
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
        }
    },
    data() {
        return {
            index: 1,
            mySwiper: null
        }
    },
    mounted() {
        this.index = Number(localStorage.getItem('pic-index'))
        this.$nextTick(() => {
            this.mySwiper = new Swiper('.swiper-container', {
                loop: false // 循环模式选项
            })
        })
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
