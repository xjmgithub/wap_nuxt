<template>
    <div>
        <div @click="toDetail" class="order-msg">
            <p class="time">
                {{message.orderCreateTime | formatDate}}
                <span
                    class="wait-result"
                >{{replied? 'Replied': 'Waiting For Result'}}</span>
            </p>
            <div class="order-type clearfix">
                <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt>
                <div class="right">
                    <p class="order-name">
                        {{message.orderName}}
                    </p>
                    <p class="order-status">
                        Order ID: {{message.orderNo}}
                    </p>
                </div>
            </div>
            <p class="complain">
                Complain
            </p>
            <p>{{message.message}}</p>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
    filters: {
        formatDate(date) {
            return dayjs(date).format('D MMM YYYY HH:mm:ss')
        }
    },
    props: {
        message: {
            require: true,
            type: Object,
            default: () => {
                return {}
            }
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
    }
}
</script>
<style lang="less" scoped>
.order-msg {
    padding: 0 0.5rem 0.8rem;
    position: relative;
    background: white;
    width: 90%;
    margin: 1rem auto;
    border-radius: 2px;
    p.time {
        width: 100%;
        color: #aaaaaa;
        font-size: 0.8rem;
        border-bottom: 1px solid #eeeeee;
        padding: 0.4rem 0;
        img {
            position: absolute;
            display: block;
            width: 1.2rem;
            right: 0.4rem;
            top: 0.4rem;
        }
        input {
            position: absolute;
            cursor: pointer;
            left: -9999px;
            &:checked {
                & + i {
                    border: 1px solid #008be9;
                    &:after {
                        opacity: 1;
                    }
                }
            }
        }
        i {
            display: block;
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            width: 18px;
            height: 18px;
            outline: 0;
            border: 1px solid #bdbdbd;
            background: #ffffff;
            border-radius: 50%;
            &:after {
                position: absolute;
                content: '';
                top: 3px;
                left: 3px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #008be9;
                opacity: 0;
                transition: opacity 0.1s;
                -webkit-transition: opacity 0.1s;
            }
        }
        .wait-result {
            font-size: 0.9rem;
            float: right;
            color: black;
        }
    }
    .order-type {
        padding: 0.5em 0;
        img {
            width: 2.5rem;
            height: 2.5rem;
            float: left;
        }
        .right {
            margin-left: 3rem;
        }
        .order-name {
            span {
                font-weight: bold;
                float: right;
            }
        }
        .order-status {
            font-size: 0.9rem;
            color: #999999;
            span {
                color: #00cc33;
                float: right;
            }
        }
    }
}
</style>
