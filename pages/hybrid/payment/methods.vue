<template>
    <div style="padding:1rem;">
        <RadioBtn :radioList="radioList" class="radioBtn" @pick="changeItem"></RadioBtn>
        <hr />
        <RadioBtn :radioList="radioList2" class="radioBtn" @pick="changeItem"></RadioBtn>
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
            client_id: this.$route.query.client_id,
            app_key: this.$route.query.key,
            country: 'TZ',
            currency: 'TZS',
            payToken: '',
            txNo: '',
            radioList: [],
            radioList2: [],
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
            if (this.selected > 9002 && this.selected < 9029) {
                this.$router.push(
                    `/hybrid/payment/wallet/payto?payToken=${
                        this.payToken
                    }&payChannel=${this.selected}&txNo=${this.txNo}`
                )
            } else {
                this.$router.push(
                    `/hybrid/payment/channelDesc?payToken=${
                        this.payToken
                    }&payChannel=${this.selected}`
                )
            }
        }
    },
    mounted() {
        this.$axios
            .post(
                `/payment/platform/v1/oauth/token?grant_type=client_credentials`,
                {},
                {
                    auth: {
                        username: this.client_id,
                        password: this.app_key
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
                            value: '100017'
                        },
                        {
                            key: 'totalAmount',
                            value: '3000'
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
                            value: this.country
                        },
                        {
                            key: 'currency',
                            value: this.currency
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
                    str += '&key=' + this.app_key
                    let hmac = crypto.createHmac('md5', '123456')
                    let up = hmac.update(str)
                    let result = up.digest('hex')
                    paramObj.sign = result.toUpperCase()
                    this.$axios
                        .post('/payment/platform/v1/create-payment', paramObj, {
                            headers: {
                                Authorization: 'Bearer ' + res.data.access_token
                            }
                        })
                        .then(res2 => {
                            this.payToken = res2.data.payToken
                            this.txNo = res2.data.txNo
                            if (!this.payToken) {
                                this.$alert('payToken error')
                                return
                            }
                            this.$axios
                                .get(
                                    `/payment/api/v2/get-pre-payment?payToken=${
                                        this.payToken
                                    }`
                                )
                                .then(res => {
                                    let data = res.data
                                    let list = []
                                    let list2 = []
                                    if (
                                        data &&
                                        data.payChannels &&
                                        data.payChannels.length > 0
                                    ) {
                                        let payChannels = {}

                                        data.payChannels.forEach(
                                            (item, index) => {
                                                if (
                                                    item.id > 9002 &&
                                                    item.id < 9029
                                                ) {
                                                    list2.push({
                                                        code: item.id,
                                                        value: item.name,
                                                        imgUrl:
                                                            item.logoUrl || '',
                                                        desc: item.description,
                                                        checked: index
                                                            ? false
                                                            : true,
                                                        channelType:
                                                            item.channelType,
                                                        ussd: item.shortUssdCode
                                                    })
                                                } else {
                                                    list.push({
                                                        code: item.id,
                                                        value: item.name,
                                                        imgUrl:
                                                            item.logoUrl || '',
                                                        desc: item.description,
                                                        checked: index
                                                            ? false
                                                            : true,
                                                        channelType:
                                                            item.channelType,
                                                        ussd: item.shortUssdCode
                                                    })
                                                }
                                            }
                                        )
                                        this.radioList = list
                                        this.radioList2 = list2
                                        this.selected = list[0].code
                                    } else {
                                        this.$alert(
                                            'The merchant has not yet opened a supportable payment channel.'
                                        )
                                    }
                                })
                        })
                } else {
                    console.log('获取access_token 失败')
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