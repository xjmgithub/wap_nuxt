<template>
    <div class="wrapper">
        <card-info/>
        <order-info/>
        <pay-method/>
        <div v-show="isYueMo" style="color: white;padding:5%;position:absolute;bottom:12rem;">{{$store.state.lang.monthly_billing}}:</div>
    </div>
</template>
<script>
import cardInfo from '~/components/dvb/cardInfo'
import orderInfo from '~/components/dvb/orderInfo'
import payMethod from '~/components/dvb/payMethod'
export default {
    layout: 'base',
    components: {
        cardInfo,
        orderInfo,
        payMethod
    },
    data() {
        return {
            isLoading: false,
            isYueMo: false,
            country: this.$store.state.country.country
        }
    },
    watch: {
        isLoading(val, oldVal) {
            if (val) {
                this.$nuxt.$loading.start()
                this.$store.commit('SHOW_SHADOW_LAYER')
            } else {
                this.$nuxt.$loading.finish()
            }
        }
    },
    asyncData({ app: { $axios }, store }) {
        return {
            serverTime: new Date()
        }
    },
    mounted() {
        // 判断是否是月末
        const isBeyondYear = new Date(this.serverTime).getMonth() + 1 >= 12
        let nextMonthFirstDay
        if (isBeyondYear) {
            nextMonthFirstDay = new Date(new Date(this.serverTime).getFullYear() + 1 + '-01-01').getTime()
        } else {
            nextMonthFirstDay = new Date(new Date(this.serverTime).getFullYear() + '-' + new Date(this.serverTime).getMonth() + 2 + '-01').getTime()
        }

        const threeHoursBefore = nextMonthFirstDay - 3 * 60 * 60 * 1000
        const threeHoursAfter = nextMonthFirstDay + 3 * 60 * 60 * 1000
        const now = this.serverTime.getTime()
        if (threeHoursBefore <= now && threeHoursAfter >= now) {
            this.isYueMo = true
        }

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
    },
    head() {
        return {
            title: this.$store.state.lang.my_order_details
        }
    }
}
</script>
