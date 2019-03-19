<template>
    <div class="wrapper wide">
        <mheader/>
        <download class="clearfix"/>
        <nuxt/>
        <div v-show="showNav" @click="closeNav" class="nav-layer"/>
        <div :class="{'nav-show':showNav}" class="slide-bar">
            <ul>
                <li>
                    <div>
                        <div class="user_info">
                            <img v-if="user" :src="user.head.replace('http:','https:')">
                            <nuxt-link v-else to="/hybrid/account/login">
                                <img src="https://cdn.startimestv.com/head/h_d.png" style="margin-bottom:0.8rem">
                            </nuxt-link>
                            <div v-if="user">{{user.nickName}}</div>
                        </div>
                    </div>
                </li>
                <li class="country">
                    <nuxt-link :class="{checked:$route.path=='/browser/country'}" to="/browser/country">
                        <span>{{country.name}}</span>
                        <img :src="country.nationalFlag.replace('http:','https:')">
                    </nuxt-link>
                </li>
                <li>
                    <nuxt-link :class="{checked:$route.path=='/browser/language'}" to="/browser/language">{{language}}</nuxt-link>
                </li>
                <li>
                    <a :href="faq_url">{{$store.state.lang.officialwebsitemobile_slidenav_faq}}</a>
                </li>
                <li>
                    <nuxt-link :class="{checked:$route.path=='/browser/contactus'}" to="/browser/contactus">
                        <span>{{$store.state.lang.officialwebsitemobile_slidenav_contactus}}</span>
                    </nuxt-link>
                </li>
            </ul>
        </div>
        <alert ref="alert" />
        <confirm ref="confirm" />
    </div>
</template>
<script>
import Vue from 'vue'
import alert from '~/components/alert'
import confirm from '~/components/confirm'
import mheader from '~/components/web/header.vue'
import download from '~/components/web/download'
import { setCookie } from '~/functions/utils'
export default {
    components: {
        alert,
        confirm,
        mheader,
        download
    },
    data() {
        return {
            faq_url: 'https://m.startimestv.com/faq.php',
            contact_url: 'https://m.startimestv.com/business.php'
        }
    },
    computed: {
        user() {
            const userInfo = this.$store.state.user
            return userInfo.roleName && userInfo.roleName !== 'ANONYMOUS' ? userInfo : null
        },
        showNav() {
            return this.$store.state.navState
        },
        country() {
            return this.$store.state.country
        },
        language() {
            const type = this.$store.state.langType
            switch (type) {
                case 'fr':
                    return 'French'
                case 'sw':
                    return 'Kiswahili'
                case 'pt':
                    return 'português'
                default:
                    return 'English'
            }
        },
        token() {
            return this.$store.state.token
        },
        gtoken() {
            return this.$store.state.gtoken
        }
    },
    watch: {
        token(nv, ov) {
            setCookie('token', nv)
            // this.$axios.setHeader('token', nv)
        },
        gtoken(nv, ov) {
            setCookie('gtoken', nv)
            this.$axios.setHeader('token', nv)
        }
    },
    created() {
        // this.$nextTick(() => this.$nuxt.$loading.start())
        const _this = this
        Vue.prototype.$alert = (msg, callback) => {
            _this.$refs.alert.show(msg, callback)
            this.$store.commit('SHOW_SHADOW_LAYER')
        }
        Vue.prototype.$confirm = (msg, callback, cancel, yes, no) => {
            _this.$refs.confirm.show(msg, callback, cancel, yes, no)
            this.$store.commit('SHOW_SHADOW_LAYER')
        }
        this.$axios.setHeader('token', this.$store.state.gtoken)
    },
    mounted() {
        const host = window.location.host
        if (host.indexOf('qa') >= 0 || host.indexOf('dev') >= 0 || host.indexOf('localhost') >= 0) {
            this.faq_url = 'http://qa.upms.startimestv.com/wap/faq.php'
            this.contact_url = 'http://qa.upms.startimestv.com/wap/business.php'
        }
    },
    methods: {
        closeNav() {
            this.$store.commit('SET_NAV_STATE', false)
        }
    }
}
</script>
<style lang="less">
@import '~assets/less/browser/index.less';
@font-face {
    font-family: Roboto;
    src: url('~assets/fonts/Roboto-Regular.ttf');
    font-style: 'normal';
}
.nav-layer {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}
.slide-bar {
    position: fixed;
    left: 0rem;
    top: 0;
    width: 10rem;
    background: #222527;
    z-index: 1001;
    display: none;
    &.nav-show {
        position: fixed;
        display: block;
    }
    ul {
        padding: 1rem;
        color: white;
        line-height: 2.5rem;
        font-size: 0.9rem;
        a {
            color: white;
            &.checked {
                color: #ffbc2e;
            }
        }
    }
}
.user_info {
    color: #bdbdbd;
    img {
        width: 3rem;
        border-radius: 3rem;
        border: 1px #bdbdbd solid;
        display: block;
    }
}
.wrapper {
    width: 100%;
    padding: 3rem 0.8rem 0;
    background: white;
    overflow-y: auto;
    &.wide {
        padding-left: 0;
        padding-right: 0;
    }
}
.country {
    img {
        width: 1.5rem;
        height: 1.5rem;
        margin-left: 0.2rem;
    }
}
</style>
