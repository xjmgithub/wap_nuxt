<template>
    <div id="wrapper">
        <img class="st_logo" src="~/assets/img/logo01.png" />
        <img class="third_login facebook" @click="byfacebook" src="~/assets/img/users/btn_facebook_def.png" />
        <img class="third_login twitter" @click="bytwitter" src="~/assets/img/users/btn_twitter_def.png" />
        <img id="google-btn" class="third_login google" src="~/assets/img/users/btn_google_def.png" />
        <nuxt-link :to="pre?('/c/account/signin?pre='+ pre):'/c/account/signin'"><div class="login_btn"> SIGN IN </div></nuxt-link>
        <div class="regtext">
            Don't have an account?
            <nuxt-link to="/c/account/register">Register</nuxt-link>
        </div>
    </div>
</template>
<script>
import { setCookie } from '~/functions/utils'
export default {
    layout: 'base',
    data() {
        return {
            pre: this.$route.query.pre
        }
    },
    mounted() {
        let _this = this
        // twitter登录
        hello.init(
            {
                twitter: 'ECicswlypoOTdXm0NuWmzCZQe'
            },
            {
                oauth_proxy: 'https://auth-server.herokuapp.com/proxy'
            }
        )
        // facebooke登录初始化
        FB.init({
            appId: '159785064477978',
            xfbml: true,
            version: 'v3.0'
        })

        var googleUser = {}
        gapi.load('auth2', function() {
            var auth2 = gapi.auth2.init({
                client_id:
                    '152211292692-l849uvbt5jfmghi40e05o2jhuf8n3epj.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin'
            })
            auth2.attachClickHandler(
                document.getElementById('google-btn'),
                {},
                function(googleUser) {
                    _this.loginByThird(googleUser.getBasicProfile().getId())
                    // console.log('ID: ' + profile.getId()) // Do not send to your backend! Use an ID token instead.
                    // console.log('Name: ' + profile.getName())
                    // console.log('Image URL: ' + profile.getImageUrl())
                    // console.log('Email: ' + profile.getEmail()) // This is null if the 'email' scope is not present.
                },
                function(error) {
                    console.log(JSON.stringify(error, undefined, 2))
                }
            )
        })
    },
    methods: {
        byfacebook() {
            let _this = this
            FB.login(function(res) {
                _this.loginByThird(res.authResponse.userID)
            })
        },
        bytwitter() {
            hello.login(
                'twitter',
                {
                    response_type: 'code'
                },
                function(res) {
                    _this.loginByThird(res.authResponse.user_id)
                }
            )
        },
        loginByThird(userkey) {
            var _this = this
            this.$axios.setHeader('token', this.$store.state.token)
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
                        setCookie('userId', res.data.data.userId)
                        setCookie('token', res.data.data.token)
                        setCookie('countryId', res.data.data.countryId)
                        setCookie('country', res.data.data.country)
                        this.$store.commit('SET_TOKEN', res.data.data.token)
                        this.$store.commit('SET_COUNTRY', {
                            id: res.data.data.countryId,
                            short: res.data.data.country
                        })

                        if (this.pre) {
                            this.$router.push(encodeURIComponent(this.pre))
                        } else {
                            this.$router.push('/c/payment/wallet/payto')
                        }
                    } else {
                        _this.$alert(res.datea.message)
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
#wrapper {
    font-family: 'Roboto';

    img {
        display: block;
        height: 2.3rem;
        width: 18rem;
        margin: 0 auto;
        margin-top: 1.2rem;
        margin-bottom: 1.2rem;
    }

    .st_logo {
        height: 2.5rem;
        width: 10rem;
        margin-bottom: 3.5rem;
        margin-top: 6rem;
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
    }

    .regtext {
        text-align: center;
        font-size: 0.8rem;
        color: #424242;
        margin-top: 2.5rem;
    }
}
</style>