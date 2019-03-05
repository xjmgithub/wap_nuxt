<template>
    <div>
        <div class="gap"/>
        <div class="order-msg">
            <div class="clearfix">
                <span>{{LANG.dvb_recharge_link_recharge}}</span>
                <span class="fr declare">{{rechargeExplanation}}</span>
            </div>
            <hr class="line">
            <div class="clearfix">
                <span>{{LANG.payment_details_promation}}</span>
                <span v-if="!cardHaveCharged&&firstChargeTip" class="fr" style="max-width:67%; font-size:0.9rem;">{{firstChargeTip}}</span>
                <span v-else class="fr no-time">{{LANG.recharge_no_promotion}}</span>
            </div>
        </div>
        <div class="gap"/>
        <div class="order-msg">
            <div class="clearfix">
                <span>{{LANG.results_recharge_amount}}</span>
                <span class="fr">{{ currency }} {{ rechargeAmount | formatMoney }}</span>
            </div>
            <div class="clearfix">
                <span>{{LANG.payment_details_promation}}</span>
                <span class="fr">- {{ currency }} {{(rechargeAmount-paymentAmount) | formatMoney}}</span>
            </div>
            <div class="clearfix total">
                <span>{{LANG.payment_details_total}}</span>
                <span class="fr">{{ currency }} {{ paymentAmount | formatMoney }}</span>
            </div>
        </div>
        <div class="gap"/>
    </div>
</template>
<script>
import { formatAmount } from '~/functions/utils'
export default {
    data() {
        return {
            rechargeExplanation: '',
            cardHaveCharged: false,
            firstChargeTip: '',
            currency: this.$store.state.country.currencySymbol,
            rechargeAmount: 0,
            paymentAmount: 0
        }
    },
    computed: {
        LANG() {
            return this.$store.state.lang
        }
    },
    beforeMount() {
        let param = JSON.parse(sessionStorage.getItem('order-info'))
        this.rechargeExplanation = param.rechargeExplanation
        this.cardHaveCharged = param.cardHaveCharged
        this.firstChargeTip = param.firstChargeTip
        this.rechargeAmount = param.rechargeAmount
        this.paymentAmount = param.paymentAmount
    },
    filters: {
        formatMoney(val) {
            return formatAmount(val)
        }
    }
}
</script>
<style lang="less" scoped>
.gap {
    width: 100%;
    height: 0.5rem;
    background: #eee;
}
.order-msg {
    width: 90%;
    margin: 0 auto;
    padding: 0.5rem 0;
    & > div {
        margin: 0.5rem 0;
        .declare {
            color: #333333;
            font-weight: bold;
        }
        .no-time {
            color: #bdbdbd;
        }
    }
    .line {
        height: 1px;
        border: none;
        background-color: #e0e0e0;
        width: 100%;
    }
    .total {
        font-size: 1.15rem;
        font-weight: bold;
    }
}
</style>
