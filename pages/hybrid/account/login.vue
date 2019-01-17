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
    </div>
</template>
<script>
import { setCookie, initUser } from '~/functions/utils'
export default {
    layout: 'base',
    data() {
        return {
            pre: this.$route.query.pre
        }
    },
    mounted() {
        if (this.pre) {
            localStorage.setItem('login_prefer', this.pre)
        }

        var googleUser = {}
        let _this = this
        var script = document.createElement('script')
        script.src = 'https://apis.google.com/js/platform.js'

        script.onload = function() {
            gapi.load('auth2', function() {
                var auth2 = gapi.auth2.init({
                    client_id: '461626275431-sngbv2nv2bmecefaiu01r67cu1n88rja.apps.googleusercontent.com',
                    cookiepolicy: 'single_host_origin'
                })
                auth2.attachClickHandler(
                    document.getElementById('google-btn'),
                    {},
                    function(googleUser) {
                        _this.loginByThird(googleUser.getBasicProfile().getId())
                    },
                    function(error) {
                        console.log(JSON.stringify(error, undefined, 2))
                    }
                )
            })
        }
        document.getElementsByTagName('head')[0].appendChild(script)

        // facebook登录初始化
        FB.init({
            appId: '159785064477978', // 和app公用
            xfbml: true,
            cookie: true,
            version: 'v3.1'
        })
    },
    methods: {
        byfacebook() {
            let _this = this
            FB.getLoginStatus(function(response) {
                if (response.status == 'connected') {
                    _this.loginByThird(response.authResponse.userID)
                } else {
                    FB.login(function(res) {
                        _this.loginByThird(res.authResponse.userID)
                    })
                }
            })
        },
        bytwitter() {
            this.$axios.get('/hybrid/api/twitter/oauth/request_token').then(res => {
                if (res.data.code == 0) {
                    window.location.href=`https://api.twitter.com/oauth/authenticate?oauth_token=${res.data.data.oauth_token}`
                }else{
                    // LOGIN ERROR
                }
            })
        },
        loginByThird(userkey) {
            this.$axios
                .post('/ums/v1/user/login', {
                    applicationId: 2,
                    deviceId: this.$store.state.deviceId,
                    timeZoneId: 'Asia/Shanghai',
                    type: 1,
                    thirdPartyToken: 'THIRD#' + userkey
                })
                .then(res => {
                    if (res.data.code == 0) {
                        initUser(res.data.data.token, res.data.data.userId, res.data.data)
                        if (this.pre) {
                            window.location.href = this.pre
                        } else {
                            window.location.href = '/hybrid/payment/wallet/payto'
                        }
                    } else {
                        this.$alert(res.datea.message)
                    }
                })
        }
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
        margin-top: 4.5rem;
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
}
</style>
