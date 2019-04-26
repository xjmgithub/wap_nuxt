<template>
    <div class="m_header">
        <div class="logo">
            <img src="~assets/img/web/ic_guidelist.png" @click="showNav">
            <img v-if="logo==0" class="logo_img" src="~assets/img/startimes2.png" alt="Startimes">
            <img v-if="logo==1" class="logo_img" src="~assets/img/topstar_white2.png" alt="Startimes">
            <img v-if="logo==2" class="logo_img" src="~assets/img/starsat_white2.png" alt="Startimes">
        </div>
        <div class="navigator">
            <div>
                <nuxt-link to="/browser/">
                    <img v-if="$route.path=='/browser/'||$route.path=='/browser'" src="~assets/img/web/ic_home_def_yellow.png">
                    <img v-else src="~assets/img/web/ic_home_def_g.png">
                    <div
                        :class="{checked:$route.path=='/browser/'||$route.path=='/browser'}"
                        class="nav_title"
                    >
                        {{$store.state.lang.officialwebsitemobile_topnav_home}}
                    </div>
                </nuxt-link>
            </div>
            <div>
                <nuxt-link to="/browser/guide">
                    <img v-if="$route.path.indexOf('/browser/guide')>=0" src="~assets/img/web/ic_tvguide_yellow.png">
                    <img v-else src="~assets/img/web/ic_tvguide.png">
                    <div :class="{checked:$route.path.indexOf('/browser/guide')>=0}" class="nav_title">
                        {{$store.state.lang.officialwebsitemobile_topnav_tvguide}}</div>
                </nuxt-link>
            </div>
            <div>
                <nuxt-link to="/browser/program/list">
                    <img v-if="$route.path.indexOf('/browser/program')>=0" src="~assets/img/web/ic_menu_def_yellow.png">
                    <img v-else src="~assets/img/web/ic_menu_def_w.png">
                    <div :class="{checked:$route.path.indexOf('/browser/program')>=0}" class="nav_title">
                        {{$store.state.lang.officialwebsitemobile_topnav_list}}
                    </div>
                </nuxt-link>
            </div>
            <div>
                <nuxt-link to="/browser/live">
                    <img v-if="$route.path.indexOf('/browser/live')>=0" src="~assets/img/web/ic_phoneplay_def_yellow.png">
                    <img v-else src="~assets/img/web/ic_phoneplay_def_w.png">
                    <div :class="{checked:$route.path.indexOf('/browser/live')>=0}" class="nav_title">
                        {{$store.state.lang.officialwebsitemobile_topnav_live}}
                    </div>
                </nuxt-link>
            </div>
            <div>
                <nuxt-link to="/browser/search">
                    <img v-if="$route.path.indexOf('/browser/search')>=0" src="~assets/img/web/ic_search_y.png">
                    <img v-else src="~assets/img/web/ic_search_w.png">
                    <div :class="{checked:$route.path.indexOf('/browser/search')>=0}" class="nav_title">
                        {{$store.state.lang.officialwebsitemobile_search}}
                    </div>
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
    computed: {
        logo() {
            const country = this.$store.state.country
            if (country.id === 18) {
                return 1
            } else if (country.id === 7) {
                return 2
            } else {
                return 0
            }
        }
    },
    mounted() {
        const host = window.location.host
        if (host.indexOf('qa') >= 0 || host.indexOf('dev') >= 0 || host.indexOf('localhost') >= 0) {
            this.tvguide_url = 'http://qa.upms.startimestv.com/wap/TVguide_list.php'
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
                height: 2.5rem;
            }
        }
    }
    .navigator {
        float: right;
        & > div {
            float: left;
            margin-left: 0.4rem;
            text-align: center;
            width: 2.4rem;
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
