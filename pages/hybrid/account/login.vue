<template>
    <div class="wrapper">
        <img class="st_logo" src="~assets/img/ic_upgrade_icon.png" />
        <img class="third_login facebook" src="~assets/img/users/btn_facebook_def.png" @click="byfacebook" />
        <img class="third_login twitter" src="~assets/img/users/btn_twitter_def.png" @click="bytwitter" />
        <img id="google-btn" class="third_login google" src="~assets/img/users/btn_google_def.png" />
        <nuxt-link to="/hybrid/account/signIn" replace>
            <div class="login_btn">{{$store.state.lang.login_btn}}</div>
        </nuxt-link>
        <div class="regtext">
            {{$store.state.lang.no_have_account}}
            <nuxt-link to="/hybrid/account/register" style="text-decoration:underline">{{$store.state.lang.register}}</nuxt-link>
        </div>
        <div class="service">
            {{$store.state.lang.firstpage_tips}}
            <a href="http://m.startimestv.com/copyright/copyright.html">{{$store.state.lang.firstpage_tips2}}</a>
            {{$store.state.lang.firstpage_tips3}}
            <a href="https://m.startimestv.com/privacyPolicy/privacyPolicy.html">{{$store.state.lang.firstpage_tips4}}</a>
        </div>
    </div>
</template>
<script>
import { login, initGoogleLogin } from '~/functions/utils'
export default {
    layout: 'base',
    data() {
        return {
            pre: this.$route.query.pre,
            twitter_oauth_token: this.$route.query.oauth_token,
            twitter_oauth_verifier: this.$route.query.oauth_verifier
        }
    },
    mounted() {
        if (this.pre) {
            sessionStorage.setItem('login_prefer', this.pre)
        }

        // twitter callback
        if (this.twitter_oauth_token && this.twitter_oauth_verifier) {
            this.$nextTick(() => this.$nuxt.$loading.start())
            this.$axios
                .get(`/hybrid/api/twitter/callback?oauth_token=${this.twitter_oauth_token}&oauth_verifier=${this.twitter_oauth_verifier}`)
                .then(res => {
                    if (res.data.code === 0) {
                        this.loginByThird(res.data.data.user_id, res.data.data.screen_name, 2)
                    } else {
                        this.$alert(res.data.message)
                    }
                })
        }

        const _this = this
        initGoogleLogin(document.getElementById('google-btn'), function(userId, nickname) {
            _this.loginByThird(userId, nickname, 3)
        })
    },
    methods: {
        byfacebook() {
            const _this = this
            // eslint-disable-next-line no-undef
            FB.login(function(res) {
                // eslint-disable-next-line no-undef
                FB.api('/me', function(response) {
                    _this.loginByThird(response.id, response.name, 1)
                })
            })
        },
        bytwitter() {
            this.$axios.get(`/hybrid/api/twitter/oauth/request_token?back=${location.origin}`).then(res => {
                if (res.data.code === 0) {
                    window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${res.data.data.oauth_token}`
                } else {
                    this.$alert(res.data.message)
                }
            })
        },
        loginByThird(userkey, nickname, type) {
            // http://gitlab.startimes.me/startimesapp/ums/blob/develop/ums-api/src/main/java/com/star/ums/api/model/LoginRequest.java
            login(this, {
                applicationId: 2,
                deviceId: this.$store.state.deviceId,
                type: type || 1, // 1:Facebook 2:Twitter 3:Google
                thirdPartyToken: 'THIRD#' + userkey,
                platform: 3, // WEB
                nickname: nickname || ''
            })
        }
    },
    head() {
        return {
            title: this.$store.state.lang.login_title
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    position: static;
    min-height: 100%;
    padding-top: 10%;
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

    .login_btn {
        width: 18rem;
        height: 2.3rem;
        line-height: 2.3rem;
        color: #0084e5;
        border: #0084e5 solid 1px;
        border-radius: 2px;
        margin: 0 auto;
        text-align: center;
        font-size: 0.9rem;
        font-weight: bold;
    }

    .regtext {
        text-align: center;
        font-size: 0.8rem;
        color: #424242;
        margin-top: 2.5rem;
    }

    .service {
        position: absolute;
        left: 0;
        bottom: 2rem;
        text-align: center;
        font-size: 0.8rem;
        color: #424242;
        margin: 0 10%;
    }
    .regtext,
    .service {
        a {
            color: #0084e5;
            text-decoration: underline;
        }
    }
}
</style>
