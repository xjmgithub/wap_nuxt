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
        app.$axios
            .post(
                'http://10.0.63.7:8010/payment/platform/v1/oauth/token?grant_type=client_credentials',
                {},
                {
                    auth: {
                        username: 'testapp10',
                        password: '123456'
                    }
                }
            )
            .then(res => {
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
                    app.$axios
                        .post(
                            'http://10.0.63.7:8010/payment//platform/v1/create-payment',
                            paramObj,
                            {
                                headers: {
                                    Authorization:
                                        'Bearer ' + res.data.access_token
                                }
                            }
                        )
                        .then(res => {
                            console.log(res.data)
                            app.payToken = res.data.payToken
                        })
                } else {
                    window.alert('获取access_token 失败')
                }
            })
    }
}
</script>