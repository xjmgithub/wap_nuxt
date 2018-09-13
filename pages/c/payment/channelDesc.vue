<template>
    <div class="container">
        <p>
            {{desc}}
        </p>
        <div class="footer">
            <mButton :disabled="false" :text="'OK'" @click="nextStep"></mButton>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
export default {
    data() {
        return {
            payToken: this.$route.query.payToken,
            payChannel: this.$route.query.payChannel || 9002,
            desc: '',
            form_exit: false,
            appInterfaceMode: null,
            payType: null
        }
    },
    layout: 'base',
    mounted() {
        this.$axios.setHeader('token', this.$store.state.token)
        this.$axios
            .get('/payment/api/v2/get-pre-payment', {
                payToken: this.payToken
            })
            .then(res => {
                if (res.data) {
                    let payChannels = {}
                    if (res.data.payChannels.length > 0) {
                        res.data.payChannels.forEach((item, index) => {
                            payChannels[item.id] = item
                        })
                    }
                    this.desc = payChannels[this.payChannel].description
                    this.form_exit =
                        payChannels[this.payChannel].form_config_exist
                    this.appInterfaceMode =
                        payChannels[this.payChannel].appInterfaceMode
                    this.payType = payChannels[this.payChannel].payType
                    if (!this.desc) {
                        this.nextStep()
                    }
                }
            })
    },
    methods: {
        nextStep() {
            if (this.form_exit) {
                this.$router.push(
                    `/c/payment/form?paychannelId=${
                        this.payChannel
                    }&appInterfaceMode=${this.appInterfaceMode}`
                )
            } else {
                if (
                    _this.paymethod.payType != 1 &&
                    !$.inArray(_this.paymethod.appInterfaceMode, [2, 3])
                ) {
                    return false
                }

                this.$axios.setHeader('token', this.$store.state.token)
                this.$axios
                    .post('/payment/api/v2/invoke-payment', {
                        payToken: this.payToken,
                        payChannelId: this.payChannel,
                        tradeType: 'JSAPI',
                        signType: 'MD5',
                        extendInfo: {}
                    })
                    .then(res => {
                        if (res.data && res.data.resultCode == 0) {
                            if (_this.paymethod.appInterfaceMode == 2) {
                                window.location.href = data.data.redirectUrl
                            } else if (_this.paymethod.appInterfaceMode == 3) {
                                // TODO 查询支付结果
                                // window.location.href = 'payment_process.php?orderId=' + _this.orderId  // 等待支付结果
                            } else {
                                // SDK 和 其他 不支持,
                                // payType 1 钱包支付
                                _this.$alert(
                                    'The payment method is not supported for the time being'
                                )
                            }
                        } else {
                            // TODO PAY FAIL
                        }
                    })
            }
        }
    },
    components: {
        mButton
    }
}
</script>
<style lang="less" scoped>
.container {
    padding: 5rem 1rem 0;
    font-size: 0.9rem;
}
.container p {
    color: #666;
    line-height: 1.5rem;
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