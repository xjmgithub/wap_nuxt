<template>
    <div class="container">
        <!-- TODO 轮播图 -->
        <div class="banner">
            <img src="~assets/img/dvb/active_banner.jpg">
        </div>
        <div class="exclusive">
            <div class="shadow">
                <img src="~assets/img/dvb/gift.png">
                <div class="border">
                    <div class="nav">
                        <span :class="{'on':type==1}" @click="type=1"><img src="~assets/img/dvb/ic_telephone_def.png"> Mobile Phone</span>
                        <span :class="{'on':type==2}" @click="type=2"><img src="~assets/img/dvb/ic_DecoderService_def_g.png">Decoder Number</span>
                    </div>
                </div>
            </div>
            <div class="get-gift">
                <div v-show="type==1" class="phone">
                    <img class="country_icon" :src="cdnPicSrc(country.nationalFlag)" @click="countryDialogStatus=true" />
                    <div>
                        <span>+{{country.phonePrefix}} | </span>
                        <input v-model="phoneNum" placeholder="Enter your phone number" />
                    </div>
                </div>
                <div v-show="type==2" class="decoder">
                    <input v-model="decoderNum" placeholder="Enter your decoder number" />
                </div>
                <div class="btn" :class="{'disabled':!decoderNum && !phoneNum}" @click="getGift">
                    <img v-if="decoderNum||phoneNum" src="~assets/img/dvb/Button-OK.png">
                    <img v-else src="~assets/img/dvb/Button-getgift2.png">
                    <span>GET GIFT</span>
                </div>
            </div>
            <div class="rules">
                <img src="~assets/img/dvb/rules.png">
                <div class="contain">
                    <p />
                    <span>Rules</span>
                    <div>
                        <p>1. Remeber to download the StarTimes ON App first.</p>
                        <p>2. If you want to enjoy the decoder users' gift, please make sure your phone is connected with decoder.</p>
                        <p>3. Please contact the local call center for further details.</p>
                    </div>
                </div>
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

export default {
    layout: 'base',
    components: {
        shadowLayer
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
                .get(
                    `/self/v1/bonuses/punish-stops?area_id=${this.countryId}&lnCode=${this.langType}&smartcard=${this.decoderNum}&phone=${
                        this.phoneNum
                    }`
                )
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
    overflow-y: scroll;
    .banner {
        img {
            width: 100%;
            display: block;
        }
    }
    .exclusive {
        width: 100%;
        padding: 2.5rem 2.5%;
        background: url('~assets/img/dvb/active_bg.png') no-repeat;
        background-position-y: -2.5rem;
        background-size: 100%;
        .shadow {
            padding: 0 0.6rem 0.7rem;
            background: url('~assets/img/dvb/tab_bg.png') no-repeat 100%;
            margin-bottom: 0.8rem;
            background-size: 100% 100%;
            & > img {
                width: 105%;
                margin-bottom: 0.5rem;
                margin-top: -0.2rem;
            }
            .border {
                background: linear-gradient(to bottom, #b04ede 0%, #3f0f8a 100%);
                padding: 0.3rem;
                border-radius: 16px;
                .nav {
                    height: 4.5rem;
                    line-height: 4.5rem;
                    background: linear-gradient(to bottom, #33005b 0%, #36014b 100%);
                    border-radius: 13px;
                    font-size: 0.75rem;
                    color: #ffffff;
                    span {
                        display: inline-block;
                        width: 49%;
                        text-align: center;
                        img {
                            width: 1.5rem;
                            height: 1.5rem;
                        }
                        &.on {
                            font-weight: bold;
                        }
                    }
                }
            }
        }
        .get-gift {
            padding: 1.5rem 0.8rem 1rem;
            background: linear-gradient(to top, rgba(133, 0, 169, 0.16) 0%, rgba(31, 1, 87, 0.55) 100%);
            border-radius: 16px;
            .phone {
                text-align: center;
                font-size: 0.95rem;
                img {
                    width: 1.5rem;
                    height: 1.5rem;
                    margin-right: 0.3rem;
                    margin-top: -0.2rem;
                }
                div {
                    padding: 2px;
                    display: inline-block;
                    border-radius: 6px;
                    color: #8d2fff;
                    border: 2px solid #ffb800;
                    padding: 0.4rem 0.5rem;
                    input {
                        outline: none;
                        border: none;
                        color: #ffffff;
                        background: rgba(255, 255, 255, 0);
                        &::-webkit-input-placeholder {
                            opacity: 0.5;
                            color: #ffffff;
                        }
                    }
                }
            }
            .decoder {
                padding: 0.8rem;
                input {
                    width: 100%;
                    outline: none;
                }
            }
            .btn {
                width: 70%;
                margin: 0.8rem auto;
                height: 2.5rem;
                line-height: 2.5rem;
                text-align: center;
                font-weight: bold;
                letter-spacing: 1px;
                position: relative;
                color: #ffffff;
                img {
                    width: 100%;
                    height: 100%;
                }
                span {
                    position: absolute;
                    left: 0;
                    width: 100%;
                }
                &.disabled {
                    color: #aaaaaa;
                }
            }
        }
        .rules {
            margin-top: 2rem;
            img {
                width: 100%;
            }
            .contain {
                width: 94%;
                margin: -1.2rem auto 0;
                background: #ffffff;
                color: #ff6600;
                font-size: 0.95rem;
                text-align: center;
                position: relative;
                & > p {
                    height: 1.5rem;
                    background: linear-gradient(to bottom, rgba(247, 124, 90, 0.45) 0%, rgba(247, 134, 90, 0) 100%);
                }
                span {
                    padding: 0 0.5rem;
                    font-weight: bold;
                    font-size: 1.2rem;
                    background: #ffffff;
                }
                div {
                    border-top: 1px dashed #ff6600;
                    padding: 0.8rem 0;
                    width: 95%;
                    margin: -0.7rem auto 0;
                    p {
                        margin: 0.8rem 0;
                        text-align: left;
                    }
                }
            }
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

