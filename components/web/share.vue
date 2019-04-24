<template>
    <div>
        <div v-show="showShare" class="share-layer" @click="closeShare" />
        <div :class="{'share-show':showShare}" class="slide-bar-share">
            <p>Share to:</p>
            <ul>
                <li>
                    <!-- <nuxt-link :class="{checked:$route.path=='/browser/country'}" to="/browser/country">
                        <img :src="country.nationalFlag.replace('http:','https:')">
                        <span>{{country.name}}</span>
                    </nuxt-link> -->
                    <img src="~assets/img/web/app_icon.png">
                    <p>Facebook</p>
                </li>
                <li>
                    <img src="~assets/img/web/app_icon.png">
                    <p>Copy Link</p>
                </li>
                <li>
                    <img src="~assets/img/web/app_icon.png">
                    <p>Twitter</p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    computed: {
        showShare() {
            return this.$store.state.shareState
        }
    },
    methods: {
        closeShare() {
            this.$store.commit('SET_SHARE_STATE', false)
        }
    }
}
</script>
<style lang="less">
.share-layer {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1000;
}
.slide-bar-share {
    width: 100%;
    height: 11rem;
    z-index: 1001;
    display: none;
    position: fixed;
    left: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.5);
    &.share-show {
        display: block;
    }
    & > p {
        color: #333333;
        padding: 1rem 0 0 1rem;
    }
    ul {
        line-height: 2.5rem;
        font-size: 0.9rem;
        color: #666666;
        text-align: center;
        li {
            float: left;
            width: 33.3%;
            padding: 0 1rem;
            img {
                width: 100%;
            }
        }
    }
}
</style>
