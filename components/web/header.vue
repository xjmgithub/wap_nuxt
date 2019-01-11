<template>
    <div class="m_header">
        <img class="menu" @click="toggleNav" src="~assets/img/web/ic_guidelist.png">
        <img class="logo" src="~assets/img/logo.png" alt="Startimes">
        <div class="navigator">
            <div>
                <nuxt-link to="/browser/">
                    <img src="~assets/img/web/ic_home_def_g.png">
                    <div class="nav_title">Home</div>
                </nuxt-link>
            </div>
            <div>
                <nuxt-link to="/browser/tvguide">
                    <img src="~assets/img/web/ic_tvguide.png">
                    <div class="nav_title">Guide</div>
                </nuxt-link>
            </div>
            <div>
                <nuxt-link to="/browser/programlist">
                    <img src="~assets/img/web/ic_menu_def_w.png">
                    <div class="nav_title">List</div>
                </nuxt-link>
            </div>
            <div @click="redirect('phoneplay')">
                <nuxt-link to="/browser/phoneplay">
                    <img src="~assets/img/web/ic_phoneplay_def_w.png">
                    <div class="nav_title">Live</div>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        toggleNav() {
            let state = this.$store.state.navState
            this.$store.commit('SET_NAV_STATE', !state)
        }
    }
}
</script>
<style lang="less" scope>
.m_header {
    padding: 0.6rem 0.8rem 0.6rem 0.3rem;
    background: #222527;
    height: 3.7rem;
    position: fixed;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 999;
    & > img {
        float: left;
        display: block;
        height: 1.6rem;
        margin-left: 0.4rem;
    }
    .navigator {
        float: right;
        & > div {
            float: left;
            margin-left: 0.85rem;
            text-align: center;
            .nav_title {
                font-size: 0.7rem;
                color: white;
            }
            img {
                height: 1.6rem;
            }
        }
    }
}
</style>
