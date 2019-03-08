<template>
    <div style="padding:1rem;">
        <RadioBtn :radio-list="radioList" @pick="changeItem" class="radioBtn" />
        <div style="height:0;border-bottom:solid 1px #E0E0E0;margin:1rem 0;" />
        <RadioBtn :radio-list="radioList2" @pick="changeItem" class="radioBtn" />
        <div class="footer">
            <mButton @click="next()" text="OK" />
        </div>
    </div>
</template>
<script>
import crypto from 'crypto'
import dayjs from 'dayjs'
import mButton from '~/components/button'
import RadioBtn from '~/components/radioBtn'
import env from '~/env.js'
import axios from 'axios'
export default {
    layout: 'base',
    components: {
        RadioBtn,
        mButton
    },
    data() {
        return {
            payToken: '',
            txNo: '',
            radioList: [],
            radioList2: [],
            selected: null
        }
    },
    async asyncData({ store, redirect, query }) {
        if (!process.server) {
            return false
        }
        const res = await axios.post(
            `${env.mechantRequestUrl}payment/platform/v1/oauth/token?grant_type=client_credentials`,
            {},
            {
                auth: {
                    username: query.client_id,
                    password: query.key
                }
            }
        )
        if (res.data.access_token) {
            const paramArr = [
                {
                    key: 'redirectUrl',
                    value: query.redirectUrl || ''
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
                    value: query.appId || '10017'
                },
                {
                    key: 'totalAmount',
                    value: query.amount || 10
                },
                {
                    key: 'signType',
                    value: 'HMAC-MD5'
                },
                {
                    key: 'notifyUrl',
                    value: query.redirectUrl || ''
                },
                {
                    key: 'tradeTimeout',
                    value: '30'
                },
                {
                    key: 'country',
                    value: query.country || 'TZ'
                },
                {
                    key: 'currency',
                    value: query.currency || 'TZS'
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
                    value: 'mstar-' + new Date().getTime()
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
            const hmac = crypto.createHmac('md5', query.key || '123456')
            const up = hmac.update(str)
            const result = up.digest('hex')
            paramObj.sign = result.toUpperCase()
            const res2 = await axios.post(`${env.mechantRequestUrl}payment/platform/v1/create-payment`, paramObj, {
                headers: {
                    Authorization: 'Bearer ' + res.data.access_token
                }
            })
            store.commit('SET_PAYTOKEN', res2.data.payToken)
            store.commit('SET_TXNO', res2.data.txNo)
        } else {
            console.log('获取access_token 失败')
        }
    },
    mounted() {
        this.payToken = this.$store.state.payToken
        this.txNo = this.$store.state.txNo
        const _this = this
        this.$axios.get(`/payment/api/v2/get-pre-payment?payToken=${this.payToken}`).then(res => {
            const data = res.data
            const list = []
            const list2 = []
            if (data && data.payChannels && data.payChannels.length > 0) {
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
                _this.$alert('The merchant has not yet opened a supportable payment channel.')
            }
        })
    },
    methods: {
        changeItem(code) {
            this.selected = code
        },
        next() {
            if (this.selected > 9001 && this.selected < 9029) {
                this.$router.push(`/hybrid/payment/wallet/payto?payToken=${this.payToken}&payChannel=${this.selected}&txNo=${this.txNo}`)
            } else {
                this.$router.push(`/hybrid/payment/channelDesc?payToken=${this.payToken}&payChannel=${this.selected}`)
            }
        }
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
