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
                            placeholder="<?php echo $alang['please_input_smartcard']; ?>"
                            type="tel"
                            maxlength="13"
                        >
                        <span v-show="canBuy" class="card_state" v-bind:class="card_state == 'VALID' ? 'program-state-valid' : 'program-state'">
                            <span v-if="card_state=='PUNISH_STOP'"><?php echo $alang['dormant']; ?></span>
                            <span v-if="card_state=='PAUSE'"><?php echo $alang['link_suspend']; ?></span>
                            <span v-if="card_state=='VALID'&&stop_days"><?php echo $alang['dvb_acitve_to']; ?> {{stop_days | formatStopDays}}</span>
                            <span v-if="card_state=='VALID'&&!stop_days"><?php echo $alang['active_']; ?></span>
                        </span>
                        <span class="error-card" :class="{showError:isErrorCard}"><?php echo $alang['h5_input_card_wrong']; ?></span>
                        <p class="count">
                            <span class="current">{{current}}</span> /
                            <span class="total">11</span>
                        </p>
                        <div class="operate">
                            <img @click="clearInput" v-show="oriCardNum!=''" src="../resource/img/recharge/delete.png">
                        </div>
                        <ul class="history" v-show="showHistoryList">
                            <li v-for="(item,index) in historyList" @click="chooseCard(index)">{{ formatCard(item) }}</li>
                        </ul>
                    </div>
                </div>
                <div class="demoDialog" v-show="!loaded&&historyLoaded&&historyList.length<=0">
                    <div @click="focusInput">
                        <p><?php echo $alang['input_your_smartcard_number']; ?></p>
                        <div>
                            <img src="../resource/img/icon_smart_card.png">
                        </div>
                        <p><?php echo $alang['recharge_your_decoder_account']; ?></p>
                        <p class="tips"><?php echo $alang['Tips_check_your_Balance']; ?></p>
                    </div>
                    <p>
                        <?php echo $alang['if_you_are_not_a_startimes_tv_user']; ?>
                        <a
                            href="javascript:void(0)"
                            @click="toLoadurl"
                        ><?php echo $alang['click_here']; ?></a>
                        <?php echo $alang['if_you_are_not_a_startimes_tv_user2']; ?>
                    </p>
                </div>
                <div class="program-box" v-show="loaded">
                    <p v-show="canBuy">
                        <?php echo $alang['topup_bouquet']; ?>:
                        <span class="program-name">{{ program_name }}</span>
                    </p>
                </div>
                <div class="money-box clearfix" :class="{disabled:!canBuy}" v-show="loaded&&recharge_items.length>0">
                    <p><?php echo $alang['select_']; ?></p>
                    <ul class="recharge-style">
                        <li
                            v-for="(item,index) in recharge_items"
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
                                src="../resource/img/recharge/ic_gift_def.png"
                            >
                            <div v-if="item.preferentialPlanVo&&item.preferentialPlanVo.type==100" class="christmas">
                                <img src="../resource/img/recharge/img_christmaslogo.png" class="christmaslogo">
                                <span>{{((item.rate_amount-item.preferentialPlanVo.exclusivePrice)*100/item.rate_amount).toFixed(0)}}% OFF</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="first-charge" v-show="firstChargeTip">
                    <img src="../resource/img/recharge/ic_gift_def.png">
                    <div style="width:65%;float:left;">{{firstChargeTip}}</div>
                    <div v-show="firstChargeDetails" class="first-charge-detail" @click="showDetails"><?php echo $alang['first_recharge_detail']; ?></div>
                </div>
                <div class="count-box clearfix" :class="{disabled:!canBuy}">
                    <p v-show="loaded&&countList.length>1"><?php echo $alang['results_recharge_amount']; ?></p>
                    <ul class="choose clearfix" v-show="loaded&&countList.length>1">
                        <li v-for="(item,index) in countList">
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
                                <i></i>
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="pay-btn" v-on:click="buyNow" :class="{disabled:!canBuy}" v-show="loaded">
                    <span class="need-pay">{{ currency }}{{ paymentAmount | formatRateAmount }}</span>
                    <?php echo $alang['next_']; ?>
                </div>
            </div>
            <img
                v-show="loaded&&(countryCode=='NG'||countryCode=='TZ')"
                @click="buyNow"
                src="../resource/img/recharge/dvb_ug_off.png"
                style="width:100%"
            >
            <div class="blank_bottom" v-show="canBuy&&loaded&&countryCode=='NG'&&isApp==1">&nbsp;</div>
            <div class="more-services" v-show="canBuy&&loaded&&countryCode=='NG'&&isApp==1">
                <p @click="showAllWays">
                    <?php echo $alang['more_recharge_method']; ?>
                    <span class="all">
                        <?php echo $alang['membership_all']; ?>
                        <img src="../resource/img/recharge/ic_right_def_r.png" alt>
                    </span>
                </p>
            </div>
        </div>
        <loading v-show="!loaded"/>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data: function() {
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
            countryCode: "<?php echo $COUNTRY['code']; ?>",
            currency: "<?php echo $COUNTRY['currency_symbol']; ?>",
            currencyCode: "<?php echo $COUNTRY['currency_code']; ?>",
            stop_days: '',
            isLoading: false,
            init: true,
            cardHaveCharged: false,
            user_status: false,
            isApp: isApp
        }
    },
    computed: {
        oriCardNum: function() {
            var reg = /^[0-9]*$/
            var tmp = this.cardNum.replace(/\s/g, '')
            return reg.test(tmp) ? tmp : ''
        },
        rechargeAmount: function() {
            var item = this.recharge_items[this.chargeItemIndex]
            if (item) {
                return Number(item.rate_amount) * Number(this.checkedValue)
            } else {
                return 0
            }
        },
        rechargeExplanation: function() {
            var name = this.recharge_items[this.chargeItemIndex].rate_display_name
            if (name.indexOf('/') >= 0) {
                return name.split('/')[1] + ' x ' + this.checkedValue
            } else {
                return name + ' x ' + this.checkedValue
            }
        },
        paymentAmount: function() {
            var item = this.recharge_items[this.chargeItemIndex]
            var count = 0
            if (item) {
                if (item.preferentialPlanVo && item.preferentialPlanVo.exclusivePrice > 0) {
                    count = item.preferentialPlanVo.exclusivePrice
                } else {
                    count = item.rate_amount
                }
            }
            return Number(count) * Number(this.checkedValue)
        },
        firstChargeTip: function() {
            var item = this.recharge_items[this.chargeItemIndex]
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
        firstChargeDetails: function() {
            var item = this.recharge_items[this.chargeItemIndex]
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
        formatStopDays: function(str) {
            return dayjs(str).format('MMM DD YYYY') || ''
        },
        formatDate: function(str) {
            if (str.indexOf('/') >= 0) {
                return str.split('/')[1]
            } else {
                return str
            }
        },
        formatRateAmount: function(val) {
            // var tmp = String(str).split('').reverse().join('').match(/(\d{1,3})/g)
            // return tmp.join(',').split('').reverse().join('')
            if (!isNaN(val)) {
                var arr = val.toString().split('.')
                if (arr[1]) {
                    return arr[0].toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,') + '.' + arr[1]
                } else {
                    return arr[0].toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,') + '.00'
                }
            } else {
                return ''
            }
        },
        discountAmount: function(item) {
            var count = 0
            if (item.preferentialPlanVo && item.preferentialPlanVo.exclusivePrice > 0) {
                count = item.preferentialPlanVo.exclusivePrice
            } else {
                count = item.rate_amount
            }
            if (!isNaN(count)) {
                var arr = count.toString().split('.')
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
        focusInput: function() {
            this.$nextTick(function() {
                document.querySelector('input.card').focus()
            })
        },
        showAllWays: function() {
            this.sendEvLog({
                category: 'dvbservice',
                action: 'other_paymentWay_click',
                label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                value: 10,
                service_type: 'Recharge'
            })
            if (isApp == '1') {
                window.getChannelId.toAppPage(3, 'com.star.mobile.video.smartcard.recharge.RechargeActivity?fromNewRecharge=true', '')
            }
        },
        toLoadurl: function() {
            sendEvLog({
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
        showDetails: function() {
            sendEvLog({
                category: 'dvbservice',
                action: 'promotion_detail_click',
                label: 'DVB_H5',
                value: 10,
                service_type: 'Recharge'
            })
            malert(this.firstChargeDetails, '', function() {
                sendEvLog({
                    category: 'dvbservice',
                    action: 'promotion_detail_back',
                    label: 'DVB_H5',
                    value: 10,
                    service_type: 'Recharge'
                })
            })
        },
        clearInput: function() {
            this.cardNum = ''
            this.oriCardNum = ''
        },
        getHistoryBindCard: function(callback) {
            var _this = this
            mAjax('/self/v1/user/all_smartcard_basic_info_4wx', token, {
                type: 'get',
                dataType: 'json',
                data: '',
                success: function(data) {
                    _this.historyLoaded = true
                    if (data && data.length > 0) {
                        var arr = []
                        data.forEach(function(item, index) {
                            arr.push(item.smardcard_no)
                        })
                        _this.historyList = arr
                        _this.user_status = true
                        if (callback) callback()
                    } else {
                        sendEvLog({
                            category: 'dvbservice',
                            action: 'onlineServiceBtn_show',
                            label: 'dvb_recharge_empty_decoder',
                            value: 1,
                            service_type: 'Recharge'
                        })
                    }
                },
                error: function(err) {
                    _this.historyLoaded = true
                    sendEvLog({
                        category: 'dvbservice',
                        action: 'onlineServiceBtn_show',
                        label: 'dvb_recharge_empty_decoder',
                        value: 1,
                        service_type: 'Recharge'
                    })
                }
            })
        },
        chooseCard: function(index) {
            this.cardNum = this.formatCard(this.historyList[index])
            this.checkout()
        },
        formatCard: function(str) {
            return str.replace(/(^\d{3}\B|\d{4}\B)/g, '$1 ')
        },
        changeNum: function() {
            this.cardNum = this.formatCard(this.oriCardNum)
        },
        buyNow: function() {
            var rechargeItem = this.recharge_items[this.chargeItemIndex]

            sendEvLog({
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

            var _this = this

            if (!this.canBuy) return false

            var currencyCode = _this.currencyCode
            if (location.host.indexOf('qa.upms') >= 0 || location.host.indexOf('dev.upms') >= 0) {
                if (_this.countryCode.toLowerCase() == 'mg') {
                    currencyCode = 'OUV'
                }
            }

            var preferentialPlanId = rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo

            var params = {
                cardNo: _this.oriCardNum,
                countryCode: _this.countryCode,
                currencyCode: currencyCode,
                currency: _this.currency,
                rechargeExplanation: _this.rechargeExplanation,
                promotionAmount: (rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo.firstRechargeGiveMoney) || 0,
                rechargeAmount: new Number(_this.rechargeAmount).toFixed(2),
                paymentAmount: new Number(_this.paymentAmount).toFixed(2),
                exclusivePrice: new Number(
                    (rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo.exclusivePrice) || rechargeItem.rate_amount
                ).toFixed(2),
                preferentialPlanId: (rechargeItem.preferentialPlanVo && rechargeItem.preferentialPlanVo.id) || 0,
                listingPrice: new Number(rechargeItem.rate_amount).toFixed(2), // 原始单价
                rechargeItemSelectedQuantity: this.checkedValue,
                rechargeItemSelectedName: rechargeItem.rate_display_name,
                tv_platform: _this.tv_platform,
                smartcard_status: _this.card_state,
                stop_days: _this.stop_days,
                program_name: _this.program_name,
                money: _this.money,
                rechargeAmount: _this.rechargeAmount,
                firstChargeTip: _this.firstChargeTip,
                cardHaveCharged: _this.cardHaveCharged
            }

            sessionStorage.setItem('order-info', JSON.stringify(params))
            window.location.href = 'order.php'
        },
        selected: function(index) {
            if (this.canBuy) {
                this.chargeItemIndex = index
            }
        },
        checkout: function() {
            var _this = this
            var reg = /^\d{11}$/g
            var reg2 = /^(90|91|92|93)\d{9}$/g
            var reg3 = /^(01|02)\d{9}$/g

            if (_this.oriCardNum == '') {
                sendEvLog({
                    category: 'dvbservice',
                    action: 'smartcard_input',
                    label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                    value: -1,
                    service_type: 'Recharge',
                    SmartCardNo: _this.oriCardNum
                })
                return false
            } else {
                if (!reg.test(_this.oriCardNum)) {
                    sendEvLog({
                        category: 'dvbservice',
                        action: 'smartcard_input',
                        label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                        value: -1,
                        service_type: 'Recharge',
                        SmartCardNo: _this.oriCardNum
                    })
                    _this.isErrorCard = true
                    return false
                } else {
                    if (!reg3.test(_this.oriCardNum)) {
                        if (reg2.test(_this.oriCardNum)) {
                            sendEvLog({
                                category: 'dvbservice',
                                action: 'smartcard_input',
                                label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                                value: 0,
                                service_type: 'Recharge',
                                SmartCardNo: _this.oriCardNum,
                                errorMsg: 'eWallet'
                            })
                            mconfirm(
                                "<?php echo $alang['besure_input_ewallet']; ?>",
                                "<?php echo $alang['refuse_tip']; ?>",
                                "<?php echo $alang['agree_tip']; ?>",
                                function() {
                                    window.getChannelId.toAppPage(3, 'com.star.mobile.video.wallet.WalletRechargeActivity', '')
                                }
                            )
                        } else {
                            sendEvLog({
                                category: 'dvbservice',
                                action: 'smartcard_input',
                                label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                                value: 0,
                                service_type: 'Recharge',
                                SmartCardNo: _this.oriCardNum,
                                errorMsg: 'Decoder'
                            })
                            mconfirm(
                                "<?php echo $alang['besure_have_card']; ?>",
                                "<?php echo $alang['refuse_tip']; ?>",
                                "<?php echo $alang['agree_tip']; ?>",
                                function() {
                                    _this.toLoadurl()
                                }
                            )
                        }
                        _this.isErrorCard = true
                        return false
                    }

                    sendEvLog({
                        category: 'dvbservice',
                        action: 'smartcard_input',
                        label: this.user_status ? 'AddCardUser' : 'NewCardUser',
                        value: 1,
                        service_type: 'Recharge',
                        SmartCardNo: _this.oriCardNum
                    })
                }
            }
            _this.isLoading = true
            var timetr = new Date().getTime()
            mAjax('/self/v1/user/smartcardinfo/sync4h5', token, {
                type: 'get',
                dataType: 'json',
                data: {
                    smartcard: _this.oriCardNum,
                    is_bind_card: isLogin ? true : false
                },
                success: function(data) {
                    var n_timetr = new Date().getTime()

                    _this.isLoading = false
                    if (data && data.program_name) {
                        // page status
                        _this.loaded = true
                        _this.canBuy = true
                        _this.countLists = []
                        _this.chargeItemIndex = 0

                        _this.program_name = data.program_name
                        _this.tv_platform = data.tv_platform
                        _this.card_state = data.smartcard_status
                        _this.stop_days = data.penalty_stop
                        _this.money = data.money
                        _this.cardHaveCharged = data.have_rechareged
                        if (data.recharge_items && data.recharge_items.length > 0) {
                            _this.recharge_items = data.recharge_items || []
                            // 默认选中最大值
                            var maxMoney = 0
                            _this.recharge_items.sort(function(a, b) {
                                return a.rate_amount - b.rate_amount
                            })
                            _this.recharge_items.forEach(function(item, index) {
                                if (item.rate_amount > maxMoney) {
                                    maxMoney = item.rate_amount
                                    _this.chargeItemIndex = index
                                }
                                if (item.recharge_fee_numbers) {
                                    _this.countLists[_this.countLists.length] = item.recharge_fee_numbers
                                }
                            })

                            // 默认选中最小值
                            // var minMoney = 0
                            // _this.recharge_items.sort(function (a, b) {
                            //     return a.rate_amount - b.rate_amount;
                            // })
                            // _this.recharge_items.forEach(function (item, index) {
                            //     if (item.rate_amount < minMoney) {
                            //         minMoney = item.rate_amount
                            //         _this.chargeItemIndex = index
                            //     }
                            //     if (item.recharge_fee_numbers) {
                            //         _this.countLists[_this.countLists.length] = item.recharge_fee_numbers
                            //     }
                            // })
                            sendEvLog({
                                category: 'dvbservice',
                                action: 'load_recharge_item',
                                label: _this.user_status ? 'AddCardUser' : 'NewCardUser',
                                value: 1,
                                SmartCardNo: _this.oriCardNum,
                                BouquetName: _this.program_name,
                                CardState: _this.card_state,
                                PauseDate: _this.stop_days,
                                service_type: 'Recharge',
                                timeAlong: n_timetr - timetr
                            })
                        } else {
                            sendEvLog({
                                category: 'dvbservice',
                                action: 'load_recharge_item',
                                label: _this.user_status ? 'AddCardUser' : 'NewCardUser',
                                value: 0,
                                SmartCardNo: _this.oriCardNum,
                                BouquetName: _this.program_name,
                                CardState: _this.card_state,
                                PauseDate: _this.stop_days,
                                service_type: 'Recharge',
                                timeAlong: n_timetr - timetr
                            })
                            _this.canBuy = false
                            _this.$nextTick(function() {
                                malert("This bouquet can't be recharged for now, please contact the local center")
                            })
                        }
                        if (_this.countLists.length > 0) {
                            _this.countList = _this.countLists[_this.chargeItemIndex]
                        } else {
                            _this.countList = [1]
                        }
                        _this.checkedValue = _this.countList[0]
                    } else {
                        sendEvLog({
                            category: 'dvbservice',
                            action: 'load_recharge_item',
                            label: _this.user_status ? 'AddCardUser' : 'NewCardUser',
                            value: -1,
                            SmartCardNo: _this.oriCardNum,
                            BouquetName: _this.program_name,
                            CardState: _this.card_state,
                            PauseDate: _this.stop_days,
                            service_type: 'Recharge',
                            errorMsg: data.message,
                            timeAlong: n_timetr - timetr
                        })
                        _this.isErrorCard = true
                    }
                },
                error: function(err) {
                    var n_timetr = new Date().getTime()
                    sendEvLog({
                        category: 'dvbservice',
                        action: 'load_recharge_item',
                        label: _this.user_status ? 'AddCardUser' : 'NewCardUser',
                        value: -1,
                        SmartCardNo: _this.oriCardNum,
                        BouquetName: _this.program_name,
                        CardState: _this.card_state,
                        PauseDate: _this.stop_days,
                        service_type: 'Recharge',
                        errorMsg: err.status + '~' + err.statusText,
                        timeAlong: n_timetr - timetr
                    })
                    _this.isLoading = false

                    _this.$nextTick(function() {
                        if (err.status == 401) {
                            malert("<?php echo $alang['account_signed_elsewhere']; ?>", '', function() {
                                if (isApp == 1) {
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
                            malert("<?php echo $alang['error_network']; ?>")
                        }
                    })
                }
            })
        }
    },
    created: function() {
        var _this = this
        sendEvLog({
            category: 'dvbservice',
            action: 'recharge_show',
            label: 'DVB_H5',
            value: 10,
            service_type: 'Recharge'
        })
        var step2 = sessionStorage.getItem('step2')
        if (step2) {
            sendEvLog({
                category: 'dvbservice',
                action: 'back_history',
                label: 'DVB_H5',
                value: 10,
                service_type: 'Recharge'
            })
        }

        this.getHistoryBindCard(function() {
            if (_this.historyList.length > 0) {
                _this.cardNum = _this.formatCard(_this.historyList[0])
            }
        })
    },
    watch: {
        oriCardNum: function(val, oldVal) {
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
        chargeItemIndex: function(val, oldVal) {
            if (this.countLists.length > 0) {
                this.countList = this.countLists[val]
            } else {
                this.countList = [1]
            }
            this.checkedValue = this.countList[0]
        }
    },
    head() {
        return {
            title: this.$store.state.lang.dvb_bind_title
        }
    }
}
</script>
