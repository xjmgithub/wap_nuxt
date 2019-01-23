<template>
    <div>
        <loading v-if="!showPageComp"/>
        <nuxt v-if="showPageComp"/>
        <alert ref="alert"/>
        <confirm ref="confirm"/>
        <shadowLayer v-show="layer"/>
    </div>
</template>
<script>
import Vue from 'vue'
import alert from '~/components/alert'
import confirm from '~/components/confirm'
import shadowLayer from '~/components/shadow-layer'
import loading from '~/components/loading'
import { toNativePage } from '~/functions/utils'
export default {
    data() {
        return {
            showPageComp: false // 是否显示页面组件
        }
    },
    components: {
        alert,
        confirm,
        shadowLayer,
        loading
    },
    computed: {
        layer() {
            return this.$store.state.shadowStatus
        },
        needLoginAlert() {
            return this.$store.state.needLoginAlert
        }
    },
    created() {
        let _this = this
        Vue.prototype.$alert = (msg, callback) => {
            _this.$refs.alert.show(msg, callback)
            this.$store.commit('SHOW_SHADOW_LAYER')
        }
        Vue.prototype.$confirm = (msg, callback, cancel, yes, no) => {
            _this.$refs.confirm.show(msg, callback, cancel, yes, no)
            this.$store.commit('SHOW_SHADOW_LAYER')
        }
        this.$axios.setHeader('token', this.$store.state.token)
    },
    mounted() {
        if (this.needLoginAlert) {
            this.loginAlert()
        } else {
            this.showPageComp = true
        }
    },
    watch: {
        needLoginAlert(nv, ov) {
            if (nv) {
                this.loginAlert()
            }
        }
    },
    methods: {
        loginAlert() {
            this.$alert('Your account is signed in elsewhere. Please Login again', () => {
                if (this.$store.state.appType == 1) {
                    toNativePage('com.star.mobile.video.account.LoginActivity')
                } else {
                    toNativePage('startimes://login')
                }
            })
        }
    }
}
</script>
<style lang="less">
@font-face {
    font-family: Roboto;
    src: url('~assets/fonts/Roboto-Regular.ttf');
    font-style: 'normal';
}
html,
body {
    margin: 0px;
    padding: 0px;
    height: 100%;
    overflow-y: auto;
    font-family: system, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Sans-serif;
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
#wrapper {
    min-height: 100%;
    z-index: 2;
    position: absolute;
    background: white;
}
</style>
