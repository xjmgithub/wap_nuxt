<template>
    <div class="pay-cont">
        <div class="channel">
            <div v-if="ewalletRender.name">
                <div class="channel-name">{{ewalletRender.name}}</div>
                <mLine style="clear:both"/>
                <div v-for="(card,iv) in ewalletRender.radioList" :key="iv" class="radio-box">
                    <label v-if="card.authorizationCode" class="radio">
                        <div :class="card.brand" class="img-box"/>
                        <span>{{card.cardType}}({{card.last4}})</span>
                        <input :checked="card.authorizationCode==selected.authorizationCode" type="radio" name="pay-options" @click="choose(card)">
                        <i/>
                    </label>
                    <label v-else class="radio">
                        <div class="balance img-box"/>
                        <span>Balance: {{currency}}{{formatAmount(balance)}}</span>
                        <input :checked="card.fkPayChannelId==selected.fkPayChannelId" type="radio" name="pay-options" @click="choose(card)">
                        <i/>
                        <div v-if="balance<paymentAmount" class="recharge" @click="chargeWallet">RECHARGE</div>
                    </label>
                </div>
                <div v-if="ewalletRender.addCardPay" class="addCard" @click="payHandle(ewalletRender.addCardPay,'',1)">
                    <div class="img-box"/>
                    <span v-if="ewalletRender.radioList.length>1">Pay with Another Card</span>
                    <span v-else>Add a Bank Card</span>
                    <div class="arrows"/>
                </div>
            </div>
            <div v-for="(item,index) in outChannels" :key="index" @click="payHandle(item)">
                <div class="channel-name">{{item.name}}</div>
                <div class="arrows"/>
            </div>
        </div>
        <div v-show="selected&&selected.description" class="note">
            <p>Note:</p>
            <p v-html="selected&&selected.description"/>
        </div>
        <div v-if="ewalletRender.name" class="btn-box">
            <span class="total">{{$store.state.lang.payment_details_total}}:</span>
            <span class="total">{{ currency }}{{ formatAmount(paymentAmount)}}</span>
            <div :class="{disabled:!canPay}" class="pay-btn" @click="pay">{{$store.state.lang.dvb_recharge_btn_pay}}</div>
        </div>
    </div>
</template>
<script>
import mLine from '~/components/pay/line'
import { formatAmount } from '~/functions/utils'
import { createDVBOrder, invoke, commonPayAfter, chargeWallet, checkPass } from '~/functions/pay'
export default {
    components: {
        mLine
    },
    data() {
        const user = this.$store.state.user
        return {
            selected: {},
            paymentAmount: 0,
            wallet: {},
            currency: this.$store.state.country.currencySymbol,
            isLogin: user.roleName && user.roleName.toUpperCase() !== 'ANONYMOUS',
            osv5: false,
            channels: []
        }
    },
    computed: {
        balance() {
            return (this.wallet && this.wallet.amount) || 0
        },
        canPay() {
            if (this.selected.fkPayChannelId) {
                if (this.selected.fkPayChannelId > 9001 && this.selected.fkPayChannelId < 9035 && this.balance < this.paymentAmount) {
                    return false
                } else {
                    return true
                }
            }else{
                return false
            }
        },
        ewalletRender() {
            const ewallet = {
                name: null,
                radioList: [],
                addCardPay: null
            }
            let ewalletPay = null
            let addCardPay = null
            this.channels.forEach(item => {
                if (item.fkPayChannelId > 9001 && item.fkPayChannelId < 9035) {
                    ewalletPay = item
                }
                if (item.isSupportCardBind > 0) {
                    addCardPay = item
                }
            })

            if (ewalletPay) {
                ewallet.name = ewalletPay.name
                if (this.isLogin) {
                    if (addCardPay) {
                        addCardPay.payChannelCardAuthDtoList.forEach(item => {
                            item = Object.assign(item, addCardPay)
                        })
                        ewallet.addCardPay = this.osv5 && addCardPay
                        if (addCardPay.lastSuccessPay) {
                            ewallet.radioList = [].concat(addCardPay.payChannelCardAuthDtoList || []).concat(ewalletPay)
                        } else {
                            ewallet.radioList = [].concat(ewalletPay).concat(addCardPay.payChannelCardAuthDtoList || [])
                        }
                    } else {
                        ewallet.radioList = [ewalletPay]
                    }
                } else if (addCardPay && this.osv5) {
                    ewallet.addCardPay = addCardPay
                } else {
                    ewallet.name = null
                }
            }

            ewallet.radioList && ewallet.radioList.length > 0 && this.choose(ewallet.radioList[0])

            return ewallet
        },
        outChannels() {
            const r = []
            this.channels.forEach(item => {
                !(item.isSupportCardBind > 0 || (item.fkPayChannelId > 9001 && item.fkPayChannelId < 9035)) && r.push(item)
            })
            return r
        }
    },
    mounted() {
        const param = JSON.parse(sessionStorage.getItem('order-info'))
        this.paymentAmount = Math.floor(param.paymentAmount)
        if (navigator.connection) {
            this.osv5 = true
        } else {
            this.sendEvLog({
                category: 'dvbservice',
                action: 'hide_payment',
                label: 1,
                value: 0,
                service_type: 'Recharge'
            })
        }

        this.$axios.get(`/wxorder/v2/payment_channels`).then(res => {
            this.channels = res.data || []
        })

        this.$axios.get(`/mobilewallet/v1/accounts/me`).then(res => {
            this.wallet = res.data
            sessionStorage.setItem('wallet', JSON.stringify(this.wallet))
        })
    },
    methods: {
        choose(item) {
            this.selected = item
        },
        chargeWallet() {
            chargeWallet.call(this, () => {
                this.$axios.get(`/mobilewallet/v1/accounts/me`).then(res => {
                    this.wallet = res.data
                    sessionStorage.setItem('wallet', JSON.stringify(this.wallet))
                })
            })
        },
        payHandle(channel, card, ignorePwdVerify) {
            const order = JSON.parse(sessionStorage.getItem('order-info'))
            this.$nuxt.$loading.start()
            this.$store.commit('SHOW_SHADOW_LAYER')

            this.sendEvLog({
                category: 'dvbservice',
                action: 'order_click',
                label: channel.name, // TODO 埋点名称
                value: order.rechargeAmount || 0,
                service_type: 'Recharge',
                recharge_config: order.rechargeItemSelectedName,
                recharge_amount: order.rechargeItemSelectedQuantity,
                SmartCardNo: order.cardNo,
                BouquetName: order.program_name,
                CardState: order.smartcard_status,
                PauseDate: order.stop_days
            })

            createDVBOrder.call(this, order, data => {
                if (channel.needEwalletPwdVerify > 0 && !ignorePwdVerify) {
                    checkPass.call(this, this.wallet.accountNo, setted => {
                        this.$nuxt.$loading.finish()
                        this.$store.commit('HIDE_SHADOW_LAYER')
                        if (setted) {
                            this.$router.push(
                                `/hybrid/payment/wallet/paybyPass?paytoken=${data.paymentToken}&channel=${channel.fkPayChannelId}&apiType=${
                                    channel.appInterfaceMode
                                }&card=${card || ''}`
                            )
                        } else {
                            this.$alert('For your security,please set up your password for eWallet and register your phone number.', () => {
                                this.$router.push(
                                    `/hybrid/payment/wallet/setPassword?paytoken=${data.paymentToken}&channel=${channel.fkPayChannelId}&apiType=${
                                        channel.appInterfaceMode
                                    }&card=${card || ''}`
                                )
                            })
                        }
                    })
                } else if (channel.formConfigExist) {
                    this.$nuxt.$loading.finish()
                    this.$store.commit('HIDE_SHADOW_LAYER')
                    this.$router.push(
                        `/hybrid/payment/form?payToken=${data.paymentToken}&payChannelId=${channel.fkPayChannelId}&appInterfaceMode=${
                            channel.appInterfaceMode
                        }`
                    )
                } else {
                    invoke.call(this, data.paymentToken, channel.fkPayChannelId, data => {
                        this.$nuxt.$loading.finish()
                        this.$store.commit('HIDE_SHADOW_LAYER')
                        commonPayAfter.call(this, data, channel.payType, channel.appInterfaceMode)
                    })
                }
            })
        },
        pay() {
            this.canPay && this.payHandle(this.selected, this.selected.authorizationCode)
        },
        formatAmount(num) {
            return formatAmount(num)
        }
    }
}
</script>
<style lang="less" scoped>
.pay-cont {
    margin: 0 auto;
    padding: 0 0.8rem 5rem;
}
.channel {
    position: relative;
    > div {
        overflow: hidden;
        zoom: 1;
        border-bottom: 1px solid #e0e0e0;
    }
    .channel-name {
        line-height: 3rem;
        font-size: 1.1rem;
        width: 85%;
        float: left;
    }
    .arrows {
        float: right;
        width: 1.3rem;
        height: 3rem;
        background: url('~assets/img/dvb/ic_right_def_r.png') no-repeat center center;
        background-size: auto;
    }
    .addCard {
        font-size: 0.95rem;
        height: 2.7rem;
        line-height: 2.2rem;
        position: relative;
        .img-box {
            display: inline-block;
            vertical-align: middle;
            height: 1.3rem;
            width: 1.3rem;
            background-size: 100% !important;
            background: url('~assets/img/dvb/ic_ewallet_add.png') no-repeat;
        }
        span {
            margin-left: 0.5rem;
        }
    }
}

.radio-box .img-box {
    display: inline-block;
    vertical-align: middle;
    height: 1.3rem;
    width: 1.3rem;
    background-size: 100% !important;
    background: url('~assets/img/dvb/ic_no_logo_card.png') no-repeat;
    &.balance {
        background: url('~assets/img/dvb/ic_ewallet_balance.png') no-repeat;
    }
    &.visa {
        background: url('~assets/img/dvb/ic_visa.png') no-repeat;
    }
    &.verve {
        background: url('~assets/img/dvb/ic_verve.png') no-repeat;
    }
    &.mastercard {
        background: url('~assets/img/dvb/ic_mastercard.png') no-repeat;
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
    margin: auto;
}
.radio-box input:checked + i {
    border: 2px solid #008be9;
}
.radio-box input:checked + i:after {
    opacity: 1;
}
.radio-box input + i + .recharge {
    display: none;
}
.radio-box input:checked + i + .recharge {
    display: block;
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

.note {
    font-size: 0.95rem;
    color: #666666;
    line-height: 1.3rem;
    background: #fff;
    word-break: break-all;
    padding-top: 0.7rem;
    p {
        margin: 0;
        padding: 0;
    }
}
.btn-box {
    bottom: 0;
    position: fixed;
    padding: 0.8rem 0;
    left: 0.8rem;
    right: 0.8rem;
    border-top: 1px solid #e0e0e0;
    line-height: 2.3rem;
    background: #fff;
    .pay-btn {
        background-color: #008be9;
        color: #fff;
        height: 2.4rem;
        width: 7rem;
        line-height: 2.4rem;
        text-align: center;
        font-size: 0.9rem;
        float: right;
        border-radius: 4px;
        &.disabled {
            background-color: #bdbdbd;
        }
    }
    .total {
        font-size: 1.15rem;
        font-weight: bold;
    }
}
</style>
