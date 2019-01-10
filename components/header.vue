<template>
    <div class="m_header">
        <img class="menu" @click="toggleNav" src="~assets/img/web/ic_guidelist.png">
        <img class="logo" src="~assets/img/logo.png" alt="Startimes" @click="redirect('index')">
        <div class="navigator">
            <img src="~assets/img/web/ic_home_def_g.png" @click="redirect('home')">
            <img src="~assets/img/web/ic_menu_def_w.png" @click="redirect('menu')">
            <img src="~assets/img/web/ic_tvguide.png" @click="redirect('tvguide')">
            <img src="~assets/img/web/ic_phoneplay_def_w.png" @click="redirect('phoneplay')">
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        redirect(url) {
            this.$emit('redirect', url)
        },
        toggleNav(){
            let state = this.$store.state.navState
            console.log(state)
            this.$store.commit('SET_NAV_STATE',!state)
        }
    }
}
</script>
<style lang="less">
.m_header {
    padding: 0.6rem .8rem .6rem .3rem;
    background: #222527;
    height: 2.8rem;
    position: fixed;
    top: 0;
    width: 100%;
    &>img{
        float: left;
        display: block;
        height: 1.5rem;
        margin-left:.4rem;
    }
    .navigator{
        float:right;
        img{
            height:1.5rem;
            margin-left:.4rem;
        }
    }
}


</style>
