<template>
    <div class="order-msg">
        <p class="time">
            {{order.order_create_time | formatDate }}
            <slot/>
        </p>
        <div class="order-type clearfix">
            <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt>
            <div class="right">
                <p class="order-name">
                    {{orderName}}
                    <span>{{currency}} {{order.order_amount}}</span>
                </p>
                <p class="order-status">
                    {{order.order_type}}
                    <span>{{orderStatus}}</span>
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
            default: null,
            require: true,
            type: Object
        }
    },
    filters: {
        formatDate(date) {
            return dayjs(date).format('D MMM YYYY HH-mm:ss')
        }
    },
    computed: {
        orderName() {
            switch (this.order.order_type_id) {
                case 1:
                case 2:
                case 3:
                    return 'Card No.' + this.order.card_no
                    break
                default:
                    return this.order.order_name
            }
        },
        currency() {
            return this.$store.state.country.currencySymbol
        },
        orderStatus() {
            if (this.order) {
                let type = this.order.order_type_id
                if ([1, 2, 3].indexOf(type) >= 0) {
                    // bouquet,link,charge

                    switch (this.order.order_status) {
                        case '0':
                            return 'UNPAID'
                            break
                        case '10':
                            return 'UNRECHARGED'
                            break
                        case '20':
                        case '4':
                            return 'FAILD'
                            break
                        case '3':
                            return 'SUCCESS'
                            break
                        case '11':
                            return 'CHARGING'
                            break
                        default:
                            return ''
                    }
                } else {
                    // ott

                    switch (this.order.order_status) {
                        case '1':
                        case '10':
                        case '100':
                            return 'UNPAID'
                            break
                        case '11':
                        case '110':
                            return 'CANCEL'
                            break
                        case '101':
                            return 'SUCCESS'
                            break
                        case '111':
                            return 'REFUNDING'
                            break
                        case '1000':
                            return 'REFUNDED'
                            break
                        case '1001':
                            return 'EXPIRED'
                            break
                        default:
                            return ''
                    }
                }
            } else {
                return ''
            }
        }
    }
}
</script>
<style lang="less">
.order-msg {
    padding: 0 0.5rem;
    position: relative;
    p.time {
        width: 100%;
        color: #aaaaaa;
        font-size: 0.8rem;
        border-bottom: 1px solid #eeeeee;
        padding: 0.2rem 0;
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
