import qs from 'qs'
import {
    parseUA
} from '~/functions/utils.js'
import {
    toNativePage
} from '~/functions/app'

// 生成订单
export const createDVBOrder = function (order, callback) {
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

export const checkPass = function (walletNo, callback) {
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

export const verifyWalletPass = function (accountNo, password, callback) {
    this.$axios.get(`/mobilewallet/v1/accounts/${accountNo}/pay-password?password=${password}`).then(res => {
        if (res.data.code === 0) {
            callback && callback(res.data)
        } else {
            this.$nuxt.$loading.finish()
            this.$alert(this.$store.state.lang.incorrect_pay_password)
        }
    })
}

/* 
    ins vue 组件实例
    payToken 支付token
    channel 渠道号
    extend 扩展字段，动态表单
*/
export const invoke = function (payToken, channel, callback, failback, extend) {
    if (!payToken || !channel) return false

    const dstr = parseUA(this.$store.state.appType, this.$store.state.appVersionCode)

    this.$axios({
            url: `/payment/api/v4/invoke-payment`,
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
            this.$nuxt.$loading.finish()
            if (res.data.resultCode === '0') {
                if (res.data.extendInfo.instructions) {
                    sessionStorage.setItem('instructions', res.data.extendInfo.instructions)
                }
                callback && callback(res.data)
            } else if (res.data.resultCode === '1') {
                failback && failback(res.data.paySeqNo)
            } else {
                this.$toastLoading()
                this.$alert(res.data.resultMessage)
            }
        })
        .catch(() => {
            this.$nuxt.$loading.finish()
            this.$toastLoading()
            this.$alert(this.$store.state.lang.error_network)
        })
}

export const getInvokeResult = function (seqNo, callback) {
    if (!seqNo) return false
    this.$axios({
            url: `/payment/api/v4/get-payment-init-result?seqNo=${seqNo}`,
            method: 'get',
            timeout: 30000 
        })
        .then(res => {
            if (res.data.state >= 1 && res.data.state <= 4) {
                callback && callback(res.data)
            } else {
                this.$alert(res.data.summary)
            }
        })
        .catch(() => {
            this.$toastLoading()
            this.$alert(this.$store.state.lang.error_network)
        })
}
/* 
    data invoke 返回值
    payType 支付方式
    apiType 对接方式
*/
export const commonPayAfter = function (data, payType, apiType) {
    if (payType == 3) {
        if (apiType == 2) {
            // redirect
            window.location.href = data.redirectUrl // 最终也会回调到payResult
        } else if (apiType == 3) {
            // wait
            window.location.href = '/hybrid/payment/payResult?seqNo=' + data.paySeqNo
        } else {
            this.$alert(this.$store.state.lang.payment_method_not_supported)
        }
    } else {
        this.$alert(this.$store.state.lang.payment_method_not_supported)
    }
}

export const chargeWallet = function (back) {
    this.$alert(this.$store.state.lang.refresh_wallet, () => {
        back && back()
    })
    const appType = this.$store.state.appType
    if (appType == 1) {
        toNativePage('com.star.mobile.video.wallet.WalletRechargeActivity')
    } else if (appType == 2) {
        window.location.href = 'startimes://walletRecharge?isBackToSource=false'
    }
}

export const payWithBalance = function (walletAccountNo, data, password, callback) {
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

export const updateWalletAccount = function (callback) {
    this.$axios &&
        this.$axios.get('/mobilewallet/v1/accounts/me').then(res => {
            if (res.data) {
                localStorage.setItem('wallet_account', JSON.stringify(res.data))
            }
            if (callback) callback(res.data)
        })
}

export const updateWalletConf = function (account, callback) {
    this.$axios &&
        this.$axios.get(`/mobilewallet/v1/accounts/${account}/prop-details`).then(res => {
            localStorage.setItem('wallet_config', JSON.stringify(res.data))
            if (callback) callback(res.data)
        })
}
