<template>
    <div>{{payToken}}</div>
</template>
<script>
import moment from 'moment'
import crypto from 'crypto'
export default {
    layout: 'base',
    data() {
        return {
            payToken: ''
        }
    },
    async asyncData({ app, store, redirect }) {
        let res = await app.$axios.post(
            'http://10.0.63.7:8010/payment/platform/v1/oauth/token?grant_type=client_credentials',
            {},
            {
                auth: {
                    username: 'testapp10',
                    password: '123456'
                }
            }
        )
        if (res.data.access_token) {
            let paramArr = [
                {
                    key: 'redirectUrl',
                    value: 'http://www.baidu.com'
                },
                {
                    key: 'paySubject',
                    value: 'test_pay'
                },
                {
                    key: 'language',
                    value: 'en'
                },
                {
                    key: 'extendInfo',
                    value: ''
                },
                {
                    key: 'nonceStr',
                    value: ''
                },
                {
                    key: 'deviceInfo',
                    value: ''
                },
                {
                    key: 'payNote',
                    value: ''
                },
                {
                    key: 'merchantAppId',
                    value: '2'
                },
                {
                    key: 'totalAmount',
                    value: '1000'
                },
                {
                    key: 'signType',
                    value: 'HMAC-MD5'
                },
                {
                    key: 'notifyUrl',
                    value: 'http://m.startimestv.com'
                },
                {
                    key: 'tradeTimeout',
                    value: '30'
                },
                {
                    key: 'currency',
                    value: 'NGN'
                },
                {
                    key: 'payChannelCodes',
                    value: ''
                },
                {
                    key: 'requestTime',
                    value: moment().format('YYYY-MM-DD hh:mm:ss')
                },
                {
                    key: 'txNo',
                    value: 'mstar-' + new Date().getTime()
                }
            ]

            paramArr.sort((a, b) => {
                return a.key < b.key ? -1 : 1
            })
            let str = ''
            var paramObj = {}
            paramArr.forEach((item, index) => {
                if (item.value != '') {
                    if (index == 0) {
                        str += `${item.key}=${item.value}`
                    } else {
                        str += `&${item.key}=${item.value}`
                    }
                }
                paramObj[item.key] = item.value
            })
            str += '&key=123456'
            let hmac = crypto.createHmac('md5', '123456')
            let up = hmac.update(str)
            let result = up.digest('hex')
            paramObj.sign = result.toUpperCase()
            let res2 = await app.$axios.post(
                'http://10.0.63.7:8010/payment//platform/v1/create-payment',
                paramObj,
                {
                    headers: {
                        Authorization: 'Bearer ' + res.data.access_token
                    }
                }
            )
            return { payToken: res2.data.payToken }
        } else {
            console.log('获取access_token 失败')
        }
    },
    mounted() {
        this.$axios
            .get(`/payment/api/v2/get-pre-payment?payToken=${this.payToken}`)
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
                            payChannels[this.payChannel].form_config_exist
                        this.appInterfaceMode =
                            payChannels[this.payChannel].appInterfaceMode
                        this.payType = payChannels[this.payChannel].payType
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
    }
}
</script>