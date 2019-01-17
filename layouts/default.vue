<template>
    <div class="frame" :class="{shownav:showNav}" style="overflow:visible;height:auto;">
        <mheader/>
        <nuxt/>
        <div class="slide-bar">
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
                    <a href="https://m.startimestv.com/faq.php">FAQ</a>
                </li>
                <li>
                    <a href="https://m.startimestv.com/business.php">Contact Us</a>
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
            return userInfo.roleName != 'ANONYMOUS' ? userInfo : null
        },
        showNav() {
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

.frame {
    transition: transform 0.3s;
}
.frame.shownav {
    transform: translateX(10rem);
}

.slide-bar {
    position: absolute;
    left: -10rem;
    top: 0;
    width: 10rem;
    background: #222527;
    ul {
        padding: 1rem;
        color: white;
        line-height: 2rem;
        font-size: 0.9rem;
        a {
            color: white;
        }
    }
}
.user_info {
    text-align: center;
    padding: 1rem;
    img {
        width: 3rem;
        margin: 0 auto;
        border-radius: 3rem;
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
