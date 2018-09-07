<template>
    <div id="wrapper">
        <img class="st_logo" src="~/assets/img/logo01.png" />
        <img class="third_login facebook" @click="byfacebook" src="~/assets/img/users/btn_facebook_def.png" />
        <img class="third_login twitter" @click="bytwitter" src="~/assets/img/users/btn_twitter_def.png" />
        <img class="third_login google g-signin2"  src="~/assets/img/users/btn_google_def.png" />
        <div class="login_btn"> SIGN IN </div>
        <div class="regtext">
            Don't have an account?
            <a href="/register">Register</a>
        </div>
    </div>
</template>
<script>
    export default {
        layout: 'base',
        mounted() {
            hello.init({
                twitter: 'ECicswlypoOTdXm0NuWmzCZQe',
            }, {
                    oauth_proxy: 'https://auth-server.herokuapp.com/proxy'
                })
            FB.init({
                appId: '159785064477978',
                xfbml: true,
                version: 'v3.0'
            })
        },
        methods: {
            byfacebook() {
                let _this = this
                FB.login(function (res) {
                    _this.loginByThird(res.authResponse.userID)
                })
            },
            bytwitter() {
                hello.login('twitter', {
                    response_type: 'code'
                }, function (res) {
                    _this.loginByThird(res.authResponse.user_id)
                })
            },
            bygoogle() {
                var profile = googleUser.getBasicProfile();
                console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
            },
            loginByThird(userkey) {
                var _this = this
                this.$axios.setHeader('token', this.$store.state.token)
                this.$axios.post('/ums/v1/user/login', {
                    "applicationId": 2,
                    "deviceId": this.$store.state.deviceId,
                    "timeZoneId": "Asia/Shanghai",
                    "type": 1,
                    "thirdPartyToken": 'THIRD#' + userkey
                })
                    .then(res => {
                        if (res.data.code == 0) {
                            //TODO 登录成功
                        } else {
                            // _this.$toast('mesth')
                            // TODO components toast
                        }

                        let user = res.data
                        this.userHead = user.head || '~/assets/img/faq/1-02.png'
                        this.userName = user.nickName
                        this.userId = user.head
                        this.loginStatus = user.type
                    })
            }
        },
        head() {
            return {
                title: 'Login',
                meta: [
                    { name: 'format-detection', content: 'email=no' },
                    { name: 'format-detection', content: 'telephone=no' },
                    { name: 'google-signin-client_id', content: '152211292692-l849uvbt5jfmghi40e05o2jhuf8n3epj.apps.googleusercontent.com' }
                ],
                script: [
                    {
                        src: 'https://cdnjs.cloudflare.com/ajax/libs/hellojs/1.17.1/hello.all.min.js'
                    },
                    {
                        src: 'https://connect.facebook.net/en_US/sdk.js'
                    },
                    {
                        src: 'https://apis.google.com/js/platform.js'
                    }
                ]
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
            color: #0084E5;
            border: #0084E5 solid 1px;
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