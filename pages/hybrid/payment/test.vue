<template>
    <div>
        <div>{{payToken}}</div>
        <RadioBtn :radioList="radioList" class="radioBtn" @pick="changeItem"></RadioBtn>
        <div class="footer">
            <mButton text="OK" @click="next()"></mButton>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import crypto from 'crypto'
import mButton from '~/components/button'
import RadioBtn from '~/components/radioBtn'
import env from '~/env.js'
export default {
    layout: 'base',
    data() {
        return {
            payToken: '',
            radioList: [],
            selected: null
        }
    },
    components: {
        RadioBtn,
        mButton
    },
    methods: {
        changeItem(code) {
            this.selected = code
        },
        next() {
            this.$router.replace(
                `/hybrid/payment/channelDesc?payToken=${
                    this.payToken
                }&payChannel=${this.selected}`
            )
        }
    },
    async asyncData({ app, store, redirect }) {
        let res = await app.$axios.post(
            `${
                env.mechant_request_url
            }payment/platform/v1/oauth/token?grant_type=client_credentials`,
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
                    value: '100017'
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
                    key: 'country',
                    value: 'TZ'
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
                `${env.mechant_request_url}payment/platform/v1/create-payment`, // TODO
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
                let list = []
                if (data && data.payChannels && data.payChannels.length > 0) {
                    let payChannels = {}

                    data.payChannels.forEach((item, index) => {
                        list.push({
                            code: item.id,
                            value: item.name,
                            imgUrl: item.logoUrl || '',
                            desc: item.description,
                            checked: index ? false : true,
                            channelType: item.channelType,
                            ussd: item.shortUssdCode
                        })
                    })
                    this.radioList = list
                    this.selected = list[0].code
                } else {
                    this.$alert(
                        'The merchant has not yet opened a supportable payment channel.'
                    )
                }
            })
    }
}
</script>
<style lang="less">
.footer {
    position: fixed;
    bottom: 3rem;
    width: 16rem;
    margin: 0 auto;
    left: 0;
    right: 0;
    text-align: center;
    a {
        color: #0087eb;
        text-decoration: underline;
        font-size: 0.8rem;
        font-weight: bold;
    }
}
</style>