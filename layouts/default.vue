<template>
    <div class="frame" :class="{shownav:showNav}" style="overflow:visible;height:auto;">
        <mheader @redirect="goToPage"/>
        <nuxt/>
        <div class="slide-bar">
            <ul>
                <li>Signin / Register</li>
                <li @click="chooseLanguage()">Language</li>
                <li @click="chooseCountry()">Country</li>
                <li>FAQ</li>
                <li>Contact Us</li>
            </ul>
        </div>
    </div>
</template>
<script>
import mheader from '~/components/web/header.vue'
export default {
    computed:{
        showNav(){
            return this.$store.state.navState
        }
    },
    components: {
        mheader
    },
    methods: {
        goToPage(url) {
            switch (url) {
                case 'home':
                    this.$router.push('/browser')
                    break;
                case 'menu':
                    this.$router.push('/browser/menu')
                    break;
                case 'tvguide':
                    this.$router.push('/browser/tvguide')
                    break;
                case 'phoneplay':
                    this.$router.push('/browser/phoneplay')
                    break;
            }
        },
        chooseLanguage(){
            this.$router.push('/browser/language')
            this.$store.commit('SET_NAV_STATE', !this.showNav)
        },
        chooseCountry(){
            this.$router.push('/browser/country')
            this.$store.commit('SET_NAV_STATE', !this.showNav)
        },
    },
    created() {
        this.$axios.setHeader('token', this.$store.state.token)
    }
}
</script>
<style lang="less">
html,
body {
    padding: 0;
    margin: 0;
}

.frame{
    transition: transform 0.3s;
}
.frame.shownav{
    transform: translateX(10rem);
}

.slide-bar {
    position: absolute;
    left: -10rem;
    top: 0;
    width:10rem;
    background:#222527;
    ul{
        padding:1rem;
        color:white;
        line-height:2rem;
        font-size:0.9rem;
    }
}
.wrapper {
    box-shadow: -10rem 0 0 0px #222527;
    background:white;
}
</style>
