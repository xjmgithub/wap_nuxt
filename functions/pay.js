import qs from 'qs'
import { parseUA, toNativePage } from '~/functions/utils.js'

// 生成订单
export const createDVBOrder = function(order, callback) {
    if (!order) return false

    const fcmToken = (window.getChannelId && window.getChannelId.getFCMToken && window.getChannelId.getFCMToken()) || ''
    const user = this.$store.state.user
    const isLogin = user.roleName && user.roleName.toUpperCase() !== 'ANONYMOUS'
    this.$axios({
        url: `/wxorder/v1/geneOrder4OnlinePay`,
        method: 'post',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            token: this.$store.state.token
        },
        data: qs.stringify(
            Object.assign({}, order, {
                orderSource: 2,
                fcmToken: fcmToken || '',
                promotion: !isLogin ? 'a' : 'l'
            })
        )
    })
        .then(res => {
            callback && callback(res.data)
        })
        .catch(() => {
            this.$nuxt.$loading.finish()
            this.$alert(this.$store.state.lang.error_network)
        })
}

export const checkPass = function(walletNo, callback) {
    if (!walletNo) return false
    this.$axios
        .get(`/mobilewallet/v1/accounts/${walletNo}/prop-details`)
        .then(res => {
            if (res.data) {
                let result = false
                if (res.data.payPassword === 'true') {
                    result = true
                } else {
                    result = false
                }
                callback && callback(result)
            } else {
                this.$nuxt.$loading.finish()
                this.$alert('ewallet config error')
            }
        })
        .catch(() => {
            this.$nuxt.$loading.finish()
            this.$alert(this.$store.state.lang.error_network)
        })
}

export const verifyWalletPass = function(accountNo, password, callback) {
    this.$axios.get(`/mobilewallet/v1/accounts/${accountNo}/pay-password?password=${password}`).then(res => {
        if (res.data.code === 0) {
            callback && callback(res.data)
        } else {
            this.$nuxt.$loading.finish()
            this.$alert('Incorrect payment password.')
        }
    })
}

/* 
    ins vue 组件实例
    payToken 支付token
    channel 渠道号
    extend 扩展字段，动态表单
*/
export const invoke = function(payToken, channel, callback, extend) {
    if (!payToken || !channel) return false

    const dstr = parseUA(this.$store.state.appType, this.$store.state.appVersionCode)

    this.$axios({
        url: `/payment/api/v2/invoke-payment`,
        method: 'post',
        data: {
            payToken: payToken,
            payChannelId: channel,
            tradeType: 'JSAPI',
            signType: 'MD5',
            deviceInfo: dstr,
            extendInfo: extend || {}
        }
    })
        .then(res => {
            if (res.data.resultCode === '0') {
                callback && callback(res.data)
            } else {
                this.$nuxt.$loading.finish()
                this.$alert(res.data.resultMessage)
            }
        })
        .catch(() => {
            this.$nuxt.$loading.finish()
            this.$alert(this.$store.state.lang.error_network)
        })
}

/* 
    data invoke 返回值
    payType 支付方式
    apiType 对接方式
*/
export const commonPayAfter = function(data, payType, apiType) {
    if (payType == 3) {
        if (apiType == 2) {
            // redirect
            window.location.href = data.tppRedirectUrl // 最终也会回调到payResult
        } else if (apiType == 3) {
            // wait
            this.$router.replace('/hybrid/payment/payResult?seqNo=' + data.paySeqNo)
        } else {
            this.$alert('The payment method is not supported for the time being')
        }
    } else {
        this.$alert('The payment method is not supported for the time being')
    }
}

export const chargeWallet = function(ins, back) {
    ins.$alert(ins.$store.state.lang.refresh_wallet, () => {
        back && back()
    })
    toNativePage('com.star.mobile.video.wallet.WalletRechargeActivity')
}

export const payWithBalance = function(walletAccountNo, data, password, callback) {
    this.$axios
        .post('/mobilewallet/v1/balance-payments', {
            amount: data.totalAmount,
            currency: data.currency,
            orderId: data.txNo,
            payeeAccountNo: data.extendInfo.payeeAccountNo,
            payerAccountNo: walletAccountNo,
            payerPayPassword: password,
            subject: data.paySubject,
            signature: data.extendInfo.signature,
            extensionInfo: {
                paySeqNo: data.extendInfo.paySeqNo
            }
        })
        .then(res => {
            if (res.data.resultCode === 0) {
                callback && callback(res)
            } else {
                this.$nuxt.$loading.finish()
                this.$alert(res.data.resultMessage)
            }
        })
        .catch(err => {
            this.$nuxt.$loading.finish()
            this.$alert(err)
        })
}
