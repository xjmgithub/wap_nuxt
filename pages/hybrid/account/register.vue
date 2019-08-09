<template>
    <div class="wrapper">
        <div class="tab">
            <div :class="{seled:type==0}" @click="type=0">
                <img class="gray" src="~assets/img/users/ic_telephone_def_g.png" />
                <img class="blue" src="~assets/img/users/ic_telephone_sl_blue.png" />
                <span class="arrow"></span>
                <span class="gray">Phone number</span>
                <span class="blue">Phone number</span>
            </div>
            <div :class="{seled:type==1}" @click="type=1">
                <img class="gray" src="~assets/img/users/ic_email_def_gray.png" />
                <img class="blue" src="~assets/img/users/ic_email_sl_blue.png" />
                <span class="arrow"></span>
                <span class="gray">Email Address</span>
                <span class="blue">Email Address</span>
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
                        <input v-model="tel" type="tel" placeholder="Enter your Phone Number" @focus="focus_tel=true" @blur="focus_tel=false" />
                    </div>
                    <div v-show="error_tel" class="error" v-html="error_tel"></div>
                </div>
            </div>
            <div class="get-code">
                <password ref="telCode" class="code_num" :default-view="0" :length="4" @endinput="vertifyTelCode" @inputing="inputTelCode" />
                <getCodeBtn ref="telGetCodeBtn" class="get-code-btn" :disabled="!new RegExp(country.phoneRegex).test(tel)" @click="getTelCode" />
                <div class="error_code">{{error_tel_code}}</div>
            </div>
        </div>
        <div v-show="type==1" class="by_email">
            <div :class="{focus:focus_email,error:error_email}" class="input-email">
                <div class="number">
                    <input v-model="email" type="email" placeholder="Enter your email address" @focus="focus_email=true" @blur="focus_email=false" />
                    <div v-show="showAutoInput" class="auto-input">
                        <div @click="autoInput('gamil.com')">{{email}}gamil.com</div>
                        <div @click="autoInput('fotmail.com')">{{email}}fotmail.com</div>
                        <div @click="autoInput('yahoo.com')">{{email}}yahoo.com</div>
                    </div>
                </div>
                <div v-show="error_email" class="error" v-html="error_email"></div>
            </div>
            <div class="get-code">
                <password ref="emailCode" class="code_num" :default-view="0" :length="4" @endinput="vertifyEmailCode" @inputing="inputEmailCode" />
                <getCodeBtn
                    ref="emailGetCodeBtn"
                    class="get-code-btn"
                    :disabled="!new RegExp(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/).test(email)"
                    @click="getEmailCode"
                />
                <div class="error_code">{{error_email_code}}</div>
            </div>
        </div>
        <div style="width:80%;margin:0 auto;">
            <mButton :disabled="!canNext" :text="'NEXT'" @click="nextStep" />
        </div>
        <div class="terms">
            <a href="http://m.startimestv.com/copyright/copyright.html">Terms of Service</a>
        </div>
        <div v-show="countryDialogStatus" class="country-choose-dialog">
            <div class="dialog-title">Country List</div>
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
import password from '~/components/password'
import getCodeBtn from '~/components/form/getCodeBtn'
import shadowLayer from '~/components/shadow-layer'
import mButton from '~/components/button'
import countrys from '~/functions/countrys.json'
import qs from 'qs'
export default {
    layout: 'base',
    components: {
        password,
        getCodeBtn,
        shadowLayer,
        mButton
    },
    data() {
        return {
            type: 0,
            countrys: countrys,
            country: this.$store.state.country,
            countryDialogStatus: false,
            tel: '',
            email: '',
            focus_tel: false,
            focus_email: false,
            error_tel: '',
            error_email: '',
            error_tel_code: '',
            error_email_code: '',
            haveGetTelCode: false,
            haveGetEmailCode: false,
            haveTelcodeVertify: false,
            haveEmailCodeVertify: false,
            showAutoInput: false
        }
    },
    computed: {
        canNext() {
            if (this.type === 1) {
                return this.haveGetEmailCode && this.haveEmailCodeVertify
            } else {
                return this.haveGetTelCode && this.haveTelcodeVertify
            }
        }
    },
    watch: {
        tel(nv, ov) {
            this.haveGetTelCode = false
            this.error_tel = ''
        },
        email(nv, ov) {
            this.haveEmailCodeVertify = false
            this.error_email = ''
            const str = this.email.substr(this.email.length - 1, 1)
            if (this.email.length > 1 && str == '@') {
                this.showAutoInput = true
            } else {
                this.showAutoInput = false
            }
        },
        country(nv, ov) {
            this.tel = ''
        }
    },
    methods: {
        inputTelCode() {
            this.haveTelcodeVertify = false
            this.error_tel_code = ''
        },
        inputEmailCode() {
            this.haveEmailcodeVertify = false
            this.error_email_code = ''
        },
        getTelCode(callback) {
            this.$axios({
                url: `/ums/v2/register/code/sms?phone=${this.tel}&phoneCc=${this.country.phonePrefix}&index=1`,
                method: 'get'
            })
                .then(res => {
                    callback()
                    if (res.data.code === 0) {
                        this.haveGetTelCode = true
                    } else if (res.data.code === 2) {
                        this.error_tel =
                            'You are not a new user because you have registered once.<a href="/hybrid/account/signIn" style="color:#0087eb;text-decoration:underline"> Sign in</a>'
                    } else {
                        this.error_tel = 'This phone number you entered is incorrect. Please try again.'
                    }
                })
                .catch(() => {
                    callback()
                })
        },
        getEmailCode(callback) {
            this.$axios({
                url: `/ums/v1/register/code/email?email=${this.email}`,
                method: 'get'
            })
                .then(res => {
                    callback()
                    if (res.data.code === 0) {
                        this.haveGetTelCode = true
                    } else if (res.data.code === 2) {
                        this.error_tel =
                            'You are not a new user because you have registered once.<a href="/hybrid/account/signIn" style="color:#0087eb;text-decoration:underline"> Sign in</a>'
                    } else {
                        this.error_tel = 'This phone number you entered is incorrect. Please try again.'
                    }
                })
                .catch(() => {
                    callback()
                })
        },
        vertifyTelCode(val) {
            this.$axios({
                url: '/ums/v1/register/code/sms',
                method: 'post',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    token: this.$store.state.token
                },
                data: qs.stringify({
                    phoneCc: this.country.phonePrefix,
                    phone: this.tel,
                    code: val
                })
            })
                .then(res => {
                    if (res.data.code == 0) {
                        this.haveTelcodeVertify = true
                    } else {
                        this.error_tel_code = 'This code you entered is incorrect. Please try again.'
                    }
                })
                .catch(() => {
                    // console.log(验证失败)
                })
        },
        vertifyEmailCode(val) {
            this.$axios({
                url: '/ums/v1/register/code/verify',
                method: 'post',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    token: this.$store.state.token
                },
                data: qs.stringify({
                    email: this.email,
                    code: val
                })
            })
                .then(res => {
                    if (res.data.code == 0) {
                        this.haveEmailcodeVertify = true
                    } else {
                        this.error_email_code = 'This code you entered is incorrect. Please try again.'
                    }
                })
                .catch(() => {
                    // console.log(验证失败)
                })
        },
        autoInput(str) {
            this.email += str
            this.showAutoInput = false
        },
        chooseCountry(country) {
            this.country = country
            this.countryDialogStatus = false
        },
        nextStep() {
            if (this.type === 1) {
                const email = this.email
                const code = this.$ref.emailCode.password
                this.$router.push(`/hybrid/account/setpass?email=${email}&code=${code}`)
            } else {
                // TODO校验
                const phone = this.tel
                const code = this.$refs.telCode.password
                const phoneCc = this.country.phonePrefix
                this.$router.push(`/hybrid/account/setpass?phone=${phone}&phoneCc=${phoneCc}&code=${code}`)
            }
        }
    },
    head() {
        return {
            title: 'Register'
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    position: static;
    padding: 0 1.2rem;
    .tab {
        div {
            width: 50%;
            float: left;
            padding: 1.2rem 0.7rem;
            border-bottom: solid #dddddd 1px;
            position: relative;
            display: -webkit-box;
            display: flex;
            span {
                -webkit-box-flex: 5;
                flex: 5;
                width: 6.2rem;
                height: 1.4rem;
                padding-left: 4px;
                display: block;
                font-size: 14px;
                line-height: 1.4rem;
            }
            img {
                -webkit-box-flex: 1;
                flex: 1;
                width: 1rem;
                display: block;
            }
            .arrow {
                width: 24px;
                height: 0;
                position: absolute;
                bottom: -2px;
                display: block;
                margin: 0 auto;
                left: 0;
                right: 0;
                border-bottom: 3px solid #0087eb;
                display: none;
            }
            .blue {
                display: none;
                color: #0087eb;
            }
            .gray {
                display: block;
                color: #999;
            }
        }
        .seled {
            .gray {
                display: none;
            }
            .blue,
            .arrow {
                display: block;
            }
        }
        &:after {
            content: '0';
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;
        }
    }
    .by_tel,
    .by_email {
        height: 15rem;
        .input-email {
            padding-top: 2.5rem;
            width: 100%;
            border-bottom: #dddddd solid 1px;
            padding-bottom: 5px;
            margin: 1rem 0 2rem;
            position: relative;
            &.focus {
                border-bottom: #0087eb solid 1px;
            }
            &.error {
                border-bottom: red solid 1px;
            }
            &:after {
                content: '0';
                display: block;
                height: 0;
                clear: both;
                visibility: hidden;
            }
            .number {
                width: 100%;
                position: relative;
                input {
                    width: 100%;
                    border: none;
                    display: block;
                    outline: none;
                    padding-left: 0.4rem;
                    &::-webkit-input-placeholder {
                        font-size: 0.9rem;
                    }
                }
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
            .error {
                height: 1rem;
                position: absolute;
                bottom: -1.5rem;
                font-size: 0.8rem;
                color: red;
            }
        }
        .get-code {
            margin-top: 2.5rem;
        }
    }
    .by_tel {
        .phone_number {
            display: -webkit-box;
            display: flex;
            margin-bottom: 2.4rem;
            .country_choose {
                -webkit-box-flex: 1;
                flex: 1;
                img {
                    width: 1.5rem;
                    height: 1.5rem;
                    margin-top: 3.3rem;
                }
                .country_icon {
                    margin-right: 0.2rem;
                }
            }
            .input-tel {
                -webkit-box-flex: 4;
                flex: 4;
                align-content: flex-end;
                padding-bottom: 5px;
                margin-top: 3.3rem;
                border-bottom: #dddddd solid 1px;
                position: relative;
                &.focus {
                    border-bottom: #0087eb solid 1px;
                }
                &.error {
                    border-bottom: red solid 1px;
                }
                &:after {
                    content: '0';
                    display: block;
                    height: 0;
                    clear: both;
                    visibility: hidden;
                }
                .prefix {
                    position: absolute;
                    top: 0.3rem;
                    left: 0;
                    font-size: 14px;
                }
                .number {
                    margin-left: 2.3rem;
                    input {
                        width: 100%;
                        border: none;
                        display: block;
                        padding: 0 0.5rem;
                        height: 1.5rem;
                        line-height: 1.5rem;
                        outline: none;
                        color: #333333;
                        &::-webkit-input-placeholder {
                            font-size: 0.9rem;
                        }
                    }
                }
                .error {
                    height: 1rem;
                    position: absolute;
                    bottom: -1.5rem;
                    font-size: 0.8rem;
                    color: red;
                }
            }
        }
    }
    .terms {
        font-size: 0.5rem;
        text-align: center;
        line-height: 2rem;
        a {
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
.get-code {
    display: flex;
    position: relative;
    .code_num {
        flex: 2;
        margin-right: 10px;
    }
    .get-code-btn {
        flex: 1;
    }
    .error_code {
        position: absolute;
        bottom: -1rem;
        font-size: 0.8rem;
        color: red;
    }
}
.input-email {
    padding-top: 1rem;
    width: 100%;
    border-bottom: #dddddd solid 1px;
    padding-bottom: 5px;
    margin: 1rem 0 2rem;
    position: relative;
    &.focus {
        border-bottom: #0087eb solid 1px;
    }
    &.error {
        border-bottom: red solid 1px;
    }
    &:after {
        content: '0';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    .number {
        width: 100%;
        position: relative;
        input {
            width: 100%;
            border: none;
            display: block;
            outline: none;
            padding-left: 0.4rem;
            &::-webkit-input-placeholder {
                font-size: 0.9rem;
            }
        }
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
    .error {
        height: 1rem;
        position: absolute;
        bottom: -1.5rem;
        font-size: 0.8rem;
        color: red;
    }
}
</style>
