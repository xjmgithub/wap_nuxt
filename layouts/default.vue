<template>
    <div style="overflow:visible;height:auto;">
        <mheader/>
        <nuxt/>
        <div class="nav-layer" v-show="showNav" @click="closeNav"/>
        <div class="slide-bar" :class="{'nav-show':showNav}">
            <ul>
                <li>
                    <div v-if="user">
                        <div class="user_info">
                            <img :src="user.head">
                            <div>{{user.nickName}}</div>
                        </div>
                    </div>
                    <nuxt-link v-else to="/hybrid/account/login">Signin / Register</nuxt-link>
                </li>
                <li class="country">
                    <nuxt-link to="/browser/country">
                        <span>{{country.name}}</span>
                        <img :src="country.nationalFlag">
                    </nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/browser/language">{{language}}</nuxt-link>
                </li>
                <li>
                    <a href="https://m.startimestv.com/faq.php">{{$store.state.lang.officialwebsitemobile_slidenav_faq}}</a>
                </li>
                <li>
                    <a href="https://m.startimestv.com/business.php">{{$store.state.lang.officialwebsitemobile_slidenav_contactus}}</a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import mheader from '~/components/web/header.vue'
export default {
    computed: {
        user() {
            let userInfo = this.$store.state.user
            return userInfo.roleName && userInfo.roleName != 'ANONYMOUS' ? userInfo : null
        },
        showNav() {
            // return true
            return this.$store.state.navState
        },
        country() {
            return this.$store.state.country
        },
        language() {
            let type = this.$store.state.langType
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
        }
    },
    components: {
        mheader
    },
    methods: {
        closeNav() {
            this.$store.commit('SET_NAV_STATE', false)
        }
    },
    created() {
        this.$axios.setHeader('token', this.$store.state.token)
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
    padding: 0;
    margin: 0;
    font-family: system, -apple-system, BlinkMacSystemFont, Roboto, Sans-serif;
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
        }
    }
}
.user_info {
    color:#BDBDBD;
    img {
        width: 3rem;
        border-radius: 3rem;
        border:1px #BDBDBD solid;
        display: block;
    }
}
.wrapper {
    box-shadow: -10rem 0 0 0px #222527;
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
