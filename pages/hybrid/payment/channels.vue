<template>
    <div class="container">
        <div class="goods">
            <p v-show="totalAmount" class="pay-money">
                <span>{{currency}}</span>{{totalAmount | formatAmount}}
            </p>
            <p class="pay-subject">Production Name: {{paySubject}}</p>
        </div>
        <div class="pay-channels">
            <div v-for="(item,i) in payChannels" :key="i">
                <label class="radio">
                    <img v-if="item.logoUrl" :src="cdnPic(item.logoUrl)">
                    <img v-else src="~assets/img/pay/ewallet.png">
                    <span v-if="item.payType==1&&eCurrencySymbol&&eAmount>=0">eWallet: {{eCurrencySymbol}}{{eAmount| formatAmount}}</span>
                    <span v-else-if="item.payType==1">eWallet</span>
                    <span v-else>{{item.name}}</span>
                    <input :checked="lastpay===item.id || i===0?true:false" type="radio" name="pay-options" value="item.payType" @click="checkThis(item)">
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
import { formatAmount, cdnPicSrc, setCookie, getCookie } from '~/functions/utils'
import { updateWalletAccount, updateWalletConf, invoke, commonPayAfter } from '~/functions/pay'
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
        return {
            isLogin: user.roleName && user.roleName.toUpperCase() !== 'ANONYMOUS',
            payToken: this.$route.query.payToken,
            payChannel: 9003,
            appInterfaceMode: null,
            currency: '',
            totalAmount: '',
            paySubject: '',
            payChannels: [],
            lastpay: '',
            payType: 1,
            eAmount: '',
            eCurrency: '',
            eCurrencySymbol: '',
            formConfigExist: false
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
        errorMsg() {
            let tmp = ''
            if (!this.isLogin && this.payType === 1) return tmp
            else if (this.currency != this.eCurrency) tmp = 'Commodity currency does not match wallet currency and cannot be paid'
            else if (this.eAmount < this.totalAmount && this.payType === 1) tmp = 'The wallet balance is insufficient to pay for the goods'
            return tmp
        }
    },
    mounted() {
        this.getPayMethods()
        if (this.isLogin) this.getMyEwallet()
        this.lastpay = getCookie('lastpay')
        console.log(this.lastpay)
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
        getMyEwallet() {
            updateWalletAccount.call(this, account => {
                this.eAmount = account.amount
                this.eCurrency = account.currency
                this.eCurrencySymbol = account.currencySymbol
                sessionStorage.setItem('wallet', JSON.stringify(account))
                updateWalletConf.call(this, account.accountNo)
            })
        },
        cdnPic(src) {
            return cdnPicSrc.call(this, src)
        },
        checkThis(item) {
            this.payType = item.payType
            this.currency = item.currency
            this.payChannel = item.id
            this.formConfigExist = item.formConfigExist
            this.appInterfaceMode = item.appInterfaceMode
        },
        nextStep() {
            if (this.payType === 1) {
                if (!this.isLogin) {
                    this.$confirm('The eWallet needs to login the startimes first', () => {
                        this.$router.push(`/hybrid/account/signin?pre=${location.href}`)
                    })
                } else {
                    const passIsSet = JSON.parse(localStorage.getItem('wallet_config')).payPassword
                    if (passIsSet === 'true') {
                        this.$router.push(`/hybrid/payment/wallet/paybyPass?channel=${this.payChannel}&payToken=${this.payToken}`)
                    } else {
                        this.$router.push(`/hybrid/payment/wallet/setPassword?channel=${this.payChannel}&payToken=${this.payToken}`)
                    }
                }
            } else if (this.formConfigExist) {
                this.$router.push(
                    `/hybrid/payment/form?payToken=${this.payToken}&payChannelId=${this.payChannel}&appInterfaceMode=${this.appInterfaceMode}`
                )
            } else {
                invoke.call(this, this.payToken, this.payChannel, data => {
                    setCookie('lastpay', this.channel)
                    this.$nuxt.$loading.finish()
                    this.$store.commit('HIDE_SHADOW_LAYER')
                    commonPayAfter.call(this, data, this.payType, this.appInterfaceMode)
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
