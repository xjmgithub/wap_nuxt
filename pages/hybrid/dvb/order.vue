<template>
    <div id="wapper">
        <div class="container">
            <div class="card-box">
                <div class="card-msg">
                    <p><span>{{$store.state.lang.smart_card_no_content}}</span>{{ cardNum }}</p>
                    <p class="state" v-if=" state === 'PUNISH_STOP'">
                        <img src="~assets/img/dvb/ic_dormant.png" alt=""> {{$store.state.lang.dormant}}
                    </p>
                    <p class="state" v-else-if="state === 'VALID'">
                        <img src="~assets/img/dvb/ic_active.png" alt="">
                        <span style="font-size:1rem;" v-if="stop_days">
                            {{$store.state.lang.dvb_acitve_to}} {{stop_days}}
                        </span>
                        <span style="font-size:1rem;" v-if="!stop_days">
                            {{$store.state.lang.active_}}
                        </span>
                    </p>
                    <p class="state" v-else-if=" state === 'PAUSE'">
                        <img src="~assets/img/dvb/ic_suspended_def_y.png" alt=""> {{$store.state.lang.link_suspend}}
                    </p>
                    <p class="state" v-else-if="money">
                        {{$store.state.lang.smart_card_balance}} {{money | formatMoney}}
                    </p>
                </div>
                <div class="card-type">
                    <p class="platform" v-show="tv_platform == 'DTH'">
                        <img src="~assets/img/dvb/ic_dth.png" alt="">{{ program }}
                    </p>
                    <p class="platform" v-show="tv_platform == 'DTT'">
                        <img src="~assets/img/dvb/ic_dtt.png" alt="">{{ program }}
                    </p>
                </div>
            </div>
            <div class="gap" />
            <div class="order-msg ">
                <div class="clearfix">
                    <span>
                        {{$store.state.lang.dvb_recharge_link_recharge}}
                    </span>
                    <span class="fr declare">{{rechargeExplanation}}</span>
                </div>
                <hr class="line">
                <div class="clearfix">
                    <span>
                        {{$store.state.lang.payment_details_promation}}
                    </span>
                    <span v-if="!cardHaveCharged&&firstChargeTip" class="fr" style="max-width:67%; font-size:0.9rem;">
                        {{firstChargeTip}}
                    </span>
                    <span v-else class="fr no-time">
                        {{$store.state.lang.recharge_no_promotion}}
                    </span>
                </div>
            </div>
            <div class="gap" />
            <div class="order-msg">
                <div class="clearfix">
                    <span>
                        {{$store.state.lang.results_recharge_amount}}
                    </span>
                    <span class="fr">{{ currency }} {{ rechargeAmount | formatMoney }}</span>
                </div>
                <div class="clearfix">
                    <span>
                        {{$store.state.lang.payment_discount}}
                    </span>
                    <span class="fr">- {{ currency }} {{(rechargeAmount-paymentAmount) | formatMoney}}</span>
                </div>
                <div class="clearfix total">
                    <span>
                        {{$store.state.lang.payment_details_total}}
                    </span>
                    <span class="fr">{{ currency }} {{ paymentAmount | formatMoney }}</span>
                </div>
            </div>
            <div class="gap" />
            <div class="pay-methods">
                <div class="methods">
                    <p>{{$store.state.lang.payment_details_method}}：</p>
                    <ul class="choose clearfix">
                        <li v-for="(item,index) in methodsList" :key="index" v-if="item.fkPayChannelId<9002||item.fkPayChannelId>9034||isLogin">
                            <label class="radio" @click="changeMethod(item)">
                                <input type="radio" name="methods" :value="item.name" v-model="selectMethod.name">
                                <i/>
                                <span>{{ item.name }}</span><br>
                                <span v-if="item.fkPayChannelId >= 9002 && item.fkPayChannelId <= 9034 && wallet_account.accountNo" class="balance" :class="{red:wallet_account.amount < paymentAmount}">
                                    (Balance:{{wallet_account.currencySymbol}}{{wallet_account.amount}} )
                                </span>
                            </label>
                            <div class="recharge" @click="chargeWallet" v-if="item.fkPayChannelId>=9002&&item.fkPayChannelId<=9034&&wallet_account.accountNo&&wallet_account.amount<paymentAmount">RECHARGE</div>
                        </li>
                    </ul>
                    <div class="note" v-show="selectMethod.description">
                        <p>Note:</p>
                        <p v-html="selectMethod.description" />
                    </div>
                </div>
            </div>
            <div class="btn-box">
                <span class="total">
                    {{$store.state.lang.payment_details_total}}:
                </span>
                <span class="total">{{ currency }}{{ paymentAmount | formatMoney }}</span>
                <div class="pay-btn" :class="{disabled:!canPay}" @click="payNow">
                    {{$store.state.lang.dvb_recharge_btn_pay}}
                </div>
            </div>
            <loading v-show="isLoading" />
            <div style="color: white;padding:5%;position:absolute;bottom:12rem;" v-show="isYueMo">
                {{$store.state.lang.monthly_billing}}:
            </div>
        </div>
    </div>
</template>
<script>
import loading from '~/components/loading'
export default {
    layout: 'base',
    data() {
        return {
            isLogin: this.$store.state.user.type || false,
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
            wallet_account: {},
            fcmToken: (window.getChannelId && getChannelId.getFCMToken && window.getChannelId.getFCMToken()) || '',
            serverTime: this.$store.state.serverTime,
            isYueMo: false
        }
    },
    created() {
        if (process.server) {
            let serverTime = new Date()
            this.$store.commit('SET_SERVER_TIME', serverTime)
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
        if ( threeHoursBefore <= now && threeHoursAfter >= now){
            this.isYueMo = true
        }

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
            service_type: 'Recharge'
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
        this.stop_days = param.stop_days ? dayjs(param.stop_days).format('MMM DD YYYY') : ''
        let tmp = param.cardNo
        let len = tmp.length
        for (let i = 0; i < len; i++) {
            this.cardNum += tmp[i]
            if (i == 2 || i == 6) {
                this.cardNum += ' '
            }
        }
        this.$axios({
            url: `/wxorder/v1/queryPaymentChannelByCountryCode?countryCode=${this.countryCode}`,
            method: 'get',
            data: {}
        })
            .then(res => {
                if (res.data && res.data.length > 0) {
                    this.methodsList = data
                    this.selectMethod = this.methodsList[0]
                } else {
                    this.$nextTick(() => {
                        this.$alert(this.$store.state.lang.error_network, () => {
                            window.location.reload()
                        })
                    })
                }
            })
            .catch(err => {
                this.$nextTick(() => {
                    this.$alert(this.$store.state.lang.error_network, () => {
                        window.location.reload()
                    })
                })
            })
        this.getWalletAccount()
    },
    methods: {
        chargeWallet() {
            // TODO IOS
            this.$alert(
                this.$store.state.lang.refresh_wallet,
                () => {
                    this.getWalletAccount()
                },
                this.$store.state.lang.continue_to_pay
            )
            window.getChannelId.toAppPage(3, 'com.star.mobile.video.wallet.WalletRechargeActivity', '')
        },
        payNow() {
            let param = JSON.parse(sessionStorage.getItem('order-info'))
            this.sendEvLog({
                category: 'dvbservice',
                action: 'order_click',
                label: this.selectMethod.name,
                value: this.rechargeAmount,
                service_type: 'Recharge',
                recharge_config: param.rechargeItemSelectedName,
                recharge_amount: param.rechargeItemSelectedQuantity,
                SmartCardNo: param.cardNo,
                BouquetName: this.program,
                CardState: this.state,
                PauseDate: this.stop_days
            })

            if (!this.canPay) return false

            this.isLoading = true

            if (this.selectMethod.fkPayChannelId >= 9002 && this.selectMethod.fkPayChannelId <= 9034) {
                this.$axios({
                    url: `/mobilewallet/v1/accounts/${this.wallet_account.accountNo}/prop-details`,
                    method: 'get',
                    data: {}
                })
                    .then(res => {
                        if (res.data) {
                            if (res.data.payPassword == 'true') {
                                this.toPay()
                            } else {
                                this.$alert('For your security,please set up your password for eWallet and register your phone number.', '', () => {
                                    this.isLoading = false
                                    window.getChannelId &&
                                        window.getChannelId.toAppPage(
                                            3,
                                            'com.star.mobile.video.wallet.WalletPwdSettingActivity?EXTRA_KEY_SMS_CODE=StarT1mes$PaY',
                                            ''
                                        )
                                })
                            }
                        } else {
                            this.isLoading = false
                            this.$alert('ewallet config error')
                        }
                    })
                    .catch(err => {
                        this.isLoading = false
                        this.$nextTick(() => {
                            this.$alert(this.$store.state.lang.error_network, () => {}, 'Retry')
                        })
                    })
            } else {
                this.toPay()
            }
        },
        changeMethod(item) {
            this.selectMethod = item
        },
        getWalletAccount() {
            this.$axios({
                url: `/mobilewallet/v1/accounts/me`,
                method: 'get',
                data: {}
            }).then(res => {
                if (res.data) {
                    this.wallet_account = data
                }
            })
        },
        toPay() {
            let param = JSON.parse(sessionStorage.getItem('order-info'))
            this.$axios({
                url: `/wxorder/v1/geneOrder4OnlinePay`,
                method: 'post',
                data: $.extend({}, param, {
                    orderSource: 1,
                    fcmToken: this.fcmToken || '',
                    promotion: !this.isLogin ? 'l1' : 'lalala'
                })
            })
                .then(res => {
                    if (res.data && res.data.orderNo && this.selectMethod.fkPayChannelId) {
                        if (this.selectMethod.formConfigExist) {
                            window.location.href =
                                'payment-form.php?payChannelId=' +
                                this.selectMethod.fkPayChannelId +
                                '&payType=' +
                                this.selectMethod.payType +
                                '&payToken=' +
                                res.data.paymentToken +
                                '&appInterfaceMode=' +
                                this.selectMethod.appInterfaceMode
                        } else {
                            if (this.selectMethod.payType != 1 && $.inArray(this.selectMethod.appInterfaceMode, [2, 3]) < 0) {
                                return false
                            }
                            this.$axios({
                                url: `/payment/api/v2/invoke-payment`,
                                method: 'post',
                                data: {
                                    payToken: data.paymentToken,
                                    payChannelId: this.selectMethod.fkPayChannelId,
                                    tradeType: 'JSAPI',
                                    signType: 'MD5',
                                    deviceInfo: dstr,
                                    extendInfo: {}
                                }
                            })
                                .then(res => {
                                    if (res.data.resultCode == 0) {
                                        if (this.selectMethod.payType == 1) {
                                            // 钱包支付
                                            sessionStorage.setItem('wallet_account', JSON.stringify(this.wallet_account))
                                            window.location.href =
                                                'walletpay.php?txNo=' +
                                                res.data.txNo +
                                                '&channelId=' +
                                                res.data.extendInfo.payeeAccountNo +
                                                '&sign=' +
                                                res.data.extendInfo.signature +
                                                '&seqNo=' +
                                                res.data.paySeqNo
                                        } else if (this.selectMethod.payType == 3 || this.selectMethod.payType == 4) {
                                            // 第三方在线支付 订阅
                                            if (this.selectMethod.appInterfaceMode == 2) {
                                                window.location.href = data.tppRedirectUrl
                                            } else if (this.paymethod.appInterfaceMode == 3) {
                                                window.location.href = 'proccess.php?seqNo=' + res.data.paySeqNo
                                            } else {
                                                this.$alert('The payment method is not supported for the time being')
                                            }
                                        } else {
                                            this.$alert('The payment method is not supported for the time being')
                                        }
                                    } else {
                                        this.$alert(res.data.resultMessage)
                                    }
                                })
                                .catch(err => {
                                    this.isLoading = false
                                    this.$nextTick(() => {
                                        this.$alert(this.$store.state.lang.error_network, () => {}, 'Retry')
                                    })
                                })
                        }
                    } else {
                        this.$alert(res.data.message)
                    }
                })
                .catch(err => {
                    this.isLoading = false
                    this.$nextTick(() => {
                        this.$alert(this.$store.state.lang.error_network, () => {}, 'Retry')
                    })
                })
        }
    },
    computed: {
        canPay() {
            if (this.selectMethod.fkPayChannelId) {
                if (this.selectMethod.fkPayChannelId >= 9002 && this.selectMethod.fkPayChannelId <= 9034) {
                    if (this.wallet_account.amount >= this.paymentAmount) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            } else {
                return false
            }
        }
    },
    filters: {
        formatMoney(val) {
            if (!isNaN(val)) {
                let arr = val.toString().split('.')
                if (arr[1]) {
                    return arr[0].toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,') + '.' + arr[1]
                } else {
                    return arr[0].toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,') + '.00'
                }
            } else {
                return ''
            }
        }
    },
    head() {
        return {
            title: this.$store.state.lang.my_order_details
        }
    }
}
sessionStorage.setItem('step2', 1)
// invoke deviceInfo
if (this.isApp == 1 || this.isApp == 2) {
    let system = this.isApp == 1 ? 'android' : 'ios'
    let dstr = 'APP(' + system + ',<?php echo $appVersionCode; ?>)'
    dstr += ';H5(' + system
    if (this.isApp == 1) {
        let s = navigator.userAgent.indexOf('Android')
        if (s > 0) {
            dstr += '_' + navigator.userAgent.substr(s + 8).split(';')[0]
        }
    } else {
        let s = navigator.userAgent.indexOf('iPhone OS')
        if (s > 0) {
            dstr += '_' + navigator.userAgent.substr(s + 10).split(' ')[0]
        }
    }
    dstr += ', Chrome'
    let b = navigator.userAgent.indexOf('Version')
    let c = navigator.userAgent.indexOf('Chrome')
    if (b > 0) {
        let s = navigator.userAgent
            .substr(b)
            .split(' ')[1]
            .split('/')[1]
        if (s) {
            dstr += '_' + s
        }
    } else {
        if (c > 0) {
            let s = navigator.userAgent
                .substr(c)
                .split(' ')[0]
                .split('/')[1]
            if (s) {
                dstr += '_' + s
            }
        }
    }
    dstr += ')'
} else {
    let plat = 'others'
    if (navigator.userAgent.indexOf('Android') > 0) {
        plat = 'android'
    } else if (navigator.userAgent.indexOf('iPhone') > 0) {
        plat = 'ios'
    }
    let dstr = 'H5(' + plat + ', MQQBrowser'
    let b = navigator.userAgent.indexOf('Version')
    let c = navigator.userAgent.indexOf('Chrome')
    if (b > 0) {
        let s = navigator.userAgent
            .substr(b)
            .split(' ')[1]
            .split('/')[1]
        if (s) {
            dstr += '_' + s
        }
    } else {
        if (c > 0) {
            let s = navigator.userAgent
                .substr(c)
                .split(' ')[0]
                .split('/')[1]
            if (s) {
                dstr += '_' + s
            }
        }
    }
    dstr += ')'
}
</script>
