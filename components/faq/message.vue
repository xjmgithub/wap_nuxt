<template>
<div>
    <div class="order-msg" @click="toDetail">
        <p class="time">{{message.orderCreateTime}} <span class="wait-result">{{replied? 'Replied': 'Waiting For Result'}}</span></p>
        <div class="order-type clearfix">
            <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
            <div class="right">
                <p class="order-name">{{message.orderName}}</p>
                <p class="order-status">Order ID: {{message.orderNo}} </p>
            </div>
        </div>
        <p class="complain">Complain</p>
        <p>{{message.message}}</p>
    </div>
</div>
</template>
<script>
export default {
    props:['message','replied'],
    methods:{
        toDetail(){
            // TODO storage message
            localStorage.setItem('showMsg',JSON.stringify(this.message))
            this.$router.push('/hybrid/faq/message')
        }
    }
}
</script>