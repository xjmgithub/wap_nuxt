<template>
    <div class="order-msg">
        <p class="time">
            {{order.order_create_time | formatDate }}
            <slot/>
        </p>
        <div class="order-type clearfix">
            <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt>
            <div class="right">
                <div class="order-l">
                    <div>{{orderName}}</div>
                    <div class="card-no">{{orderNo}}</div>
                </div>
                <div class="order-r">
                    <div>{{currency}} {{order.order_amount}}</div>
                    <div>{{orderStatus}}</div>
                </div>
            </div>
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
        order: {
            default: () => {
                return {}
            },
            require: true,
            type: Object
        }
    },
    computed: {
        orderName() {
            switch (this.order.order_type_id) {
                case 1:
                case 2:
                case 3:
                    return this.order.order_type || 'DVB Recharge'
                default:
                    return this.order.order_name
            }
        },
        orderNo() {
            switch (this.order.order_type_id) {
                case 1:
                case 2:
                case 3:
                    return `Card No.${this.order.card_no||this.order.smartcardNo}`
                default:
                    return this.order.order_no
            }
        },
        currency() {
            return this.$store.state.country.currencySymbol
        },
        orderStatus() {
            if (this.order) {
                const type = this.order.order_type_id
                if ([1, 2, 3].indexOf(type) >= 0) {
                    // bouquet,link,charge
                    switch (this.order.order_status) {
                        case '0':
                            return 'UNPAID'
                        case '10':
                            return 'UNRECHARGED'
                        case '20':
                        case '4':
                            return 'FAILD'
                        case '3':
                            return 'SUCCESS'
                        case '11':
                            return 'CHARGING'
                        default:
                            return ''
                    }
                } else {
                    // ott
                    switch (this.order.order_status) {
                        case '1':
                        case '2':
                        case '4':
                        case '6':
                            return 'UNPAID'
                        case '3':
                            return 'CANCEL'
                        case '5':
                            return 'SUCCESS'
                        case '7':
                            return 'REFUNDING'
                        case '8':
                            return 'REFUNDED'
                        default:
                            return 'EXPIRED'
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
/* slot的样式暂时放这里 */
.order-msg {
    padding: 0 0.5rem;
    position: relative;
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
    }
    .order-type {
        padding: 0.5em 0;
        line-height: 1.3rem;
        img {
            width: 2.5rem;
            height: 2.5rem;
            float: left;
        }
        .right {
            margin-left: 3rem;
        }
        .order-l {
            width: 70%;
            float: left;
            .card-no {
                color: #999999;
                font-size: 0.95rem;
            }
        }
        .order-r {
            float: right;
            text-align: right;

            div:first-child {
                font-weight: bold;
                font-size: 1.1rem;
            }
            div:last-child {
                color: #00cc33;
                font-size: 0.9rem;
            }
        }
    }
}
</style>
