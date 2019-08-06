<template>
    <div class="wrapper">
        <img class="st_logo" src="~assets/img/logo01.png">
        <div class="regtext">
            Download startimes ON app now?
            <nuxt-link to="/hybrid/account/register" style="text-decoration:underline">
                Download
            </nuxt-link>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            utm_str: '',
        }
    },
    mounted() {
        this.utm_str = sessionStorage.getItem("utm_str");
    },
    methods: {
        
    },
    head() {
        return {
            title: 'Download'
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    position: static;
    min-height: 100%;
    padding-top: 25%;
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
