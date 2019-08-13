<template>
    <div class="container">
        <div class="goods">
            <p v-show="totalAmount" class="pay-money">
                <span>{{currencySymbol}}</span>
                {{totalAmount | formatAmount}}
            </p>
            <p class="pay-subject">Production Name: {{paySubject}}</p>
        </div>
        <div class="contain">
            <div class="pay-channels">
                <div v-for="(item,i) in payChannels" :key="i">
                    <label class="radio">
                        <img v-if="item.logoUrl" :src="cdnPic(item.logoUrl)" />
                        <img v-else src="~assets/img/pay/ewallet.png" />
                        <span v-if="item.payType==1&&eCurrencySymbol&&eAmount>=0">eWallet: {{eCurrencySymbol}}{{eAmount| formatAmount}}</span>
                        <span v-else-if="item.payType==1">eWallet</span>
                        <span v-else>{{item.name}}</span>
                        <input
                            :checked="lastpay==item.id || i===0?true:false"
                            :value="item.payType"
                            :data-id="item.id"
                            type="radio"
                            name="pay-options"
                            @click="initChannel(item)"
                        />
                        <i />
                    </label>
                </div>
            </div>
            <div v-show="payDesc" class="desc">
                <p>Note:</p>
                <p v-html="payDesc" />
            </div>
        </div>
        <div class="footer">
            <div class="error-msg" v-html="errorMsg" />
            <mButton :disabled="Boolean(errorMsg)" text="PAY NOW" @click="nextStep" />
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import { formatAmount, cdnPicSrc, getCookie } from '~/functions/utils'
import { updateWalletAccount, updateWalletConf, invoke, commonPayAfter } from '~/functions/pay'
import countrys from '~/functions/countrys.json'
export default {
    layout: 'base',
    components: {
        mButton
    },
    filters: {
        formatAmount(num) {
            return formatAmount(num)
        },
        formatDefPay(num) {
            return formatAmount(num)
        }
    },
    data() {
        const user = this.$store.state.user
        const obj = {}
        countrys.forEach(item => {
            obj[item.country] = item
        })
        return {
            isLogin: user.roleName && user.roleName.toUpperCase() !== 'ANONYMOUS',
            payToken: this.$route.query.payToken || '',
            channel: {
                payChannel: -1,
                appInterfaceMode: null,
                payType: -1,
                formConfigExist: false
            },
            currency: '', // 商品货币code
            currencySymbol: '', // 商品货币符号
            totalAmount: '',
            paySubject: '',
            payChannels: [],
            lastpay: '',
            eAmount: '', // 电子钱包余额
            eCurrency: '', // 电子钱包货币code
            eCurrencySymbol: '', // 电子钱包货币符号
            oCurrency: '', // 渠道货币code 用于比较判断
            countrys: obj
        }
    },
    computed: {
        payDesc() {
            let tmp = ''
            this.payChannels.forEach(ele => {
                if (ele.payType == this.channel.payType) {
                    tmp = ele.description
                }
            })
            return tmp
        },
        errorMsg() {
            let tmp = ''
            if (!this.isLogin && this.channel.payType === 1) return tmp
            else if (this.currency != this.oCurrency) tmp = 'Commodity currency does not match wallet currency and cannot be paid'
            else if (this.eAmount < this.totalAmount && this.channel.payType === 1) tmp = 'The wallet balance is insufficient to pay for the goods'
            return tmp
        }
    },
    mounted() {
        const sessionToken = sessionStorage.getItem('payToken')
        if (!this.payToken) {
            if (sessionToken) {
                this.payToken = sessionToken
            } else {
                this.$alert('Query payToken needed! please check request')
                return false
            }
        }
        sessionStorage.setItem('payToken', this.payToken)
        this.getPayMethods()
        if (this.isLogin) this.getMyEwallet()
    },
    methods: {
        getPayMethods() {
            this.lastpay = getCookie('lastpay') || ''
            this.$axios.get(`/payment/api/v2/get-pre-payment?payToken=${this.payToken}`).then(res => {
                const data = res.data
                if (data && data.payChannels && data.payChannels.length > 0) {
                    data.payChannels.sort((a, b) => {
                        return a.orderSeq - b.orderSeq
                    })
                    this.currency = data.currency
                    this.currencySymbol = this.countrys[data.country].currencySymbol
                    this.totalAmount = data.totalAmount
                    this.paySubject = data.paySubject
                    this.payChannels = data.payChannels
                    const payChannels = {}
                    this.payChannels.forEach(item => {
                        payChannels[item.id] = item
                    })
                    this.lastpay && this.initChannel(payChannels[this.lastpay])
                    !this.lastpay && this.initChannel(this.payChannels[0])
                } else {
                    this.$alert('payToken and payChannel Mismatch! please check request')
                }
            })
        },
        getMyEwallet() {
            updateWalletAccount.call(this, account => {
                this.eAmount = account.amount
                this.eCurrency = account.currency
                this.eCurrencySymbol = account.currencySymbol
                sessionStorage.setItem('wallet', JSON.stringify(account))
                updateWalletConf.call(this, account.accountNo)
                if (this.lastpay >= 9003 && this.lastpay <= 9034) {
                    this.oCurrency = account.currency
                }
            })
        },
        cdnPic(src) {
            return cdnPicSrc.call(this, src)
        },
        initChannel(item) {
            this.channel.payType = item.payType
            this.channel.payChannel = item.id
            this.channel.formConfigExist = item.formConfigExist
            this.channel.appInterfaceMode = item.appInterfaceMode
            this.oCurrency = item.payType == 1 ? this.eCurrency : item.currency
        },
        nextStep() {
            if (this.channel.payType === 1) {
                if (!this.isLogin) {
                    this.$confirm('The eWallet needs to login the startimes first', () => {
                        window.location.href = `${location.origin}/hybrid/account/signIn?pre=${location.href}`
                    })
                } else {
                    const passIsSet = JSON.parse(localStorage.getItem('wallet_config')).payPassword
                    if (passIsSet === 'true') {
                        this.$router.push(`/hybrid/payment/wallet/paybyPass?channel=${this.channel.payChannel}&payToken=${this.payToken}`)
                    } else {
                        this.$router.push(`/hybrid/payment/wallet/setPassword?channel=${this.channel.payChannel}&payToken=${this.payToken}`)
                    }
                }
            } else if (this.channel.formConfigExist) {
                this.$router.push(
                    `/hybrid/payment/form?payToken=${this.payToken}&payChannelId=${this.channel.payChannel}&appInterfaceMode=${
                        this.channel.appInterfaceMode
                    }`
                )
            } else {
                invoke.call(this, this.payToken, this.channel.payChannel, data => {
                    this.$nuxt.$loading.finish()
                    this.$store.commit('HIDE_SHADOW_LAYER')
                    commonPayAfter.call(this, data, this.channel.payType, this.channel.appInterfaceMode)
                })
            }
        }
    },
    head() {
        return {
            title: 'Confirm Payment'
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    width: 100%;
    height: 100%;
    padding: 0 5%;
    .goods {
        width: 90%;
        text-align: center;
        padding: 0.8rem 0;
        margin-bottom: 1.5rem;
        height: 7.5rem;
        position: fixed;
        top: 0;
        background: #ffffff;
        z-index: 99;
        word-break: break-all;
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
    .contain {
        // height: 60vh; // 兼容
        overflow-y: scroll;
        margin-top: 7.5rem;
        margin-bottom: 6.5rem;
        .pay-channels {
            width: 100%;
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
            width: 100%;
            line-height: 1.3rem;
            margin-top: 0.8rem;
        }
    }
    .footer {
        width: 100%;
        background: #ffffff;
        z-index: 99;
        position: fixed;
        bottom: 0rem;
        margin: 0 auto;
        left: 0;
        right: 0;
        height: 6rem;
        padding-bottom: 2rem;
        box-sizing: border-box;
        .error-msg {
            color: red;
            font-size: 0.8rem;
            width: 75%;
            text-align: center;
            display: block;
            margin: 0 auto;
            padding-top: 0.5rem;
        }
        button {
            width: 75%;
        }
    }
}
</style>
