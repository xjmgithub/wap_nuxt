<template>
    <div id="wrapper">
        <div class="container">
            <card-info/>
            <order-info/>
            <!-- <pay-methods :wallet="wallet" /> -->
            <NG class="ng-pay" :wallet="wallet"/>
            <div style="color: white;padding:5%;position:absolute;bottom:12rem;" v-show="isYueMo">{{$store.state.lang.monthly_billing}}:</div>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
import NG from '~/components/pay/NG'
import cardInfo from '~/components/dvb/cardInfo'
import orderInfo from '~/components/dvb/orderInfo'
import payMethods from '~/components/dvb/payMethods'
import { parseUA, toNativePage } from '~/functions/utils.js'
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
        let user = this.$store.state.user
        return {
            isLogin: user.roleName && user.roleName.toUpperCase() != 'ANONYMOUS',
            isApp: this.$store.state.appType,
            cardNum: '',
            cardNo: '',
            program: '',
            state: '',
            isLoading: false,
            money: '',
            tv_platform: '',
            stop_days: '',
            rechargeExplanation: '',
            paymentAmount: '',
            rechargeAmount: '',
            firstChargeTip: '',
            currency: '',
            methodsList: [],
            selectMethod: {},
            countryCode: '',
            fcmToken: '',
            isYueMo: false,
            cardHaveCharged: 0,
            dstr: ''
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

        this.dstr = parseUA(this.isApp, this.$store.state.appVersionCode) // 支付统计用
        this.fcmToken = (window.getChannelId && getChannelId.getFCMToken && window.getChannelId.getFCMToken()) || ''
        let param = JSON.parse(sessionStorage.getItem('order-info'))

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

        this.cardNo = param.cardNo
        this.program = param.program_name
        this.state = param.smartcard_status
        this.money = param.money
        this.tv_platform = param.tv_platform
        this.rechargeExplanation = param.rechargeExplanation
        this.paymentAmount = param.paymentAmount
        this.rechargeAmount = param.rechargeAmount
        this.firstChargeTip = param.firstChargeTip
        this.cardHaveCharged = param.cardHaveCharged
        this.currency = param.currency
        this.countryCode = param.countryCode
        this.stop_days = param.stop_days
        let tmp = param.cardNo
        let len = tmp.length
        for (let i = 0; i < len; i++) {
            this.cardNum += tmp[i]
            if (i == 2 || i == 6) {
                this.cardNum += ' '
            }
        }
    },
    methods: {
        /* 
            channel 支付渠道号，width card 993102 ,with bank 993101, 9002
            payType 支付方式 ewallet 1, width card/bank 3 
            apiType 接口模型 ewallet 1, width card/bank 2
            form   是否需要表单 false
            byPass ewallet true,  width card(list true/ add false), with bank false
        */
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
<style lang="less">
.ng-pay {
    width: 90%;
    margin: 0 auto;
    padding-bottom: 5.5rem;
}
.pay-btn {
    background-color: #008be9;
    color: #fff;
    height: 2.4rem;
    line-height: 2.4rem;
    text-align: center;
    font-size: 0.9rem;
    margin: 0 auto;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    &.disabled {
        background-color: #bdbdbd;
    }
    .need-pay {
        margin-right: 0.5rem;
    }
}
</style>
