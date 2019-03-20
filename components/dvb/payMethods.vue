<template>
    <div>
        <div class="pay-methods">
            <div class="methods">
                <p>{{LANG.payment_details_method}}：</p>
                <ul class="choose clearfix">
                    <li v-for="(item,index) in methodsList" v-show="item.fkPayChannelId<9002||item.fkPayChannelId>9034||wallet" :key="index">
                        <label class="radio" @click="changeMethod(item)">
                            <input v-model="selectMethod.name" :value="item.name" type="radio" name="methods">
                            <i/>
                            <span>{{ item.name }}</span>
                            <br>
                            <span
                                v-if="item.fkPayChannelId >= 9002 && item.fkPayChannelId <= 9034 && wallet.accountNo"
                                :class="{red:wallet.amount < payAmount}"
                                class="balance"
                            >(Balance:{{wallet.currencySymbol}}{{wallet.amount}} )</span>
                        </label>
                        <div
                            v-if="item.fkPayChannelId>=9002&&item.fkPayChannelId<=9034&&wallet.accountNo&&wallet.amount<payAmount"
                            class="recharge"
                            @click="chargeWallet"
                        >RECHARGE</div>
                    </li>
                </ul>
                <div v-show="selectMethod.description" class="note">
                    <p>Note:</p>
                    <p v-html="selectMethod.description"/>
                </div>
            </div>
        </div>
        <div class="btn-box">
            <span class="total">{{LANG.payment_details_total}}:</span>
            <span class="total">{{ currency }}{{formatAmount(payAmount) }}</span>
            <div :class="{disabled:!canPay}" class="pay-btn" @click="pay">{{LANG.dvb_recharge_btn_pay}}</div>
        </div>
    </div>
</template>
<script>
import { formatAmount } from '~/functions/utils'
import { createDVBOrder, invoke, commonPayAfter, chargeWallet, checkPass } from '~/functions/pay'
export default {
    data() {
        const user = this.$store.state.user
        return {
            countryCode: this.$store.state.country.country,
            currency: this.$store.state.country.currencySymbol,
            methodsList: [],
            selectMethod: {},
            isLogin: user.roleName && user.roleName.toUpperCase() !== 'ANONYMOUS',
            payAmount: 0,
            wallet: {}
        }
    },
    computed: {
        LANG() {
            return this.$store.state.lang
        },
        canPay() {
            if (this.selectMethod.fkPayChannelId) {
                if (this.selectMethod.fkPayChannelId >= 9002 && this.selectMethod.fkPayChannelId <= 9034) {
                    if (this.wallet.amount >= this.payAmount) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            } else {
                return false
            }
        }
    },
    mounted() {
        const param = JSON.parse(sessionStorage.getItem('order-info'))
        this.payAmount = param.paymentAmount

        this.$axios.get(`/mobilewallet/v1/accounts/me`).then(res => {
            this.wallet = res.data
            sessionStorage.setItem('wallet', JSON.stringify(this.wallet))
        })
        this.$axios
            .get(`/wxorder/v1/queryPaymentChannelByCountryCode?countryCode=${this.countryCode}`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    this.methodsList = res.data
                    this.selectMethod = this.methodsList[0]
                } else {
                    this.$alert(this.LANG.error_network, () => {
                        this.$router.go(0) // TODO 优化
                    })
                }
            })
            .catch(() => {
                this.$alert(this.LANG.error_network, () => {
                    this.$router.go(0) // TODO 优化
                })
            })
    },
    methods: {
        changeMethod(item) {
            this.selectMethod = item
        },
        chargeWallet() {
            chargeWallet(this)
        },
        formatAmount(num) {
            return formatAmount(num)
        },
        pay() {
            const channel = this.selectMethod.fkPayChannelId
            const checkPassTag = channel > 9002 && channel < 9034
            if (!this.canPay) return false
            this.$nuxt.$loading.start()
            this.$store.commit('SHOW_SHADOW_LAYER')
            if (checkPassTag) {
                checkPass(this, this.wallet.accountNo, () => {
                    this.payHandle()
                })
            } else {
                this.payHandle()
            }
        },
        payHandle() {
            const order = JSON.parse(sessionStorage.getItem('order-info'))
            const useForm = this.selectMethod.formConfigExist
            const channel = this.selectMethod.fkPayChannelId
            const payType = this.selectMethod.payType
            const apiType = this.selectMethod.appInterfaceMode

            this.sendEvLog({
                category: 'dvbservice',
                action: 'order_click',
                label: this.selectMethod.name,
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
                if (useForm) {
                    this.$nuxt.$loading.finish()
                    this.$store.commit('HIDE_SHADOW_LAYER')
                    this.$router.push(`/hybrid/payment/form?payToken=${data.paymentToken}&payChannelId=${channel}`)
                } else {
                    invoke(this, data.paymentToken, channel, data => {
                        this.$nuxt.$loading.finish()
                        this.$store.commit('HIDE_SHADOW_LAYER')
                        commonPayAfter(this, data, payType, apiType)
                    })
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.pay-methods {
    width: 90%;
    margin: 0 auto;
    .choose {
        li {
            list-style: none;
            box-sizing: border-box;
            margin-bottom: 0.7rem;
            width: 100%;
            position: relative;
            .radio {
                position: relative;
                padding-left: 1.5rem;
                cursor: pointer;
                display: block;
                color: #424242;
                input {
                    position: absolute;
                    left: -9999px;
                    & + i {
                        &:after {
                            position: absolute;
                            content: '';
                            top: 2px;
                            left: 2px;
                            width: 9px;
                            height: 9px;
                            border-radius: 50%;
                            background-color: #008be9;
                            opacity: 0;
                            transition: opacity 0.1s;
                            -webkit-transition: opacity 0.1s;
                        }
                    }
                    &:checked {
                        & + i {
                            border: 1px solid #008be9;
                            &:after {
                                opacity: 1;
                            }
                        }
                    }
                }
                i {
                    display: block;
                    position: absolute;
                    top: 1px;
                    left: 0;
                    width: 15px;
                    height: 15px;
                    outline: 0;
                    border: 1px solid #bdbdbd;
                    background: #ffffff;
                    border-radius: 50%;
                }
            }
            .recharge {
                color: #008be9;
                font-weight: bold;
                font-size: 0.95rem;
                position: absolute;
                top: 0.5rem;
                right: 0;
            }
        }
        span {
            vertical-align: middle;
            font-weight: bold;
            &.balance {
                font-size: 0.75rem;
                &.red {
                    color: red;
                }
            }
        }
    }
    .methods {
        padding-bottom: 5.5rem;
        & > p {
            font-weight: bold;
            margin: 0.6rem 0;
        }
    }
    .note {
        font-size: 0.85rem;
        color: #666666;
        line-height: 1.1rem;
        background: #fff;
        word-break: break-all;
        p {
            margin: 0;
            padding: 0;
        }
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
