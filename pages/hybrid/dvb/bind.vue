<template>
    <div class="wrapper">
        <div class="untrim">
            <card-input ref="cardInput" :list="cardList" @endInput="checkout" @typing="canBuy=false" :stop-days="stopDays" :card-state="cardState"/>
            <div class="program-box" v-if="recharge_items.length>0">
                <p v-show="canBuy">
                    {{LANG.topup_bouquet}}:
                    <span class="program-name">{{ program_name }}</span>
                </p>
            </div>
            <goods ref="goodsPicker" v-if="recharge_items.length>0" :goods-list="recharge_items" :disabled="canBuy" @update="changeNorm"/>
            <div class="pay-btn" v-if="recharge_items.length>0" @click="buyNow" :class="{disabled:!canBuy}">
                <span class="need-pay">{{ currency }}{{ formatAmount(payAmount) }}</span>
                {{LANG.next_}}
            </div>
        </div>
        <img
            v-show="recharge_items.length>0&&(countryCode=='NG'||countryCode=='TZ')"
            @click="buyNow"
            src="~assets/img/dvb/dvb_ug_off.png"
            style="width:100%"
        >
        <more-methods v-show="canBuy&&recharge_items.length>0&&countryCode=='NG'&&isApp==1"/>
        <div class="demoDialog" v-if="!recharge_items.length>0&&cardList.length<=0">
            <div @click="focusInput">
                <p>{{LANG.input_your_smartcard_number}}</p>
                <div>
                    <img src="~assets/img/dvb/icon_smart_card.png">
                </div>
                <p>{{LANG.recharge_your_decoder_account}}</p>
                <p class="tips">{{LANG.Tips_check_your_Balance}}</p>
            </div>
            <p>
                {{LANG.if_you_are_not_a_startimes_tv_user}}
                <a
                    href="javascript:void(0)"
                    @click="toLoadurl"
                    style="color:#0087EB;text-decoration:underline"
                >{{LANG.click_here}}</a>
                {{LANG.if_you_are_not_a_startimes_tv_user2}}
            </p>
        </div>
    </div>
</template>
<script>
import cardInput from '~/components/dvb/input'
import goods from '~/components/dvb/goods'
import moreMethods from '~/components/dvb/moreMethods'
import { formatAmount } from '~/functions/utils'
export default {
    layout: 'base',
    components: {
        cardInput,
        goods,
        moreMethods
    },
    async asyncData({ app: { $axios }, store }) {
        $axios.setHeader('token', store.state.token)
        let { data } = await $axios.get(`/self/v1/user/all_smartcard_basic_info_4wx`)
        return {
            cardList: Array.from(data, x => x.smardcard_no) || [],
            newUser: data.length > 0
        }
    },
    data() {
        return {
            cardState: '',
            stopDays: '',
            program_name: '',
            tv_platform: '',
            canBuy: false,
            money: '',
            recharge_items: [],
            countryCode: this.$store.state.country.country,
            currency: this.$store.state.country.currencySymbol,
            currencyCode: this.$store.state.country.currencyCode,
            isLoading: false,
            cardHaveCharged: false,
            isLogin: this.$store.state.user.roleName && this.$store.state.user.roleName.toUpperCase() != 'ANONYMOUS',
            isApp: this.$store.state.appType,
            payAmount: 0,
            rechargeDes: '',
            rechargeAmount: 0
        }
    },
    computed:{
        LANG() {
            return this.$store.state.lang
        }
    },
    methods: {
        changeNorm(obj) {
            this.payAmount = obj.payAmount
            this.rechargeAmount = obj.rechargeAmount
            this.rechargeDes = obj.rechargeDes
        },
        focusInput() {
            this.$nextTick(function() {
                document.querySelector('input.card').focus()
            })
        },
        toLoadurl() {
            this.sendEvLog({
                category: 'dvbservice',
                action: 'onlineServiceBtn_click',
                label: 'dvb_recharge_empty_decoder',
                value: 1,
                service_type: 'Recharge',
                page_from: 'new'
            })
            if (this.countryCode.toLowerCase() == 'ke') {
                window.location.href = 'https://goo.gl/forms/AUlQ9ECJs0XC7zd72'
            } else if (this.countryCode.toLowerCase() == 'tz') {
                window.location.href = 'https://goo.gl/forms/dwtkLMqZZVRLgFZH3'
            } else if (this.countryCode.toLowerCase() == 'gh') {
                window.location.href = 'https://goo.gl/YWzd1m'
            } else if (this.countryCode.toLowerCase() == 'ng') {
                window.location.href = 'https://m.startimestv.com/IntelligentService.php?entrance_id=0&config_id=136&dir_id=0'
            } else if (this.countryCode.toLowerCase() == 'ug') {
                window.location.href = 'https://m.startimestv.com/IntelligentService.php?entrance_id=0&config_id=137&dir_id=0'
            } else if (this.countryCode.toLowerCase() == 'mg') {
                window.location.href = 'https://m.startimestv.com/IntelligentService.php?entrance_id=0&config_id=138&dir_id=0'
            } else {
                window.location.href = 'https://m.startimestv.com/IntelligentService.php?entrance_id=0&config_id=139&dir_id=0'
            }
        },
        buyNow() {
            let ref = this.$refs.goodsPicker
            let index = ref.goodIndex
            let rechargeItem = ref.list[index]
            let num = ref.num
            let card = this.$refs.cardInput.oriCardNum

            this.sendEvLog({
                category: 'dvbservice',
                action: 'recharge_click',
                label: 'DVB_H5',
                value: this.rechargeAmount || 0,
                service_type: 'Recharge',
                page_from: 'new',
                recharge_config: rechargeItem.rate_display_name,
                recharge_amount: num,
                BouquetName: this.program_name,
                CardState: this.cardState,
                PauseDate: this.stopDays,
                SmartCardNo: card
            })

            if (!this.canBuy) return false

            let currencyCode = this.currencyCode
            if (location.host.indexOf('qa.upms') >= 0 || location.host.indexOf('dev.upms') >= 0) {
                if (this.countryCode.toLowerCase() == 'mg') {
                    currencyCode = 'OUV'
                }
            }

            let preferentialPlanId = rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo
            

            let params = {
                cardNo: card,
                countryCode: this.countryCode,
                currencyCode: currencyCode,
                currency: this.currency,
                rechargeExplanation: this.rechargeDes,
                promotionAmount: (rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo.firstRechargeGiveMoney) || 0,
                rechargeAmount: new Number(this.rechargeAmount).toFixed(2),
                paymentAmount: new Number(this.payAmount).toFixed(2),
                exclusivePrice: new Number(
                    (rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo.exclusivePrice) || rechargeItem.rate_amount
                ).toFixed(2),
                preferentialPlanId: (rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo.id) || 0,
                listingPrice: new Number(rechargeItem.rate_amount).toFixed(2), // 原始单价
                rechargeItemSelectedQuantity: num,
                rechargeItemSelectedName: rechargeItem.rate_display_name,
                tv_platform: this.tv_platform,
                smartcard_status: this.cardState,
                stop_days: this.stopDays,
                program_name: this.program_name,
                money: this.money,
                firstChargeTip: ref.firstChargeTip,
                cardHaveCharged: this.cardHaveCharged
            }

            sessionStorage.setItem('order-info', JSON.stringify(params))
            this.$router.push('/hybrid/dvb/order')
        },
        logSmartInput(card, val) {
            let newUser = this.$refs.cardInput.newUser
            this.sendEvLog({
                category: 'dvbservice',
                action: 'smartcard_input',
                label: newUser ? 'AddCardUser' : 'NewCardUser',
                value: val,
                service_type: 'Recharge',
                page_from: 'new',
                SmartCardNo: card
            })
        },
        logloadItem(card, val) {
            let newUser = this.$refs.cardInput.newUser
            this.sendEvLog({
                category: 'dvbservice',
                action: 'load_recharge_item',
                label: newUser ? 'AddCardUser' : 'NewCardUser',
                value: val,
                SmartCardNo: card,
                BouquetName: this.program_name,
                CardState: this.cardState,
                PauseDate: this.stopDays,
                service_type: 'Recharge',
                page_from: 'new'
            })
        },
        checkout(card) {
            let reg = /^\d{11}$/g
            let reg2 = /^(90|91|92|93)\d{9}$/g
            let reg3 = /^(01|02)\d{9}$/g

            if (card == '') {
                this.logSmartInput(card, -1)
                return false
            } else {
                if (!reg.test(card)) {
                    this.logSmartInput(card, -1)
                    this.$refs.cardInput.showError()
                    return false
                } else {
                    if (!reg3.test(card)) {
                        if (reg2.test(card)) {
                            this.logSmartInput(card, 0)
                            this.$confirm(
                                this.$store.state.lang.besure_input_ewallet,
                                () => {
                                    window.getChannelId.toAppPage(3, 'com.star.mobile.video.wallet.WalletRechargeActivity', '')
                                },
                                () => {},
                                this.$store.state.lang.agree_tip,
                                this.$store.state.lang.refuse_tip
                            )
                        } else {
                            this.logSmartInput(card, 0)
                            this.$confirm(
                                this.$store.state.lang.besure_have_card,
                                () => {
                                    this.toLoadurl()
                                },
                                () => {},
                                this.$store.state.lang.agree_tip,
                                this.$store.state.lang.refuse_tip
                            )
                        }
                        return false
                    } else {
                        this.logSmartInput(card, 1)
                    }
                }
            }

            this.isLoading = true

            this.$axios
                .get(`/self/v1/user/smartcardinfo/sync4h5?smartcard=${card}&is_bind_card=${this.isLogin ? true : false}`)
                .then(res => {
                    let data = res.data
                    this.isLoading = false

                    if (!data || !data.program_name) {
                        this.logloadItem(card, -1)
                        this.$refs.cardInput.showError()
                        return false
                    }
                    this.canBuy = true
                    this.program_name = data.program_name
                    this.tv_platform = data.tv_platform
                    this.cardState = data.smartcard_status
                    this.stopDays = data.penalty_stop
                    this.money = data.money
                    this.cardHaveCharged = data.have_rechareged
                    if (data.recharge_items && data.recharge_items.length > 0) {
                        this.recharge_items = data.recharge_items || []
                        this.logloadItem(card, 1)
                    } else {
                        this.logloadItem(card, 0)
                        this.canBuy = false
                        this.$nextTick(function() {
                            this.$alert("This bouquet can't be recharged for now, please contact the local center")
                        })
                    }
                })
                .catch(err => {
                    this.logloadItem(card, 1)
                    this.isLoading = false

                    this.$nextTick(() => {
                        if (err.status == 401) {
                            this.$alert(this.$store.state.lang.account_signed_elsewhere, () => {
                                if (this.isApp == 1) {
                                    window.getChannelId.toAppPage(
                                        3,
                                        'com.star.mobile.video.account.LoginActivity?returnClass=com.star.mobile.video.activity.BrowserActivity?loadUrl=' +
                                            encodeURIComponent(window.location.href),
                                        ''
                                    )
                                }
                            })
                            return false
                        } else {
                            this.$alert(this.$store.state.lang.error_network)
                        }
                    })
                })
        },
        formatAmount(num) {
            return formatAmount(num)
        }
    },
    watch: {
        isLoading(val, oldVal) {
            if (val) {
                this.$nextTick(() => this.$nuxt.$loading.start())
                this.$store.commit('SHOW_SHADOW_LAYER')
            } else {
                this.$nextTick(() => this.$nuxt.$loading.finish())
                this.$store.commit('HIDE_SHADOW_LAYER')
            }
        }
    },
    head() {
        return {
            title: this.$store.state.lang.dvb_bind_title
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    min-height:100%;
    background:white;
    .untrim{
        padding: 0 1rem;
        position: relative;
    }
    
}
.demoDialog {
    width: 85%;
    margin: 1.5rem auto 0;
    font-size: 0.8rem;
    & > div {
        border-radius: 5px;
        padding: 1rem;
        background: #eeeeee;
        color: #424242;
        margin-bottom: 2rem;
        img {
            width: 95%;
            display: block;
            margin: 1rem auto;
            border-radius: 7px;
        }
    }
    & > p {
        width: 80%;
        margin: 0 auto;
    }
    .tips {
        margin-top: 1.5rem;
    }
}
.program-box {
    font-size: 0.9rem;
    p {
        padding: 0;
        margin: 0;
        font-weight: bold;
        color: #424242;
    }
    span {
        &.program-name {
            font-weight: 400;
        }
    }
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

