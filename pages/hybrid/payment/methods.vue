<template>
    <div style="padding:1rem;">
        <RadioBtn :radioList="radioList" class="radioBtn" @pick="changeItem"></RadioBtn>
        <div style="height:0;border-bottom:solid 1px #E0E0E0;margin:1rem 0;"></div>
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
import axios from 'axios'
export default {
    layout: 'base',
    data() {
        return {
            client_id: this.$route.query.client_id,
            app_key: this.$route.query.key,
            country: this.$route.query.country || 'TZ',
            currency: this.$route.query.currency || 'TZS',
            amount: this.$route.query.amount || '10',
            merchantId: this.$route.query.merchantId || '10017',
            payToken: '',
            txNo: '',
            redirect: this.$route.query.redirectUrl || '',
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
            if (this.selected > 9001 && this.selected < 9029) {
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
    async asyncData({ app, store, redirect }) {
        if (!app.context.isServer) {
            return false
        }
        let res = await axios.post(
            `${
                env.mechant_request_url
            }payment/platform/v1/oauth/token?grant_type=client_credentials`,
            {},
            {
                auth: {
                    username: app.context.route.query.client_id,
                    password: app.context.route.query.key
                }
            }
        )
        if (res.data.access_token) {
            let paramArr = [
                {
                    key: 'redirectUrl',
                    value:
                        app.context.route.query.redirectUrl ||
                        'https://m.startimestv.com'
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
                    value: app.context.route.query.merchantId || '10017'
                },
                {
                    key: 'totalAmount',
                    value: app.context.route.query.amount || 10
                },
                {
                    key: 'signType',
                    value: 'HMAC-MD5'
                },
                {
                    key: 'notifyUrl',
                    value:
                        app.context.route.query.redirectUrl ||
                        'https://m.startimestv.com'
                },
                {
                    key: 'tradeTimeout',
                    value: '30'
                },
                {
                    key: 'country',
                    value: app.context.route.query.country || 'TZ'
                },
                {
                    key: 'currency',
                    value: app.context.route.query.currency || 'TZS'
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
            let hmac = crypto.createHmac('md5', '123456')
            let up = hmac.update(str)
            let result = up.digest('hex')
            paramObj.sign = result.toUpperCase()
            let res2 = await axios.post(
                `${env.mechant_request_url}payment/platform/v1/create-payment`,
                paramObj,
                {
                    headers: {
                        Authorization: 'Bearer ' + res.data.access_token
                    }
                }
            )
            store.commit('SET_PAYTOKEN', res2.data.payToken)
            store.commit('SET_TXNO', res2.data.txNo)
        } else {
            console.log('获取access_token 失败')
        }
    },
    mounted() {
        this.payToken = this.$store.state.payToken
        this.txNo = this.$store.state.txNo
        let _this = this
        this.$axios
            .get(`/payment/api/v2/get-pre-payment?payToken=${this.payToken}`)
            .then(res => {
                let data = res.data
                let list = []
                let list2 = []
                if (data && data.payChannels && data.payChannels.length > 0) {
                    let payChannels = {}

                    data.payChannels.forEach((item, index) => {
                        if (item.id > 9001 && item.id < 9029) {
                            list2.push({
                                code: item.id,
                                value: item.name,
                                imgUrl: item.logoUrl || '',
                                desc: item.description,
                                checked: false,
                                channelType: item.channelType,
                                ussd: item.shortUssdCode
                            })
                        } else {
                            list.push({
                                code: item.id,
                                value: item.name,
                                imgUrl: item.logoUrl || '',
                                desc: item.description,
                                checked: false,
                                channelType: item.channelType,
                                ussd: item.shortUssdCode
                            })
                        }
                    })
                    list[0].checked = true
                    _this.radioList = list
                    _this.radioList2 = list2
                    _this.selected = list[0].code
                } else {
                    _this.$alert(
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
    width: 75%;
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