<template>
    <div class="container">
        <loading v-show="loadStatus"></loading>
        <p class="amount">Payments to {{merchant}}</p>
        <div class="pay-number">
            <div class="signature">
                {{signature}}
            </div>
            <div class="money">
                <input type="tel" placeholder="Payment amount" v-model="amount" disabled="disabled" />
                <div class="balance" :class="{notenough:!enough}">eWallet Balance:￠{{balance}}</div>
            </div>
        </div>
        <div class="footer">
            <mButton :disabled="false" :text="enough?'NEXT':'RECHARGE'" @click="nextStep"></mButton>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import loading from '~/components/loading'
export default {
    layout: 'base',
    data() {
        return {
            payToken: this.$route.query.payToken,
            amount: 10,
            merchant: '',
            signature: '',
            balance: 0,
            loadStatus: true
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
        if (!this.payToken) {
            this.$alert('Query payToken needed! please check request')
            return false
        }
        this.$axios.get('/mobilewallet/v1/accounts/me').then(res => {
            if (res.data) {
                window.localStorage.setItem(
                    'wallet_account',
                    JSON.stringify(res.data)
                )
                this.balance = res.data.amount
                this.balance = 100 // TODO remove demo
                this.getSetConfig(res.data.accountNo) // 钱包配置
            }
        })

        this.$axios
            .get(`/payment/api/v2/get-pre-payment?payToken=${this.payToken}`)
            .then(res => {
                let data = res.data
                if (data && data.resultCode == '0') {
                    this.amount = data.totalAmount
                    this.merchant = data.mercahntName
                    this.signature = data.currency
                    sessionStorage.setItem('currency', data.currency)
                    this.loadStatus = false
                } else {
                    this.$alert(data.resultMessage)
                }
            })
    },
    methods: {
        getSetConfig(account) {
            this.$axios
                .get(`/mobilewallet/v1/accounts/${account}/prop-details`)
                .then(res => {
                    window.localStorage.setItem('wallet_config', JSON.stringify(res.data))
                })
        },
        nextStep() {
            if (this.enough) {
                // 支付流程
                let passIsSet = JSON.parse(window.localStorage.getItem('wallet_config')).payPassword
                if (passIsSet=='true') {
                    this.$router.push('/c/payment/wallet/paybyPass')
                } else {
                    this.$router.push('/c/payment/wallet/setPassword')
                }
            } else {
                // 充值流程
                this.$router.push('/c/payment/wallet/rechargeChannel')
            }
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    padding-top: 6rem;
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
    margin-top: 2rem;
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
        line-height: 1.8rem;
        font-size: 0.9rem;
    }
}
.footer {
    position: fixed;
    bottom: 2rem;
    width: 16rem;
    margin: 0 auto;
    left: 0;
    right: 0;
}
</style>