<template>
    <div class="wrapper">
        <img class="st_logo" src="~assets/img/logo01.png">
        <img class="third_login facebook" @click="byfacebook" src="~assets/img/users/btn_facebook_def.png">
        <img class="third_login twitter" @click="bytwitter" src="~assets/img/users/btn_twitter_def.png">
        <img id="google-btn" class="third_login google" src="~assets/img/users/btn_google_def.png">
        <nuxt-link to="/hybrid/account/signin">
            <div class="login_btn">SIGN IN</div>
        </nuxt-link>
        <div class="regtext">Don't have an account?
            <nuxt-link to="/hybrid/account/register" style="text-decoration:underline">Register</nuxt-link>
        </div>
        <div class="loading-layer" v-show="loadStatus">
            <loading/>
        </div>
    </div>
</template>
<script>
import { setCookie, initUser, initGoogleLogin, initFacebookLogin } from '~/functions/utils'
import loading from '~/components/loading'
export default {
    layout: 'base',
    data() {
        return {
            pre: this.$route.query.pre,
            twitter_oauth_token: this.$route.query.oauth_token,
            twitter_oauth_verifier: this.$route.query.oauth_verifier,
            loadStatus: false
        }
    },
    mounted() {
        if (this.pre) {
            sessionStorage.setItem('login_prefer', this.pre)
        }

        // twitter callback
        if (this.twitter_oauth_token && this.twitter_oauth_verifier) {
            this.loadStatus = true
            this.$axios
                .get(`/hybrid/api/twitter/callback?oauth_token=${this.twitter_oauth_token}&oauth_verifier=${this.twitter_oauth_verifier}`)
                .then(res => {
                    if (res.data.code == 0) {
                        this.loginByThird(res.data.data.user_id, res.data.data.screen_name, 2)
                    } else {
                        this.$alert(res.data.message)
                    }
                })
        }

        let _this = this
        initGoogleLogin(document.getElementById('google-btn'), function(userId, nickname) {
            _this.loginByThird(userId, nickname, 3)
        })

        initFacebookLogin()
    },
    methods: {
        byfacebook() {
            let _this = this
            FB.login(function(res) {
                FB.api('/me', function(response) {
                    _this.loginByThird(response.id, response.name, 1)
                })
            })
        },
        bytwitter() {
            this.$axios.get(`/hybrid/api/twitter/oauth/request_token?back=${location.origin}`).then(res => {
                if (res.data.code == 0) {
                    window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${res.data.data.oauth_token}`
                } else {
                    this.$alert(res.data.message)
                }
            })
        },
        loginByThird(userkey, nickname, type) {
            // http://gitlab.startimes.me/startimesapp/ums/blob/develop/ums-api/src/main/java/com/star/ums/api/model/LoginRequest.java
            this.$axios
                .post('/ums/v3/user/login', {
                    applicationId: 2,
                    deviceId: this.$store.state.deviceId,
                    type: type || 1, // 1:Facebook 2:Twitter 3:Google
                    thirdPartyToken: 'THIRD#' + userkey,
                    platform: 3, // WEB
                    nickname: nickname || ''
                })
                .then(res => {
                    if (res.data.code == 0) {
                        initUser(res.data.data.token, res.data.data.userId, res.data.data)
                        let pre = sessionStorage.getItem('login_prefer') || ''
                        if (pre) {
                            window.location.href = pre
                        } else {
                            window.location.href = '/browser/'
                        }
                    } else {
                        this.$alert(res.datea.message)
                    }
                })
        }
    },
    components: {
        loading: loading
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
    .loading-layer {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        position: fixed;
        top: 0;
    }
}
</style>
