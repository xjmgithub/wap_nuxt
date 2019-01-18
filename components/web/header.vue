<template>
    <div class="m_header">
        <div class="logo">
            <img @click="toggleNav" src="~assets/img/web/ic_guidelist.png">
            <img class="logo_img" v-if="logo==0" src="~assets/img/startimes.png" alt="Startimes">
            <img class="logo_img" v-if="logo==1" src="~assets/img/topstar_white.png" alt="Startimes">
            <img class="logo_img" v-if="logo==2" src="~assets/img/starsat_white.png" alt="Startimes">
        </div>
        <div class="navigator">
            <div>
                <nuxt-link to="/browser/">
                    <img src="~assets/img/web/ic_home_def_g.png">
                    <div class="nav_title">Home</div>
                </nuxt-link>
            </div>
            <div>
                <a href="https://m.startimestv.com/TVguide_list.php">
                    <img src="~assets/img/web/ic_tvguide.png">
                    <div class="nav_title">Guide</div>
                </a>
            </div>
            <div>
                <nuxt-link to="/browser/programlist">
                    <img src="~assets/img/web/ic_menu_def_w.png">
                    <div class="nav_title">List</div>
                </nuxt-link>
            </div>
            <div>
                <nuxt-link to="/browser/live">
                    <img src="~assets/img/web/ic_phoneplay_def_w.png">
                    <div class="nav_title">Live</div>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    computed:{
        logo(){
            let country = this.$store.state.country
            if(country.id==6){
                return 1
            }else if(country.id==7){
                return 2
            }else{
                return 0
            }
        }
    },
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
    padding: 0.4rem 0.5rem;
    background: #222527;
    height: 3.45rem;
    position: fixed;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 999;
    .logo{
        float: left;
        height:100%;
        img {
            height: 1.6rem;
            &.logo_img{
                height:2.2rem;
            }
        }
    }
    .navigator {
        float: right;
        & > div {
            float: left;
            margin-left: 0.7rem;
            text-align: center;
            &:first-of-type{
                margin-left: 0;
            }
            .nav_title {
                font-size: 0.7rem;
                color: white;
                transform: scale(0.9)
            }
            img {
                height: 1.6rem;
            }
        }
    }
}
</style>
