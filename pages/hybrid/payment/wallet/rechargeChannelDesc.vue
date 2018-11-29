<template>
    <div class="container">
        <h3>Recharge by {{ name }}</h3>
        <h4 class="description">Description</h4>
        <div class="desc">
            <div v-html="desc"/>
            <div id="copy-button" :data-clipboard-text="ussd" v-if="ussd">click to copy {{ ussd }}</div>
        </div>
        <div class="footer">
            <mButton :disabled="type!=4&&type!=1" text="NEXT" @click="nextStep"/>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import clipboard from 'clipboard'
export default {
    layout: 'base',
    data() {
        return {
            name: '',
            desc: '',
            code: '',
            type: '', // 1 boss 充值 2 copon 充值 3 第三方支付充值  4 充值卡充值,
            ussd: ''
        }
    },
    components: {
        mButton
    },
    mounted() {
        let channelInfo = JSON.parse(window.localStorage.getItem('wallet_charge_channel'))
        this.name = channelInfo.value
        this.desc = channelInfo.desc
        this.code = channelInfo.code
        this.type = channelInfo.channelType
        this.ussd = channelInfo.ussd

        new clipboard('#copy-button')
    },
    methods: {
        copyCode(ussd) {},
        nextStep() {
            if (this.type == 1) {
                window.open(`tel://${this.ussd}`)
                this.$router.push('/hybrid/payment/wallet/lastcharge')
            } else if (this.type == 2) {
                return false // coupon 充值 // TODO
            } else if (this.type == 3) {
                return false // 第三方支付充值，app暂时没做
            } else if (this.type == 4) {
                this.$router.push('/hybrid/payment/wallet/rechargeByCard')
            } else {
                return false
            }
        }
    }
}
</script>
<style scoped>
.container {
    padding: 5rem 1rem 0;
    font-size: 0.9rem;
    color: #333;
}
.container h3 {
    text-align: center;
    font-weight: bold;
    font-size: 1.25rem;
}
.container h4 {
    font-weight: bold;
    padding: 1rem 0;
    margin-top: 0.5rem;
    font-size: 1.125rem;
    border-bottom: 1px solid #e0e0e0;
}
.container ul {
    padding-top: 1rem;
    font-size: 0.9rem;
    color: #666;
}
.container ul li {
    height: 1.5rem;
}
.container li span {
    font-size: 1rem;
    color: #333;
    font-weight: 600;
}
.desc {
    padding: 1rem 0;
    color: #666666;
}
.footer {
    position: fixed;
    bottom: 2rem;
    width: 75%;
    margin: 0 auto;
    left: 0;
    right: 0;
}
#copy-button {
    margin-top: 1rem;
    font-weight: bold;
    color: blue;
}
</style>
