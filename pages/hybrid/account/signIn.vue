<template>
    <div class="wrapper">
        <div class="logo">
            <img src="~assets/img/ic_upgrade_icon.png" />
        </div>
        <div class="tab">
            <div v-show="type==1">
                <img class="gray" src="~assets/img/users/ic_telephone_def_g.svg" />
                <a href="javascript:void(0)" class="sign-way" @click="changetype(0)">{{$store.state.lang.signin_switch_phone}}</a>
            </div>
            <div v-show="type==0">
                <img class="gray" src="~assets/img/users/ic_email_def_gray.svg" />
                <a href="javascript:void(0)" class="sign-way" @click="changetype(1)">{{$store.state.lang.signin_switch_email}}</a>
            </div>
        </div>
        <div v-show="type==0" class="by_tel">
            <div class="phone_number">
                <div class="country_choose" @click="countryDialogStatus=true">
                    <img class="country_icon" :src="cdnPicSrc(country.nationalFlag)" />
                    <img class="ic_categary" src="~assets/img/users/ic_categary.png" />
                </div>
                <div :class="{focus:focus_tel,error:error_tel}" class="input-tel">
                    <div class="prefix">+{{country.phonePrefix}}</div>
                    <div class="number">
                        <input v-model="phoneNum" type="tel" :placeholder="focus_tel?'':account_phone" @focus="telFocus" @blur="telBlur" />
                    </div>
                    <div v-show="focus_tel&&!error_tel" class="focus">{{account_phone}}</div>
                    <div v-show="error_tel" class="focus-error">{{account_phone}}</div>
                    <div v-show="error_tel" class="error" v-html="error_tel"></div>
                </div>
            </div>

        </div>
        <div v-show="type==1" class="by_email">
            <div :class="{focus:focus_email,error:error_email}" class="input-email">
                <div class="number">
                    <input v-model="email" type="email" :placeholder="focus_email?'':account_email" @focus="emailFocus" @blur="emailBlur" />
                    <div v-show="showAutoInput" class="auto-input">
                        <div @click="autoInput('gmail')">{{email}}gmail.com</div>
                        <div @click="autoInput('yahoo')">{{email}}yahoo.com</div>
                        <div @click="autoInput('hotmail')">{{email}}hotmail.com</div>
                    </div>
                </div>
                <div v-show="focus_email&&!error_email" class="focus">{{account_email}}</div>
                <div v-show="error_email" class="focus-error">{{account_email}}</div>
                <div v-show="error_email" class="error" v-html="error_email"></div>
            </div>

        </div>
        <div :class="{focus:focus_pass,error:error_pass}" class="password-box">
            <div class="label">
                <img v-if="isCiphertext==1" class="open-close" src="~assets/img/ic_hide_def_g.png" alt @click="isCiphertext=2" />
                <img v-if="isCiphertext==2" class="open-close" src="~assets/img/ic_show_def_g.png" alt @click="isCiphertext=1" />
            </div>
            <input v-model="password" :type="pwdType" :placeholder="focus_pass?'':Password" @focus="passFocus" @blur="passBlur" />
            <div v-show="focus_pass" class="focus">{{Password}}</div>
            <div v-show="error_pass" class="focus-error">{{Password}}</div>
            <div v-show="error_pass" class="error" v-html="error_pass"></div>
        </div>
        <div class="footer">
            <mButton :disabled="!canNext" :text="signin" @click="login" />
        </div>
        <div class="forgot-pwd" @click="forgotPwd">
            <nuxt-link v-show="type==0" to="/hybrid/account/resetTelPass">{{$store.state.lang.forget_password}}</nuxt-link>
            <nuxt-link v-show="type==1" to="/hybrid/account/resetEmailPass">{{$store.state.lang.forget_password}}</nuxt-link>
        </div>
        <div class="regtext" @click="regtext">
            <nuxt-link to="/hybrid/account/register">{{$store.state.lang.register_text}}</nuxt-link>
        </div>
        <div v-show="countryDialogStatus" class="country-choose-dialog">
            <div class="dialog-title">{{$store.state.lang.all}}</div>
            <ul>
                <li v-for="(item,index) in countrys" :key="index" @click="chooseCountry(item)">
                    <img :src="cdnPicSrc(item.nationalFlag)" />
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
        <shadowLayer v-show="countryDialogStatus" @click="countryDialogStatus=false" />
    </div>
</template>
<script>
import shadowLayer from '~/components/shadow-layer'
import { setCookie } from '~/functions/utils'
import countrArr from '~/functions/countrys.json'
import mButton from '~/components/button'
import { Base64 } from 'js-base64'
export default {
    layout: 'base',
    components: {
        shadowLayer,
        mButton
    },
    data() {
        return {
            type: 0, // 0 tel 1 email
            country: this.$store.state.country,
            countryDialogStatus: false,
            phoneNum: '',
            password: '',
            email: '',
            countrys: countrArr,
            pre: this.$route.query.pre,
            account_phone: this.$store.state.lang.account_phone,
            account_email: this.$store.state.lang.account_email,
            Password: this.$store.state.lang.Password,
            focus_tel: false,
            focus_email: false,
            focus_pass: false,
            error_tel: '',
            error_email: '',
            error_pass: '',
            showAutoInput: false,
            isCiphertext: 1,
            haveConfirmTel: false,
            haveConfirmTelPass: false,
            haveConfirmEmail: false,
            haveConfirmEmailPass: false,
            signin: this.$store.state.lang.sign_in
        }
    },
    computed: {
        pwdType() {
            return this.isCiphertext === 1 ? 'password' : 'text'
        },
        canNext() {
            if (this.type === 0) {
                return this.haveConfirmTel && this.haveConfirmTelPass
            } else {
                return this.haveConfirmEmail && this.haveConfirmEmailPass
            }
        }
    },
    watch: {
        country(nv, ov) {
            this.phoneNum = ''
        },
        phoneNum(nv, ov) {
            this.haveConfirmTel = false
            this.error_tel = ''
        },
        email(nv, ov) {
            this.haveConfirmEmail = false
            this.error_email = ''
            const str = this.email.substr(this.email.length - 1, 1)
            if (this.email.length > 1 && str == '@') {
                this.showAutoInput = true
            } else {
                this.showAutoInput = false
            }
        },
        password(nv, ov) {
            this.haveConfirmTelPass = false
            this.haveConfirmEmailPass = false
            this.error_pass = ''
            if (nv) {
                this.haveConfirmTelPass = true
                this.haveConfirmEmailPass = true
            }
        }
    },
    mounted() {
        const tmp = this.pre
        if (this.pre && btoa(atob(tmp)) == tmp) {
            sessionStorage.setItem('login_prefer', Base64.decode(this.pre))
            sessionStorage.setItem('register_prefer', Base64.decode(this.pre))
        } else if (this.pre) {
            sessionStorage.setItem('login_prefer', this.pre)
            sessionStorage.setItem('register_prefer', this.pre)
        }
        this.sendEvLog({
            category: 'login_page',
            action: 'page_show',
            label: 1,
            value: 1
        })
    },
    methods: {
        telFocus() {
            this.focus_tel = true
        },
        emailFocus() {
            this.focus_email = true
        },
        passFocus() {
            if (this.error_pass && this.password.length >= 6 && this.password.length <= 18) {
                this.password = ''
            }
            this.focus_pass = true
            this.error_pass = ''
        },
        telBlur() {
            this.focus_tel = false
            if (this.phoneNum != 0 && !new RegExp(this.country.phoneRegex).test(this.phoneNum)) {
                this.error_tel = this.$store.state.lang.confirm_number
            } else if (this.phoneNum != 0) {
                this.$axios({
                    url: `/ums/v1/user/check/username?phoneCc=${this.country.phonePrefix}&phone=${this.phoneNum}&type=10`,
                    method: 'get'
                })
                    .then(res => {
                        if (res.data.code === 1) {
                            // 号码未注册
                            this.error_tel =
                                this.$store.state.lang.signin_notexist +
                                ' <a href="/hybrid/account/register" style="color:#0087eb;text-decoration:underline">' +
                                this.$store.state.lang.register +
                                '</a>'
                        } else if (res.data.code === 0) {
                            // 已注册号码，格式正确
                            this.error_tel = ''
                            this.haveConfirmTel = true
                        }
                    })
                    .catch(() => {})
            }
        },
        emailBlur() {
            this.focus_email = false
            if (this.email != 0 && !new RegExp(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/).test(this.email)) {
                this.error_email = this.$store.state.lang.mailbox_not_correct_format
            } else if (this.email != 0) {
                this.$axios({
                    url: `/ums/v1/user/check/username?email=${this.email}&type=0`,
                    method: 'get'
                })
                    .then(res => {
                        if (res.data.code === 1) {
                            // 号码未注册
                            this.error_email =
                                this.$store.state.lang.signin_notexist +
                                ' <a href="/hybrid/account/register" style="color:#0087eb;text-decoration:underline">' +
                                this.$store.state.lang.register +
                                '</a>'
                        } else if (res.data.code === 0) {
                            // 已注册号码，格式正确
                            this.error_email = ''
                            this.haveConfirmEmail = true
                        }
                    })
                    .catch(() => {})
            }
        },
        passBlur() {
            this.focus_pass = false
        },
        autoInput(str) {
            this.email += str + '.com'
            this.showAutoInput = false
            const inputEmail = document.getElementsByClassName('input-email')[0].getElementsByTagName('input')[0]
            inputEmail.focus()
        },
        changetype(type) {
            this.type = type
            this.password = ''
        },
        chooseCountry(country) {
            this.country = country
            this.countryDialogStatus = false
        },
        login() {
            this.sendEvLog({
                category: 'login_page',
                action: 'signin_click',
                label: 1,
                value: 1
            })
            if (this.password.length < 6) {
                this.error_pass = this.$store.state.lang.password_cannot_less_letters
            } else if (this.password.length > 18) {
                this.error_pass = this.$store.state.lang.password_cannoe_greater
            } else {
                let params = {}
                if (this.type === 1) {
                    params = {
                        applicationId: 2,
                        deviceId: this.$store.state.deviceId,
                        type: 0,
                        email: this.email,
                        pwd: this.password
                    }
                } else {
                    const tel = this.phoneNum.length > 10 ? this.phoneNum.substr(3) : this.phoneNum
                    params = {
                        applicationId: 2,
                        phoneCc: this.country.phonePrefix,
                        phone: tel,
                        pwd: this.password,
                        deviceId: this.$store.state.deviceId,
                        type: 10
                    }
                }
                this.$axios.post('/ums/v3/user/login', params).then(res => {
                    if (res.data.code == 2) {
                        this.error_pass = this.$store.state.lang.password_is_incorrect
                    } else {
                        const token = res.data.data.token
                        this.$axios
                            .get('/cms/users/me', {
                                headers: {
                                    token: token
                                }
                            })
                            .then(res => {
                                res.status !== 200 && this.$alert(res.data.message)
                                const user = res.data
                                this.$store.commit('SET_TOKEN', token)
                                this.$store.commit('SET_USER', user)

                                setCookie('token', token)
                                localStorage.setItem('user', JSON.stringify(user))
                                const pre = sessionStorage.getItem('login_prefer') || ''
                                if (pre) {
                                    window.location.href = pre
                                } else {
                                    this.$router.replace('/browser')
                                }
                            })
                            .catch(() => {
                                this.$alert(this.$store.state.lang.get_userinfo_error)
                            })
                    }
                })
            }
        },
        forgotPwd() {
            this.sendEvLog({
                category: 'login_page',
                action: 'forget_pass_click',
                label: 1,
                value: 1
            })
        },
        regtext() {
            this.sendEvLog({
                category: 'login_page',
                action: 'register_click',
                label: 1,
                value: 1
            })
        }
    },
    head() {
        return {
            title: this.$store.state.lang.sign_in
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    padding: 1rem;
    .logo {
        width: 100%;
        text-align: center;
        margin: 2rem auto;
        img {
            width: 50%;
        }
    }
    .tab {
        div {
            padding-top: 1rem;
            text-align: right;
            img {
                height: 1.3rem;
                width: 1.3rem;
                margin-right: 0.5rem;
                margin-top: -0.3rem;
            }
            .sign-way {
                color: #0087eb;
                font-size: 0.9rem;
                text-decoration: underline;
            }
        }
    }
    .by_tel,
    .by_email {
        padding-top: 1.5rem;
        position: relative;
    }
    .regtext {
        text-align: center;
        font-size: 0.8rem;
        color: #424242;
        width: 100%;
        a {
            color: #0087eb;
            text-decoration: underline;
        }
    }
    .by_tel {
        .phone_number {
            display: -webkit-box;
            display: flex;
            margin-bottom: 3.5rem;
            .country_choose {
                -webkit-box-flex: 1;
                flex: 1;
                img {
                    width: 1.5rem;
                    height: 1.5rem;
                }
                .country_icon {
                    margin-right: 0.2rem;
                }
            }
            .input-tel {
                -webkit-box-flex: 4;
                flex: 4;
                align-content: flex-end;
                position: relative;
                &.focus {
                    border-bottom: #0087eb solid 1px;
                }
                &.error {
                    border-bottom: red solid 1px;
                }
                .prefix {
                    position: absolute;
                    top: 0.3rem;
                    left: 0;
                    font-size: 14px;
                }
                .number {
                    margin-left: 2.3rem;
                }
            }
        }
    }
    .by_email {
        .input-email {
            width: 100%;
            margin-bottom: 3.5rem;
            position: relative;
            &.focus {
                border-bottom: #0087eb solid 1px;
            }
            &.error {
                border-bottom: red solid 1px;
            }
            .number {
                width: 100%;
                .auto-input {
                    width: 100%;
                    position: absolute;
                    top: 1.6rem;
                    left: 0;
                    border: 1px solid #dddddd;
                    background-color: #ffffff;
                    z-index: 10;
                    div {
                        width: 100%;
                        height: 3rem;
                        line-height: 3rem;
                        border-bottom: 1px solid #dddddd;
                        &.yahoo {
                            border: 0;
                        }
                        color: #999999;
                        padding-left: 0.4rem;
                        font-size: 0.9rem;
                    }
                }
            }
        }
    }
    .password-box {
        display: -webkit-box;
        display: flex;
        margin-bottom: 3.5rem;
        position: relative;
        &.focus {
            border-bottom: #0087eb solid 1px;
        }
        &.error {
            border-bottom: red solid 1px;
        }
        input {
            -webkit-box-flex: 1;
            flex: 1;
            padding-left: 0.4rem;
            padding-bottom: 5px;
        }
        .label {
            .open-close {
                width: 1.5rem;
                height: 1.5rem;
                position: absolute;
                top: -0.1rem;
                right: 0;
            }
        }
    }
    .input-tel,
    .input-email,
    .password-box {
        padding-bottom: 0.2rem;
        border-bottom: #dddddd solid 1px;
        input {
            width: 100%;
            border: none;
            display: block;
            padding: 0 0.5rem;
            height: 1.5rem;
            line-height: 1.5rem;
            outline: none;
            color: #333333;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            &::-webkit-input-placeholder {
                font-size: 0.9rem;
            }
        }
        .focus,
        .focus-error,
        .error {
            height: 1rem;
            position: absolute;
            left: 0;
            font-size: 0.8rem;
        }
        .focus {
            bottom: 1.8rem;
            color: #0087eb;
        }
        .focus-error {
            bottom: 1.8rem;
            color: red;
        }
        .error {
            bottom: -1.4rem;
            color: red;
        }
    }
    .forgot-pwd {
        text-align: center;
        width: 100%;
        margin-top: 1rem;
        margin-bottom: 2rem;
        a {
            color: #0087eb;
            font-size: 0.8rem;
            text-decoration: underline;
        }
    }
    .footer {
        width: 80%;
        margin: 0 auto;
    }
    .register {
        text-align: left;
        margin: 1rem auto 2rem 10%;
        a {
            color: #0087eb;
            font-size: 0.8rem;
            text-decoration: underline;
        }
    }
    .country-choose-dialog {
        width: 18rem;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1000;
        height: 25rem;
        margin-top: -12.5rem;
        margin-left: -9rem;
        background: white;
        padding: 1rem;
        .dialog-title {
            height: 2rem;
        }
        ul {
            display: block;
            height: 21rem;
            overflow: auto;
            li {
                display: block;
                width: 8rem;
                float: left;
                height: 2.5rem;
                line-height: 2.5rem;
                img {
                    width: 1.3rem;
                    height: 1.3rem;
                    margin-top: 0.6rem;
                    margin-right: 0.3rem;
                    float: left;
                }
                span {
                    width: 6.4rem;
                    overflow: hidden;
                    height: 2.5rem;
                    display: block;
                    float: left;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 0.8rem;
                }
            }
        }
    }
}
</style>

