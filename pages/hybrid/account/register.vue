<template>
    <div class="wrapper">
        <div class="tab">
            <div :class="{seled:type==0}" @click="changeType(0)">
                <img class="gray" src="~assets/img/users/ic_telephone_def_g.png" />
                <img class="blue" src="~assets/img/users/ic_telephone_sl_blue.png" />
                <span class="arrow"></span>
                <span class="gray">{{$store.state.lang.phone_number}}</span>
                <span class="blue">{{$store.state.lang.phone_number}}</span>
            </div>
            <div :class="{seled:type==1}" @click="changeType(1)">
                <img class="gray" src="~assets/img/users/ic_email_def_gray.png" />
                <img class="blue" src="~assets/img/users/ic_email_sl_blue.png" />
                <span class="arrow"></span>
                <span class="gray">{{$store.state.lang.email_addr}}</span>
                <span class="blue">{{$store.state.lang.email_addr}}</span>
            </div>
        </div>
        <div v-show="type==0" class="by_tel">
            <div class="phone_number">
                <div class="country_choose" @click="showChooseCountry">
                    <img class="country_icon" :src="cdnPicSrc(country.nationalFlag)" />
                    <img class="ic_categary" src="~assets/img/users/ic_categary.png" />
                </div>
                <div :class="{focus:focus_tel,error:error_tel}" class="input-tel">
                    <div class="prefix">+{{country.phonePrefix}}</div>
                    <div class="number">
                        <input v-model="tel" type="tel" :placeholder="$store.state.lang.enter_your_phone_number" @focus="focusTel" @blur="focus_tel=false" />
                    </div>
                    <div v-show="error_tel" class="error" v-html="error_tel" @click="clear" />
                </div>
            </div>
            <div class="get-code">
                <password ref="telCode" :class="{error:error_line_tel}" class="code_num" :default-view="0" :length="4" @endinput="vertifyTelCode" @inputing="inputTelCode" />
                <getCodeBtn ref="telGetCodeBtn" class="get-code-btn" :disabled="!new RegExp(country.phoneRegex).test(tel)" @click="getTelCode" />
                <div class="error_code">{{error_tel_code}}</div>
            </div>
        </div>
        <div v-show="type==1" class="by_email">
            <div :class="{focus:focus_email,error:error_email}" class="input-email">
                <div class="number">
                    <input v-model="email" type="email" :placeholder="$store.state.lang.enter_your_email_addr" @focus="focusEmail" @blur="focus_email=false" />
                    <div v-show="showAutoInput" class="auto-input">
                        <div @click="autoInput('gmail')">{{email}}gmail.com</div>
                        <div @click="autoInput('yahoo')">{{email}}yahoo.com</div>
                        <div @click="autoInput('hotmail')">{{email}}hotmail.com</div>
                    </div>
                </div>
                <div v-show="error_email" class="error" v-html="error_email" @click="clear" />
            </div>
            <div class="get-code">
                <password ref="emailCode" :class="{error:error_line_email}" class="code_num" :default-view="0" :length="4" @endinput="vertifyEmailCode" @inputing="inputEmailCode" />
                <getCodeBtn ref="emailGetCodeBtn" class="get-code-btn" :disabled="!new RegExp(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/).test(email)" @click="getEmailCode" />
                <div class="error_code">{{error_email_code}}</div>
            </div>
        </div>
        <div class="next-btn">
            <mButton :disabled="!canNext" :text="$store.state.lang.text_onair_next" @click="nextStep" />
        </div>
        <div class="terms" @click="toService">
            {{$store.state.lang.terms_of_service}}
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
import password from '~/components/password'
import getCodeBtn from '~/components/form/getCodeBtn'
import shadowLayer from '~/components/shadow-layer'
import mButton from '~/components/button'
import countrys from '~/functions/countrys.json'
import { getRandomInt } from '~/functions/utils'
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
            error_line_tel: false,
            error_line_email: false,
            haveGetTelCode: false,
            haveGetEmailCode: false,
            haveTelCodeVertify: false,
            haveEmailCodeVertify: false,
            showAutoInput: false
        }
    },
    computed: {
        canNext() {
            if (this.type === 1) {
                return this.haveGetEmailCode && this.haveEmailCodeVertify
            } else {
                return this.haveGetTelCode && this.haveTelCodeVertify
            }
        }
    },
    watch: {
        tel(nv, ov) {
            this.haveGetTelCode = false
            this.error_tel = ''
        },
        email(nv, ov) {
            this.haveGetEmailCode = false
            this.error_email = ''
            const str = this.email.substr(this.email.length - 1, 1)
            if (this.email.length > 1 && str == '@') {
                this.mSendEvLog('register', 'register_input_at', 1, 0)
                this.showAutoInput = true
                 this.mSendEvLog('register', 'register_mailheip_show', 1, 0)
            } else {
                this.showAutoInput = false
            }
        },
        country(nv, ov) {
            this.tel = ''
        }
    },
    mounted() {
        this.mSendEvLog('register', 'register_show', 1, 0)
    },
    methods: {
        toService() {
            window.location.href = 'http://m.startimestv.com/copyright/copyright.html'
            this.mSendEvLog('register', 'register_tos', 1, 0)
        },
        clear() {
            sessionStorage.setItem('login_prefer', '')
        },
        mSendEvLog(category, action, label, value) {
            this.sendEvLog({
                category: category,
                action: action,
                label: label,
                value: value
            })
        },
        focusTel() {
            this.focus_tel = true
            this.mSendEvLog('register', 'register_input', 'register phone', 0)
        },
        focusEmail() {
            this.focus_email = true
            this.mSendEvLog('register', 'register_input', 'register email', 0)
        },
        showChooseCountry() {
            this.countryDialogStatus = true
            this.mSendEvLog('register', 'register_country_switch', '1', 0)
        },
        changeType(num) {
            this.type = num
            this.mSendEvLog('register', 'register_switch', num, 0)
        },
        inputTelCode() {
            this.haveTelCodeVertify = false
            this.error_tel_code = ''
            this.error_line_tel = false
        },
        inputEmailCode() {
            this.haveEmailCodeVertify = false
            this.error_email_code = ''
            this.error_line_email = false
        },
        getTelCode(callback) {
            this.mSendEvLog('register', 'register_getcode', 'register phone', 0)
            const timerIntercept = 'error' // 倒计时拦截
            const index = getRandomInt(1, 10) // 发送短信平台的调用顺序
            this.$axios({
                url: `/ums/v2/register/code/sms?phone=${this.tel}&phoneCc=${this.country.phonePrefix}&index=${index}`,
                method: 'get'
            })
                .then(res => {
                    if (res.data.code === 0) {
                        callback()
                        this.haveGetTelCode = true
                        this.$toast(this.$store.state.lang.send_code_success)
                        this.mSendEvLog('register', 'register_getcode_ok', 'register phone', 0)
                    } else if (res.data.code === 2) {
                        this.mSendEvLog('register', 'register_getcode_err', 'register phone', 0)
                        this.mSendEvLog('register', 'register_toast_exit', 'register phone', 0)
                        callback(timerIntercept)
                        this.error_tel =
                            this.$store.state.lang.error_registered +
                            ' <a href="/hybrid/account/signIn" style="color:#0087eb;text-decoration:underline">' +
                            this.$store.state.lang.sign_in +
                            '</a>'
                    } else {
                        this.mSendEvLog('register', 'register_getcode_err', 'register phone', 0)
                        callback(timerIntercept)
                        this.error_tel = this.$store.state.lang.error_tel_number_false
                    }
                })
                .catch(() => {
                    this.mSendEvLog('register', 'register_getcode_err', 'register phone', 0)
                    callback(timerIntercept)
                })
        },
        getEmailCode(callback) {
            this.mSendEvLog('register', 'register_getcode', 'register email', 0)
            const timerIntercept = 'error'
            this.$axios({
                url: `/ums/v1/register/code/email?email=${this.email}`,
                method: 'get'
            })
                .then(res => {
                    if (res.data.code === 0) {
                        callback()
                        this.haveGetEmailCode = true
                        this.$toast(this.$store.state.lang.send_code_success)
                        this.mSendEvLog('register', 'register_getcode_ok', 'register email', 0)
                    } else if (res.data.code === 2) {
                        this.mSendEvLog('register', 'register_getcode_err', 'register email', 0)
                        this.mSendEvLog('register', 'register_toast_exit', 'register email', 0)
                        callback(timerIntercept)
                        this.error_email =
                            this.$store.state.lang.error_registered +
                            ' <a href="/hybrid/account/signIn" style="color:#0087eb;text-decoration:underline">' +
                            this.$store.state.lang.sign_in +
                            '</a>'
                    } else {
                        this.mSendEvLog('register', 'register_getcode_err', 'register email', 0)
                        callback(timerIntercept)
                        this.error_email = this.$store.state.lang.error_email_false
                    }
                })
                .catch(() => {
                    this.mSendEvLog('register', 'register_getcode_err', 'register email', 0)
                    callback(timerIntercept)
                })
        },
        vertifyTelCode(val) {
            this.$axios({
                url: '/ums/v1/register/code/sms',
                method: 'post',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    phoneCc: this.country.phonePrefix,
                    phone: this.tel,
                    code: val
                })
            })
                .then(res => {
                    if (res.data.code == 0) {
                        this.haveTelCodeVertify = true
                        this.mSendEvLog('register', 'register_verifycode_ok', 'register phone', 0)
                    } else {
                        this.error_tel_code = this.$store.state.lang.error_code
                        this.error_line_tel = true
                        this.mSendEvLog('register', 'register_verifycode_err', 'register phone', 0)
                    }
                })
                .catch(() => {
                    this.mSendEvLog('register', 'register_verifycode_err', 'register phone', 0)
                })
        },
        vertifyEmailCode(val) {
            this.$axios({
                url: '/ums/v1/register/code/verify',
                method: 'post',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    email: this.email,
                    code: val
                })
            })
                .then(res => {
                    if (res.data.code == 0) {
                        this.haveEmailCodeVertify = true
                        this.mSendEvLog('register', 'register_verifycode_ok', 'register email', 0)
                    } else {
                        this.error_email_code = this.$store.state.lang.error_code
                        this.error_line_email = true
                        this.mSendEvLog('register', 'register_verifycode_err', 'register email', 0)
                    }
                })
                .catch(() => {
                    this.mSendEvLog('register', 'register_verifycode_err', 'register email', 0)
                })
        },
        autoInput(str) {
            this.email += str + '.com'
            this.showAutoInput = false
            this.mSendEvLog('register', 'register_mailheip_click', str, 0)
        },
        chooseCountry(country) {
            this.country = country
            this.countryDialogStatus = false
            this.mSendEvLog('register', 'register_country_choose', 'register_country_' + country.country, 0)
        },
        nextStep() {
            if (this.type === 1) {
                this.mSendEvLog('register', 'register_username_submit', 'register email', 0)
                const email = this.email
                const code = this.$refs.emailCode.password
                this.$router.push(`/hybrid/account/setpass?email=${email}&code=${code}`)
            } else {
                this.mSendEvLog('register', 'register_username_submit', 'register phone', 0)
                const phone = this.tel
                const code = this.$refs.telCode.password
                const phoneCc = this.country.phonePrefix
                this.$router.push(`/hybrid/account/setpass?phone=${phone}&phoneCc=${phoneCc}&code=${code}`)
            }
        }
    },
    head() {
        return {
            title: this.$store.state.lang.reg_title
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
            img {
                -webkit-box-flex: 1;
                flex: 1;
                width: 1rem;
                height: 100%;
                display: block;
            }
            span {
                -webkit-box-flex: 5;
                flex: 5;
                // width: auto;
                height: 1.4rem;
                padding-left: 4px;
                display: block;
                font-size: 14px;
                line-height: 1.4rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
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
        height: 13.5rem;
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
                height: 1rem;
                position: absolute;
                left: 0;
                bottom: -1rem;
                font-size: 0.8rem;
                color: red;
            }
        }
        .number {
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
        }
    }
    .by_tel {
        padding-top: 3.3rem;
        .phone_number {
            display: -webkit-box;
            display: flex;
            margin-bottom: 2.6rem;
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
                padding-bottom: 5px;
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
                }
            }
        }
    }
    .by_email {
        padding-top: 3.3rem;
        .input-email {
            width: 100%;
            border-bottom: #dddddd solid 1px;
            padding-bottom: 5px;
            margin-bottom: 2.6rem;
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
    .input-tel,
    .input-email {
        .error {
            height: 1rem;
            position: absolute;
            left: 0;
            bottom: -1.5rem;
            font-size: 0.8rem;
            color: red;
        }
    }
    .next-btn {
        width: 80%;
        margin: 0 auto 1.8rem;
    }
    .terms {
        margin: 0 auto;
        font-size: 0.5rem;
        text-align: center;
        text-decoration: underline;
        color: #0087eb;
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
