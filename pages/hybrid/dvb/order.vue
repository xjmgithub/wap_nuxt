<template>
    <div class="wrapper">
        <div class="container">
            <card-info/>
            <order-info/>
            <!-- <pay-methods :wallet="wallet" /> -->
            <NG :wallet="wallet"/>
            <div style="color: white;padding:5%;position:absolute;bottom:12rem;" v-show="isYueMo">{{$store.state.lang.monthly_billing}}:</div>
        </div>
    </div>
</template>
<script>
import NG from '~/components/pay/NG'
import cardInfo from '~/components/dvb/cardInfo'
import orderInfo from '~/components/dvb/orderInfo'
import payMethods from '~/components/dvb/payMethods'
export default {
    layout: 'base',
    async asyncData({ app: { $axios }, store }) {
        let user = store.state.user
        let wallet = null
        if (user.roleName && user.roleName.toUpperCase() != 'ANONYMOUS') {
            $axios.setHeader('token', store.state.token)
            let { data } = await $axios.get(`/mobilewallet/v1/accounts/me`)
            wallet = data
        }
        return {
            wallet: wallet,
            serverTime: new Date()
        }
    },
    data() {
        return {
            isLoading: false,
            isYueMo: false
        }
    },
    mounted() {
        // 判断是否是月末
        let isBeyondYear = new Date(this.serverTime).getMonth() + 1 >= 12 ? true : false
        let nextMonthFirstDay
        if (isBeyondYear) {
            nextMonthFirstDay = new Date(new Date(this.serverTime).getFullYear() + 1 + '-01-01').getTime()
        } else {
            nextMonthFirstDay = new Date(new Date(this.serverTime).getFullYear() + '-' + new Date(this.serverTime).getMonth() + 2 + '-01').getTime()
        }

        let threeHoursBefore = nextMonthFirstDay - 3 * 60 * 60 * 1000
        let threeHoursAfter = nextMonthFirstDay + 3 * 60 * 60 * 1000
        let now = this.serverTime.getTime()
        if (threeHoursBefore <= now && threeHoursAfter >= now) {
            this.isYueMo = true
        }
        
        let param = JSON.parse(sessionStorage.getItem('order-info'))
        sessionStorage.setItem('wallet', JSON.stringify(this.wallet))

        this.sendEvLog({
            category: 'dvbservice',
            action: 'order_show',
            label: 'DVB_H5',
            value: 10,
            SmartCardNo: param.cardNo,
            BouquetName: param.program_name,
            CardState: param.smartcard_status,
            PauseDate: param.stop_days,
            service_type: 'Recharge',
            page_from: 'new'
        })
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
    components: {
        NG,
        cardInfo,
        orderInfo,
        payMethods
    },
    head() {
        return {
            title: this.$store.state.lang.my_order_details
        }
    }
}
</script>
