<template>
    <div class="pay-cont">
        <p>Pay with eWallet</p>
        <mLine/>
        <radioBtnRight
            v-if="isLogin"
            :radio-list="radioList"
            :balance="balance"
            :payment-amount="paymentAmount"
            @pick="changeItem"
            @charge="chargeWallet"
        />
        <div v-if="osv5" class="addCard" @click="payHandle(993102, 3, 2,'eWallet-NEWCARD')">
            <div class="img-box"/>
            <span v-if="radioList.length>1&&isLogin">Pay with Another Card</span>
            <span v-else>Add a Bank Card</span>
            <img src="~assets/img/dvb/ic_right_def_r.png" class="arrows">
        </div>
        <p v-for="(item,i) in normalMethods" :key="i" class="bb1" @click="payHandle(item.id,item.payType,item.appInterfaceMode,item.name)">
            {{item.name}}
            <img src="~assets/img/dvb/ic_right_def_r.png" class="arrows">
        </p>
        <div v-show="showDes" class="note">
            <p>Note:</p>
            <p v-html="showDes"/>
        </div>
        <div class="btn-box">
            <span class="total">{{$store.state.lang.payment_details_total}}:</span>
            <span class="total">{{ currency }}{{ formatAmount(paymentAmount)}}</span>
            <div :class="{disabled:!canPay}" class="pay-btn" @click="pay">{{$store.state.lang.dvb_recharge_btn_pay}}</div>
        </div>
    </div>
</template>
<script>
import mLine from '~/components/pay/line'
import radioBtnRight from '~/components/radioBtnRight'
import { formatAmount, getCookie } from '~/functions/utils'
import { createDVBOrder, invoke, commonPayAfter, chargeWallet, checkPass, needPassVerify } from '~/functions/pay'
export default {
    components: {
        mLine,
        radioBtnRight
    },
    data() {
        const user = this.$store.state.user
        return {
            radioList: [],
            walletDes: '',
            payStackDes: '',
            normalMethods: [],
            selected: {},
            paymentAmount: 0,
            wallet: {},
            currency: this.$store.state.country.currencySymbol,
            isLogin: user.roleName && user.roleName.toUpperCase() !== 'ANONYMOUS',
            osv5: false
        }
    },
    computed: {
        balance() {
            return (this.wallet && this.wallet.amount) || 0
        },
        canPay() {
            if (this.selected.brand === 'balance' && this.balance < this.paymentAmount) {
                return false
            } else {
                return true
            }
        },
        showDes() {
            if (this.selected.brand !== 'balance') {
                return this.payStackDes
            } else {
                return this.walletDes
            }
        }
    },
    mounted() {
        if (navigator.connection) {
            this.osv5 = true
        } else {
            this.sendEvLog({
                category: 'dvbservice',
                action: 'hide_payment',
                label: 1,
                value: 0,
                service_type: 'Recharge'
            })
        }

        const param = JSON.parse(sessionStorage.getItem('order-info'))
        this.paymentAmount = Math.floor(param.paymentAmount)
        this.$axios.get(`/wxorder/v1/queryPaymentChannelByCountryCode?countryCode=${this.$store.state.country.country}`).then(res => {
            if (res.data && res.data.length > 0) {
                // 993102 ， 993101,9002
                res.data.forEach(ele => {
                    if (ele.id !== 993102 && ele.id !== 993101 && ele.id !== 9002) {
                        this.normalMethods.push(ele)
                    } else if (ele.id === 993102) {
                        this.payStackDes = ele.description
                    } else if (ele.id === 9002) {
                        this.walletDes = ele.description
                    }
                })
            }
        })

        this.$axios.get(`/mobilewallet/v1/accounts/me`).then(res => {
            this.wallet = res.data
            sessionStorage.setItem('wallet', JSON.stringify(this.wallet))
        })

        this.$axios
            .get('/payment/v2/pay-channels/993102/card-auth')
            .then(res => {
                const lastpay = getCookie('lastpay')
                if (res.data && res.data.length > 0) {
                    const list = [...res.data]
                    if (lastpay === 'card') {
                        this.radioList = list.concat([
                            {
                                brand: 'balance',
                                cardType: 'Balance: '
                            }
                        ])
                    } else {
                        this.radioList = [
                            {
                                brand: 'balance',
                                cardType: 'Balance: '
                            }
                        ].concat(list)
                    }
                    this.selected = this.radioList[0]
                } else {
                    this.radioList = [
                        {
                            brand: 'balance',
                            cardType: 'Balance: '
                        }
                    ]
                    this.selected = this.radioList[0]
                }
            })
            .catch(() => {
                this.radioList = [
                    {
                        brand: 'balance',
                        cardType: 'Balance: '
                    }
                ]
                this.selected = this.radioList[0]
            })
    },
    methods: {
        changeItem(item) {
            this.selected = item
        },
        chargeWallet() {
            chargeWallet(this, () => {
                this.$axios.get(`/mobilewallet/v1/accounts/me`).then(res => {
                    this.wallet = res.data
                    sessionStorage.setItem('wallet', JSON.stringify(this.wallet))
                })
            })
        },
        /* 
            channel 支付渠道号，width card 993102 ,with bank 993101, 钱包9002
            payType 支付方式 ewallet 1, width card/bank 3 
            apiType 接口模型 ewallet 1, width card 3/2 , with bank 2
            card 是否是绑卡支付
        */
        payHandle(channel, payType, apiType, name, card) {
            const order = JSON.parse(sessionStorage.getItem('order-info'))
            this.$nuxt.$loading.start()
            this.$store.commit('SHOW_SHADOW_LAYER')

            this.sendEvLog({
                category: 'dvbservice',
                action: 'order_click',
                label: name,
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
                // 生成订单
                if (needPassVerify(channel, card)) {
                    checkPass.call(this, this.wallet.accountNo, setted => {
                        this.$nuxt.$loading.finish()
                        this.$store.commit('HIDE_SHADOW_LAYER')
                        if (setted) {
                            this.$router.push(`/hybrid/payment/wallet/paybyPass?paytoken=${data.paymentToken}&channel=9002&card=${card || ''}`)
                        } else {
                            this.$alert('For your security,please set up your password for eWallet and register your phone number.', () => {
                                this.$router.push(`/hybrid/payment/wallet/setPassword?paytoken=${data.paymentToken}&channel=9002&card=${card || ''}`)
                            })
                        }
                    })
                } else {
                    invoke.call(this, data.paymentToken, channel, data => {
                        this.$nuxt.$loading.finish()
                        this.$store.commit('HIDE_SHADOW_LAYER')
                        commonPayAfter.call(this, data, payType, apiType)
                    })
                }
            })
        },
        pay() {
            this.canPay &&
                (this.selected.brand === 'balance'
                    ? this.payHandle(9002, 1, 1, 'eWallet-BALANCE')
                    : this.payHandle(993102, 3, 3, 'eWallet-OLDCARD', this.selected.authorizationCode))
        },
        formatAmount(num) {
            return formatAmount(num)
        }
    }
}
</script>
<style lang="less" scoped>
.pay-cont {
    margin: 0 auto;
    padding: 0 0.8rem 5rem;
    & > p {
        position: relative;
        padding: 0.65rem 0;
    }
    .arrows {
        position: absolute;
        right: 0.3rem;
        top: 0.6rem;
    }
    .bb1 {
        border-bottom: 1px solid #e0e0e0;
    }
    .addCard {
        border-bottom: 1px solid #e0e0e0;
        font-size: 0.95rem;
        height: 2.7rem;
        line-height: 2.2rem;
        position: relative;
        .img-box {
            display: inline-block;
            vertical-align: middle;
            height: 1.3rem;
            width: 1.3rem;
            background-size: 100% !important;
            background: url('~assets/img/dvb/ic_ewallet_add.png') no-repeat;
        }
        span {
            margin-left: 0.5rem;
        }
    }
    .note {
        font-size: 0.95rem;
        color: #666666;
        line-height: 1.3rem;
        background: #fff;
        word-break: break-all;
        padding-top: 0.7rem;
        p {
            margin: 0;
            padding: 0;
        }
    }
    .btn-box {
        bottom: 0;
        position: fixed;
        padding: 0.8rem 0;
        left: 0.8rem;
        right: 0.8rem;
        border-top: 1px solid #e0e0e0;
        line-height: 2.3rem;
        background: #fff;
        .pay-btn {
            background-color: #008be9;
            color: #fff;
            height: 2.4rem;
            width: 7rem;
            line-height: 2.4rem;
            text-align: center;
            font-size: 0.9rem;
            float: right;
            border-radius: 4px;
            &.disabled {
                background-color: #bdbdbd;
            }
        }
        .total {
            font-size: 1.15rem;
            font-weight: bold;
        }
    }
}
</style>
