<template>
    <div class="frame">
        <mheader/>
        <download class="clearfix"/>
        <nuxt class="page-main" />
        <div v-show="showNav" class="nav-layer" @click="closeNav"/>
        <div :class="{'nav-show':showNav}" class="slide-bar">
            <ul>
                <li>
                    <div>
                        <div class="user_info">
                            <img v-if="user" :src="cdnPicSrc(user.head)">
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
                        <img :src="cdnPicSrc(country.nationalFlag)">
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
import mheader from '~/components/web/header.vue'
import download from '~/components/web/download'
import shadowLayer from '~/components/shadow-layer'
import toast from '~/components/toast'
import { setCookie, cdnPicSrc } from '~/functions/utils'
export default {
    components: {
        alert,
        confirm,
        mheader,
        download,
        shadowLayer,
        toast
    },
    data() {
        return {
            faq_url: 'https://m.startimestv.com/faq.php'
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
        },
        layer() {
            return this.$store.state.shadowStatus
        }
    },
    watch: {
        token(nv, ov) {
            setCookie('token', nv)
            this.$axios.setHeader('token', nv)
        },
        gtoken(nv, ov) {
            setCookie('gtoken', nv)
            this.$axios.setHeader('token', nv)
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
        this.$axios.setHeader('token', this.$store.state.gtoken)
    },
    mounted() {
        const host = window.location.host
        if (host.indexOf('qa') >= 0 || host.indexOf('dev') >= 0 || host.indexOf('localhost') >= 0) {
            this.faq_url = 'http://qa.upms.startimestv.com/wap/faq.php'
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
.frame {
    width: 100%;
    padding-top: 6rem;
    background: white;
    padding-left: 0;
    padding-right: 0;
}
.page-main {
    padding: 1.4rem 0.8rem;
    background: white;
}
.country {
    img {
        width: 1.5rem;
        height: 1.5rem;
        margin-left: 0.2rem;
    }
}
</style>
