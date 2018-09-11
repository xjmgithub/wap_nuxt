<template>
    <div class="container">
        <Password :placeholder="pwdType" :toggleView="false" @setPassword="setPassword" ></Password>
        <div class="forgot-pwd">
            <a href="#">Forgot payment password?</a>
        </div>
        <div class="footer">
        <Button :disabled="!canPay" :text="'PAY NOW'" @click="nextStep"></Button>
        </div>
    </div>

</template>
<script>
    import Button from '~/components/button'
    import Password from '~/components/password'
    export default {
        data() {
            return {
                pwdType: "Enter Payment Password",
                password: '',
                canPay:false
            }
        },
        layout: 'base',
        components: {
            Button, 
            Password
        },
        methods: {
            setPassword(data) {
                this.password = data
            },
            nextStep(){
                this.$axios.setHeader('token', this.$store.state.token)
                this.$axios.post('/mobilewallet/v1/balance-payments&noquery=1',{  // TODO 钱包支付的参数
                    "amount": _this.payRecord.amount,
                    "currency": _this.payRecord.currency,
                    "extensionInfo": _this.payRecord.extendInfo,
                    "note": _this.payRecord.payNote,
                    "orderId": _this.payRecord.orderId,
                    "payeeAccountNo": channelId,
                    "payerAccountNo": this.ewalletNo,
                    "payerPayPassword": this.password,
                    "signature": _this.payRecord.signature,
                    "subject": _this.payRecord.paySubject,
                    "extensionInfo": {
                        "paySeqNo": _this.payRecord.seqNo
                    }
                }).then(res => {
                    if (res.data) {
                        _this.signature = res.data.currency
                        _this.balance = res.data.amount
                        _this.accountNo = res.data.accountNo
                        _this.balance = 100
                    }
                })
            }
        },
        watch: {
            password(val, oldVal) {
                if (val.length >= 6) {
                    this.canPay = true
                } else {
                    this.canPay = false
                }

            }
        }
    }

</script>
<style scoped>
.container {
    padding: 6rem 1rem 0 1rem;
    font-family: 'Roboto';
}

.forgot-pwd {
    text-align: right;
}

.forgot-pwd a {
    color: #0087eb;
    font-size: 0.85rem;
    font-weight: bold;
    display: inline-block;
    border-bottom: 1px solid #0087eb;
    padding-top: 0.3rem;
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