<template>
    <div id="wrapper">
        <div class="container">
            <div class="wrapper">
                <div class="card-input">
                    <div class="contains clearfix">
                        <input
                            class="card"
                            v-model="cardNum"
                            :class="{error:isErrorCard}"
                            ref="input"
                            @input="changeNum"
                            @focus="canBuy=false"
                            @blur="checkout"
                            :placeholder="$store.state.lang.please_input_smartcard"
                            type="tel"
                            maxlength="13"
                        >
                        <span v-show="canBuy" class="card_state" :class="card_state == 'VALID' ? 'program-state-valid' : 'program-state'">
                            <span v-if="card_state=='PUNISH_STOP'">{{$store.state.lang.dormant}}</span>
                            <span v-if="card_state=='PAUSE'">{{$store.state.lang.link_suspend}}</span>
                            <span v-if="card_state=='VALID'&&stop_days">{{$store.state.lang.dvb_acitve_to}} {{stop_days | formatStopDays}}</span>
                            <span v-if="card_state=='VALID'&&!stop_days">{{$store.state.lang.active_}}</span>
                        </span>
                        <span class="error-card" :class="{showError:isErrorCard}">{{$store.state.lang.h5_input_card_wrong}}</span>
                        <p class="count">
                            <span>{{current}}</span> /
                            <span>11</span>
                        </p>
                        <div class="operate">
                            <img @click="clearInput" v-show="oriCardNum!=''" src="~assets/img/dvb/delete.png">
                        </div>
                        <ul class="history" v-show="showHistoryList">
                            <li v-for="(item,index) in historyList" @click="chooseCard(index)" :key="index">{{ formatCard(item) }}</li>
                        </ul>
                    </div>
                </div>
                <div class="demoDialog" v-show="!loaded&&historyLoaded&&historyList.length<=0">
                    <div @click="focusInput">
                        <p>{{$store.state.lang.input_your_smartcard_number}}</p>
                        <div>
                            <img src="~assets/img/dvb/icon_smart_card.png">
                        </div>
                        <p>{{$store.state.lang.recharge_your_decoder_account}}</p>
                        <p class="tips">{{$store.state.lang.Tips_check_your_Balance}}</p>
                    </div>
                    <p>
                        {{$store.state.lang.if_you_are_not_a_startimes_tv_user}}
                        <a
                            href="javascript:void(0)"
                            @click="toLoadurl"
                        >{{$store.state.lang.click_here}}</a>
                        {{$store.state.lang.if_you_are_not_a_startimes_tv_user2}} 
                    </p>
                </div>
                <div class="program-box" v-show="loaded">
                    <p v-show="canBuy">
                        {{$store.state.lang.topup_bouquet}}:
                        <span class="program-name">{{ program_name }}</span>
                    </p>
                </div>
                <div class="money-box clearfix" :class="{disabled:!canBuy}" v-show="loaded&&recharge_items.length>0">
                    <p>{{$store.state.lang.select_}}</p>
                    <ul class="recharge-style">
                        <li
                            v-for="(item,index) in recharge_items" 
                            :key="index"
                            @click="selected(index)"
                            :class="{selected:index == chargeItemIndex,'center-text':!(item.preferentialPlanVo&&item.preferentialPlanVo.exclusivePrice>0&&item.rate_amount!=item.preferentialPlanVo.exclusivePrice)}"
                        >
                            <p>{{ item.rate_display_name | formatDate }}</p>
                            <p>
                                <span>{{ currency }}</span>
                                {{ item | discountAmount }}
                            </p>
                            <p
                                v-if="item.preferentialPlanVo&&item.preferentialPlanVo.exclusivePrice>0&&item.rate_amount!=item.preferentialPlanVo.exclusivePrice"
                            >
                                <del>{{ currency }}{{ item.rate_amount | formatRateAmount }}</del>
                            </p>
                            <img
                                v-if="item.preferentialPlanVo&&item.preferentialPlanVo.firstRechargeGiveMoney>0"
                                class="first-charge-img"
                                src="~assets/img/dvb/ic_gift_def.png"
                            >
                            <div v-if="item.preferentialPlanVo&&item.preferentialPlanVo.type==100" class="christmas">
                                <img src="~assets/img/dvb/img_christmaslogo.png" class="christmaslogo">
                                <span>{{((item.rate_amount-item.preferentialPlanVo.exclusivePrice)*100/item.rate_amount).toFixed(0)}}% OFF</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="first-charge" v-show="firstChargeTip">
                    <img src="~assets/img/dvb/ic_gift_def.png">
                    <div style="width:65%;float:left;">{{firstChargeTip}}</div>
                    <div v-show="firstChargeDetails" class="first-charge-detail" @click="showDetails"> {{$store.state.lang.first_recharge_detail}}</div>
                </div>
                <div class="count-box clearfix" :class="{disabled:!canBuy}">
                    <p v-show="loaded&&countList.length>1">{{$store.state.lang.results_recharge_amount}}</p>
                    <ul class="choose clearfix" v-show="loaded&&countList.length>1">
                        <li v-for="(item,index) in countList" :key="index">
                            <label class="radio">
                                {{ item }}
                                <input
                                    type="radio"
                                    name="count"
                                    :disabled="canBuy?false:'disabled'"
                                    :value="item"
                                    :checked="index == chargeNumIndex"
                                    v-model="checkedValue"
                                >
                                <i/>
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="pay-btn" @click="buyNow" :class="{disabled:!canBuy}" v-show="loaded">
                    <span class="need-pay">{{ currency }}{{ paymentAmount | formatRateAmount }}</span>
                    {{$store.state.lang.next_}}
                </div>
            </div>
            <img
                v-show="loaded&&(countryCode=='NG'||countryCode=='TZ')"
                @click="buyNow"
                src="~assets/img/dvb/dvb_ug_off.png"
                style="width:100%"
            >
            <div class="blank_bottom" v-show="canBuy&&loaded&&countryCode=='NG'&&isApp==1">&nbsp;</div>
            <div class="more-services" v-show="canBuy&&loaded&&countryCode=='NG'&&isApp==1">
                <p @click="showAllWays">
                    {{$store.state.lang.more_recharge_method}}
                    <span class="all">
                        {{$store.state.lang.membership_all}}
                        <img src="~assets/img/dvb/ic_right_def_r.png" alt>
                    </span>
                </p>
            </div>
        </div>
        <loading v-show="isLoading"/>
    </div>
</template>
<script>
import loading from '~/components/loading'
export default {
    layout: 'base',
    data() {
        return {
            cardNum: '',
            historyList: [],
            historyLoaded: false,
            showHistoryList: false,
            current: 0,
            program_name: '',
            tv_platform: '',
            canBuy: false,
            loaded: false,
            card_state: '',
            money: '',
            isErrorCard: false,
            recharge_items: [],
            countLists: [],
            countList: [],
            chargeItemIndex: 0,
            checkedValue: 1,
            chargeNumIndex: 0,
            countryCode: this.$store.state.countryCode,
            currency: this.$store.state.currency_symbol,
            currencyCode: this.$store.state.currency_code,
            stop_days: '',
            isLoading: false,
            init: true,
            cardHaveCharged: false,
            user_status: false,
            isLogin: this.$store.state.user.type || false,
            isApp: this.$store.state.appType,

        }
    },
    computed: {
        oriCardNum:{
            get(){
                let reg = /^[0-9]*$/
                let tmp = this.cardNum.replace(/\s/g, '')
                return reg.test(tmp) ? tmp : ''
            },
            set(){

            }
        },
        rechargeAmount() {
            let item = this.recharge_items[this.chargeItemIndex]
            if (item) {
                return Number(item.rate_amount) * Number(this.checkedValue)
            } else {
                return 0
            }
        },
        rechargeExplanation() {
            let name = this.recharge_items[this.chargeItemIndex].rate_display_name
            if (name.indexOf('/') >= 0) {
                return name.split('/')[1] + ' x ' + this.checkedValue
            } else {
                return name + ' x ' + this.checkedValue
            }
        },
        paymentAmount() {
            let item = this.recharge_items[this.chargeItemIndex]
            let count = 0
            if (item) {
                if (item.preferentialPlanVo && item.preferentialPlanVo.exclusivePrice > 0) {
                    count = item.preferentialPlanVo.exclusivePrice
                } else {
                    count = item.rate_amount
                }
            }
            return Number(count) * Number(this.checkedValue)
        },
        firstChargeTip() {
            let item = this.recharge_items[this.chargeItemIndex]
            if (item) {
                if (item.preferentialPlanVo && item.preferentialPlanVo.firstRechargeGiveMoney) {
                    return item.preferentialPlanVo.description
                } else {
                    return ''
                }
            } else {
                return ''
            }
        },
        firstChargeDetails() {
            let item = this.recharge_items[this.chargeItemIndex]
            if (item) {
                if (item.preferentialPlanVo && item.preferentialPlanVo.firstRechargeGiveMoney) {
                    return item.preferentialPlanVo.descDetail
                } else {
                    return ''
                }
            } else {
                return ''
            }
        }
    },
    filters: {
        formatStopDays(str) {
            return dayjs(str).format('MMM DD YYYY') || ''
        },
        formatDate(str) {
            if (str.indexOf('/') >= 0) {
                return str.split('/')[1]
            } else {
                return str
            }
        },
        formatRateAmount(val) {
            // let tmp = String(str).split('').reverse().join('').match(/(\d{1,3})/g)
            // return tmp.join(',').split('').reverse().join('')
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
        },
        discountAmount(item) {
            let count = 0
            if (item.preferentialPlanVo && item.preferentialPlanVo.exclusivePrice > 0) {
                count = item.preferentialPlanVo.exclusivePrice
            } else {
                count = item.rate_amount
            }
            if (!isNaN(count)) {
                let arr = count.toString().split('.')
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
    methods: {
        focusInput() {
            this.$nextTick(function() {
                document.querySelector('input.card').focus()
            })
        },
        showAllWays() {
            this.sendEvLog({
                category: 'dvbservice',
                action: 'other_paymentWay_click',
                label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                value: 10,
                service_type: 'Recharge'
            })
            if (this.isApp == '1') {
                window.getChannelId.toAppPage(3, 'com.star.mobile.video.smartcard.recharge.RechargeActivity?fromNewRecharge=true', '')
            }
        },
        toLoadurl() {
            this.sendEvLog({
                category: 'dvbservice',
                action: 'onlineServiceBtn_click',
                label: 'dvb_recharge_empty_decoder',
                value: 1,
                service_type: 'Recharge'
            })
            if (this.countryCode.toLowerCase() == 'ke') {
                window.location.href = 'https://goo.gl/forms/AUlQ9ECJs0XC7zd72'
            } else if (this.countryCode.toLowerCase() == 'tz') {
                window.location.href = 'https://goo.gl/forms/dwtkLMqZZVRLgFZH3'
            } else if (this.countryCode.toLowerCase() == 'gh') {
                window.location.href = 'https://goo.gl/YWzd1m'
            } else if (this.countryCode.toLowerCase() == 'ng') {
                window.location.href = 'http://m.startimestv.com/IntelligentService.php?entrance_id=0&config_id=136&dir_id=0'
            } else if (this.countryCode.toLowerCase() == 'ug') {
                window.location.href = 'http://m.startimestv.com/IntelligentService.php?entrance_id=0&config_id=137&dir_id=0'
            } else if (this.countryCode.toLowerCase() == 'mg') {
                window.location.href = 'http://m.startimestv.com/IntelligentService.php?entrance_id=0&config_id=138&dir_id=0'
            } else {
                window.location.href = 'http://m.startimestv.com/IntelligentService.php?entrance_id=0&config_id=139&dir_id=0'
            }
        },
        showDetails() {
            this.sendEvLog({
                category: 'dvbservice',
                action: 'promotion_detail_click',
                label: 'DVB_H5',
                value: 10,
                service_type: 'Recharge'
            })
            this.$alert(this.firstChargeDetails,()=>{
                this.sendEvLog({
                    category: 'dvbservice',
                    action: 'promotion_detail_back',
                    label: 'DVB_H5',
                    value: 10,
                    service_type: 'Recharge'
                })
            })
        },
        clearInput() {
            this.cardNum = ''
            this.oriCardNum = ''
        },
        getHistoryBindCard(callback) {
            this.$axios({
                    url: `/self/v1/user/all_smartcard_basic_info_4wx`,
                    method: 'get',
                    data: {}
                }).then(res => {
                    this.historyLoaded = true
                    if (res.data && res.data.length > 0) {
                        let arr = []
                        res.data.forEach((item, index) =>{
                            arr.push(item.smardcard_no)
                        })
                        this.historyList = arr
                        this.user_status = true
                        if (callback) callback()
                    } else {
                         this.sendEvLog({
                            category: 'dvbservice',
                            action: 'onlineServiceBtn_show',
                            label: 'dvb_recharge_empty_decoder',
                            value: 1,
                            service_type: 'Recharge'
                        })
                    }
                })
                .catch(err=> {
                    this.historyLoaded = true
                    this.sendEvLog({
                        category: 'dvbservice',
                        action: 'onlineServiceBtn_show',
                        label: 'dvb_recharge_empty_decoder',
                        value: 1,
                        service_type: 'Recharge'
                    })
                });
        },
        chooseCard(index) {
            this.cardNum = this.formatCard(this.historyList[index])
            this.checkout()
        },
        formatCard(str) {
            return str.replace(/(^\d{3}\B|\d{4}\B)/g, '$1 ')
        },
        changeNum() {
            this.cardNum = this.formatCard(this.oriCardNum)
        },
        buyNow() {
            let rechargeItem = this.recharge_items[this.chargeItemIndex]

            this.sendEvLog({
                category: 'dvbservice',
                action: 'recharge_click',
                label: 'DVB_H5',
                value: this.rechargeAmount || 0,
                service_type: 'Recharge',
                recharge_config: rechargeItem.rate_display_name,
                recharge_amount: this.checkedValue,
                BouquetName: this.program_name,
                CardState: this.card_state,
                PauseDate: this.stop_days,
                SmartCardNo: this.cardNum
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
                cardNo: this.oriCardNum,
                countryCode: this.countryCode,
                currencyCode: currencyCode,
                currency: this.currency,
                rechargeExplanation: this.rechargeExplanation,
                promotionAmount: (rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo.firstRechargeGiveMoney) || 0,
                rechargeAmount: new Number(this.rechargeAmount).toFixed(2),
                paymentAmount: new Number(this.paymentAmount).toFixed(2),
                exclusivePrice: new Number(
                    (rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo.exclusivePrice) || rechargeItem.rate_amount
                ).toFixed(2),
                preferentialPlanId: (rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo.id) || 0,
                listingPrice: new Number(rechargeItem.rate_amount).toFixed(2), // 原始单价
                rechargeItemSelectedQuantity: this.checkedValue,
                rechargeItemSelectedName: rechargeItem.rate_display_name,
                tv_platform: this.tv_platform,
                smartcard_status: this.card_state,
                stop_days: this.stop_days,
                program_name: this.program_name,
                money: this.money,
                rechargeAmount: this.rechargeAmount,
                firstChargeTip: this.firstChargeTip,
                cardHaveCharged: this.cardHaveCharged
            }

            sessionStorage.setItem('order-info', JSON.stringify(params))
            window.location.href = 'order.php'
        },
        selected(index) {
            if (this.canBuy) {
                this.chargeItemIndex = index
            }
        },
        checkout() {
            let reg = /^\d{11}$/g
            let reg2 = /^(90|91|92|93)\d{9}$/g
            let reg3 = /^(01|02)\d{9}$/g

            if (this.oriCardNum == '') {
                this.sendEvLog({
                    category: 'dvbservice',
                    action: 'smartcard_input',
                    label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                    value: -1,
                    service_type: 'Recharge',
                    SmartCardNo: this.oriCardNum
                })
                return false
            } else {
                if (!reg.test(this.oriCardNum)) {
                    this.sendEvLog({
                        category: 'dvbservice',
                        action: 'smartcard_input',
                        label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                        value: -1,
                        service_type: 'Recharge',
                        SmartCardNo: this.oriCardNum
                    })
                    this.isErrorCard = true
                    return false
                } else {
                    if (!reg3.test(this.oriCardNum)) {
                        if (reg2.test(this.oriCardNum)) {
                            this.sendEvLog({
                                category: 'dvbservice',
                                action: 'smartcard_input',
                                label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                                value: 0,
                                service_type: 'Recharge',
                                SmartCardNo: this.oriCardNum,
                                errorMsg: 'eWallet'
                            })
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
                            this.sendEvLog({
                                category: 'dvbservice',
                                action: 'smartcard_input',
                                label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                                value: 0,
                                service_type: 'Recharge',
                                SmartCardNo: this.oriCardNum,
                                errorMsg: 'Decoder'
                            })
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
                        this.isErrorCard = true
                        return false
                    }

                    this.sendEvLog({
                        category: 'dvbservice',
                        action: 'smartcard_input',
                        label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                        value: 1,
                        service_type: 'Recharge',
                        SmartCardNo: this.oriCardNum
                    })
                }
            }
            this.isLoading = true
            let timetr = new Date().getTime()
            this.$axios({
                url: `/self/v1/user/smartcardinfo/sync4h5?smartcard=${this.oriCardNum}&is_bind_card=${this.isLogin ? true : false}`,
                method: 'get',
                data: {}
            }).then(res => {
                let n_timetr = new Date().getTime()
                this.isLoading = false

                if (res.data && res.data.program_name) {
                    this.loaded = true
                        this.canBuy = true
                        this.countLists = []
                        this.chargeItemIndex = 0

                        this.program_name = data.program_name
                        this.tv_platform = data.tv_platform
                        this.card_state = data.smartcard_status
                        this.stop_days = data.penalty_stop
                        this.money = data.money
                        this.cardHaveCharged = data.have_rechareged
                        if (data.recharge_items && data.recharge_items.length > 0) {
                            this.recharge_items = data.recharge_items || []
                            // 默认选中最大值
                            let maxMoney = 0
                            this.recharge_items.sort(function(a, b) {
                                return a.rate_amount - b.rate_amount
                            })
                            this.recharge_items.forEach(function(item, index) {
                                if (item.rate_amount > maxMoney) {
                                    maxMoney = item.rate_amount
                                    this.chargeItemIndex = index
                                }
                                if (item.recharge_fee_numbers) {
                                    this.countLists[this.countLists.length] = item.recharge_fee_numbers
                                }
                            })

                            // 默认选中最小值
                            // let minMoney = 0
                            // this.recharge_items.sort(function (a, b) {
                            //     return a.rate_amount - b.rate_amount;
                            // })
                            // this.recharge_items.forEach(function (item, index) {
                            //     if (item.rate_amount < minMoney) {
                            //         minMoney = item.rate_amount
                            //         this.chargeItemIndex = index
                            //     }
                            //     if (item.recharge_fee_numbers) {
                            //         this.countLists[this.countLists.length] = item.recharge_fee_numbers
                            //     }
                            // })
                            this.sendEvLog({
                                category: 'dvbservice',
                                action: 'load_recharge_item',
                                label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                                value: 1,
                                SmartCardNo: this.oriCardNum,
                                BouquetName: this.program_name,
                                CardState: this.card_state,
                                PauseDate: this.stop_days,
                                service_type: 'Recharge',
                                timeAlong: n_timetr - timetr
                            })
                        } else {
                            this.sendEvLog({
                                category: 'dvbservice',
                                action: 'load_recharge_item',
                                label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                                value: 0,
                                SmartCardNo: this.oriCardNum,
                                BouquetName: this.program_name,
                                CardState: this.card_state,
                                PauseDate: this.stop_days,
                                service_type: 'Recharge',
                                timeAlong: n_timetr - timetr
                            })
                            this.canBuy = false
                            this.$nextTick(function() {
                                malert("This bouquet can't be recharged for now, please contact the local center")
                            })
                        }
                        if (this.countLists.length > 0) {
                            this.countList = this.countLists[this.chargeItemIndex]
                        } else {
                            this.countList = [1]
                        }
                        this.checkedValue = this.countList[0]
                }else{
                    this.sendEvLog({
                        category: 'dvbservice',
                        action: 'load_recharge_item',
                        label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                        value: -1,
                        SmartCardNo: this.oriCardNum,
                        BouquetName: this.program_name,
                        CardState: this.card_state,
                        PauseDate: this.stop_days,
                        service_type: 'Recharge',
                        errorMsg: data.message,
                        timeAlong: n_timetr - timetr
                    })
                    this.isErrorCard = true
                }
            }).catch(err=>{
                let n_timetr = new Date().getTime()
                this.sendEvLog({
                    category: 'dvbservice',
                    action: 'load_recharge_item',
                    label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                    value: -1,
                    SmartCardNo: this.oriCardNum,
                    BouquetName: this.program_name,
                    CardState: this.card_state,
                    PauseDate: this.stop_days,
                    service_type: 'Recharge',
                    errorMsg: err.status + '~' + err.statusText,
                    timeAlong: n_timetr - timetr
                })
                this.isLoading = false

                this.$nextTick(()=> {
                    if (err.status == 401) {
                        this.$alert(this.$store.state.lang.account_signed_elsewhere,()=>{
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
                        this.$alert( this.$store.state.lang.error_network)
                    }
                })
            })
        }
    },
    mounted() {
        this.sendEvLog({
            category: 'dvbservice',
            action: 'recharge_show',
            label: 'DVB_H5',
            value: 10,
            service_type: 'Recharge'
        })
        let step2 = sessionStorage.getItem('step2')
        if (step2) {
            this.sendEvLog({
                category: 'dvbservice',
                action: 'back_history',
                label: 'DVB_H5',
                value: 10,
                service_type: 'Recharge'
            })
        }

        this.getHistoryBindCard(()=> {
            if (this.historyList.length > 0) {
                this.cardNum = this.formatCard(this.historyList[0])
            }
        })
    },
    watch: {
        oriCardNum(val, oldVal) {
            this.current = val.length
            this.canBuy = false
            this.isErrorCard = false

            if (val.length <= 0) {
                this.showHistoryList = true
            } else {
                this.showHistoryList = false
            }
            if (val.length >= 11) {
                if (this.init) {
                    this.checkout()
                    this.$refs.input.blur()
                    this.init = false
                } else {
                    this.$refs.input.blur()
                }
            }
        },
        chargeItemIndex(val, oldVal) {
            if (this.countLists.length > 0) {
                this.countList = this.countLists[val]
            } else {
                this.countList = [1]
            }
            this.checkedValue = this.countList[0]
        }
    },
    components:{
        loading
    },
    head() {
        return {
            title: this.$store.state.lang.dvb_bind_title
        }
    }
}
</script>
<style lang="less">
@import '~assets/less/dvb/index.less';
</style>

