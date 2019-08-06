import qs from 'qs'
import axios from 'axios'
import env from '../../env'
import dayjs from 'dayjs'
import crypto from 'crypto'

export default function(req, res, next) {
    let data = ''
    req.on('data', function(d) {
        data += d
    })
    req.on('end', function() {
        const formType = req.headers['content-type'] && req.headers['content-type'].indexOf('json') >= 0
        const getBodyData = getPostData(data, formType)

        const clientId = getBodyData.client_id || 'testapp10'
        const apiKey = getBodyData.apiKey || '123456'
        const appid = getBodyData.appid || '10017'
        const redirectUrl = getBodyData.redirectUrl || ''
        const paySubject = getBodyData.paySubject || 'test_pay'
        const payNote = getBodyData.payNote || '123456'
        const totalAmount = getBodyData.totalAmount || 10
        const notifyUrl = getBodyData.notifyUrl || ''
        const country = getBodyData.country || 'TZ'
        const currency = getBodyData.currency || 'TZS'
        const txNo = getBodyData.txNo || 'mstar-' + new Date().getTime()

        axios({
            url: `${env.mechantRequestUrl}payment/platform/v1/oauth/token?grant_type=client_credentials`,
            method: 'post',
            auth: {
                username: clientId,
                password: apiKey
            }
        })
            .then(res1 => {
                const paramArr = [
                    {
                        key: 'redirectUrl',
                        value: redirectUrl
                    },
                    {
                        key: 'paySubject',
                        value: paySubject
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
                        value: payNote
                    },
                    {
                        key: 'merchantAppId',
                        value: appid
                    },
                    {
                        key: 'totalAmount',
                        value: totalAmount
                    },
                    {
                        key: 'signType',
                        value: 'HMAC-MD5'
                    },
                    {
                        key: 'notifyUrl',
                        value: notifyUrl
                    },
                    {
                        key: 'tradeTimeout',
                        value: '30'
                    },
                    {
                        key: 'country',
                        value: country
                    },
                    {
                        key: 'currency',
                        value: currency
                    },
                    {
                        key: 'payChannelCodes',
                        value: ''
                    },
                    {
                        key: 'requestTime',
                        value: dayjs().format('YYYY-MM-DD hh:mm:ss')
                    },
                    {
                        key: 'txNo',
                        value: txNo
                    }
                ]

                paramArr.sort((a, b) => {
                    return a.key < b.key ? -1 : 1
                })
                let str = ''
                const paramObj = {}
                paramArr.forEach((item, index) => {
                    if (item.value !== '') {
                        if (index === 0) {
                            str += `${item.key}=${item.value}`
                        } else {
                            str += `&${item.key}=${item.value}`
                        }
                    }
                    paramObj[item.key] = item.value
                })
                const hmac = crypto.createHmac('md5', apiKey)
                const up = hmac.update(str)
                const result = up.digest('hex')
                paramObj.sign = result.toUpperCase()
                axios({
                    url: `${env.mechantRequestUrl}payment/platform/v1/create-payment`,
                    method: 'post',
                    data: paramObj,
                    headers: {
                        Authorization: 'Bearer ' + res1.data.access_token
                    }
                })
                    .then(res2 => {
                        // res2.data.txNo
                        res.end(JSON.stringify(res2.data))
                    })
                    .catch(() => {
                        res.end(
                            JSON.stringify({
                                resultCode: '121',
                                resultMessage: 'req is invalid'
                            })
                        )
                    })
            })
            .catch(err => {
                res.end(
                    JSON.stringify({
                        resultCode: '121',
                        resultMessage: err
                    })
                )
            })
    })
}

function getPostData(data, isjson) {
    if (isjson) {
        return JSON.parse(data)
    } else {
        return qs.parse(data)
    }
}
