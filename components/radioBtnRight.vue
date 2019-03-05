<template>
    <div class="radio-box">
        <div v-for="(item,i) in radioList" :key="i">
            <label class="radio">
                <div class="img-box" :class="item.brand"/>
                <span v-if="i==0" >{{item.cardType}} {{currency}} {{ balance }}</span>
                <span v-else>{{item.cardType}}({{item.last4}}) </span>
                <input type="radio" name="pay-options" value="item.code" @click="checkThis(i)" :checked="item.checked?true:false">
                <i/>
                <div
                    class="recharge"
                    @click="chargeWallet"
                    v-if="i==0 &&balance < paymentAmount&& canRecharge"
                >RECHARGE</div>
            </label>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        radioList: {
            type: Array,
            required: true,
            default: new Array()
        },
        balance:{
            type: String,
            required: true,
            default: ''
        },
        paymentAmount:{
            type: String,
            required: true,
            default: ''
        }
    },
    data(){
        return{
            currency: this.$store.state.country.currencySymbol,
            canRecharge:true
        }
    },
    methods: {
        checkThis(index) {
            this.$emit('pick', index)
            this.canRecharge = index == 0? true :false
        },
        chargeWallet() {
            this.$emit('charge')
        },
    }
}
</script>
<style lang="less" scoped>
.radio-box .img-box {
    display: inline-block;
    vertical-align: middle;
    height: 1.4rem;
    width:1.4rem;
    background-size: 100% !important;
    &.balance{
        background: url("~assets/img/dvb/ic_ewallet_balance.png") no-repeat ;
    }
    &.visa{
        background: url("~assets/img/dvb/ic_visa.png") no-repeat ;
    }
    &.verve{
        background: url("~assets/img/dvb/ic_verve.png") no-repeat ;
    }
    &.master {
        background: url("~assets/img/dvb/ic_mastercard.png") no-repeat ;
    }
    &.default{
        background: url("~assets/img/dvb/ic_no_logo_card.png") no-repeat ;
    }
   
}
.radio-box > div {
    margin-top: 0.4rem;
}
.radio-box .radio {
    position: relative;
    cursor: pointer;
    display: block;
    line-height: 1.65rem;
    height: 1.65rem;
}
.radio-box input {
    position: absolute;
    left: -9999px;
}

.radio-box .radio i {
    width: 1.1rem;
    height: 1.1rem;
    outline: 0;
    border: 2px solid #ddd;
    background: #ffffff;
    border-radius: 50%;
    float:right;
    position: relative;
    top:.35rem;
}

.radio-box i:after {
    position: absolute;
    content: '';
    top: 0.13rem;
    left: 0.13rem;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background-color: #008be9;
    opacity: 0;
    transition: opacity 0.1s;
    -webkit-transition: opacity 0.1s;
}
.radio-box input:checked + i {
    border: 2px solid #008be9;
}
.radio-box input:checked + i:after {
    opacity: 1;
}
.radio-box span {
    font-size: 0.9rem;
    margin-left: .5rem;
}
.recharge {
    color: #008be9;
    font-weight: bold;
    font-size: 0.9rem;
    position: absolute;
    top: 0.1rem;
    right: 2rem;
}
</style>
