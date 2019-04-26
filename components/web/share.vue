<template>
    <div>
        <div v-show="showShare" class="share-layer" @click="closeShare"/>
        <div :class="{'share-show':showShare}" class="slide-bar-share">
            <p>Share to:</p>
            <ul>
                <li @click="shareWithFacebook">
                    <!-- <nuxt-link :class="{checked:$route.path=='/browser/country'}" to="/browser/country">
                        <img :src="country.nationalFlag.replace('http:','https:')">
                        <span>{{country.name}}</span>
                    </nuxt-link>-->
                    <img src="~assets/img/web/app_icon.png">
                    <p>Facebook</p>
                </li>
                <li @click="copyLink">
                    <img src="~assets/img/web/app_icon.png">
                    <p>Copy Link</p>
                </li>
                <li @click="shareWithTwitter">
                    <img src="~assets/img/web/app_icon.png">
                    <p>Twitter</p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { initFacebookLogin } from '~/functions/utils'
export default {
    computed: {
        showShare() {
            return this.$store.state.shareState
        }
    },
    mounted() {
        initFacebookLogin()
    },
    methods: {
        closeShare() {
            this.$store.commit('SET_SHARE_STATE', false)
        },
        shareWithFacebook() {
            // eslint-disable-next-line no-undef
            FB.ui(
                {
                    method: 'share',
                    display: 'popup',
                    href: window.location.href
                },
                function(response) {}
            )
        },
        copyLink() {
            // TODO copy Link
        },
        shareWithTwitter() {
            // TODO share with twitter
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
