<template>
    <div>
        <nuxt v-if="!needLoginAlert"/>
        <div v-if="needLoginAlert" class="authfail">
            <img src="~assets/img/pay/img_failed_def_b.png">
            <p class="fail">
                Please
                <a href="javascript:void(0)" @click="toNativeLogin">Log in First.</a>
            </p>
        </div>
        <alert ref="alert"/>
        <confirm ref="confirm"/>
        <toast ref="toast"/>
        <shadowLayer v-show="layer"/>
    </div>
</template>
<script>
import Vue from 'vue'
import alert from '~/components/alert'
import confirm from '~/components/confirm'
import toast from '~/components/toast'
import shadowLayer from '~/components/shadow-layer'
import { toNativePage, cdnPicSrc } from '~/functions/utils'
export default {
    components: {
        alert,
        confirm,
        shadowLayer,
        toast
    },
    data() {
        return {
            needLoginAlert: this.$store.state.needLoginAlert // 是否显示页面组件
        }
    },
    computed: {
        layer() {
            return this.$store.state.shadowStatus
        }
    },
    created() {
        Vue.prototype.$alert = (msg, callback) => {
            this.$refs.alert.show(msg, callback)
            this.$store.commit('SHOW_SHADOW_LAYER')
        }
        Vue.prototype.$confirm = (msg, callback, cancel, yes, no) => {
            this.$refs.confirm.show(msg, callback, cancel, yes, no)
            this.$store.commit('SHOW_SHADOW_LAYER')
        }
        Vue.prototype.$toast = (msg, duration) => {
            this.$refs.toast.show(msg, duration)
        }

        Vue.prototype.cdnPicSrc = value => {
            return cdnPicSrc.call(this, value)
        }
        Vue.prototype.lasyLoadImg = () => {
            this.getPic()
        }

        this.$axios.setHeader('token', this.$store.state.token)
    },
    mounted() {
        if (this.$store.state.appVersionCode >= 50900) {
            this.sendEvLog({
                category: 'h5_open',
                action: 'layout_mounted',
                label: window.location.pathname,
                value: this.needLoginAlert ? 0 : 1
            })
        }

        if(this.$store.state.appType<=0){
            /* eslint-disable */
            window.fbAsyncInit = function() {
                FB.init({
                    appId: '159785064477978',
                    status: true,
                    xfbml: true,
                    version: 'v3.2'
                })
            }
            const script = document.createElement('script')
            script.src = 'https://connect.facebook.net/en_US/sdk.js'
            const firstScript = document.getElementsByTagName('script')[0]
            firstScript.parentNode.insertBefore(script, firstScript)
        }

        const user = this.$store.state.user
        this.$nextTick(() => {
            this.$nuxt.$loading.finish()
            if (!user.roleName && this.$store.state.appType) {
                this.$alert('Your user authentication has expired. Please log in again.', () => {
                    this.toNativeLogin()
                })
            }

            this.getPic()
            document.addEventListener('scroll', () => {
                this.getPic()
            })
        })
    },
    methods: {
        getPic() {
            const lasyImg = document.querySelectorAll('img[pre-src]')
            const screenHeight = window.screen.availHeight
            for (let i = 0; i < lasyImg.length; i++) {
                const el = lasyImg[i]
                const top = el.getBoundingClientRect().top
                if (top < screenHeight) {
                    el.src = el.getAttribute('pre-src')
                }
            }
        },
        toNativeLogin() {
            this.sendEvLog({
                category: 'h5_jump',
                action: 'toLogin',
                label: window.location.pathname,
                value: 1
            })
            if (this.$store.state.appType === 1) {
                toNativePage('com.star.mobile.video.account.LoginActivity')
            } else {
                toNativePage('startimes://login')
            }
        }
    }
}
</script>
<style lang="less" scoped>
html,
body {
    margin: 0px;
    padding: 0px;
}
.clearfix:after {
    display: block;
    visibility: hidden;
    clear: both;
    height: 0;
    content: '';
}
.clearfix {
    zoom: 1;
}
.wrapper {
    min-height: 100%;
    background: white;
}
.authfail {
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 4rem;
    background: white;
    img {
        width: 15rem;
        height: 13rem;
    }
    .fail {
        width: 80%;
        margin: 0 auto;
        margin-top: 1rem;
    }
}
</style>
