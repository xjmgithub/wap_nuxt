<template>
    <div>
        <div class="eWallet">
            <p class="cardNo">eWallet No. {{walletAccount}}</p>
            <div>
                <span class="balance">Balance：</span>
                <span class="currency">{{currency}}</span>
                <span class="money">{{walletLeft | fixAmount}}</span>
            </div>
        </div>
        <RadioBtn :radioList="radioList" class="radioBtn" @pick="changeItem"></RadioBtn>
        <div class="footer">
            <mButton :disabled="false" text="NEXT" @click="nextStep"></mButton>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import RadioBtn from '~/components/radioBtn'
export default {
    layout: 'base',
    data() {
        return {
            walletAccount: '',
            walletLeft: '',
            currency: '',
            radioList: [],
            selected: null,
            step: 1
        }
    },
    computed: {
        selectedChannel() {
            let _this = this
            let result = {}
            this.radioList.forEach((item, index) => {
                if (item.code == _this.selected) {
                    result = item
                }
            })
            return result
        }
    },
    mounted() {
        let wallet = JSON.parse(localStorage.getItem('wallet_account'))
        this.walletAccount = wallet.accountNo
        this.walletLeft = wallet.amount
        this.currency = JSON.parse(localStorage.getItem('payObject')).currency
        
        this.$axios.get('/mobilewallet/v1/recharge-channels').then(res => {
            let list = []
            if (res.data && res.data.length > 0) {
                res.data.forEach((item, index) => {
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
            }
        })
    },
    components: {
        mButton,
        RadioBtn
    },
    filters: {
        fixAmount(val) {
            return Number(val).toFixed(2)
        }
    },
    methods: {
        nextStep() {
            window.localStorage.setItem(
                'wallet_charge_channel',
                JSON.stringify(this.selectedChannel)
            )
            this.$router.push('/hybrid/payment/wallet/rechargeChannelDesc')
        },
        changeItem(code) {
            this.selected = code
        }
    }
}
</script>
<style lang="less" scoped>
.eWallet {
    width: 100%;
    height: 6rem;
    padding: 1rem;
    background: #0087eb;
    color: #fff;
}

.eWallet .cardNo {
    display: inline-block;
    height: 1.7rem;
    line-height: 1.7rem;
    font-size: 0.9rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.2471);
    padding: 0 0.8rem;
    margin-bottom: 0.5rem;
}

.eWallet .balance {
    font-size: 0.9rem;
    opacity: 0.8;
    padding-left: 0.8rem;
}

.eWallet .currency {
    font-weight: bold;
}

.eWallet .money {
    font-size: 1.5rem;
    font-weight: bold;
}

.radioBtn {
    margin-left: 0.8rem;
    margin-top: 1.5rem;
}

.footer {
    position: fixed;
    bottom: 2rem;
    width: 16rem;
    margin: 0 auto;
    left: 0;
    right: 0;
}
</style>