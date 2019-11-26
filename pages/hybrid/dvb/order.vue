<template>
    <div class="wrapper">
        <div class="goods">
            <p v-show="totalAmount" class="pay-money">
                <span>{{currencySymbol}}</span>
                {{totalAmount | formatAmount }}
            </p>
            <p v-show="rechargeAmount&&rechargeAmount>totalAmount" class="recharge-money">
                <span>{{currencySymbol}}</span>
                {{rechargeAmount | formatAmount }}
            </p>
            <p class="pay-subject">{{paySubject}}</p>
        </div>
        <div v-if="payChannels&&payChannels.length>0" class="contain">
            <div class="pay-channels">
                <div v-for="(item,i) in payChannels" :key="i">
                    <label class="radio">
                        <img v-if="item.logoUrl" :src="cdnPic(item.logoUrl)" onerror="this.src='http://cdn.startimestv.com/banner/pay_ment_default.png'" />
                        <img v-else-if="!item.logoUrl&&item.payType==1" src="http://cdn.startimestv.com/banner/ic_ewallet_def_g%20copy.png" />
                        <img v-else src="~/assets/img/pay/pay_ment_default.png" />
                        <span v-if="item.payType==1&&eCurrencySymbol&&eAmount>=0">{{$store.state.lang.eWallet}}: {{eCurrencySymbol}}{{eAmount| formatAmount}}</span>
                        <span v-else-if="item.payType==1">{{$store.state.lang.eWallet}}</span>
                        <span v-else>{{item.name}}</span>
                        <input v-if="!item.payChannelCardAuthDtoList" :checked="item.lastSuccessPay|| i===0" :value="item.payType" :data-id="item.id" type="radio" name="pay-options" @click="initChannel(item)" />
                        <i v-show="!item.payChannelCardAuthDtoList" />
                        <div v-show="item.payType==1&&eAmount&&eAmount<totalAmount&&currencySymbol==eCurrencySymbol" class="recharge" @click="chargeWallet">RECHARGE</div>
                    </label>
                    <div class="sub-channels">
                        <div v-for="(card,si) in item.payChannelCardAuthDtoList" v-show="item.payChannelCardAuthDtoList && item.payChannelCardAuthDtoList.length > 0 && isLogin" :key="si">
                            <label class="radio">
                                <div :class="card.brand" class="img-box" />
                                <span>{{card.cardType}}({{card.last4}})</span>
                                <input :checked="isLogin && item.lastSuccessPay &&si===0" :value="item.payType" :data-id="item.id" type="radio" name="pay-options" @click="initSubChannel(item,card)" />
                                <i />
                            </label>
                        </div>
                        <label v-show="item.payChannelCardAuthDtoList" class="radio">
                            <img src="~/assets/img/dvb/ic_ewallet_add.png" />
                            <span>{{$store.state.lang.add_card_topay}}</span>
                            <input :checked="item.lastSuccessPay && item.payChannelCardAuthDtoList&&item.payChannelCardAuthDtoList.length<=0" :value="item.payType" :data-id="item.id" type="radio" name="pay-options" @click="initChannel(item)" />
                            <i />
                        </label>
                    </div>
                </div>
            </div>
            <div v-show="payDesc" class="desc">
                <p>{{$store.state.lang.note}}:</p>
                <p v-html="payDesc" />
            </div>
        </div>
        <div v-if="loaded&&payChannels.length<=0" class="contain nochannel">
            {{$store.state.lang.starpay_payment_no_paychannel}}
        </div>
        <div class="footer">
            <div class="error-msg" v-html="errorMsg" />
            <mButton :disabled="Boolean(errorMsg)" :text="$store.state.lang.pay_now" @click="pay" />
        </div>
        <div v-show="isYueMo" style="color: white;padding:5%;position:absolute;bottom:12rem;">{{$store.state.lang.monthly_billing}}:</div>
    </div>
</template>
<script>
import { cdnPicSrc } from '~/functions/utils'
import { updateWalletAccount, updateWalletConf, createDVBOrder, checkPass, invoke, commonPayAfter, chargeWallet } from '~/functions/pay'
import mButton from '~/components/button'
import countrys from '~/functions/countrys.json'

export default {
    layout: 'base',
    components: {
        mButton
    },
    filters: {
        formatAmount(num) {
            const arr = num.toString().split('.')
            if (arr[1] && arr[1] != '00') {
                const tmp = Number(0 + '.' + arr[1]).toFixed(2)
                return arr[0].toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,') + '.' + tmp.toString().split('.')[1]
            } else {
                return arr[0].toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,')
            }
        }
    },
    data() {
        const user = this.$store.state.user
        const obj = {}
        countrys.forEach(item => {
            obj[item.country] = item
        })
        return {
            currencySymbol: '',
            totalAmount: '', // 折后价
            rechargeAmount: '', // 原价
            paySubject: '',
            payChannels: [],
            channel: {
                payChannel: -1,
                appInterfaceMode: null,
                payType: -1,
                formConfigExist: false,
                needEwalletPwdVerify: '',
                currencySymbol: '',
                fkPayChannelId: '',
                payChannelName: ''
            },
            selected: {},
            eCurrencySymbol: '', // 电子钱包货币符号
            eAmount: '', // 电子钱包余额
            isLogin: user.roleName && user.roleName.toUpperCase() !== 'ANONYMOUS',
            loaded: false,
            countrys: obj,
            isYueMo: false,
            wallet: {}
        }
    },
    computed: {
        payDesc() {
            let tmp = ''
            this.payChannels.forEach(ele => {
                if (ele.id == this.channel.payChannel) {
                    tmp = ele.description
                }
            })
            return tmp
        },
        errorMsg() {
            let tmp = ''
            if (this.loaded && this.payChannels.length <= 0) tmp = this.$store.state.lang.starpay_payment_no_paychannel
            if (!this.isLogin && this.channel.payType === 1) return tmp
            else if (this.currencySymbol != this.oCurrencySymbol) tmp = this.$store.state.lang.starpay_payment_currency_error
            else if (this.eAmount < this.totalAmount && this.channel.payType === 1) tmp = this.$store.state.lang.starpay_payment_amount_error
            return tmp
        },
        oCurrencySymbol() {
            // 渠道货币符号 用于比较判断
            if (this.channel.payType == 1) {
                return this.eCurrencySymbol
            } else {
                return this.channel.currencySymbol
            }
        }
    },
    asyncData({ app: { $axios }, store }) {
        return {
            serverTime: new Date()
        }
    },
    mounted() {
        const param = JSON.parse(sessionStorage.getItem('order-info'))
        this.sendEvLog({
            category: 'dvbservice',
            action: 'order_show',
            label: 'DVB_H5',
            value: 1,
            SmartCardNo: param.cardNo,
            BouquetName: param.program_name,
            CardState: param.smartcard_status,
            PauseDate: param.stop_days,
            service_type: 'Recharge'
        })
        this.totalAmount = param.paymentAmount
        this.rechargeAmount = param.rechargeAmount
        this.currencySymbol = param.currency
        this.paySubject = `Decoder top-up(Card No.${param.cardNo}) ${param.rechargeExplanation.replace('x', '*')}`
        this.yueMo()
        this.getPayMethods()
        if (this.isLogin) this.getMyEwallet()
    },
    methods: {
        // 判断是否是月末
        yueMo() {
            const isBeyondYear = new Date(this.serverTime).getMonth() + 1 >= 12
            let nextMonthFirstDay
            if (isBeyondYear) {
                nextMonthFirstDay = new Date(new Date(this.serverTime).getFullYear() + 1 + '-01-01').getTime()
            } else {
                nextMonthFirstDay = new Date(
                    new Date(this.serverTime).getFullYear() + '-' + new Date(this.serverTime).getMonth() + 2 + '-01'
                ).getTime()
            }

            const threeHoursBefore = nextMonthFirstDay - 3 * 60 * 60 * 1000
            const threeHoursAfter = nextMonthFirstDay + 3 * 60 * 60 * 1000
            const now = this.serverTime.getTime()
            if (threeHoursBefore <= now && threeHoursAfter >= now) {
                this.isYueMo = true
            }
        },
        cdnPic(src) {
            return cdnPicSrc.call(this, src)
        },
        chargeWallet() {
            chargeWallet.call(this, () => {
                this.$axios.get(`/mobilewallet/v1/accounts/me`).then(res => {
                    this.wallet = res.data
                    sessionStorage.setItem('wallet', JSON.stringify(this.wallet))
                    this.getMyEwallet()
                })
            })
        },
        pay() {
            const channel = this.channel
            const order = JSON.parse(sessionStorage.getItem('order-info'))
            this.$nuxt.$loading.start()
            this.$store.commit('SHOW_SHADOW_LAYER')
            this.sendEvLog({
                category: 'dvbservice',
                action: 'order_click',
                label: channel.payChannelName, // TODO 埋点名称
                value: order.rechargeAmount || 0,
                service_type: 'Recharge',
                recharge_config: order.rechargeItemSelectedName,
                recharge_amount: order.rechargeItemSelectedQuantity,
                SmartCardNo: order.cardNo,
                BouquetName: order.program_name,
                CardState: order.smartcard_status,
                PauseDate: order.stop_days
            })

            createDVBOrder.call(this, order, data => {
                if (channel.payType === 1 || this.authorizationCode) {
                    checkPass.call(this, this.wallet.accountNo, setted => {
                        this.$nuxt.$loading.finish()
                        this.$store.commit('HIDE_SHADOW_LAYER')
                        if (setted) {
                            this.$router.push(
                                `/hybrid/payment/wallet/paybyPass?payToken=${data.paymentToken}&channel=${channel.fkPayChannelId}&apiType=${
                                    channel.appInterfaceMode
                                }&card=${this.authorizationCode || ''}`
                            )
                        } else {
                            this.$alert('For your security,please set up your password for eWallet and register your phone number.', () => {
                                this.$router.push(
                                    `/hybrid/payment/wallet/setPassword?payToken=${data.paymentToken}&channel=${channel.fkPayChannelId}&apiType=${
                                        channel.appInterfaceMode
                                    }&card=${this.authorizationCode || ''}`
                                )
                            })
                        }
                    })
                } else if (channel.formConfigExist) {
                    this.$nuxt.$loading.finish()
                    this.$store.commit('HIDE_SHADOW_LAYER')
                    this.$router.push(
                        `/hybrid/payment/form?payToken=${data.paymentToken}&payChannelId=${channel.fkPayChannelId}&appInterfaceMode=${
                            channel.appInterfaceMode
                        }`
                    )
                } else {
                    invoke.call(this, data.paymentToken, channel.fkPayChannelId, data => {
                        this.$nuxt.$loading.finish()
                        this.$store.commit('HIDE_SHADOW_LAYER')
                        commonPayAfter.call(this, data, channel.payType, channel.appInterfaceMode)
                    })
                }
            })
        },
        getMyEwallet() {
            updateWalletAccount.call(this, account => {
                this.wallet = account
                this.eAmount = account.amount
                this.eCurrencySymbol = this.countrys[account.country].currencySymbol
                sessionStorage.setItem('wallet', JSON.stringify(this.wallet))
                updateWalletConf.call(this, account.accountNo)
            })
        },
        initChannel(item) {
            this.channel.payType = item.payType
            this.channel.payChannel = item.id
            this.channel.formConfigExist = item.formConfigExist
            this.channel.appInterfaceMode = item.appInterfaceMode
            this.channel.payChannelName = item.name
            this.channel.fkPayChannelId = item.fkPayChannelId
            this.channel.currencySymbol = this.countrys[item.countryCode].currencySymbol
            this.authorizationCode = ''
        },
        initSubChannel(item, card) {
            this.initChannel(item)
            this.authorizationCode = card.authorizationCode
        },
        getPayMethods() {
            this.$axios.get(`/wxorder/v2/payment_channels`).then(res => {
                this.loaded = true
                this.payChannels = this.bubbleSort(res.data) || []
                const payChannels = {}
                let lastpay = ''
                let authCode = ''
                this.payChannels.forEach(item => {
                    payChannels[item.id] = item
                    if (item.lastSuccessPay) {
                        lastpay = item.id
                        authCode =
                            item.payChannelCardAuthDtoList && item.payChannelCardAuthDtoList.length > 0
                                ? item.payChannelCardAuthDtoList[0].authorizationCode
                                : ''
                    }
                })
                lastpay && this.initChannel(payChannels[lastpay])
                !lastpay && this.initChannel(this.payChannels[0])
                this.authorizationCode = authCode
            })
        },
        bubbleSort(arr) {
            let temp
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr.length - i - 1; j++) {
                    if (parseInt(arr[j].payType) > parseInt(arr[j + 1].payType)) {
                        temp = arr[j]
                        arr[j] = arr[j + 1]
                        arr[j + 1] = temp
                    }
                }
            }
            return arr
        }
    },
    head() {
        return {
            title: this.$store.state.lang.my_order_details
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    width: 100%;
    height: 100%;
    padding: 0 5%;
    .goods {
        width: 90%;
        text-align: center;
        padding: 0.8rem 0;
        margin-bottom: 1.5rem;
        height: 8.3rem;
        position: fixed;
        top: 0;
        background: #ffffff;
        z-index: 99;
        word-break: break-all;
        .pay-money {
            font-weight: bold;
            font-size: 2rem;
            color: #212121;
            margin-bottom: 0.4rem;
            span {
                font-size: 1.25rem;
            }
        }
        .recharge-money {
            color: #666666;
            text-decoration: line-through;
        }
        .pay-subject {
            color: #666666;
            font-size: 1.1rem;
            word-break: break-word;
            margin: 0.8rem 0;
        }
    }
    .contain {
        overflow-y: scroll;
        margin-top: 7.5rem;
        margin-bottom: 6.5rem;
        &::-webkit-scrollbar {
            display: none;
        }
        .pay-channels {
            width: 100%;
            font-weight: bold;
            & > div {
                border-bottom: 1px solid #eeeeee;
                padding: 0.8rem 0;
            }
            .radio {
                position: relative;
                .img-box {
                    display: inline-block;
                    vertical-align: middle;
                    height: 1.3rem;
                    width: 1.3rem;
                    background-size: 100% !important;
                    background: url('~assets/img/dvb/ic_no_logo_card.png') no-repeat;
                    &.balance {
                        background: url('~assets/img/dvb/ic_ewallet_balance.png') no-repeat;
                    }
                    &.visa {
                        background: url('~assets/img/dvb/ic_visa.png') no-repeat;
                    }
                    &.verve {
                        background: url('~assets/img/dvb/ic_verve.png') no-repeat;
                    }
                    &.mastercard {
                        background: url('~assets/img/dvb/ic_mastercard.png') no-repeat;
                    }
                }
                img {
                    width: 1.5rem;
                }
                span {
                    margin-left: 0.5rem;
                    color: #333333;
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
                            & + .recharge {
                                display: block;
                            }
                            &:after {
                                opacity: 1;
                            }
                        }
                    }
                    & + i.recharge {
                        display: none;
                    }
                }
                .recharge {
                    color: #008be9;
                    font-weight: bold;
                    font-size: 0.9rem;
                    position: absolute;
                    top: 0.1rem;
                    right: 2rem;
                    text-decoration: underline;
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
            .sub-channels {
                padding-left: 2rem;
                font-weight: normal;
                img {
                    width: 1.3rem;
                }
            }
        }
        .desc {
            width: 100%;
            line-height: 1.3rem;
            margin-top: 0.8rem;
        }
        &.nochannel {
            padding-top: 2rem;
            text-align: center;
            color: #666666;
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

