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
        <div class="rechargePin">
            <p>Input Recharge Pin</p>
            <div>
                <span :class="{focus:isFocus}">Enter the 4-32 digits on Voucher Card</span>
                <input type="tel" maxlength="39" @focus="isFocus=true" v-model="rechargePin" @input="changePinNum">
            </div>
                <p class="msg">
                    Vocher PIN is on the StarTimes recharge card that you bought from StarTimes business hall or dealer
                </p>
            </div>
            <div class="footer">
                <mButton :disabled="!canNext" text="NEXT" @click="nextStep"></mButton>
            </div>
        </div>
</template>
<script>
import mButton from '~/components/button'
export default {
    layout: 'base',
    data() {
        return {
            walletAccount: '',
            walletLeft: 0,
            currency: '',
            isFocus: false,
            rechargePin: ''
        }
    },
    computed: {
        oriPinNum: function() {
            var reg = /^[0-9]*$/
            var tmp = this.rechargePin.replace(/-/g, '')
            return reg.test(tmp) ? tmp : ''
        },
        canNext() {
            return this.oriPinNum.length > 4 && this.oriPinNum.length < 32
        }
    },
    mounted() {
        let wallet = JSON.parse(localStorage.getItem('wallet_account'))
        this.walletAccount = wallet.accountNo
        this.walletLeft = wallet.amount
        this.currency = JSON.parse(localStorage.getItem('payObject')).currency
    },
    components: {
        mButton
    },
    filters: {
        fixAmount(val) {
            return Number(val).toFixed(2)
        }
    },
    methods: {
        nextStep() {
            if (!this.canNext) return false
            this.$confirm(
                `<div style="font-size:1.2rem;">Please Check</div>
                <br />
                <div>eWallet No.${this.walletAccount}</div>
                <div>Recharge Pin: ${this.rechargePin}</div>
                <br />
                <div>The Voucher Card will be charged into this ewallet No.</div>
                <br />
            `,
                () => {
                    this.$axios
                        .post(
                            `/mobilewallet/v2/accounts/${
                                this.walletAccount
                            }/recharge-by-rc?rechargeCardPin=${this.oriPinNum}`,
                            {
                                rechargeCardPin: this.oriPinNum
                            },
                            {
                                headers: {
                                    token: this.$store.state.token
                                }
                            }
                        )
                        .then(res => {
                            if (res.data && res.data.code == 0) {
                                this.$router.push(
                                    '/hybrid/payment/wallet/rechargeResult?result=0'
                                )
                            } else {
                                // TODO 充值结果页面未使用
                                this.$router.push(
                                    '/hybrid/payment/wallet/rechargeResult?result=1'
                                )
                            }
                        })
                },
                'CONFIRM',
                'CANCEL'
            )
        },
        formatCard(str) {
            return str.replace(/(^\d{4}\B|\d{4}\B)/g, '$1-')
        },
        changePinNum() {
            this.rechargePin = this.formatCard(this.oriPinNum)
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
    .cardNo {
        display: inline-block;
        height: 1.7rem;
        line-height: 1.7rem;
        font-size: 0.9rem;
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.2471);
        padding: 0 0.8rem;
        margin-bottom: 0.5rem;
    }
    .balance {
        font-size: 0.9rem;
        opacity: 0.8;
        padding-left: 0.8rem;
    }
    .currency {
        font-weight: bold;
    }
    .money {
        font-size: 1.5rem;
        font-weight: bold;
    }
}
.rechargePin {
    padding: 1rem;
    p {
        font-size: 1.1rem;
        color: #222222;
        margin: 0;
        padding: 0;
        &.msg {
            font-size: 0.8rem;
            line-height: 1.2rem;
            color: #808080;
        }
    }
    div {
        margin: 0.3rem 0 0.5rem;
        span {
            color: #0087eb;
            font-size: 0.7rem;
            display: block;
            opacity: 0;
            &.focus {
                opacity: 1;
            }
        }
        input {
            width: 100%;
            border: none;
            outline: none;
            border-bottom: 2px solid #0087eb;
            caret-color: #0087eb;
            display: block;
            margin-top: 0.3rem;
            font-size: 0.9rem;
        }
    }
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