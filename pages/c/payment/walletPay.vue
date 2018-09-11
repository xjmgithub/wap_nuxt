<template>
    <div class="container">
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
            <Button :disabled="false" :text="enough?'NEXT':'RECHARGE'" @click="nextStep"></Button>
        </div>
    </div>
</template>
<script>
    import Button from '~/components/button'
    export default {
        data() {
            return {
                amount:10,
                merchant: 'Xender',  // TODO 
                signature: '',
                balance: 0,
                accountNo: ''
            }
        },
        computed:{
            enough(){
                return this.amount <= this.balance
            }
        },
        layout: 'base',
        components: {
            Button
        },
        created() {
            let _this = this
            this.$axios.setHeader('token', this.$store.state.token)
            this.$axios.get('/mobilewallet/v1/accounts/me').then(res => {
                if (res.data) {
                    _this.signature = res.data.currency
                    _this.balance = res.data.amount
                    _this.accountNo = res.data.accountNo
                    _this.balance = 100
                }
            })
        },
        methods:{
            nextStep(){
                if(this.enough){
                    // TODO 支付流程
                    this.$router.push('/c/payment/walletPass')
                }else{
                    // TODO 充值流程
                }
            }
        },
        watch: {
            amount(val, oldVal) {
                if (val >= 0) { // TODO 0元支付
                    if (val < this.balance) {
                        this.canNext = true
                    } else {
                        this.canNext = false
                    }
                } else {
                    this.canNext = false
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