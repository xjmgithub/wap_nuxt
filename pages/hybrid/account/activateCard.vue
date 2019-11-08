<template>
    <div class="container">
        <!-- TODO 轮播图 -->
        <div class="banner">
            <img src="~assets/img/dvb/active_banner.jpg" @click="useNow">
        </div>
        <div class="exclusive">
            <div class="shadow">
                <img src="~assets/img/dvb/gift.png">
                <div v-show="!getGiftSuccess" class="border">
                    <div class="nav">
                        <p :class="{'on':type==1}" @click="type=1">
                            <span> <img src="~assets/img/dvb/ic_telephone_def.png"> Mobile Phone </span>
                        </p>
                        <p :class="{'on':type==2}" @click="type=2">
                            <span> <img src="~assets/img/dvb/ic_DecoderService_def_g.png">Decoder Number</span>
                        </p>
                    </div>
                </div>
            </div>
            <div v-show="!getGiftSuccess" class="get-gift">
                <div v-show="type==1" class="phone">
                    <img :src="cdnPicSrc(country.nationalFlag)" />
                    <div>
                        <span>+{{country.phonePrefix}} | </span>
                        <input v-model="phoneNum" placeholder="Enter your phone number" />
                    </div>
                </div>
                <div v-show="type==2" class="decoder">
                    <img src="~assets/img/dvb/ic_email.png" />
                    <div>
                        <input v-model="decoderNum" placeholder="Enter your Smart Card number" />
                    </div>
                </div>
                <div class="btn" :class="{'disabled':!decoderNum && !phoneNum}" @click="getGift">
                    <img v-if="decoderNum||phoneNum" src="~assets/img/dvb/Button-OK.png">
                    <img v-else src="~assets/img/dvb/Button-getgift2.png">
                    <span>GET GIFT</span>
                </div>
            </div>
            <div v-show="getGiftSuccess" class="received">
                <div class="coupon">
                    <h4>{{couponData.bonus_title}}</h4>
                    <p>{{couponData.use_condition}}</p>
                    <span>USE NOW</span>
                </div>
                <div class="btn" @click="useNow">
                    <img src="~assets/img/dvb/Button-OK.png">
                    <span>USE NOW</span>
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
        <div v-show="showAlert" class="alert">
            <h4>Gift Received!</h4>
            <p>{{alertMessage}}</p>
            <div class="btn" @click="showAlert=false">
                <img src="~assets/img/dvb/Button-OK.png">
                <span>OK</span>
            </div>
        </div>
    </div>
</template>
<script>
import countrys from '~/functions/countrys.json'
import { callApp, callMarket, downApk } from '~/functions/app'

export default {
    layout: 'base',
    data() {
        const countryCode = this.$route.query.code || 'KE'
        const obj = {}
        countrys.forEach(item => {
            obj[item.country] = item
        })
        return {
            type: 1,
            country: obj[countryCode.toLocaleUpperCase()],
            langType: this.$store.state.langType,
            phoneNum: '',
            decoderNum: '',
            showAlert: false,
            getGiftSuccess: false,
            couponData: {},
            alertMessage: ''
        }
    },
    watch: {
        type(nv, ov) {
            if (nv == 1) this.oderNum = ''
            else this.phoneNum = ''
        }
    },
    methods: {
        useNow() {
            callApp.call(this, '', () => {
                callMarket.call(this, () => {
                    this.$confirm(
                        'Download apk now?（12M）',
                        () => {
                            downApk.call(this)
                        },
                        () => {},
                        'OK',
                        'NOT NOW'
                    )
                })
            })
        },
        getGift() {
            this.$nuxt.$loading.start()
            this.$axios
                .get(
                    `/self/v1/bonuses/punish-stops?area_id=${this.country.id}&lnCode=${this.langType}&smartcard=${this.decoderNum}&phone=${
                        this.phoneNum
                    }`
                )
                .then(res => {
                    this.$nuxt.$loading.finish()
                    // @0：智能卡不存在@1：智能卡罚停@2：智能卡非罚停@3：该国家没有开通DVB充值@4：BOSS接口不可用@5智能卡罚停，但不满足领取条件
                    const state = res.data.state
                    if (res.data.code == 200) {
                        if (state == 0) {
                            this.alertMessage = 'The 85% off on sale for the VIP for you.'
                            this.showAlert = true
                        } else if (state == 2) {
                            this.showAlert = true
                            this.alertMessage = '5% discount has been put into your account. Please enjoy yourself.'
                        } else if (state == 1 && res.data.data.id) {
                            this.getGiftSuccess = true
                            this.showAlert = true
                            this.couponData = res.data.data
                            this.alertMessage = res.data.data.bonus_title
                        }
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
        padding: 2rem 2.5%;
        background: url('~assets/img/dvb/active_bg.png') no-repeat;
        background-position-y: -2.5rem;
        background-size: 100%;
        .shadow {
            padding: 0 0.6rem 0.7rem;
            background: url('~assets/img/dvb/tab_bg.png') no-repeat 100%;
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
                    background: linear-gradient(to bottom, #33005b 0%, #36014b 100%);
                    border-radius: 13px;
                    font-size: 0.75rem;
                    color: #ffffff;
                    text-align: center;
                    p {
                        display: inline-block;
                        width: 48%;
                        text-align: center;
                        margin-top: 0.4rem;
                        line-height: 4rem;
                        height: 4.5rem;
                        &.on {
                            font-weight: bold;
                            background: url('~assets/img/dvb/ic_Tab.png') no-repeat;
                            background-size: 100% 100%;
                        }
                        span {
                            img {
                                width: 1.5rem;
                                height: 1.5rem;
                            }
                        }
                    }
                }
            }
        }
        .get-gift {
            padding: 1.5rem 0;
            background: url('~assets/img/dvb/input_bg.png') no-repeat;
            background-size: 100% 100%;
            border-radius: 16px;
            margin-top: 0.8rem;
            .phone,
            .decoder {
                text-align: center;
                font-size: 0.95rem;
                img {
                    width: 1.5rem;
                    height: 1.5rem;
                    margin-right: 0.3rem;
                    margin-top: -0.2rem;
                }
                div {
                    display: inline-block;
                    border-radius: 6px;
                    color: #8d2fff;
                    border: 2px solid #ffb800;
                    padding: 0.4rem 0 0.4rem 0.4rem;
                    width: 85%;
                    text-align: left;
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
            .decoder div input {
                width: 100%;
            }
        }
        .rules {
            margin-top: 2rem;
            img {
                width: 100%;
            }
            .contain {
                width: 94%;
                margin: -1rem auto 0;
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
        .received {
            .coupon {
                background: url('~assets/img/dvb/coupon.png') no-repeat;
                background-size: 100% 100%;
                padding: 1rem 1.5rem 0.8rem;
                position: relative;
                h4 {
                    font-size: 1.25rem;
                    color: #333333;
                    line-height: 1.25rem;
                    margin: 0 0 1rem;
                    width: 80%;
                }
                p {
                    color: #d10066;
                    font-size: 0.95rem;
                    width: 80%;
                    padding-bottom: 0.2rem;
                }
                span {
                    color: #ffffff;
                    font-weight: bold;
                    position: absolute;
                    right: 3%;
                    top: 38%;
                    transform: rotate(90deg);
                    font-size: 0.85rem;
                }
            }
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
    .alert {
        width: 15rem;
        height: 18rem;
        line-height: 1.2rem;
        position: fixed;
        overflow: hidden;
        top: 50%;
        left: 50%;
        margin-left: -7.5rem;
        margin-top: -9rem;
        z-index: 999;
        background: url('~assets/img/dvb/active_bg.png') no-repeat;
        background-size: 100% 100%;
        padding: 0 0.8rem;
        text-align: center;
        border-radius: 5px;
        h4 {
            color: #000000;
            font-size: 1.2rem;
            font-weight: bold;
            height: 3rem;
            line-height: 3rem;
        }
        p {
            color: #ffffff;
            font-size: 0.95rem;
            margin: 2rem 0;
        }
    }
}
</style>

