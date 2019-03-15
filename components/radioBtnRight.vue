<template>
    <div class="radio-box">
        <div v-for="(item,i) in radioList" :key="i">
            <label class="radio">
                <div :class="item.brand" class="img-box"/>
                <span v-if="item.brand==='balance'">{{item.cardType}} {{currency}} {{ formatAmount(balance) }}</span>
                <span v-else>{{item.cardType}}({{item.last4}})</span>
                <input @click="checkThis(item)" :checked="i===0?true:false" type="radio" name="pay-options" value="item.code">
                <i/>
                <div @click="chargeWallet" v-if="item.brand==='balance'&&balance<paymentAmount" class="recharge">RECHARGE</div>
            </label>
        </div>
    </div>
</template>
<script>
import { formatAmount } from '~/functions/utils'
export default {
    props: {
        radioList: {
            type: Array,
            required: true,
            default: () => []
        },
        balance: {
            type: Number,
            required: true,
            default: 0
        },
        paymentAmount: {
            type: Number,
            required: true,
            default: 0
        }
    },
    data() {
        return {
            currency: this.$store.state.country.currencySymbol
        }
    },
    methods: {
        checkThis(item) {
            this.$emit('pick', item)
        },
        chargeWallet() {
            this.$emit('charge')
        },
        formatAmount(num) {
            return formatAmount(num)
        }
    }
}
</script>
<style lang="less" scoped>
.radio-box .img-box {
    display: inline-block;
    vertical-align: middle;
    height: 1.3rem;
    width: 1.3rem;
    background-size: 100% !important;
    &.balance {
        background: url('~assets/img/dvb/ic_ewallet_balance.png') no-repeat;
    }
    &.visa {
        background: url('~assets/img/dvb/ic_visa.png') no-repeat;
    }
    &.verve {
        background: url('~assets/img/dvb/ic_verve.png') no-repeat;
    }
    &.master {
        background: url('~assets/img/dvb/ic_mastercard.png') no-repeat;
    }
    &.default {
        background: url('~assets/img/dvb/ic_no_logo_card.png') no-repeat;
    }
}
.radio-box .radio {
    position: relative;
    cursor: pointer;
    display: block;
    line-height: 2rem;
    height: 2.3rem;
}
.radio-box input {
    position: absolute;
    left: -9999px;
}

.radio-box .radio i {
    width: 1.3rem;
    height: 1.3rem;
    outline: 0;
    border: 2px solid #ddd;
    background: #ffffff;
    border-radius: 100%;
    float: right;
    margin-top: 0.45rem;
    display: flex;
}

.radio-box i:after {
    content: '';
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 100%;
    background-color: #008be9;
    opacity: 0;
    transition: opacity 0.1s;
    -webkit-transition: opacity 0.1s;
    margin:auto;
}
.radio-box input:checked + i {
    border: 2px solid #008be9;
}
.radio-box input:checked + i:after {
    opacity: 1;
}
.radio-box input + i + .recharge {
    display:none;
}
.radio-box input:checked + i + .recharge {
    display:block
}
.radio-box span {
    font-size: 0.95rem;
    margin-left: 0.5rem;
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
</style>
