<template>
    <div class="pay-cont">
        <p>Pay with eWallet</p>
        <mLine/>
        <radioBtnRight :radio-list="radioList" :balance="balance" :payment-amount="paymentAmount" @pick="changeItem" @charge="chargeWallet"/>
        <div @click="payHandle(993102, 3, 2)" class="addCard">
            <div class="img-box"/>
            <span>Add a card to pay</span>
            <img src="~assets/img/dvb/ic_right_def_r.png">
        </div>
        <p @click="payHandle(993101, 3, 2)" class="bb1">Pay with Bank</p>
        <p v-for="(item,i) in normalMethods" :key="i" @click="payHandle(item.id,item.payType,item.appInterfaceMode)" class="bb1">{{item.name}}</p>
        <div v-show="showDes" class="note">
            <p>Note:</p>
            <p v-html="showDes"/>
        </div>
        <div class="btn-box">
            <span class="total">{{$store.state.lang.payment_details_total}}:</span>
            <span class="total">{{ currency }}{{ formatAmount(paymentAmount)}}</span>
            <div :class="{disabled:!canPay}" @click="pay" class="pay-btn">{{$store.state.lang.dvb_recharge_btn_pay}}</div>
        </div>
    </div>
</template>
<script>
import mLine from '~/components/pay/line'
import radioBtnRight from '~/components/radioBtnRight'
import { formatAmount, getCookie } from '~/functions/utils'
import { createDVBOrder, invoke, commonPayAfter, chargeWallet, checkPass } from '~/functions/pay'
export default {
    components: {
        mLine,
        radioBtnRight
    },
    props: {
        wallet: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            radioList: [],
            walletDes: '',
            payStackDes: '',
            normalMethods: [],
            selected: {},
            paymentAmount: 0,
            currency: this.$store.state.country.currencySymbol
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
        const param = JSON.parse(sessionStorage.getItem('order-info'))
        this.paymentAmount = Math.floor(param.paymentAmount)

        this.$axios.get(`/wxorder/v1/queryPaymentChannelByCountryCode?countryCode=${this.$store.state.country.countryCode}`).then(res => {
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

        this.$axios.get('/payment/v2/pay-channels/993102/card-auth').then(res => {
            if (res.data && res.data.length > 0) {
                const lastpay = getCookie('lastpay')
                const list = [...res.data]
                if (lastpay === 'wallet') {
                    this.radioList = [
                        {
                            brand: 'balance',
                            cardType: 'Balance: ',
                            checked: true
                        }
                    ].concat(list)
                } else {
                    this.radioList = list.concat([
                        {
                            brand: 'balance',
                            cardType: 'Balance: '
                        }
                    ])
                }
                this.selected = this.radioList[0]
            }
        })
    },
    methods: {
        changeItem(item) {
            this.selected = item
        },
        chargeWallet() {
            chargeWallet(this)
        },
        /* 
            channel 支付渠道号，width card 993102 ,with bank 993101, 钱包9002
            payType 支付方式 ewallet 1, width card/bank 3 
            apiType 接口模型 ewallet 1, width card/bank 2
            form   是否需要表单 false
            byPass ewallet true,  width card(list true/ add false), with bank false
        */
        payHandle(channel, payType, apiType, card) {
            const order = JSON.parse(sessionStorage.getItem('order-info'))
            this.$nuxt.$loading.start()
            this.$store.commit('SHOW_SHADOW_LAYER')
            const opt = card ? { authorization_code: card } : null
            createDVBOrder(this, order, data => {
                invoke(
                    this,
                    data.paymentToken,
                    channel,
                    data => {
                        this.$nuxt.$loading.finish()
                        this.$store.commit('HIDE_SHADOW_LAYER')
                        commonPayAfter(this, data, payType, apiType)
                    },
                    opt
                )
            })
        },
        pay() {
            this.canPay &&
                checkPass(this, this.wallet.accountNo, () => {
                    if (this.selected.brand !== 'balance') {
                        this.$router.push(`/hybrid/payment/wallet/paybyPass?card=${this.selected.authorizationCode}`)
                    } else {
                        this.payHandle(9002, 1, 1)
                    }
                })
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
    padding: 0 0.8rem;
    padding-bottom: 5rem;
    & > p {
        line-height: 3.2rem;
        font-size: 1.1rem;
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
        img {
            position: absolute;
            right: 0.3rem;
            top: 0.6rem;
        }
    }
    .note {
        font-size: 0.85rem;
        color: #666666;
        line-height: 1.1rem;
        background: #fff;
        word-break: break-all;
        padding-top: 0.5rem;
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
