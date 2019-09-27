<template>
    <div class="wrapper">
        <div class="by_tel">
            <div class="phone_number">
                <div class="country_choose" @click="showChooseCountry">
                    <img class="country_icon" :src="cdnPicSrc(country.nationalFlag)" />
                    <img class="ic_categary" src="~assets/img/users/ic_categary.png" />
                </div>
                <div :class="{focus:focus_tel,error:error_tel}" class="input-tel">
                    <div class="tag" :class="{focus:focus_tel,error:error_tel}">{{enter_phone}}</div>
                    <div class="prefix">+{{country.phonePrefix}}</div>
                    <div class="number">
                        <input v-model="tel" type="tel" :placeholder="focus_tel?'':enter_phone" @focus="focusTel" @blur="focus_tel=false" />
                    </div>
                    <div v-show="error_tel" class="error" v-html="error_tel"></div>
                </div>
            </div>
            <div class="get-code">
                <password
                    ref="telCode"
                    :class="{error:error_line_tel}"
                    class="code_num"
                    :default-view="0"
                    :length="4"
                    @endinput="vertifyTelCode"
                    @inputing="inputTelCode"
                />
                <getCodeBtn ref="telGetCodeBtn" class="get-code-btn" :disabled="!new RegExp(country.phoneRegex).test(tel)" @click="getTelCode" />
                <div class="error_code">{{error_tel_code}}</div>
            </div>
        </div>
        <div class="next-btn">
            <mButton :disabled="!canNext" :text="next" @click="nextStep" />
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
            countrys: countrys,
            country: this.$store.state.country,
            countryDialogStatus: false,
            tel: '',
            enter_phone: this.$store.state.lang.enter_your_phone_number,
            next: this.$store.state.lang.text_onair_next,
            focus_tel: false,
            error_tel: '',
            error_tel_code: '',
            error_line_tel: false,
            haveGetTelCode: false,
            haveTelCodeVertify: false,
            confirm_number: this.$store.state.lang.confirm_number,
            error_registered: this.$store.state.lang.error_registered,
            error_code: this.$store.state.lang.error_code
        }
    },
    computed: {
        canNext() {
            return this.haveGetTelCode && this.haveTelCodeVertify
        }
    },
    watch: {
        tel(nv, ov) {
            this.haveGetTelCode = false
            this.error_tel = ''
        },
        country(nv, ov) {
            this.tel = ''
        }
    },
    mounted() {},
    methods: {
        focusTel() {
            this.focus_tel = true
        },
        showChooseCountry() {
            this.countryDialogStatus = true
        },
        inputTelCode() {
            this.haveTelCodeVertify = false
            this.error_tel_code = ''
            this.error_line_tel = false
        },
        getTelCode(callback) {
            const timerIntercept = 'error' // 倒计时拦截
            const index = getRandomInt(1, 10) // 发送短信平台的调用顺序
            this.$axios({
                url: `/ums/v1/user/code/sms?phone=${this.tel}&phoneCc=${this.country.phonePrefix}&index=${index}`,
                method: 'get'
            })
                .then(res => {
                    if (res.data.code === 0) {
                        // 已注册的账号 成功
                        callback()
                        this.haveGetTelCode = true
                        this.$toast(this.$store.state.lang.send_code_success)
                    } else if (res.data.code === 1) {
                        // 未注册的账号 错误 去注册
                        callback(timerIntercept)
                        this.error_tel =
                            this.$store.state.lang.number_is_not_registered +
                            ' <a href="/hybrid/account/register" style="color:#0087eb;text-decoration:underline">' +
                            this.$store.state.lang.register +
                            '</a>'
                    } else {
                        // 错误的账号 错误 提示
                        callback(timerIntercept)
                        this.error_tel = this.confirm_number
                    }
                })
                .catch(() => {
                    callback(timerIntercept)
                })
        },
        vertifyTelCode(val) {
            this.$axios({
                url: '/ums/v1/user/code/sms',
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
                    } else {
                        this.error_tel_code = this.error_code
                        this.error_line_tel = true
                    }
                })
                .catch(() => {
                    // console.log('验证失败')
                })
        },
        chooseCountry(country) {
            this.country = country
            this.countryDialogStatus = false
        },
        nextStep() {
            const phone = this.tel
            const code = this.$refs.telCode.password
            const phoneCc = this.country.phonePrefix
            this.$router.push(`/hybrid/account/resetTelPassSubmit?phone=${phone}&phoneCc=${phoneCc}&code=${code}`)
        }
    },
    head() {
        return {
            title: this.$store.state.lang.reset_pass
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    position: static;
    padding: 0 1.2rem;
    .by_tel {
        height: 13.5rem;
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
                .tag {
                    position: absolute;
                    left: 0;
                    top: -1.2rem;
                    font-size: 0.8rem;
                    color: transparent;
                    &.focus {
                        color: #0087eb;
                    }
                    &.error {
                        color: red;
                    }
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
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        &::-webkit-input-placeholder {
                            font-size: 0.9rem;
                        }
                    }
                }
                .error {
                    height: 1rem;
                    position: absolute;
                    left: 0;
                    bottom: -1.5rem;
                    font-size: 0.8rem;
                    color: red;
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
                height: 1rem;
                position: absolute;
                left: 0;
                bottom: -1rem;
                font-size: 0.8rem;
                color: red;
            }
        }
    }
    .next-btn {
        width: 80%;
        margin: 0 auto 1.8rem;
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
