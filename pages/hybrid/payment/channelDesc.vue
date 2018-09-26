<template>
    <div class="container">
        <p>
            {{desc}}
        </p>
        <div class="footer">
            <mButton :disabled="false" text="PAY NOW" @click="nextStep"></mButton>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
export default {
    layout: 'base',
    data() {
        return {
            payToken: this.$route.query.payToken,
            payChannel: this.$route.query.payChannel || 9002,
            desc: '',
            form_exit: false,
            appInterfaceMode: null,
            payType: null,
            redirectUrl: '',
            merchantRedirectUrl: ''
        }
    },
    mounted() {
        if (!this.payToken) {
            this.$alert('Query payToken needed! please check request')
            return false
        }

        if (!this.payChannel) {
            this.$alert('Query payChannel needed! please check request')
            return false
        }

        this.$axios
            .get(`payment/api/v2/get-pre-payment?payToken=${this.payToken}`, {
                headers: {
                    token: this.$store.state.token
                }
            })
            .then(res => {
                let data = res.data
                if (data && data.payChannels && data.payChannels.length > 0) {
                    let payChannels = {}
                    data.payChannels.forEach((item, index) => {
                        payChannels[item.id] = item
                    })
                    if (payChannels[this.payChannel]) {
                        this.desc = payChannels[this.payChannel].description
                        this.form_exit =
                            payChannels[this.payChannel].formConfigExist
                        this.appInterfaceMode =
                            payChannels[this.payChannel].appInterfaceMode
                        this.payType = payChannels[this.payChannel].payType

                        // 请求支付
                        this.invokePay()
                    } else {
                        this.$alert(
                            'payToken and payChannel Mismatch! please check request'
                        )
                    }
                } else {
                    this.$alert(
                        'The merchant has not yet opened a supportable payment channel.'
                    )
                }
            })
    },
    methods: {
        invokePay() {
            if (!this.form_exit) {
                if (
                    this.payType != 3 &&
                    [2, 3].indexOf(this.appInterfaceMode) < 0
                ) {
                    /* payType 取值
                    1、钱包余额
                    2、现金
                    3、第三方在线支付
                    4、订阅
                    99、其他 */

                    /* appInterfaceMode
                    1、SDK
                    2、Web，访问Web页面
                    3、Wait，等待支付结果
                    */
                    this.$alert(
                        'The payment method you selected is temporarily not supported by this platform. Please contact appservice@startimes.com.cn'
                    )
                    return false
                }

                this.$axios
                    .post(
                        '/payment/api/v2/invoke-payment',
                        {
                            payToken: this.payToken,
                            payChannelId: this.payChannel,
                            tradeType: 'JSAPI',
                            deviceInfo: window.navigator.userAgent,
                            extendInfo: {} // 没有动态表单收集信息的传空对象
                        },
                        {
                            headers: {
                                token: this.$store.state.token
                            }
                        }
                    )
                    .then(res => {
                        let data = res.data
                        if (data && data.resultCode == 0) {
                            if (this.appInterfaceMode == 2) {
                                this.redirectUrl = data.tppRedirectUrl
                            }
                            this.merchantRedirectUrl =
                                data.merchantPayRedirectUrl
                        }
                    })
            }
        },
        nextStep() {
            if (this.form_exit) {
                this.$router.push(
                    `/hybrid/payment/form?payToken=${
                        this.payToken
                    }&payChannelId=${this.payChannel}&appInterfaceMode=${
                        this.appInterfaceMode
                    }`
                )
            } else {
                if (this.appInterfaceMode == 2) {
                    window.open(this.redirectUrl)
                    // this.$confirm(
                    //     'If payment has been completed,please click done.If you encounter problems,please try again or contact appservice@startimes.com.cn',
                    //     () => {
                    //         // 跳转商户页
                    //     },
                    //     'Completed',
                    //     'Try again'
                    // )
                }
                this.$router.push(
                    `/hybrid/payment/payResult?payToken=${
                        this.payToken
                    }&redirect=${this.merchantRedirectUrl}`
                )
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