<template>
    <div class="container">
        <div class="goods">
            <p class="pay-money">
                <span>{{currency}}</span>{{totalAmount | formatAmount}}
            </p>
            <p class="pay-subject">{{paySubject}}</p>
        </div>
        <div class="pay-channels">
            <div v-for="(item,i) in payChannels" :key="i">
                <label class="radio">
                    <img v-if="item.logoUrl" :src="cdnPic(item.logoUrl)">
                    <img v-else src="~assets/img/pay/ewallet.png">
                    <span v-if="item.payType==1&&eCurrency&&eAmount>=0">eWallet: {{eCurrency}}{{eAmount| formatAmount}}</span>
                    <span v-else-if="item.payType==1">eWallet</span>
                    <span v-else>{{item.name}}</span>
                    <input :checked="i===0?true:false" type="radio" name="pay-options" value="item.payType" @click="checkThis(item)">
                    <i/>
                </label>
            </div>
        </div>
        <div v-show="payDesc" class="desc">
            <p>Note:</p>
            <p v-html="payDesc" />
        </div>
        <div class="error-msg" v-html="errorMsg" />
        <div class="footer">
            <mButton :disabled="Boolean(errorMsg)" text="PAY NOW" @click="nextStep" />
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import { formatAmount, cdnPicSrc } from '~/functions/utils'
export default {
    layout: 'base',
    components: {
        mButton
    },
    filters: {
        formatAmount(num) {
            return formatAmount(num)
        }
    },
    data() {
        const user = this.$store.state.user
        return {
            isLogin: user.roleName && user.roleName.toUpperCase() !== 'ANONYMOUS',
            payToken: this.$route.query.payToken,
            payChannel: this.$route.query.payChannel || 9002,
            desc: '',
            form_exit: false,
            appInterfaceMode: null,
            redirectUrl: '',
            merchantRedirectUrl: '',
            currency: '',
            totalAmount: '',
            paySubject: '',
            payChannels: [],
            payType: 1,
            eAmount: '',
            eCurrency: ''
        }
    },
    computed: {
        payDesc() {
            let tmp = ''
            this.payChannels.forEach(ele => {
                if (ele.payType == this.payType) {
                    tmp = ele.description
                }
            })
            return tmp
        },
        // btnState() {
        //     return Boolean(this.errorMsg)
        //     let tmp = ''
        //     if (!this.isLogin) {
        //         return false
        //     } else if (this.payType === 1) {
        //         tmp = this.currency == this.eCurrency && this.eAmount >= this.totalAmount
        //     } else {
        //         tmp = this.currency == this.eCurrency
        //     }
        //     return !tmp
        // },
        errorMsg() {
            let tmp = ''
            if (!this.isLogin && this.payType === 1) return tmp
            tmp =
                this.currency != this.eCurrency
                    ? 'Commodity currency does not match wallet currency and cannot be paid'
                    : this.eAmount < this.totalAmount ? 'The wallet balance is insufficient to pay for the goods' : ''
            return tmp
        }
    },
    mounted() {
        this.getPayMethods()
        if (this.isLogin) {
            this.getEwalletBalance()
        }
    },
    methods: {
        getPayMethods() {
            if (!this.payToken) {
                this.$alert('Query payToken needed! please check request')
                return false
            }
            this.$axios.get(`/payment/api/v2/get-pre-payment?payToken=${this.payToken}`).then(res => {
                const data = res.data
                if (data && data.payChannels && data.payChannels.length > 0) {
                    data.payChannels.sort((a, b) => {
                        return a.orderSeq - b.orderSeq
                    })
                    this.currency = data.currency
                    this.totalAmount = data.totalAmount
                    this.paySubject = data.paySubject
                    this.payChannels = data.payChannels
                } else {
                    this.$alert('payToken and payChannel Mismatch! please check request')
                    // this.$alert('The merchant has not yet opened a supportable payment channel.')
                }
            })
        },
        getEwalletBalance() {
            this.$axios.get(`/mobilewallet/v1/accounts/me`).then(res => {
                const data = res.data
                if (data.accountNo) {
                    this.eAmount = data.amount
                    this.eCurrency = data.currencySymbol
                    sessionStorage.setItem('eWallet-account', JSON.stringify(data))
                }
            })
        },
        cdnPic(src) {
            return cdnPicSrc.call(this, src)
        },
        checkThis(item) {
            this.payType = item.payType
            this.currency = item.currency
        },
        invokePay() {
            if (!this.form_exit) {
                if (this.payType !== 3 && [2, 3].indexOf(this.appInterfaceMode) < 0) {
                    /* payType 取值
                    1、钱包余额
                    2、现金
                    3、第三方在线支付
                    4、订阅
                    99、其他 */

                    /* appInterfaceMode
                    1、SDK
                    2、Web，访问Web页面
                    3、Wait，等待支付结果
                    */
                    this.$alert(
                        'The payment method you selected is temporarily not supported by this platform. Please contact appservice@startimes.com.cn'
                    )
                    return false
                }

                this.$axios
                    .post('/payment/api/v2/invoke-payment', {
                        payToken: this.payToken,
                        payChannelId: this.payChannel,
                        tradeType: 'JSAPI',
                        deviceInfo: window.navigator.userAgent,
                        extendInfo: {} // 没有动态表单收集信息的传空对象
                    })
                    .then(res => {
                        const data = res.data
                        if (data && data.resultCode === 0) {
                            if (this.appInterfaceMode === 2) {
                                this.redirectUrl = data.tppRedirectUrl
                            }
                            this.merchantRedirectUrl = data.merchantPayRedirectUrl
                        }
                    })
            }
        },
        nextStep() {
            if (!this.isLogin && this.payType === 1) {
                this.$confirm('The eWallet needs to login the startimes first', () => {
                    this.$router.push('/hybrid/account/login')
                })
                return
            }
            if (this.form_exit) {
                this.$router.push(
                    `/hybrid/payment/form?payToken=${this.payToken}&payChannelId=${this.payChannel}&appInterfaceMode=${this.appInterfaceMode}`
                )
            } else {
                if (this.appInterfaceMode === 2) {
                    window.open(this.redirectUrl)
                    // this.$confirm(
                    //     'If payment has been completed,please click done.If you encounter problems,please try again or contact appservice@startimes.com.cn',
                    //     () => {
                    //         // 跳转商户页
                    //     },
                    //     'Completed',
                    //     'Try again'
                    // )
                }
                this.$router.push(`/hybrid/payment/payResult?payToken=${this.payToken}`)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    .goods {
        width: 100%;
        text-align: center;
        padding: 0.8rem 0;
        margin-bottom: 1.5rem;
        .pay-money {
            font-weight: bold;
            font-size: 2.25rem;
            color: #212121;
            span {
                font-size: 1.25rem;
            }
        }
        .pay-subject {
            color: #666666;
            font-size: 1.1rem;
        }
    }
    .pay-channels {
        width: 90%;
        margin: 0 auto;
        & > div {
            border-bottom: 1px solid #eeeeee;
            padding: 0.8rem 0;
        }
        .radio {
            img {
                width: 1.5rem;
            }
            span {
                margin-left: 0.5rem;
                color: #333333;
                font-weight: bold;
            }
            position: relative;
            cursor: pointer;
            display: block;
            line-height: 2rem;
            height: 2.3rem;
            input {
                position: absolute;
                left: -9999px;
                &:checked {
                    & + i {
                        border: 2px solid #008be9;
                        &:after {
                            opacity: 1;
                        }
                    }
                }
            }
            i {
                width: 1.3rem;
                height: 1.3rem;
                outline: 0;
                border: 2px solid #ddd;
                background: #ffffff;
                border-radius: 100%;
                float: right;
                margin-top: 0.45rem;
                display: flex;
                &:after {
                    content: '';
                    width: 0.8rem;
                    height: 0.8rem;
                    border-radius: 100%;
                    background-color: #008be9;
                    opacity: 0;
                    transition: opacity 0.1s;
                    -webkit-transition: opacity 0.1s;
                    margin: auto;
                }
            }
        }
    }
    .desc {
        width: 90%;
        margin: 0 auto;
        line-height: 1.3rem;
        margin-top: 0.8rem;
    }
    .error-msg {
        position: fixed;
        bottom: 4.5rem;
        color: red;
        font-size: 0.8rem;
        width: 100%;
        text-align: center;
    }
    .footer {
        position: fixed;
        bottom: 2rem;
        width: 75%;
        margin: 0 auto;
        left: 0;
        right: 0;
    }
}
</style>
