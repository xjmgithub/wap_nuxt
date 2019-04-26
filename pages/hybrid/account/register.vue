<template>
    <div class="wrapper">
        <div class="tab">
            <div :class="{seled:type==0}" @click="changetype(0)">
                <img class="gray" src="~assets/img/users/ic_telephone_def_g.svg">
                <img class="blue" src="~assets/img/users/ic_telephone_sl_blue.svg">
                <img class="arrow" src="~assets/img/users/line_arrow.jpg">
            </div>
            <div :class="{seled:type==1}" @click="changetype(1)">
                <img class="gray" src="~assets/img/users/ic_email_def_gray.svg">
                <img class="blue" src="~assets/img/users/ic_email_sl_blue.svg">
                <img class="arrow" src="~assets/img/users/line_arrow.jpg">
            </div>
        </div>
        <div v-show="type==0" class="by_tel">
            <div class="country_choose" @click="countryDialogStatus=true">
                <img :src="cdnPicSrc(country.nationalFlag)">
                <span>{{country.name}}</span>
            </div>
            <verifyTel ref="telpicker" :prefix="country.phonePrefix" @pass="changePhoneCanNext"/>
        </div>
        <div v-show="type==1" class="by_email">
            <verifyEmail ref="emailpicker" @pass="changeEmailCanNext"/>
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
import verifyTel from '~/components/form/verify_tel'
import verifyEmail from '~/components/form/verify_email'
import shadowLayer from '~/components/shadow-layer'
import mButton from '~/components/button'
import countrys from '~/functions/countrys.json'
export default {
    layout: 'base',
    components: {
        verifyTel,
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
            emailCanNext: false
        }
    },
    computed: {
        canNext() {
            if (this.type === 1) {
                return this.emailCanNext
            } else {
                return this.phoneCanNext
            }
        }
    },
    methods: {
        changePhoneCanNext(bool) {
            this.phoneCanNext = bool
        },
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

                this.$router.push(`/hybrid/account/setpass?email=${email}&code=${code}`)
            } else {
                const phone = this.$refs.telpicker.tel
                const code = this.$refs.telpicker.vscode
                const phoneCc = this.country.phonePrefix
                const countryId = this.country.id
                this.$router.push(`/hybrid/account/setpass?phone=${phone}&phoneCc=${phoneCc}&countryId=${countryId}&code=${code}`)
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
            padding: 1.2rem;
            border-bottom: solid #dddddd 1px;
            position: relative;

            img {
                width: 2.2rem;
                height: 2.2rem;
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
            line-height: 2rem;
            padding-top: 1rem;
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
