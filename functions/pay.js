import qs from 'qs'
import { parseUA, toNativePage } from '~/functions/utils.js'

/* 
    ins vue 组件实例
    order 订单参数 object
    callback 回调
*/
export const createDVBOrder = (ins, order, callback) => {
    if (!order) return false
    const fcmToken = (window.getChannelId && window.getChannelId.getFCMToken && window.getChannelId.getFCMToken()) || ''
    const user = ins.$store.state.user
    const isLogin = user.roleName && user.roleName.toUpperCase() !== 'ANONYMOUS'
    ins.$axios({
        url: `/wxorder/v1/geneOrder4OnlinePay`,
        method: 'post',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            token: ins.$store.state.token
        },
        data: qs.stringify(
            Object.assign({}, order, {
                orderSource: 2,
                fcmToken: fcmToken || '',
                promotion: !isLogin ? 'l1' : 'lalala'
            })
        )
    }).then(res => {
        callback && callback(res.data)
    })
}

/* 
    ins vue 组件实例
    walletNo 钱包账号
*/
export const checkPass = (ins, walletNo, callback) => {
    if (!walletNo) return false
    ins.$axios
        .get(`/mobilewallet/v1/accounts/${walletNo}/prop-details`)
        .then(res => {
            if (res.data) {
                if (res.data.payPassword === 'true') {
                    callback && callback()
                } else {
                    ins.$alert('For your security,please set up your password for eWallet and register your phone number.', () => {
                        ins.isLoading = false
                        toNativePage('com.star.mobile.video.wallet.WalletPwdSettingActivity?EXTRA_KEY_SMS_CODE=StarT1mes$PaY')
                    })
                }
            } else {
                ins.isLoading = false
                ins.$alert('ewallet config error')
            }
        })
        .catch(() => {
            ins.isLoading = false
            ins.$alert(ins.$store.state.lang.error_network, () => {}, 'Retry')
        })
}

/* 
    ins vue 组件实例
    payToken 支付token
    channel 渠道号
    extend 扩展字段，动态表单
*/
export const invoke = (ins, payToken, channel, callback, extend) => {
    if (!payToken || !channel) return false

    const dstr = parseUA(ins.$store.state.appType, ins.$store.state.appVersionCode)

    ins.$axios({
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
            ins.isLoading = false
            if (res.data.resultCode === 0) {
                callback && callback(res.data)
            } else {
                ins.$alert(res.data.resultMessage)
            }
        })
        .catch(err => {
            console.log(err)
            ins.isLoading = false
            ins.$alert(ins.$store.state.lang.error_network, () => {}, 'Retry')
        })
}

/* 
    ins vue 组件实例
    data invoke 返回值
    payType 支付方式
    apiType 对接方式
*/
export const commonPayAfter = (ins, data, payType, apiType, product) => {
    if (payType === 1) {
        // 钱包支付
        sessionStorage.setItem('payObj', JSON.stringify(data))
        ins.$router.push(`/hybrid/payment/wallet/paybyPass`)
    } else if (payType === 3 || payType === 4) {
        // 第三方在线支付 订阅
        if (apiType === 2) {
            window.location.href = data.tppRedirectUrl
        } else if (apiType === 3) {
            window.location.href = '/DVB/proccess.php?seqNo=' + data.paySeqNo
        } else {
            ins.$alert('The payment method is not supported for the time being')
        }
    } else {
        ins.$alert('The payment method is not supported for the time being')
    }
}

export const chargeWallet = ins => {
    ins.$alert(ins.$store.state.lang.refresh_wallet, () => {
        // TODO refresh this.getWalletAccount()
    })
    toNativePage('com.star.mobile.video.wallet.WalletRechargeActivity')
}
