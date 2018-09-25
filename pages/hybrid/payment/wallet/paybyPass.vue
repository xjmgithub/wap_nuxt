<template>
    <div class="container">
        <Password ref="pass" :placeholder="pwdType" :toggleView="false" @endinput="setPassword"></Password>
        <div class="forgot-pwd">
            <a href="#">Forgot payment password?</a>
        </div>
        <div class="footer">
            <mButton :disabled="!canPay" :text="'PAY NOW'" @click="nextStep"></mButton>
        </div>
    </div>

</template>
<script>
import mButton from '~/components/button'
import Password from '~/components/password'
export default {
    data() {
        return {
            pwdType: 'Enter Payment Password',
            password: '',
            canPay:false
        }
    },
    layout: 'base',
    components: {
        mButton,
        Password
    },
    methods: {
        setPassword(data) {
            this.password = this.$refs.pass.password
        },
        nextStep() {
            this.$axios
                .post('/mobilewallet/v1/balance-payments&noquery=1', {
                    // TODO 钱包支付的参数
                    amount: this.payRecord.amount,
                    currency: this.payRecord.currency,
                    extensionInfo: this.payRecord.extendInfo,
                    note: this.payRecord.payNote,
                    orderId: this.payRecord.orderId,
                    payeeAccountNo: channelId,
                    payerAccountNo: this.ewalletNo,
                    payerPayPassword: this.password,
                    signature: this.payRecord.signature,
                    subject: this.payRecord.paySubject,
                    extensionInfo: {
                        paySeqNo: _this.payRecord.seqNo
                    }
                })
                .then(res => {
                    if (res.data) {
                        this.signature = res.data.currency
                        this.balance = res.data.amount
                        this.accountNo = res.data.accountNo
                        this.balance = 100
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