<template>
    <div class="wrapper">
        <img class="st_logo" src="~assets/img/logo01.png">
        <div class="words">
            <div class="freeVIP">FREE<br>VIP</div>
            <div class="coins">or<br>COINS</div>
            <div class="tip">If you are new user, you can get 5000 coins after downloading app!</div>
            <div class="rules">Activity Rules</div>
        </div>
        <nuxt-link to="/hybrid/account/register">
            <div class="get-now">GET NOW</div>
        </nuxt-link>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            utm_str: this.$route.query.referrer || JSON.stringify(this.$route.query).replace(/"/g,'').replace('{','').replace('}','').replace(/,/g,'&').replace(/:/g,'=').replace('t_sr','utm_source').replace('t_md','utm_medium').replace('t_tm','utm_term').replace('t_ct','utm_content').replace('t_cn','utm_campaign')
        }
    },
    mounted() {
        // http://localhost:3000/hybrid/lands/invite?referrer=utm_source%3Dstartimes_app%26utm_medium%3Dshare%26utm_term%3Drunning%26utm_content%3Dlogolink%26utm_campaign%3Dtell_friends

        // http://localhost:3000/hybrid/lands/invite?utm_source=startimes_app&utm_medium=share&utm_term=running&utm_content=logolink&utm_campaign=tell_friends

        // http://localhost:3000/hybrid/lands/invite?t_sr=startimes_app&t_md=share&t_tm=running&t_ct=logolink&t_cn=tell_friends

        // console.log(this.utm_str) // utm_source=startimes_app&utm_medium=share&utm_term=running&utm_content=logolink&utm_campaign=tell_friends

        sessionStorage.setItem("utm_str", this.utm_str)
    },
    methods: {
        
    },
    head() {
        return {
            title: 'Login'
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    position: static;
    min-height: 100%;
    padding-top: 25%;
    padding-bottom: 25%;
    img {
        display: block;
        height: 2.3rem;
        width: 18rem;
        margin: 0 auto;
        margin-top: 1.2rem;
        margin-bottom: 1.2rem;
    }

    .st_logo {
        height: auto;
        width: 11rem;
        margin-bottom: 2.5rem;
    }

    .regtext {
        text-align: center;
        font-size: 0.8rem;
        color: #424242;
        margin-top: 2.5rem;
    }
}
</style>
