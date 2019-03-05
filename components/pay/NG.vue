<template>
    <div class="wrapper">
        <p>Pay with eWallet</p>
        <mLine />
        <radioBtnRight :radio-list="radioList" @pick="changeItem" :balance="balance" :payment-amount="paymentAmount"/>
        <div class="addCard" @click="addCard">
            <div class="img-box" />
            <span>Add a card to pay</span>
            <img src="~assets/img/dvb/ic_right_def_r.png">
        </div>
        <p @click="pay('bank')">Pay with Bank</p>
        <p>Pay with GTB 737</p>
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
            paymentAmount:'',
            currency: this.$store.state.country.currencySymbol,
        }
    },
     beforeMount() {
        let param = JSON.parse(sessionStorage.getItem('order-info'))
        this.paymentAmount = param.paymentAmount
    },
    mounted() {
        this.$axios.get('/payment/v2/pay-channels/993102/card-auth').then(res => {
            if(res.data && res.data.length > 0){
                res.data.forEach(ele => {
                    this.radioList.push(ele)
                });
            }
        })
    },
    computed: {
        balance() {
            // return this.formatAmount(this.wallet.amount)
            return "0"
        },
        canPay() {
            if (this.selected==0 && this.wallet.amount < this.paymentAmount ) {
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
        addCard() {
            this.$emit('doAdd')
        },
        pay(method) {
            let channel, payType, apiType
            if(method == 'bank'){
                channel = 993101
                payType = 3
                apiType = 2
                console.log(method)
            }else{
                channel = this.selected == 0 ?  9002 : 993102
                payType = this.selected == 0 ?  1 : 3
                apiType = this.selected == 0 ?  1 : 2
            }
            let useForm = false
            // byPass ewallet true,  width card(list true/ add false), with bank false
            let checkPass = channel ==  9002 ? true : channel == 993102 && this.radioList.length > 1 ? true : false
            if (this.canPay) this.$emit('pay', channel, payType, apiType, useForm, checkPass)
        },
        formatAmount(num) {
            return formatAmount(num)
        },
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
