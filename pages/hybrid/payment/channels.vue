<template>
    <div class="container">
        <div class="goods">
            <p v-show="totalAmount" class="pay-money">
                <span>{{currencySymbol}}</span>
                {{totalAmount }}
            </p>
            <p class="pay-subject">{{$store.state.lang.product_name}}: {{paySubject}}</p>
        </div>
        <div v-if="payChannels&&payChannels.length>0" class="contain">
            <div class="pay-channels">
                <div v-for="(item,i) in payChannels" :key="i">
                    <label class="radio">
                        <img v-if="item.logoUrl" :src="cdnPic(item.logoUrl)" onerror="this.src='http://cdn.startimestv.com/banner/pay_ment_default.png'" />
                        <img v-else src="~/assets/img/pay/pay_ment_default.png" />
                        <span v-if="item.payType==1&&eCurrencySymbol&&eAmount>=0">{{$store.state.lang.eWallet}}: {{eCurrencySymbol}}{{eAmount| formatAmount}}</span>
                        <span v-else-if="item.payType==1">{{$store.state.lang.eWallet}}</span>
                        <span v-else>{{item.name}}</span>
                        <input v-if="!item.payChannelCardAuthDtoList" :checked="item.lastSuccessPay|| i===0" :value="item.payType" :data-id="item.id" type="radio" name="pay-options" @click="initChannel(item)" />
                        <i v-show="!item.payChannelCardAuthDtoList" />
                    </label>
                    <div class="sub-channels">
                        <div v-for="(card,si) in item.payChannelCardAuthDtoList" v-show="item.payChannelCardAuthDtoList && item.payChannelCardAuthDtoList.length > 0" :key="si">
                            <label class="radio">
                                <div :class="card.brand" class="img-box" />
                                <span>{{card.cardType}}({{card.last4}})</span>
                                <input :checked="item.lastSuccessPay &&si===0" :value="item.payType" :data-id="item.id" type="radio" name="pay-options" @click="initSubChannel(item,card)" />
                                <i />
                            </label>
                        </div>
                        <label v-show="item.payChannelCardAuthDtoList" class="radio">
                            <img src="~/assets/img/dvb/ic_ewallet_add.png" />
                            <span>{{$store.state.lang.add_card_topay}}</span>
                            <input :checked="item.lastSuccessPay && item.payChannelCardAuthDtoList&&item.payChannelCardAuthDtoList.length<=0" :value="item.payType" :data-id="item.id" type="radio" name="pay-options" @click="initChannel(item)" />
                            <i />
                        </label>
                    </div>
                </div>
            </div>
            <div v-show="payDesc" class="desc">
                <p>{{$store.state.lang.note}}:</p>
                <p v-html="payDesc" />
            </div>
        </div>
        <div v-else class="contain">
            {{$store.state.lang.starpay_payment_no_paychannel}}
        </div>
        <div class="footer">
            <div class="error-msg" v-html="errorMsg" />
            <mButton :disabled="Boolean(errorMsg)" :text="$store.state.lang.pay_now" @click="nextStep" />
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import { formatAmount, cdnPicSrc } from '~/functions/utils'
import { updateWalletAccount, updateWalletConf, invoke, commonPayAfter } from '~/functions/pay'
import countrys from '~/functions/countrys.json'
export default {
    layout: 'base',
    components: {
        mButton
    },
    filters: {
        formatAmount(num) {
            return formatAmount(num)
        }
    },
    data() {
        const user = this.$store.state.user
        const obj = {}
        countrys.forEach(item => {
            obj[item.country] = item
        })
        return {
            isLogin: user.roleName && user.roleName.toUpperCase() !== 'ANONYMOUS',
            payToken: this.$route.query.payToken || '',
            channel: {
                payChannel: -1,
                appInterfaceMode: null,
                payType: -1,
                formConfigExist: false,
                currencySymbol: '',
                payChannelName: ''
            },
            merchantAppId: '',
            currencySymbol: '', // 商品货币符号
            totalAmount: '',
            paySubject: '',
            payChannels: [],
            eAmount: '', // 电子钱包余额
            eCurrencySymbol: '', // 电子钱包货币符号
            countrys: obj,
            authorizationCode: ''
        }
    },
    computed: {
        payDesc() {
            let tmp = ''
            this.payChannels.forEach(ele => {
                if (ele.id == this.channel.payChannel) {
                    tmp = ele.description
                }
            })
            return tmp
        },
        errorMsg() {
            let tmp = ''
            if (!this.isLogin && this.channel.payType === 1) return tmp
            else if (this.currencySymbol != this.oCurrencySymbol) tmp = this.$store.state.lang.starpay_payment_currency_error
            else if (this.eAmount < this.totalAmount && this.channel.payType === 1) tmp = this.$store.state.lang.starpay_payment_amount_error
            return tmp
        },
        oCurrencySymbol() {
            // 渠道货币符号 用于比较判断
            if (this.channel.payType == 1) {
                return this.eCurrencySymbol
            } else {
                return this.channel.currencySymbol
            }
        }
    },
    async asyncData({ app: { $axios }, store, req }) {
        $axios.setHeader('token', store.state.token)
        try {
            const res = await $axios.get('/cms/users/me')
            if (res.status !== 200) {
                store.commit(
                    'SET_TOKEN',
                    'eyJhbGciOiJIUzUxMiJ9.eyJhcHAiOjIsInVpZCI6OTk5OSwiY2NvZGUiOiJORyIsInJvbGUiOjAsImNyZWF0ZWQiOjE1Njc2NzAyNTY0MTgsImdwcyI6MCwiZXhwIjoxODgzMDMwMjU2LCJjaWQiOjJ9.mgMzKuLEKt1ZtS1d4f2s9mX6mDj0vOsu2xwzf09vj250XLtPhrn7RtFwj9BLkdgwvvQDfLHcRMCxt5TgzbzsYQ'
                )
            }
        } catch (e) {
            store.commit(
                'SET_TOKEN',
                'eyJhbGciOiJIUzUxMiJ9.eyJhcHAiOjIsInVpZCI6OTk5OSwiY2NvZGUiOiJORyIsInJvbGUiOjAsImNyZWF0ZWQiOjE1Njc2NzAyNTY0MTgsImdwcyI6MCwiZXhwIjoxODgzMDMwMjU2LCJjaWQiOjJ9.mgMzKuLEKt1ZtS1d4f2s9mX6mDj0vOsu2xwzf09vj250XLtPhrn7RtFwj9BLkdgwvvQDfLHcRMCxt5TgzbzsYQ'
            )
        }
    },
    mounted() {
        const sessionToken = sessionStorage.getItem('payToken')
        if (!this.payToken) {
            if (sessionToken) {
                this.payToken = sessionToken
            } else {
                this.$alert(this.$store.state.lang.query_paytoken_needed)
                return false
            }
        }
        sessionStorage.setItem('payToken', this.payToken)
        this.getPayMethods()
        if (this.isLogin) this.getMyEwallet()
    },
    methods: {
        getPayMethods() {
            this.$axios.get(`/payment/api/v2/get-pre-payment?payToken=${this.payToken}`).then(res => {
                const data = res.data
                if (data && data.payChannels && data.payChannels.length > 0) {
                    this.payChannels = this.bubbleSort(data.payChannels)
                    this.currencySymbol = data.currencySymbol
                    this.totalAmount = data.totalAmountFormat
                    this.paySubject = data.paySubject
                    this.merchantAppId = data.merchantAppId
                    const payChannels = {}
                    let lastpay = ''
                    let authCode = ''
                    this.payChannels.forEach(item => {
                        payChannels[item.id] = item
                        if (item.lastSuccessPay) {
                            lastpay = item.id
                            authCode =
                                item.payChannelCardAuthDtoList && item.payChannelCardAuthDtoList.length > 0
                                    ? item.payChannelCardAuthDtoList[0].authorizationCode
                                    : ''
                        }
                    })
                    lastpay && this.initChannel(payChannels[lastpay])
                    !lastpay && this.initChannel(this.payChannels[0])
                    this.authorizationCode = authCode
                    const msg = {
                        symbol: this.currencySymbol,
                        amount: this.totalAmount
                    }
                    sessionStorage.setItem('goodMsg', JSON.stringify(msg))
                    sessionStorage.setItem('merchantAppId', this.merchantAppId)
                    this.sendEvLog({
                        category: 'confirm_payment',
                        action: 'payment_show',
                        label: 1,
                        value: 1,
                        merchant_app_id: this.merchantAppId,
                        data_source: 2
                    })
                } else {
                    this.$alert(this.$store.state.lang.payToken_payChannel_mismatch)
                }
            })
        },
        bubbleSort: function(arr) {
            let temp
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr.length - i - 1; j++) {
                    if (parseInt(arr[j].orderSeq) > parseInt(arr[j + 1].orderSeq)) {
                        temp = arr[j]
                        arr[j] = arr[j + 1]
                        arr[j + 1] = temp
                    }
                }
            }
            return arr
        },
        getMyEwallet() {
            updateWalletAccount.call(this, account => {
                this.eAmount = account.amount
                this.eCurrencySymbol = account.currencySymbol
                sessionStorage.setItem('wallet', JSON.stringify(account))
                updateWalletConf.call(this, account.accountNo)
            })
        },
        cdnPic(src) {
            return cdnPicSrc.call(this, src)
        },
        initChannel(item) {
            this.channel.payType = item.payType
            this.channel.payChannel = item.id
            this.channel.formConfigExist = item.formConfigExist
            this.channel.appInterfaceMode = item.appInterfaceMode
            this.channel.currencySymbol = this.countrys[item.country].currencySymbol
            this.channel.payChannelName = item.payType == 1 ? 'eWallet' : item.name
            this.sendEvLog({
                category: 'confirm_payment',
                action: 'payment_channel_select',
                label: 1,
                value: 1,
                merchant_app_id: this.merchantAppId,
                data_source: 2
            })
            this.authorizationCode = ''
            sessionStorage.removeItem('card')
        },
        initSubChannel(item, card) {
            this.initChannel(item)
            this.authorizationCode = card.authorizationCode
            // TODO 绑卡信息埋点
        },
        nextStep() {
            sessionStorage.setItem('payChannel', this.channel.payChannel)
            this.authorizationCode && sessionStorage.setItem('card', this.authorizationCode)
            let passIsSet
            if (this.channel.payType === 1 || this.authorizationCode) {
                if (!this.isLogin) {
                    this.$confirm(this.$store.state.lang.starpay_payment_login_notice, () => {
                        window.location.href = `${location.origin}/hybrid/account/signIn?pre=${location.href}`
                    })
                } else {
                    passIsSet = JSON.parse(localStorage.getItem('wallet_config')).payPassword
                    if (passIsSet === 'true') {
                        this.$router.push(`/hybrid/payment/wallet/paybyPass`)
                    } else {
                        this.$router.push(`/hybrid/payment/wallet/setPassword?passIsSet=1`)
                    }
                }
            } else if (this.channel.formConfigExist) {
                this.$router.push(`/hybrid/payment/form?appInterfaceMode=${this.channel.appInterfaceMode}&appId=${this.merchantAppId}`)
            } else {
                invoke.call(this, this.payToken, this.channel.payChannel, data => {
                    this.$nuxt.$loading.finish()
                    this.$store.commit('HIDE_SHADOW_LAYER')
                    commonPayAfter.call(this, data, this.channel.payType, this.channel.appInterfaceMode)
                })
            }
            this.sendEvLog({
                category: 'confirm_payment',
                action: 'pay_click',
                label: 1,
                value: 1,
                merchant_app_id: this.merchantAppId,
                data_source: 2,
                payment_channel_id: this.channel.payChannel,
                payment_channel_name: this.channel.payChannelName,
                total_amount: this.totalAmount,
                bindcard: 0,
                paypwd: passIsSet === 'true' ? 1 : 0
            })
        }
    },
    head() {
        return {
            title: this.$store.state.lang.confirm_payment
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    width: 100%;
    height: 100%;
    padding: 0 5%;
    .goods {
        width: 90%;
        text-align: center;
        padding: 0.8rem 0;
        margin-bottom: 1.5rem;
        height: 8.3rem;
        position: fixed;
        top: 0;
        background: #ffffff;
        z-index: 99;
        word-break: break-all;
        .pay-money {
            font-weight: bold;
            font-size: 2.25rem;
            color: #212121;
            margin-bottom: 0.8rem;
            span {
                font-size: 1.25rem;
            }
        }
        .pay-subject {
            color: #666666;
            font-size: 1.1rem;
        }
    }
    .contain {
        // height: 60vh; // 兼容
        overflow-y: scroll;
        margin-top: 7.5rem;
        margin-bottom: 6.5rem;
        .pay-channels {
            width: 100%;
            font-weight: bold;
            & > div {
                border-bottom: 1px solid #eeeeee;
                padding: 0.8rem 0;
            }
            .radio {
                position: relative;
                .img-box {
                    display: inline-block;
                    vertical-align: middle;
                    height: 1.3rem;
                    width: 1.3rem;
                    background-size: 100% !important;
                    background: url('~assets/img/dvb/ic_no_logo_card.png') no-repeat;
                    &.balance {
                        background: url('~assets/img/dvb/ic_ewallet_balance.png') no-repeat;
                    }
                    &.visa {
                        background: url('~assets/img/dvb/ic_visa.png') no-repeat;
                    }
                    &.verve {
                        background: url('~assets/img/dvb/ic_verve.png') no-repeat;
                    }
                    &.mastercard {
                        background: url('~assets/img/dvb/ic_mastercard.png') no-repeat;
                    }
                }
                img {
                    width: 1.5rem;
                }
                span {
                    margin-left: 0.5rem;
                    color: #333333;
                }
                position: relative;
                cursor: pointer;
                display: block;
                line-height: 2rem;
                height: 2.3rem;
                input {
                    position: absolute;
                    left: -9999px;
                    &:checked {
                        & + i {
                            border: 2px solid #008be9;
                            &:after {
                                opacity: 1;
                            }
                        }
                    }
                }
                i {
                    width: 1.3rem;
                    height: 1.3rem;
                    outline: 0;
                    border: 2px solid #ddd;
                    background: #ffffff;
                    border-radius: 100%;
                    float: right;
                    margin-top: 0.45rem;
                    display: flex;
                    &:after {
                        content: '';
                        width: 0.8rem;
                        height: 0.8rem;
                        border-radius: 100%;
                        background-color: #008be9;
                        opacity: 0;
                        transition: opacity 0.1s;
                        -webkit-transition: opacity 0.1s;
                        margin: auto;
                    }
                }
            }
            .sub-channels {
                padding-left: 2rem;
                font-weight: normal;
                img {
                    width: 1.3rem;
                }
            }
        }
        .desc {
            width: 100%;
            line-height: 1.3rem;
            margin-top: 0.8rem;
        }
    }
    .footer {
        width: 100%;
        background: #ffffff;
        z-index: 99;
        position: fixed;
        bottom: 0rem;
        margin: 0 auto;
        left: 0;
        right: 0;
        height: 6rem;
        padding-bottom: 2rem;
        box-sizing: border-box;
        .error-msg {
            color: red;
            font-size: 0.8rem;
            width: 75%;
            text-align: center;
            display: block;
            margin: 0 auto;
            padding-top: 0.5rem;
        }
        button {
            width: 75%;
        }
    }
}
</style>
