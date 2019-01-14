<template>
    <div class="frame" :class="{shownav:showNav}" style="overflow:visible;height:auto;">
        <mheader @redirect="goToPage"/>
        <nuxt/>
        <div class="slide-bar">
            <ul>
                <li>Signin / Register</li>
                <li class="country">
                    <span>{{country.name}}</span>
                    <img :src="country.nationalFlag">
                </li>
                <li>{{language}}</li>
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
        showNav() {
            return this.$store.state.navState
        },
        country() {
            return this.$store.state.country
        },
        language(){
            let type = this.$store.state.langType
            switch(type){
                case 'fr': 
                    return 'French'
                case 'sw': 
                    return 'Kiswahili'
                case 'pt': 
                    return 'português'
                default : 
                    return 'English'
            }
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
                    break
                case 'menu':
                    this.$router.push('/browser/menu')
                    break
                case 'tvguide':
                    this.$router.push('/browser/tvguide')
                    break
                case 'phoneplay':
                    this.$router.push('/browser/phoneplay')
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
        a{
            color:white;
        }
    }
}
.wrapper {
    box-shadow: -10rem 0 0 0px #222527;
    background: white;
}
.country{
    img{
        width:1.5rem;
        height:1.5rem;
        margin-left:0.2rem;
    }
}
</style>
