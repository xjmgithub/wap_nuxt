<template>
    <div class="wrapper">
        <p>Pay with eWallet</p>
        <mLine/>
        <radioBtnRight :radio-list="radioList" :balance="balance" :payment-amount="paymentAmount" @pick="changeItem" @charge="chargeWallet"/>
        <div class="addCard" @click="paywithCard">
            <div class="img-box"/>
            <span>Add a card to pay</span>
            <img src="~assets/img/dvb/ic_right_def_r.png">
        </div>
        <p @click="payWithBank">Pay with Bank</p>
        <!-- <p>Pay with GTB 737</p> -->
        <div class="note">
            <p>Note:</p>
            <p>{{radioList[selected].node}}</p>
        </div>
        <div class="btn-box">
            <span class="total">{{$store.state.lang.payment_details_total}}:</span>
            <span class="total">{{ currency }}{{ formatAmount(paymentAmount)}}</span>
            <div class="pay-btn" :class="{disabled:!canPay}" @click="pay">{{$store.state.lang.dvb_recharge_btn_pay}}</div>
        </div>
    </div>
</template>
<script>
import mLine from '~/components/pay/line'
import radioBtnRight from '~/components/radioBtnRight'
import { formatAmount } from '~/functions/utils'
import { createDVBOrder, checkPass, invoke, commonPayAfter, chargeWallet } from '~/functions/pay'
export default {
    props: {
        wallet: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            radioList: [
                {
                    brand: 'balance',
                    cardType: 'Balance: ',
                    checked: true,
                    node: 'to Pay with an eWallet Balance'
                }
            ],
            selected: 0,
            paymentAmount: '',
            currency: this.$store.state.country.currencySymbol
        }
    },
    beforeMount() {
        let param = JSON.parse(sessionStorage.getItem('order-info'))
        this.paymentAmount = Math.floor(param.paymentAmount)
    },
    mounted() {
        this.$axios.get('/payment/v2/pay-channels/993102/card-auth').then(res => {
            if (res.data && res.data.length > 0) {
                res.data.forEach(ele => {
                    this.radioList.push(ele)
                })
            }
        })
    },
    computed: {
        balance() {
            return this.wallet.amount
            // return 0
        },
        canPay() {
            if (this.selected == 0 && this.balance < this.paymentAmount) {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        changeItem(index) {
            this.selected = index
        },
        chargeWallet() {
            chargeWallet(this)
        },
        addCard() {
            this.$emit('doAdd')
        },
        /* 
            channel 支付渠道号，width card 993102 ,with bank 993101, 钱包9002
            payType 支付方式 ewallet 1, width card/bank 3 
            apiType 接口模型 ewallet 1, width card/bank 2
            form   是否需要表单 false
            byPass ewallet true,  width card(list true/ add false), with bank false
        */
        payWithBank() {
            let order = JSON.parse(sessionStorage.getItem('order-info'))
            createDVBOrder(this, order, data => {
                invoke(this, data.paymentToken, 993101, data => {
                    commonPayAfter(this, data, 3, 2)
                })
            })
        },
        paywithCard(card) {
            if (card) {
                checkPass(this, this.wallet.accountNo, () => {
                    // TODO 跳支付密码
                    this.payHandle(993102, 3, 2,card)
                })
            } else {
                this.payHandle(993102, 3, 2)
            }
        },
        payHandle(channel, payType, apiType,card) {
            let order = JSON.parse(sessionStorage.getItem('order-info'))
            createDVBOrder(this, order, data => {
                invoke(this, data.paymentToken, channel, data => {
                    commonPayAfter(this, data, payType, apiType)
                },{
                    authorization_code:card
                })
            })
        },
        pay(method) {
            if(this.selected){
                this.paywithCard('AUTH_9wubyetg4d')
            }else{
                this.payHandle(9002, 1, 1)
            }
            
            return false


            let payType = this.selected == 0 ? 1 : 3
            let apiType = this.selected == 0 ? 1 : 2
            let useForm = false
            let checkPass = false
            let channel
            if (method == 'bank') {
                channel = 993101
                this.$emit('pay', channel, payType, apiType, useForm, checkPass)
            } else if (method == 'add') {
                channel = 993102
                this.$emit('pay', channel, payType, apiType, useForm, checkPass)
            } else {
                channel = this.selected == 0 ? 9002 : 993102
                // byPass ewallet true,  width card(list true/ add false), with bank false
                heckPass = channel == 9002 ? true : channel == 993102 && this.radioList.length > 1 ? true : false
                if (this.canPay) this.$emit('pay', channel, payType, apiType, useForm, checkPass)
            }
        },
        formatAmount(num) {
            return formatAmount(num)
        }
    },
    components: {
        mLine,
        radioBtnRight
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    color: #333333;
    & > p {
        padding: 1rem 0;
        &:nth-child(n + 1) {
            border-bottom: 1px solid #e0e0e0;
        }
    }
    .addCard {
        border-bottom: 1px solid #e0e0e0;
        padding: 0.45rem 0 0.7rem;
        font-size: 0.9rem;
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
        width: 90%;
        bottom: 0;
        position: fixed;
        left: 5%;
        padding: 0.5rem 0;
        border-top: 1px solid #e0e0e0;
        line-height: 2.3rem;
        background: #fff;
        .pay-btn {
            margin-bottom: 0;
            width: 7rem;
            float: right;
            margin-top: 0;
        }
        .total {
            font-size: 1.15rem;
            font-weight: bold;
        }
    }
}
</style>
