<template>
    <div>
        <div class="pay-methods">
            <div class="methods">
                <p>{{LANG.payment_details_method}}：</p>
                <ul class="choose clearfix">
                    <li v-for="(item,index) in methodsList" :key="index" v-show="item.fkPayChannelId<9002||item.fkPayChannelId>9034||wallet">
                        <label @click="changeMethod(item)" class="radio">
                            <input :value="item.name" v-model="selectMethod.name" type="radio" name="methods">
                            <i />
                            <span>{{ item.name }}</span>
                            <br>
                            <span
                                v-if="item.fkPayChannelId >= 9002 && item.fkPayChannelId <= 9034 && wallet.accountNo"
                                :class="{red:wallet.amount < payAmount}"
                                class="balance"
                            >(Balance:{{wallet.currencySymbol}}{{wallet.amount}} )</span>
                        </label>
                        <div
                            @click="chargeWallet"
                            v-if="item.fkPayChannelId>=9002&&item.fkPayChannelId<=9034&&wallet.accountNo&&wallet.amount<payAmount"
                            class="recharge"
                        >
                            RECHARGE
                        </div>
                    </li>
                </ul>
                <div v-show="selectMethod.description" class="note">
                    <p>Note:</p>
                    <p v-html="selectMethod.description" />
                </div>
            </div>
        </div>
        <div class="btn-box">
            <span class="total">{{LANG.payment_details_total}}:</span>
            <span class="total">{{ currency }}{{formatAmount(payAmount) }}</span>
            <div :class="{disabled:!canPay}" @click="pay" class="pay-btn">
                {{LANG.dvb_recharge_btn_pay}}
            </div>
        </div>
    </div>
</template>
<script>
import { formatAmount } from '~/functions/utils'
import { createDVBOrder, invoke, commonPayAfter, chargeWallet } from '~/functions/pay'
export default {
    props: {
        wallet: {
            type: Object,
            default: null
        }
    },
    data() {
        const user = this.$store.state.user
        return {
            countryCode: this.$store.state.country.country,
            currency: this.$store.state.country.currencySymbol,
            methodsList: [],
            selectMethod: {},
            isLogin: user.roleName && user.roleName.toUpperCase() !== 'ANONYMOUS',
            payAmount: 0
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
            const checkPass = channel > 9002 && channel < 9034
            if (!this.canPay) return false
            if (checkPass) {
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
            createDVBOrder(this, order, data => {
                if (useForm) {
                    this.$router.push(`/hybrid/payment/form?payToken=${data.paymentToken}&payChannelId=${channel}`)
                } else {
                    invoke(this, data.paymentToken, channel, data => {
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
    width: 90%;
    bottom: 0;
    position: fixed;
    left: 5%;
    padding: 0.5rem 0;
    border-top: 1px solid #e0e0e0;
    line-height: 2.3rem;
    background: #fff;
    .pay-btn {
        margin-bottom: 0;
        width: 7rem;
        float: right;
        margin-top: 0;
    }
    .total {
        font-size: 1.15rem;
        font-weight: bold;
    }
}
</style>
