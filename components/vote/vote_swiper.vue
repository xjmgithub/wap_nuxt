<template>
    <Swiper :auto-play="false" v-if="bannerList.length > 0">
        <Slide v-for="(item,index) in bannerList" :key="index" @click="clickBanner(item)">
            <img :src="item.materials.replace('http:','https:')" alt>
        </Slide>
    </Swiper>
</template>
<script>
import { Swiper, Slide } from '~/components/swiper'
export default {
    layout: 'base',
    props: {
        vote_id: {
            type: Number,
            default: 2
        }
    },
    data() {
        return {
            bannerList: []
        }
    },
    mounted() {
        this.getVote()
    },
    methods: {
        getVote() {
            this.$axios({
                url: `/voting/v1/vote?vote_id=${this.vote_id}`,
                method: 'get',
                data: {}
            }).then(res => {
                if (res.data.code == 0) {
                    if (res.data.data.banner) {
                        let bannerUUID = res.data.data.banner
                        this.getBanner(bannerUUID)
                    }
                }
            })
        },
        getBanner(bannerUUID) {
            this.$axios({
                url: `/adm/v1/units/${bannerUUID}/materials`,
                method: 'get',
                data: {}
            }).then(res => {
                if (res.data.code == 0) {
                    let shareLink = res.data.data[0].materials
                    this.bannerList = res.data.data
                    for (var i = 0; i < res.data.data.length; i++) {
                        let bannerName = res.data.data[i].name
                        this.sendEvLog({
                            category: 'vote_Bongostar',
                            action: 'banner_show',
                            label: 'banner_' + bannerName,
                            value: 10
                        })
                    }
                }
            })
        },
        clickBanner(banner) {
            let href = banner.link
            let bannerName = banner.name
            this.sendEvLog({
                category: 'vote_Bongostar',
                action: 'banner_click',
                label: 'banner_' + bannerName,
                value: 10
            })
            if (href.indexOf('com.star.mobile') == 0) {
                if (this.appType == 1) {
                    //TODO 点击banner操作 materials ??
                    // skip4(3, href, "", INITCONFIG.PLAT);
                }
            } else {
                window.location.href = href
            }
        }
    },
    components: {
        Swiper,
        Slide
    }
}
</script>
