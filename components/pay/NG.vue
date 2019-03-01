<template>
    <div class="wrapper">
        <p>Pay with eWallet</p>
        <mLine />
        <radioBtnRight :radio-list="radioList" @pick="changeItem" :balance="balance"/>
        <div class="addCard">
            <div class="img-box"/> 
            <span>Add a card to pay</span>
            <img src="~assets/img/dvb/ic_right_def_r.png" @click="addCard">
        </div>
        <p>Pay with Bank</p>
        <p>Pay with GTB 737</p>
        <div class="note">
            <p>Note:</p>
            <p>{{radioList[selected].node}}</p>
        </div>
    </div>
</template>
<script>
import mLine from '~/components/pay/line'
import radioBtnRight from '~/components/radioBtnRight'
export default {
    props: {
        currency:{
            type:String,
            required: true,
            default: '₦'
        },
        amount:{
            type:Number,
            required: true,
            default: 0
        }
    },
    data(){
        return{
            radioList:[
                {
                    className:'balance',
                    value:'Balance: ',
                    payType:1,
                    checked: true,
                    node:'to Pay with an eWallet Balance'
                },
                {
                    className:'balance',
                    value:'VISA Debit Card(0873)',
                    payType:2,
                    checked: false,
                    node:'to Pay by VISA Debit Card'
                }
            ],
            selected:0
        }
    },
    computed: {
         balance() {
            return this.currency + ' ' + this.$options.filters.formatMoney(this.amount)
        }
    },
    methods:{
        changeItem(code){
            this.selected = code
        },
        addCard(){
            this.$emit('doAdd')
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
   components:{
        mLine,
        radioBtnRight
   }
}
</script>
<style lang="less" scoped>
.wrapper {
    color:#333333;
    & > p{
        padding:1rem 0;
        &:nth-child(n+1){
            border-bottom:1px solid #e0e0e0;
        }
    }
    .addCard{
        border-bottom:1px solid #e0e0e0;
        padding:.45rem 0 .7rem;
        font-size: 0.9rem;
        position: relative;
        .img-box{
            display: inline-block;
            vertical-align: middle;
            height: 1.3rem;
            width:1.3rem;
            background-size: 100% !important;
            background: url("~assets/img/dvb/ic_ewallet_add.png") no-repeat ;
        }
        span{
            margin-left: 0.5rem;
        }
        img{
            position: absolute;
            right:.3rem;
            top:.6rem;
        }
    }
    .note {
        font-size: 0.85rem;
        color: #666666;
        line-height: 1.1rem;
        background: #fff;
        word-break: break-all;
        padding-top:.5rem;
        p {
            margin: 0;
            padding: 0;
        }
    }
}
</style>
