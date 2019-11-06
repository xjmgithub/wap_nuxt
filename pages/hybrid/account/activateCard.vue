<template>
    <div class="container">
        <!-- TODO 轮播图 -->
        <div class="exclusive">
            <div class="nav">
                <span :class="{'on':type==1}" @click="type=1">Phone Number</span>
                <span :class="{'on':type==2}" @click="type=2">Decoder Number</span>
            </div>
            <div v-show="type==1" class="phone">
                <div class="country_choose" @click="countryDialogStatus=true">
                    <img class="country_icon" :src="cdnPicSrc(country.nationalFlag)" />
                    <img src="~assets/img/users/ic_categary.png" />
                    <span>+{{country.phonePrefix}}</span>
                </div>
                <input v-model="phoneNum" placeholder="Enter your phone number" />
            </div>
            <div v-show="type==2" class="decoder">
                <input v-model="decoderNum" placeholder="Enter your decoder number" />
            </div>
            <div class="btn">
                <mButton :disabled="!decoderNum && !phoneNum" text="GET GIFT" @click="getGift" />
            </div>
            <div class="rules">
                <p>1、akljlakjdlaalksdja</p>
                <p>2、oiqoiwoiwqwqqkjwqnmwqnmwq</p>
                <p>3、lk[pwq[kvlvska;envlmc;lascoep</p>
            </div>
        </div>
        <shadowLayer v-show="countryDialogStatus" @click="countryDialogStatus=false" />
        <div v-show="countryDialogStatus" class="country-choose-dialog">
            <div class="dialog-title">{{$store.state.lang.all}}</div>
            <ul>
                <li v-for="(item,index) in countryList" :key="index" @click="chooseCountry(item)">
                    <img :src="cdnPicSrc(item.nationalFlag)" />
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import shadowLayer from '~/components/shadow-layer'
import country from '~/functions/countrys.json'
import mButton from '~/components/button'

export default {
    layout: 'base',
    components: {
        shadowLayer,
        mButton
    },
    data() {
        return {
            type: 1,
            countryDialogStatus: false,
            countryList: country,
            country: this.$store.state.country,
            countryId: this.$store.state.country.id,
            langType: this.$store.state.langType,
            phoneNum: '',
            decoderNum: ''
        }
    },
    watch: {
        type(nv, ov) {
            if (nv == 1) this.oderNum = ''
            else this.phoneNum = ''
        }
    },
    methods: {
        chooseCountry(item) {
            this.country = item
            this.countryDialogStatus = false
        },
        getGift() {
            console.log(this.$store.state)
            this.$nuxt.$loading.start()
            this.$axios
                .get(`/self/v1/bonuses/punish-stops?area_id=${this.countryId}&lnCode=${this.langType}&smartcard=${this.decoderNum}&phone=${this.phoneNum}`)
                .then(res => {
                    this.$nuxt.$loading.finish()
                    if (res.data.code == 200) {
                    } else {
                        this.$alert(res.data.message)
                    }
                })
                .catch(() => {})
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    .exclusive {
        .nav {
            span {
                display: inline-block;
                width: 49%;
                color: #333333;
                text-align: center;
                &.on {
                    color: #0087eb;
                }
            }
        }
        .phone {
            display: -webkit-box;
            display: flex;
            padding: 0.8rem;
            .country_choose {
                -webkit-box-flex: 2;
                flex: 2;
                img {
                    width: 1.5rem;
                    height: 1.5rem;
                    & + img {
                        margin-left: -0.2rem;
                        margin-right: -0.5rem;
                    }
                }
            }
            input {
                -webkit-box-flex: 5;
                flex: 5;
                outline: none;
            }
        }
        .decoder {
            padding: 0.8rem;
            input {
                width: 100%;
                outline: none;
            }
        }
    }
    .btn {
        width: 70%;
        margin: 0 auto;
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
            height: 21rem;
            overflow: auto;
            li {
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

