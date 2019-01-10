<template>
    <div class="frame" :class="{shownav:false}" style="overflow:visible">
        <mheader @redirect="goToPage"/>
        <nuxt/>
        <div class="slide-bar">
            <ul>
                <li>Signin / Register</li>
                <li>language</li>
                <li>Country</li>
                <li>FAQ</li>
                <li>Contact Us</li>
            </ul>
        </div>
    </div>
</template>
<script>
import mheader from '~/components/header.vue'
export default {
    components: {
        mheader
    },
    methods: {
        goToPage(url) {
            switch (url) {
                case 'home':
                    console.log(url)
                    break
                case 'menu':
                    break
                case 'tvguide':
                    break
                case 'phoneplay':
                    break
            }
        }
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
    transition: transform 0.5s;
    overflow: visible;
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
}
</style>
