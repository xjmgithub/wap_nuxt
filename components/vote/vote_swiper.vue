<template>
    <Swiper v-if="banners.length > 0" :auto-play="true" @changeIndex="changeIndex">
        <Slide v-for="(item,index) in banners" :key="index" @click="clickBanner(item)">
            <img :src="cdnPicSrc(item.materials)">
        </Slide>
    </Swiper>
</template>
<script>
import { Swiper, Slide } from '~/components/swiper'
import { toNativePage } from '~/functions/utils'
export default {
    layout: 'base',
    components: {
        Swiper,
        Slide
    },
    props: {
        banners: {
            type: Array,
            requred: true,
            default: () => []
        },
        name: {
            type: String,
            requred: true,
            default: ''
        }
    },
    computed: {
        platform() {
            if (this.$store.state.appType == 1) {
                return 'Android'
            } else if (this.$store.state.appType == 2) {
                return 'iOS'
            } else {
                return 'web'
            }
        }
    },
    mounted() {
        this.changeIndex(1)
    },
    methods: {
        clickBanner(banner) {
            const href = banner.link
            const bannerName = banner.name
            this.sendEvLog({
                category: `vote_${this.name}_${this.platform}`,
                action: 'banner_click',
                label: 'banner_' + bannerName,
                value: 1
            })
            toNativePage(href)
        },
        changeIndex(index) {
            if (index <= this.banners.length && index > 0) {
                const bannerName = this.banners[index - 1].name
                this.sendEvLog({
                    category: `vote_${this.name}_${this.platform}`,
                    action: 'banner_show',
                    label: 'banner_' + bannerName,
                    value: 1
                })
            }
        }
    }
}
</script>
