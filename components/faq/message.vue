<template>
    <div>
        <div class="order-msg" @click="toDetail">
            <p class="time">
                {{message.orderCreateTime | formatDate}}
                <span
                    class="wait-result"
                >{{replied? 'Replied': 'Waiting For Result'}}</span>
            </p>
            <div class="order-type clearfix">
                <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt>
                <div class="right">
                    <p class="order-name">{{message.orderName}}</p>
                    <p class="order-status">Order ID: {{message.orderNo}}</p>
                </div>
            </div>
            <p class="complain">Complain</p>
            <p>{{message.message}}</p>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
    props: {
        message: {
            require: true,
            type: Object,
            default: new Object()
        },
        replied: {
            require: false,
            type: Boolean,
            default: false
        }
    },
    methods: {
        toDetail() {
            sessionStorage.setItem('showMsg', JSON.stringify(this.message))
            this.$router.push('/hybrid/faq/message')
        }
    },
    filters: {
        formatDate(date) {
            return dayjs(date).format('D MMM YYYY HH:mm:ss')
        }
    }
}
</script>
