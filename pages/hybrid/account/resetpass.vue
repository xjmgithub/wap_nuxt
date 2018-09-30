<template>
    <div id="wrapper">
        <div class="tab">
            <div :class="{seled:type==0}" @click="changetype(0)">
                <img class="gray" src="~/assets/img/users/ic_telephone_def_g.png" />
                <img class="blue" src="~/assets/img/users/ic_telephone_sl_blue.png" />
                <img class="arrow" src="~/assets/img/users/line_arrow.jpg" />
            </div>
            <div :class="{seled:type==1}" @click="changetype(1)">
                <img class="gray" src="~/assets/img/users/ic_email_def_gray.png" />
                <img class="blue" src="~/assets/img/users/ic_email_sl_blue.png" />
                <img class="arrow" src="~/assets/img/users/line_arrow.jpg" />
            </div>
        </div>
        <div v-show="type==0" class="by_tel">
            <div class="country_choose" @click="countryDialogStatus=true">
                <img :src="areaInfo.nationalFlag" />
                <span>{{areaInfo.name}}</span>
            </div>
            <verifyTel ref="telpicker" type="1" :prefix="areaInfo.phonePrefix" @pass="phoneCanNext=true"></verifyTel>
        </div>
        <div v-show="type==1" class="by_email">
            <div class="input-email" :class="{focus:focus_email,error:error_email}">
                <div class="number">
                    <input type="email" v-model="email" @focus="focus_email=true" @blur="focus_email=false" placeholder="Enter your email address" />
                </div>
                <div class="error" v-show="error_email">{{error_email}}</div>
            </div>
        </div>
        <div style="width:80%;margin:0 auto;">
            <mButton :disabled="!canNext" :text="'NEXT'" @click="nextStep"></mButton>
        </div>
        <div class="country-choose-dialog" v-show="countryDialogStatus">
            <div class="dialog-title">Country List</div>
            <ul>
                <li v-for="(item,index) in countrys" :key="index" @click="chooseeCountry(item)">
                    <img :src="item.nationalFlag" />
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
        <shadowLayer v-show="countryDialogStatus" @click="countryDialogStatus=false"></shadowLayer>
    </div>
</template>
<script>
import verifyTel from '~/components/form/verify_tel'
import shadowLayer from '~/components/shadow-layer'
import mButton from '~/components/button'
export default {
    layout: 'base',
    async asyncData({ app, store, redirect }) {
        app.$axios.setHeader('token', store.state.token)
        let res = await app.$axios.get('/cms/vup/v2/areas?versionCode=5300')
        let countrys = {}
        res.data.forEach((item, index) => {
            countrys[item.id] = item
        })
        return {
            countrys: countrys
        }
    },
    data() {
        return {
            type: 0,
            country: this.$store.state.user.areaID,
            countryDialogStatus: false,
            phoneCanNext: false,
            email: '',
            focus_email: false,
            error_email: ''
        }
    },
    computed: {
        areaInfo() {
            return this.countrys[this.country]
        },
        canNext() {
            if (this.type == 1) {
                return this.emailCanNext
            } else {
                return this.phoneCanNext
            }
        },
        emailCanNext() {
            let reg_email = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/
            return reg_email.test(this.email)
        }
    },
    watch: {
        email(nv, ov) {
            this.error_email = ''
        }
    },
    methods: {
        changetype(type) {
            this.type = type
        },
        chooseCountry(country) {
            this.country = {
                id: country.id,
                short: country.country
            }
            this.countryDialogStatus = false
        },
        nextStep() {
            // TODO 防止多次点击
            if (this.type == 1) {
                this.$axios
                    .get(`/ums/v1/register/password/change?email=${this.email}`, {
                    headers: {
                        token: this.$store.state.token
                    }
                })
                    .then(res => {
                        if (res.data.code == 0) {
                            this.$alert(
                                'The verification code has been sent,please check your inbox or junk email in time.You can have a new verification code sent to you after 60 seconds.',
                                () => {
                                    this.$router.replace('/hybrid/account/login')
                                }
                            )
                        } else {
                            this.error_email =
                                'Please confirm you have entered the right email.'
                        }
                    })
            } else {
                let phone = this.$refs.telpicker.tel
                let code = this.$refs.telpicker.vscode
                let phoneCc = this.areaInfo.phonePrefix
                let countryId = this.country.id
                this.$router.push(
                    `/hybrid/account/resetpassConfirm?phone=${phone}&phoneCc=${phoneCc}&countryId=${countryId}&code=${code}`
                )
            }
        }
    },
    components: {
        verifyTel,
        shadowLayer,
        mButton
    },
    head() {
        return {
            title: 'Forgot password'
        }
    }
}
</script>
<style lang="less" scoped>
#wrapper {
    font-family: 'Roboto';
    padding: 1rem 0.8rem;

    .tab {
        div {
            width: 50%;
            float: left;
            padding: 1.2rem;
            border-bottom: solid #dddddd 2px;
            position: relative;

            img {
                height: 1.5rem;
                margin: 0 auto;
                display: block;
            }
            .arrow {
                width: 10px;
                height: 10px;
                position: absolute;
                bottom: -2px;
                display: block;
                margin: 0 auto;
                left: 0;
                right: 0;
            }

            .blue,
            .arrow {
                display: none;
            }
            .gray {
                display: block;
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
        .country_choose {
            line-height: 3rem;
            img {
                width: 1.5rem;
                height: 1.5rem;
                margin-right: 0.5rem;
                vertical-align: middle;
            }
            span {
                vertical-align: middle;
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
    .email-cont {
        padding-top: 2.5rem;
    }
    .input-email {
        border-bottom: #dddddd solid 1px;
        display: -webkit-box;
        display: flex;
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
        .prefix {
            max-width: 3.5rem;
            border-right: #dddddd solid 1px;
            line-height: 1.2rem;
            height: 1.2rem;
            float: left;
            -webkit-box-flex: 1;
            flex: 1;
        }
        .number {
            -webkit-box-flex: 11;
            flex: 5;
            input {
                width: 100%;
                border: none;
                display: block;
                outline: none;
                &::-webkit-input-placeholder {
                    font-size: 0.5rem;
                }
            }
        }
        .error {
            position: absolute;
            bottom: -1.4rem;
            font-size: 0.5rem;
            color: red;
        }
    }
}
</style>