<template>
    <div class="container">
        <loading v-show="loadStatus"></loading>
        <template v-if="result=='succss'&&!loadStatus">
            <img src="~assets/img/pay/pic_done_b.png" alt="">
            <p class="success">
                Payment Successful
            </p>
            <p class="money">
                50.00
                <span>Ksh</span>
            </p>
            <p class="msg">
                Thanks for your payment. Your account has been successfully paymented. Please click "OK" if you are not redirected within 5s.
            </p>
        </template>
        <template v-if="result=='fail'&&!loadStatus">
            <img src="~assets/img/pay/img_failed_def_b.png" alt="">
            <p class="fail">
                Payment Failed
            </p>
            <p class="msg">
                Thanks for your payment. But You have insufficent funds.
            </p>
        </template>
        <div class="footer" v-show="!loadStatus">
            <mButton :disabled="false" text="REFRESH" @click="refresh"></mButton>
        </div>
    </div>

</template>
<script>
import mButton from '~/components/button'
import loading from '~/components/loading'
export default {
    data() {
        return {
            result: '',
            loadStatus: true
        }
    },
    layout: 'base',
    components: {
        mButton,
        loading
    },
    mounted() {
        this.refresh()
    },
    methods: {
        refresh() {
            this.loadStatus = true
            let walletAccount = window.localStorage.getItem('wallet_account')
            this.$axios
                .get(
                    `/mobilewallet/v1/accounts/${walletAccount}/sub-account-seqs/latest?seqType=1`,
                    {
                        headers: {
                            token: this.$store.state.token
                        }
                    }
                )
                .then(res => {
                    this.loadStatus = false
                    if (res.data) {
                        _this.balance = res.data.amount
                        localStorage.setItem(
                            'wallet_account',
                            res.data.accountNo
                        )
                        localStorage.setItem('wallet_left', res.data.amount)
                        _this.balance = 1 // TODO remove demo
                    }
                })
        }
    }
}
</script>
<style scoped>
.container {
    font-family: 'Roboto';
    padding: 5rem 1rem 0;
    text-align: center;
}
.container img {
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
    font-size: 1rem;
    line-height: 1.4rem;
    text-align: left;
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