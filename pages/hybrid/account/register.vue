<template>
    <div class="wrapper">
        <div class="tab">
            <div :class="{seled:type==0}" @click="changetype(0)">
                <img class="gray" src="~assets/img/users/ic_telephone_def_g.svg">
                <img class="blue" src="~assets/img/users/ic_telephone_sl_blue.svg">
                <span class="arrow"></span>
                <span class="gray">Phone number</span>
                <span class="blue">Phone number</span>
            </div>
            <div :class="{seled:type==1}" @click="changetype(1)">
                <img class="gray" src="~assets/img/users/ic_email_def_gray.svg">
                <img class="blue" src="~assets/img/users/ic_email_sl_blue.svg">
                <span class="arrow"></span>
                <span class="gray">Email Address</span>
                <span class="blue">Email Address</span>
            </div>
        </div>
        <div v-show="type==0" class="by_tel">
            <div class="phone_number">
                <div class="country_choose" @click="countryDialogStatus=true">
                    <img class="country_icon" :src="cdnPicSrc(country.nationalFlag)">
                    <img class="ic_categary" src="~assets/img/users/ic_categary.png">
                </div>
                <div :class="{focus:focus_tel,error:error_tel}" class="input-tel">
                    <div class="prefix">
                        +{{country.phonePrefix}}
                    </div>
                    <div class="number">
                        <input v-model="tel" type="tel" placeholder="Enter your Phone Number" @focus="focus_tel=true" @blur="focus_tel=false">
                    </div>
                    <div v-show="error_tel" class="error" v-html="telError">
                        <!-- {{error_tel}} -->
                    </div>
                </div>
            </div>
            <!-- <getCode ref="telpicker" :prefix="country.phonePrefix" :tel="tel" @errorTel="showError" /> -->
            <getCode ref="telpicker" :prefix="country.phonePrefix" :tel="tel" @errorTel="showError" @phoneCanNext="telCanNext"/>
            <!-- <verifyTel ref="telpicker" :prefix="country.phonePrefix" /> -->
        </div>
        <div v-show="type==1" class="by_email">
            <verifyEmail ref="emailpicker" @emailCanNext="changeEmailCanNext">
                <!-- <template v-slot:emailcode>
                    <getCode ref="emailcode"/>
                    <getCode ref="telpicker" :prefix="country.phonePrefix" :tel="tel" @errorTel="showError" @phoneCanNext="telCanNext"/>
                </template> -->
            </verifyEmail>
        </div>
        <div style="width:80%;margin:0 auto;">
            <mButton :disabled="!canNext" :text="'NEXT'" @click="nextStep"/>
        </div>
        <div class="terms">
            <a href="http://m.startimestv.com/copyright/copyright.html">Terms of Service</a>
        </div>
        <div v-show="countryDialogStatus" class="country-choose-dialog">
            <div class="dialog-title">Country List</div>
            <ul>
                <li v-for="(item,index) in countrys" :key="index" @click="chooseCountry(item)">
                    <img :src="cdnPicSrc(item.nationalFlag)">
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
        <shadowLayer v-show="countryDialogStatus" @click="countryDialogStatus=false"/>
    </div>
</template>
<script>
import getCode from '~/components/form/get_code'
// import verifyTel from '~/components/form/verify_tel'
import verifyEmail from '~/components/form/verify_email'
import shadowLayer from '~/components/shadow-layer'
import mButton from '~/components/button'
import countrys from '~/functions/countrys.json'
export default {
    layout: 'base',
    components: {
        getCode,
        // verifyTel,
        verifyEmail,
        shadowLayer,
        mButton
    },
    data() {
        return {
            type: 0,
            countrys: countrys,
            country: this.$store.state.country,
            countryDialogStatus: false,
            phoneCanNext: false,
            emailCanNext: false,
            tel: '',
            vscode: '',
            focus_tel: false,
            error_tel: '',
            error_code: '',
        }
    },
    computed: {
        canNext() {
            // console.log(this.phoneCanNext);
            if (this.type === 1) {
                return this.emailCanNext
            } else {
                return this.phoneCanNext;
            }
        },
        telError() {
            if(this.error_tel == 'You are not a new user because you have registered once.') {
                return this.error_tel+'<a href="/hybrid/account/signIn" style="color:#0087eb;text-decoration:underline"> Sign in</a>'
            }
            return this.error_tel;
        }
        
    },
    watch: {
        tel(nv, ov) {
            this.error_tel = ''
        },
        country(nv, ov) {
            this.tel = ''
        },
    },
    methods: {
        telCanNext(bool) {
            this.phoneCanNext = bool;
        },
        showError(msg) {
            this.error_tel = msg;
        },
        // changePhoneCanNext(bool) {
        //     // console.log(this.$router.query)
        //     this.phoneCanNext = bool
        // },
        changeEmailCanNext(bool) {
            this.emailCanNext = bool
        },
        changetype(type) {
            this.type = type
        },
        chooseCountry(country) {
            this.country = country
            this.countryDialogStatus = false
        },
        nextStep() {
            if (this.type === 1) {
                const email = this.$refs.emailpicker.email
                const code = this.$refs.emailpicker.vscode
                // const activeID = '';
                // 活动ID &activeID=${activeID}
                this.$router.push(`/hybrid/account/setpass?email=${email}&code=${code}`)
            } else {
                // TODO校验
                const phone = this.tel
                const code = this.$refs.telpicker.vscode
                const phoneCc = this.country.phonePrefix
                const countryID = this.country.id
                // console.log(countryID)
                // const activeID = '';
                // 活动ID &activeID=${activeID}
                this.$router.push(`/hybrid/account/setpass?phone=${phone}&phoneCc=${phoneCc}&countryID=${countryID}&code=${code}`)
            }
        },
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
                -webkit-box-flex: 1;
                flex: 5;
                width: 6.2rem;
                height: 1.2rem;
                padding-left: 4px;
                display: block;
                font-size: 14px;
                line-height: 1.2rem;
            }
            img {
                -webkit-box-flex: 1;
                flex: 1;
                width: 1.2rem;
                height: 1.2rem;
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
                border-bottom: 3px solid #0087EB;
                display: none;
            }
            .blue {
                display: none;
                color: #0087EB;
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
    }
    .by_tel {
        .phone_number{
            display: -webkit-box;
            display: flex;
            margin-bottom: 1.9rem;
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
    .next-btn {
        width: 80%;
        background: #0087eb;
        color: white;
        text-align: center;
        height: 2rem;
        line-height: 2rem;
        font-size: 0.8rem;
        margin: 0 auto;
        &.disabled {
            background: #dddddd;
            color: #aaaaaa;
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
</style>
