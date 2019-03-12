<template>
    <div class="m_header">
        <div class="logo">
            <img @click="showNav" src="~assets/img/web/ic_guidelist.png">
            <img class="logo_img" v-if="logo==0" src="~assets/img/startimes.png" alt="Startimes">
            <img class="logo_img" v-if="logo==1" src="~assets/img/topstar_white.png" alt="Startimes">
            <img class="logo_img" v-if="logo==2" src="~assets/img/starsat_white.png" alt="Startimes">
        </div>
        <div class="navigator">
            <div>
                <nuxt-link to="/browser/">
                    <img v-if="$route.path=='/browser/'||$route.path=='/browser'" src="~assets/img/web/ic_home_def_yellow.png">
                    <img v-else src="~assets/img/web/ic_home_def_g.png">
                    <div
                        class="nav_title"
                        :class="{checked:$route.path=='/browser/'||$route.path=='/browser'}"
                    >{{$store.state.lang.officialwebsitemobile_topnav_home}}</div>
                </nuxt-link>
            </div>
            <div>
                <nuxt-link to="/browser/guide">
                    <img src="~assets/img/web/ic_tvguide.png">
                    <div class="nav_title">{{$store.state.lang.officialwebsitemobile_topnav_tvguide}}</div>
                </nuxt-link>
            </div>
            <div>
                <nuxt-link to="/browser/programlist">
                    <img v-if="$route.path.indexOf('/browser/programlist')>=0" src="~assets/img/web/ic_menu_def_yellow.png">
                    <img v-else src="~assets/img/web/ic_menu_def_w.png">
                    <div class="nav_title" :class="{checked:$route.path.indexOf('/browser/programlist')>=0}">{{$store.state.lang.officialwebsitemobile_topnav_list}}</div>
                </nuxt-link>
            </div>
            <div>
                <nuxt-link to="/browser/live">
                    <img v-if="$route.path.indexOf('/browser/live')>=0" src="~assets/img/web/ic_phoneplay_def_yellow.png">
                    <img v-else src="~assets/img/web/ic_phoneplay_def_w.png">
                    <div class="nav_title" :class="{checked:$route.path.indexOf('/browser/live')>=0}">{{$store.state.lang.officialwebsitemobile_topnav_live}}</div>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tvguide_url: 'https://m.startimestv.com/TVguide_list.php'
        }
    },
    mounted() {
        let host = window.location.host
        if (host.indexOf('qa') >= 0 || host.indexOf('dev') >= 0 || host.indexOf('localhost') >= 0) {
            this.tvguide_url = 'http://qa.upms.startimestv.com/wap/TVguide_list.php'
        }
    },
    computed: {
        logo() {
            let country = this.$store.state.country
            if (country.id == 18) {
                return 1
            } else if (country.id == 7) {
                return 2
            } else {
                return 0
            }
        }
    },
    methods: {
        showNav() {
            this.$store.commit('SET_NAV_STATE', true)
        }
    }
}
</script>
<style lang="less" scoped>
.m_header {
    padding: 0.4rem 0.5rem;
    background: #222527;
    height: 3.45rem;
    position: fixed;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 999;
    .logo {
        float: left;
        height: 100%;
        img {
            height: 1.6rem;
            &.logo_img {
                height: 2.2rem;
            }
        }
    }
    .navigator {
        float: right;
        & > div {
            float: left;
            margin-left: 0.4rem;
            text-align: center;
            width: 2.3rem;
            &:first-of-type {
                margin-left: 0;
            }
            .nav_title {
                font-size: 0.7rem;
                color: white;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                &.checked {
                    color: #ffbc2e;
                }
            }
            img {
                height: 1.6rem;
            }
        }
    }
}
</style>
