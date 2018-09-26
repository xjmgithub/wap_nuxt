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
                    <verifyTel ref="telpicker" :prefix="areaInfo.phonePrefix" @pass="phoneCanNext=true"></verifyTel>
                </div>
                <div v-show="type==1" class="by_email">
                    <verifyEmail ref="emailpicker" @pass="emailCanNext=true"></verifyEmail>
                </div>
                <div style="width:80%;margin:0 auto;">
                    <mButton :disabled="!canNext" :text="'NEXT'" @click="nextStep"></mButton>
                </div>
                <div class="terms">
                    <a href="http://m.startimestv.com/copyright/copyright.html">Terms of Service</a>
                </div>
                <div class="country-choose-dialog" v-show="countryDialogStatus">
                    <div class="dialog-title">Country List</div>
                    <ul>
                        <li v-for="(item,index) in countrys" :key="index" @click="chooseCountry(item)">
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
import verifyEmail from '~/components/form/verify_email'
import shadowLayer from '~/components/shadow-layer'
import mButton from '~/components/button'
export default {
    layout: 'base',
    async asyncData({ app, store, redirect }) {
        let res = await app.$axios.get('/cms/vup/v2/areas?versionCode=5300', {
            headers: {
                token: store.state.token
            }
        })
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
            emailCanNext: false,
            pre: this.$route.query.pre
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
        }
    },
    methods: {
        changetype(type) {
            this.type = type
        },
        chooseCountry(country) {
            this.country = country.id
            this.countryDialogStatus = false
        },
        nextStep() {
            let pre = ''
            this.pre ? (pre = `&pre=${this.pre}`) : (pre = '')

            if (this.type == 1) {
                let email = this.$refs.emailpicker.email
                let code = this.$refs.emailpicker.vscode

                this.$router.push(
                    `/hybrid/account/setpass?email=${email}&code=${code}${pre}`
                )
            } else {
                let phone = this.$refs.telpicker.tel
                let code = this.$refs.telpicker.vscode
                let phoneCc = this.areaInfo.phonePrefix
                let countryId = this.country
                this.$router.push(
                    `/hybrid/account/setpass?phone=${phone}&phoneCc=${phoneCc}&countryId=${countryId}&code=${code}${pre}`
                )
            }
        }
    },
    components: {
        verifyTel,
        verifyEmail,
        shadowLayer,
        mButton
    },
    head() {
        return {
            title: 'Register'
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
}
</style>