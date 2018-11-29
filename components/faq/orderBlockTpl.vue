<template>
    <div class="order-msg">
        <p class="time">{{order.order_create_time | formatDate}}</p>
        <div class="order-type clearfix">
            <img src="~assets/img/faq/ic_RechargeOrder_def_b.png">
            <div class="right">
                <p class="order-name">
                    {{order.order_type}}
                    <span>{{order.order_amount}}</span>
                </p>
                <p class="order-status">
                    {{order.card_no}}
                    <span>{{order.order_status}}</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
    props: {
        order: {
            require: true,
            type: Object,
            default: null
        }
    },
    filters: {
        formatDate(date) {
            return dayjs(date).format('D MMM YYYY HH:mm:ss')
        }
    }
}
</script>