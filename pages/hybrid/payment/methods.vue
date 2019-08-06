<template>
    <div style="padding:1rem;">
        生成订单
        <div>
            <input v-model="client_id" type="text" placeholder="client_id" />
            <input v-model="appid" type="text" placeholder="appid" />
            <input v-model="apikey" type="text" placeholder="apikey" />
            <input v-model="redirectUrl" type="text" placeholder="redirectUrl" />
            <input v-model="paySubject" type="text" placeholder="paySubject" />
            <input v-model="payNote" type="text" placeholder="payNote" />
            <input v-model="totalAmount" type="text" placeholder="totalAmount" />
            <input v-model="notifyUrl" type="text" placeholder="notifyUrl" />
            <input v-model="country" type="text" placeholder="country" />
            <input v-model="currency" type="text" placeholder="currency" />
            <input v-model="txNo" type="text" placeholder="txNo" />
        </div>
        <mButton text="生成订单并支付" @click="creatPayment"></mButton>
    </div>
</template>
<script>
import mButton from '~/components/button'
export default {
    layout: 'base',
    components: {
        mButton
    },
    data() {
        return {
            client_id: '',
            apikey: '',
            appid: '',
            redirectUrl: '',
            paySubject: '',
            payNote: '',
            merchantAppId: '',
            totalAmount: '',
            notifyUrl: '',
            country: '',
            currency: '',
            txNo: ''
        }
    },

    methods: {
        creatPayment() {
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
