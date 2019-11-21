<template>
    <div class="wrapper">
        <div class="untrim">
            <card-input ref="cardInput" :list="cardList" :stop-days="stopDays" :card-state="cardState" @endInput="checkout" @typing="canBuy=false" />
            <div v-if="recharge_items.length>0" class="program-box">
                <p v-show="canBuy">
                    {{LANG.topup_bouquet}}:
                    <span class="program-name">{{ program_name }}</span>
                </p>
            </div>
            <goods v-if="recharge_items.length>0" ref="goodsPicker" :goods-list="recharge_items" :disabled="canBuy" @update="changeNorm" />
            <div v-if="recharge_items.length>0" :class="{disabled:!canBuy}" class="pay-btn" @click="buyNow">
                <span class="need-pay">{{ currency }}{{ formatAmount(payAmount) }}</span>
                {{LANG.next_}}
            </div>
        </div>
        <more-methods v-show="canBuy&&recharge_items.length>0&&countryCode=='NG'" :new-user="newUser" />
        <div v-if="recharge_items.length<=0" class="demoDialog">
            <div @click="focusInput">
                <p>{{LANG.input_your_smartcard_number}}</p>
                <div>
                    <img src="~assets/img/dvb/icon_smart_card.png" />
                </div>
                <p>{{LANG.recharge_your_decoder_account}}</p>
                <p class="tips">{{LANG.Tips_check_your_Balance}}</p>
            </div>
            <p>
                {{LANG.if_you_are_not_a_startimes_tv_user}}
                <a href="javascript:void(0)" style="color:#0087EB;text-decoration:underline" @click="toLoadurl">{{LANG.click_here}}</a>
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
import { toNativePage } from '~/functions/app'
import countryArr from '~/functions/countrys.json'
import tokens from '~/functions/token.json'
export default {
    layout: 'base',
    components: {
        cardInput,
        goods,
        moreMethods
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
            isLogin: this.$store.state.user.roleName && this.$store.state.user.roleName.toUpperCase() !== 'ANONYMOUS',
            isApp: this.$store.state.appType,
            payAmount: 0,
            rechargeDes: '',
            rechargeAmount: 0
        }
    },
    computed: {
        LANG() {
            return this.$store.state.lang
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
    async asyncData({ app: { $axios }, store, route }) {
        if (route.query.country) {
            const countryMap = {}
            countryArr.forEach(item => {
                countryMap[item.country] = item
            })
            const t = tokens[route.query.country.toUpperCase()]
            const c = countryMap[route.query.country.toUpperCase()]

            if (t && c) {
                store.commit('SET_TOKEN', t)
                store.commit('SET_GTOKEN', t)
                store.commit('SET_AREA_INFO', c)
            }
        }

        $axios.setHeader('token', store.state.token)
        let data = []
        try {
            const res = await $axios.get(`/self/v1/user/all_smartcard_basic_info_4wx`)
            data = res.data
        } catch (e) {
            data = []
        }
        return {
            cardList: Array.from(data, x => x.smardcard_no) || [],
            newUser: data.length <= 0
        }
    },
    mounted() {
        this.sendEvLog({
            category: 'dvbservice',
            action: 'recharge_show',
            label: 'DVB_H5',
            value: 1,
            service_type: 'Recharge'
        })
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
                service_type: 'Recharge'
            })
            if (this.countryCode.toLowerCase() === 'ke') {
                window.location.href = 'https://goo.gl/forms/AUlQ9ECJs0XC7zd72'
            } else if (this.countryCode.toLowerCase() === 'tz') {
                window.location.href = 'https://goo.gl/forms/dwtkLMqZZVRLgFZH3'
            } else if (this.countryCode.toLowerCase() === 'gh') {
                window.location.href = 'https://goo.gl/YWzd1m'
            } else if (this.countryCode.toLowerCase() === 'ng') {
                this.$router.push('/hybrid/faq/onlineService?entrance_id=0&config_id=136&dir_id=0')
            } else if (this.countryCode.toLowerCase() === 'ug') {
                this.$router.push('/hybrid/faq/onlineService?entrance_id=0&config_id=137&dir_id=0')
            } else if (this.countryCode.toLowerCase() === 'mg') {
                this.$router.push('/hybrid/faq/onlineService?entrance_id=0&config_id=138&dir_id=0')
            } else {
                this.$router.push('/hybrid/faq/onlineService?entrance_id=0&config_id=139&dir_id=0')
            }
        },
        buyNow() {
            const ref = this.$refs.goodsPicker
            const index = ref.goodIndex
            const rechargeItem = ref.list[index]
            const num = ref.num
            const card = this.$refs.cardInput.oriCardNum

            this.sendEvLog({
                category: 'dvbservice',
                action: 'recharge_click',
                label: 'DVB_H5',
                value: this.rechargeAmount || 0,
                service_type: 'Recharge',
                recharge_config: rechargeItem.rate_display_name,
                recharge_amount: num,
                SmartCardNo: card,
                BouquetName: this.program_name,
                CardState: this.cardState,
                PauseDate: this.stopDays
            })

            if (!this.canBuy) return false

            let currencyCode = this.currencyCode
            if (location.host.indexOf('qa.upms') >= 0 || location.host.indexOf('dev.upms') >= 0) {
                if (this.countryCode.toLowerCase() === 'mg') {
                    currencyCode = 'OUV'
                }
            }

            const params = {
                cardNo: card,
                countryCode: this.countryCode,
                currencyCode: currencyCode,
                currency: this.currency,
                rechargeExplanation: this.rechargeDes,
                promotionAmount: (rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo.firstRechargeGiveMoney) || 0,
                rechargeAmount: Number(this.rechargeAmount).toFixed(2),
                paymentAmount: Number(this.payAmount).toFixed(2),
                exclusivePrice: Number(
                    (rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo.exclusivePrice) || rechargeItem.rate_amount
                ).toFixed(2),
                preferentialPlanId: (rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo.id) || 0,
                listingPrice: Number(rechargeItem.rate_amount).toFixed(2), // 原始单价
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

            // TODO app内缓存有问题，莫名其妙，暂时解决方案, 貌似webview对spa支持不好
            window.location.href = '/hybrid/dvb/order'
        },
        logSmartInput(card, val, err) {
            const newUser = this.$refs.cardInput.newUser
            this.sendEvLog({
                category: 'dvbservice',
                action: 'smartcard_input',
                label: newUser ? 'NewCardUser' : 'AddCardUser',
                value: val,
                service_type: 'Recharge',
                SmartCardNo: card,
                errorMsg: err || 'Refuse'
            })
        },
        logloadItem(card, val) {
            const newUser = this.$refs.cardInput.newUser
            this.sendEvLog({
                category: 'dvbservice',
                action: 'load_recharge_item',
                label: newUser ? 'NewCardUser' : 'AddCardUser',
                value: val,
                SmartCardNo: card,
                BouquetName: this.program_name,
                CardState: this.cardState,
                PauseDate: this.stopDays,
                service_type: 'Recharge'
            })
        },
        checkout(card) {
            const reg = /^\d{11}$/g
            const reg2 = /^(90|91|92|93)\d{9}$/g
            const reg3 = /^(01|02)\d{9}$/g

            if (card === '') {
                this.logSmartInput(card, -1)
                return false
            } else if (!reg.test(card)) {
                this.logSmartInput(card, -1)
                this.$refs.cardInput.showError()
                return false
            } else if (!reg3.test(card)) {
                if (reg2.test(card)) {
                    this.logSmartInput(card, 0, 'eWallet')
                    this.$confirm(
                        this.$store.state.lang.besure_input_ewallet,
                        () => {
                            toNativePage('com.star.mobile.video.wallet.WalletRechargeActivity')
                        },
                        () => {},
                        this.$store.state.lang.agree_tip,
                        this.$store.state.lang.refuse_tip
                    )
                } else {
                    this.logSmartInput(card, 0, 'Decoder')
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

            this.isLoading = true
            this.$axios
                .get(`/self/v1/user/smartcardinfos/bonuses/${card}?is_bind_card=${!!this.isLogin}`)
                .then(res => {
                    const data = res.data
                    this.isLoading = false

                    if (!data || !data.program_name) {
                        this.logloadItem(card, 0)
                        this.$refs.cardInput.showError()
                        return false
                    }

                    this.program_name = data.program_name
                    this.tv_platform = data.tv_platform
                    this.cardState = data.smartcard_status
                    this.stopDays = data.penalty_stop
                    this.money = data.money
                    this.cardHaveCharged = data.have_rechareged
                    this.recharge_items = data.recharge_items || []

                    if (data.punish_stop_bonus && data.punish_stop_bonus.data && data.punish_stop_bonus.data.id) {
                        this.$alert(data.punish_stop_bonus.data.popup)
                    }
                    if (data.recharge_items && data.recharge_items.length > 0) {
                        this.logloadItem(card, 1)
                        this.canBuy = true
                    } else {
                        this.logloadItem(card, 0)
                        this.canBuy = false
                        this.$nextTick(function() {
                            this.$alert("This bouquet can't be recharged for now, please contact the local center")
                        })
                    }
                })
                .catch(err => {
                    this.logloadItem(card, err.status)
                    this.isLoading = false
                    this.canBuy = false
                    this.$nextTick(() => {
                        if (err.status === 401) {
                            this.$alert(this.$store.state.lang.account_signed_elsewhere, () => {
                                if (this.isApp === 1) {
                                    toNativePage(
                                        'com.star.mobile.video.account.LoginActivity?returnClass=com.star.mobile.video.activity.BrowserActivity?loadUrl=' +
                                            encodeURIComponent(window.location.href)
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
    head() {
        return {
            title: this.$store.state.lang.dvb_bind_title
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    .untrim {
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

