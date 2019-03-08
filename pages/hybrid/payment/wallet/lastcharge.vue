<template>
    <div class="container">
        <loading v-show="loadStatus" />
        <template v-if="result==1&&!loadStatus">
            <img class="success_img" src="~assets/img/pay/pic_done_b.png" alt>
            <p class="success">
                Your lastest Recharge
            </p>
            <p class="money">
                {{amount}}
                <span>{{currencySymbol}}</span>
            </p>
            <p
                class="msg"
            >
                Thanks for your payment. Your account has been successfully paymented. Please click "OK" if you are not redirected within 5s.
            </p>
            <br>
            <p class="msg des">
                Recharge No.: {{accountNo}}
            </p>
            <p class="msg des">
                Recharge amount: {{amount}} {{currencySymbol}}
            </p>
            <p class="msg des">
                eWallet balance: {{balance}} {{currencySymbol}}
            </p>
            <p class="msg des">
                recharge time: {{rechargeTime}}
            </p>
        </template>
        <template v-if="result==2&&!loadStatus">
            <img src="~assets/img/pay/img_failed_def_b.png" alt>
            <p class="fail">
                Payment Failed
            </p>
            <p class="msg">
                Thanks for your payment. But You have insufficent funds.
            </p>
        </template>
        <div v-show="!loadStatus" class="footer">
            <mButton :disabled="false" @click="refresh" text="REFRESH" />
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import loading from '~/components/loading'
export default {
    components: {
        mButton,
        loading
    },
    data() {
        return {
            result: 0,
            loadStatus: true,
            amount: '',
            accountNo: '',
            balance: '',
            currencySymbol: '',
            rechargeTime: ''
        }
    },
    layout: 'base',
    mounted() {
        const ewallet = JSON.parse(localStorage.getItem('wallet_account'))
        this.accountNo = ewallet.accountNo
        this.refresh()
    },
    methods: {
        refresh() {
            this.loadStatus = true
            const walletAccount = JSON.parse(localStorage.getItem('wallet_account')).accountNo
            this.$axios.get(`/mobilewallet/v1/accounts/${walletAccount}/sub-account-seqs/latest?seqType=1`).then(res => {
                this.loadStatus = false
                if (res.data && res.data.amount) {
                    this.amount = res.data.postAmount
                    this.balance = res.data.amount
                    this.currencySymbol = res.data.currencySymbol
                    this.rechargeTime = res.data.createTime
                    this.result = 1
                } else {
                    this.result = 2
                }
            })
        }
    }
}
</script>
<style scoped>
.container {
    padding: 5rem 1rem 0;
    text-align: center;
    background:white;
}
.container img {
    width: 12rem;
    height: 12rem;
}
.container img.success_img {
    width: 3rem;
    height: 3rem;
}
.container .success {
    color: #0087eb;
    font-size: 1.1rem;
    font-weight: bold;
    margin-top: 0.75rem;
}
.container .money {
    color: #212121;
    font-size: 2rem;
    font-weight: bold;
    margin: 1rem 0 1.5rem;
}
.container .money span {
    font-size: 1.25rem;
}
.container .msg {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4rem;
    text-align: left;
}
.container .des {
    font-size: 0.85rem;
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
