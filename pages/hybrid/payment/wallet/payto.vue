<template>
    <div class="container">
        <loading v-show="loadStatus"/>
        <p class="amount">Payments to {{merchant}}</p>
        <div class="pay-number">
            <div class="signature">{{signature}}</div>
            <div class="money">
                <input type="tel" placeholder="Payment amount" v-model="amount" disabled="disabled">
                <div
                    class="balance"
                    :class="{notenough:!enough}"
                >eWallet Balance:{{balanceCurrency}}{{balance}}</div>
            </div>
        </div>
        <div class="footer">
            <mButton :disabled="false" :text="enough?'NEXT':'RECHARGE'" @click="nextStep"/>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import loading from '~/components/loading'
import { updateWalletAccount, updateWalletConf } from '~/functions/utils'
export default {
    layout: 'base',
    data() {
        return {
            payToken: this.$route.query.payToken,
            txNo: this.$route.query.txNo,
            payChannelId: this.$route.query.payChannel,
            amount: '0',
            merchant: '',
            signature: '',
            balance: 0,
            loadStatus: true,
            balanceCurrency: ''
        }
    },
    computed: {
        enough() {
            return this.amount <= this.balance
        }
    },
    components: {
        mButton,
        loading
    },
    mounted() {
        if (this.payToken) {
            localStorage.setItem('payToken', this.payToken)
        } else {
            this.payToken = localStorage.getItem('payToken')
            if (!this.payToken) {
                this.$alert('Query payToken needed! please check request')
                return false
            }
        }

        if (this.txNo) {
            localStorage.setItem('txNo', this.txNo)
        } else {
            this.txNo = localStorage.getItem('txNo')
            if (!this.txNo) {
                this.$alert('txNo can not be null')
                return false
            }
        }

        if (this.payChannelId) {
            localStorage.setItem('payChannelId', this.payChannelId)
        } else {
            this.payChannelId = localStorage.getItem('payChannelId')
            if (!this.payChannelId) {
                this.$alert('payChannel can not be null')
                return false
            }
        }

        updateWalletAccount(this, account => {
            this.balance = account.amount
            this.balanceCurrency = account.currencySymbol
            updateWalletConf(this, account.accountNo)
        })

        this.$axios
            .get(`/payment/api/v2/get-pre-payment?payToken=${this.payToken}`, {
                headers: {
                    token: this.$store.state.token
                }
            })
            .then(res => {
                let data = res.data
                if (data && data.resultCode == '0') {
                    this.loadStatus = false
                    this.amount = data.totalAmount
                    this.merchant = data.mercahntName
                    this.signature = data.currency
                    localStorage.setItem('payObject', JSON.stringify(data))
                } else {
                    this.$alert(data.resultMessage)
                }
            })
    },
    methods: {
        nextStep() {
            if (this.enough) {
                // 支付流程
                let passIsSet = JSON.parse(localStorage.getItem('wallet_config')).payPassword
                if (passIsSet == 'true') {
                    this.$router.push(`/hybrid/payment/wallet/paybyPass`)
                } else {
                    this.$router.push('/hybrid/payment/wallet/setPassword')
                }
            } else {
                // 充值流程
                this.$router.push('/hybrid/payment/wallet/rechargeChannel')
            }
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    padding-top: 6rem;
    background:white;
}
.container .amount {
    color: #333333;
    font-size: 1.3rem;
    line-height: 1.4rem;
    padding-bottom: 3.2rem;
    font-weight: bold;
    text-align: center;
}

.container p.balance {
    font-size: 0.8rem;
    color: #333;
    margin-left: 3rem;
}

.container .balance.notenough {
    color: red;
}

.container .pay-number {
    width: 16rem;
    margin: 0 auto;
    .signature {
        width: 3rem;
        float: left;
        text-align: right;
    }
    .money {
        width: 12.5rem;
        float: right;
        input {
            background: white;
            border: none;
            outline: none;
            border-bottom: solid 1px #dddddd;
        }
    }
    .balance {
        line-height: 2.2rem;
        font-size: 0.9rem;
    }
}
.footer {
    position: fixed;
    bottom: 2rem;
    width: 75%;
    margin: 0 auto;
    left: 0;
    right: 0;
}
</style>
