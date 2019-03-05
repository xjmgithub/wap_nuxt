<template>
    <div id="wrapper">
        <div class="container">
            <card-info/>
            <order-info/>
            <pay-methods :wallet="wallet" @charge="chargeWallet" @pay="pay"/>
            <!-- <NG class="ng-pay" :currency="currency" :amount="wallet_account.amount" @doAdd="toAddCard"/>
            <div class="btn-box">
                <span class="total">{{$store.state.lang.payment_details_total}}:</span>
                <span class="total">{{ currency }}{{ paymentAmount | formatMoney }}</span>
                <div class="pay-btn" :class="{disabled:!canPay}" @click="payNG">{{$store.state.lang.dvb_recharge_btn_pay}}</div>
            </div>-->
            <div style="color: white;padding:5%;position:absolute;bottom:12rem;" v-show="isYueMo">{{$store.state.lang.monthly_billing}}:</div>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
import NG from '~/components/pay/NG'
import cardInfo from '~/components/dvb/cardInfo'
import orderInfo from '~/components/dvb/orderInfo'
import payMethods from '~/components/dvb/payMethods'
import { parseUA, toNativePage } from '~/functions/utils.js'
export default {
    layout: 'base',
    async asyncData({ app: { $axios }, store }) {
        let user = store.state.user
        let wallet = null
        if (user.roleName && user.roleName.toUpperCase() != 'ANONYMOUS') {
            $axios.setHeader('token', store.state.token)
            let { data } = await $axios.get(`/mobilewallet/v1/accounts/me`)
            wallet = data
        }
        return {
            wallet: wallet,
            serverTime: new Date()
        }
    },
    data() {
        let user = this.$store.state.user
        return {
            isLogin: user.roleName && user.roleName.toUpperCase() != 'ANONYMOUS',
            isApp: this.$store.state.appType,
            cardNum: '',
            cardNo: '',
            program: '',
            state: '',
            isLoading: false,
            money: '',
            tv_platform: '',
            stop_days: '',
            rechargeExplanation: '',
            paymentAmount: '',
            rechargeAmount: '',
            firstChargeTip: '',
            currency: '',
            methodsList: [],
            selectMethod: {},
            countryCode: '',
            fcmToken: '',
            isYueMo: false,
            cardHaveCharged: 0,
            dstr: ''
        }
    },
    mounted() {
        // 判断是否是月末
        let isBeyondYear = new Date(this.serverTime).getMonth() + 1 >= 12 ? true : false
        let nextMonthFirstDay
        if (isBeyondYear) {
            nextMonthFirstDay = new Date(new Date(this.serverTime).getFullYear() + 1 + '-01-01').getTime()
        } else {
            nextMonthFirstDay = new Date(new Date(this.serverTime).getFullYear() + '-' + new Date(this.serverTime).getMonth() + 2 + '-01').getTime()
        }

        let threeHoursBefore = nextMonthFirstDay - 3 * 60 * 60 * 1000
        let threeHoursAfter = nextMonthFirstDay + 3 * 60 * 60 * 1000
        let now = this.serverTime.getTime()
        if (threeHoursBefore <= now && threeHoursAfter >= now) {
            this.isYueMo = true
        }

        this.dstr = parseUA(this.isApp) // 支付统计用
        this.fcmToken = (window.getChannelId && getChannelId.getFCMToken && window.getChannelId.getFCMToken()) || ''
        let param = JSON.parse(sessionStorage.getItem('order-info'))

        this.sendEvLog({
            category: 'dvbservice',
            action: 'order_show',
            label: 'DVB_H5',
            value: 10,
            SmartCardNo: param.cardNo,
            BouquetName: param.program_name,
            CardState: param.smartcard_status,
            PauseDate: param.stop_days,
            service_type: 'Recharge',
            page_from: 'new'
        })

        this.cardNo = param.cardNo
        this.program = param.program_name
        this.state = param.smartcard_status
        this.money = param.money
        this.tv_platform = param.tv_platform
        this.rechargeExplanation = param.rechargeExplanation
        this.paymentAmount = param.paymentAmount
        this.rechargeAmount = param.rechargeAmount
        this.firstChargeTip = param.firstChargeTip
        this.cardHaveCharged = param.cardHaveCharged
        this.currency = param.currency
        this.countryCode = param.countryCode
        this.stop_days = param.stop_days
        let tmp = param.cardNo
        let len = tmp.length
        for (let i = 0; i < len; i++) {
            this.cardNum += tmp[i]
            if (i == 2 || i == 6) {
                this.cardNum += ' '
            }
        }
    },
    methods: {
        chargeWallet() {
            this.$alert(this.$store.state.lang.refresh_wallet,() => {
                //TODO refresh this.getWalletAccount()
            })
            toNativePage('com.star.mobile.video.wallet.WalletRechargeActivity')
        },
        payNG() {
            this.$axios.get('/payment/v2/pay-channels/993102/card-auth').then(res => {
                console.log(res.data)
            })

            let param = JSON.parse(sessionStorage.getItem('order-info'))
            this.$axios({
                url: `/wxorder/v1/geneOrder4OnlinePay`,
                method: 'post',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    token: this.$store.state.token
                },
                data: qs.stringify(
                    Object.assign({}, param, {
                        orderSource: 2,
                        fcmToken: this.fcmToken || '',
                        promotion: !this.isLogin ? 'l1' : 'lalala'
                    })
                )
            }).then(res => {
                this.$axios({
                    url: `/payment/api/v2/invoke-payment`,
                    method: 'post',
                    data: {
                        payToken: res.data.paymentToken,
                        payChannelId: 993102,
                        tradeType: 'JSAPI',
                        signType: 'MD5',
                        deviceInfo: this.dstr,
                        extendInfo: {}
                    }
                }).then(res => {
                    //console.log(res.data)
                    window.location.href = res.data.tppRedirectUrl
                })
            })
        },
        createOrder(callback) {
            this.$axios({
                url: `/wxorder/v1/geneOrder4OnlinePay`,
                method: 'post',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    token: this.$store.state.token
                },
                data: qs.stringify(
                    Object.assign({}, param, {
                        orderSource: 2,
                        fcmToken: this.fcmToken || '',
                        promotion: !this.isLogin ? 'l1' : 'lalala'
                    })
                )
            }).then(res => {
                callback(res.data)
            })
        },
        checkPass(callback) {
            this.$axios
                .get(`/mobilewallet/v1/accounts/${this.wallet.accountNo}/prop-details`)
                .then(res => {
                    if (res.data) {
                        if (res.data.payPassword == 'true') {
                            callback()
                        } else {
                            this.$alert('For your security,please set up your password for eWallet and register your phone number.', '', () => {
                                this.isLoading = false
                                toNativePage('com.star.mobile.video.wallet.WalletPwdSettingActivity?EXTRA_KEY_SMS_CODE=StarT1mes$PaY')
                            })
                        }
                    } else {
                        this.isLoading = false
                        this.$alert('ewallet config error')
                    }
                })
                .catch(err => {
                    this.isLoading = false
                    this.$alert(this.$store.state.lang.error_network, () => {}, 'Retry')
                })
        },
        pay(channel, payType, apiType, form, byPass) {
            if (byPass) {
                this.checkPass(() => {
                    this.payHandle(channel, payType, apiType, form)
                })
            } else {
                this.payHandle(channel, payType, apiType, form)
            }
        },
        payHandle(channel, payType, apiType, form) {
            this.createOrder(data => {
                if (form) {
                    this.$router.push(`/hybrid/payment/form?payToken=${data.paymentToken}&payChannelId=${channel}`)
                } else {
                    this.invoke(data, channel, () => {
                        if (payType == 1) {
                            // 钱包支付
                            sessionStorage.setItem('payObj', JSON.stringify(res.data))
                            this.$router.push(`/hybrid/payment/wallet/paybyPass?product=${this.rechargeExplanation}`)
                        } else if (payType == 3 || payType == 4) {
                            // 第三方在线支付 订阅
                            if (apiType == 2) {
                                window.location.href = res.data.tppRedirectUrl
                            } else if (apiType == 3) {
                                window.location.href = '/DVB/proccess.php?seqNo=' + res.data.paySeqNo
                            } else {
                                this.$alert('The payment method is not supported for the time being')
                            }
                        } else {
                            this.$alert('The payment method is not supported for the time being')
                        }
                    })
                }
            })
        },
        invoke(data, channel, callback) {
            this.$axios({
                url: `/payment/api/v2/invoke-payment`,
                method: 'post',
                data: {
                    payToken: data.paymentToken,
                    payChannelId: channel,
                    tradeType: 'JSAPI',
                    signType: 'MD5',
                    deviceInfo: this.dstr,
                    extendInfo: {}
                }
            })
                .then(res => {
                    this.isLoading = false
                    if (res.data.resultCode == 0) {
                        callback()
                    } else {
                        this.$alert(res.data.resultMessage)
                    }
                })
                .catch(err => {
                    this.isLoading = false
                    this.$alert(this.$store.state.lang.error_network, () => {}, 'Retry')
                })
        },
        toAddCard() {
            // TODO
            console.log('toAddCard')
        }
    },
    watch: {
        isLoading(val, oldVal) {
            if (val) {
                this.$nuxt.$loading.start()
                this.$store.commit('SHOW_SHADOW_LAYER')
            } else {
                this.$nuxt.$loading.finish()
            }
        }
    },
    components: {
        NG,
        cardInfo,
        orderInfo,
        payMethods
    },
    head() {
        return {
            title: this.$store.state.lang.my_order_details
        }
    }
}
</script>
<style lang="less">
.ng-pay {
    width: 90%;
    margin: 0 auto;
    padding-bottom: 5.5rem;
}
.pay-btn {
    background-color: #008be9;
    color: #fff;
    height: 2.4rem;
    line-height: 2.4rem;
    text-align: center;
    font-size: 0.9rem;
    margin: 0 auto;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    &.disabled {
        background-color: #bdbdbd;
    }
    .need-pay {
        margin-right: 0.5rem;
    }
}
</style>
