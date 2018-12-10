<template>
    <div class="b-order-msg" v-if="service.order_info">
        <div class="top">
            <p class="time">{{service.order_info.order_create_time | formatDate}}</p>
            <div class="b-order-type clearfix">
                <img src="~assets/img/faq/ic_RechargeOrder_def_b.png">
                <div class="right">
                    <p class="order-name">
                        {{service.order_info.order_type}}
                        <span>{{currency}} {{service.order_info.order_amount}}</span>
                    </p>
                    <p class="order-status">
                        {{orderName}}
                        <span>{{orderStatus}}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="gap"/>
        <div class="bottom clearfix">
            <p class="clearfix">
                Questions
                <img
                    @click="moreQues(service.id)"
                    src="~assets/img/faq/ic_categary_copy41.png"
                >
            </p>
            <ul v-if="service.questions">
                <li
                    v-for="(item,index) in service.questions.slice(0,3)"
                    :key="index"
                    @click="clickQues(item)"
                >{{item.thema}}</li>
            </ul>
            <div
                class="btn"
                v-for="(item,index) in service.service_components"
                :key="index"
            ><a :href="item.service_address">{{item.presentation_name}}</a></div>
        </div>
        <div v-if="showMore" class="gap"/>
        <nuxt-link v-if="showMore" :to="{path:'/hybrid/faq/moreOrders',query:$route.query}">
            <div class="more">MORE ORDERS</div>
        </nuxt-link>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
    props: {
        service: {
            type: Object,
            require: true,
            default: null
        },
        showMore: {
            require: false,
            type: Boolean,
            default: false
        }
    },
    computed: {
        currency() {
            return this.$store.state.country.currencySymbol
        },
        orderName() {
            if (this.service && this.service.order_info) {
                switch (this.service.order_info.order_type_id) {
                    case '1':
                    case '2':
                    case '3':
                        return 'Card No.' + this.service.order_info.card_no
                        break
                    default:
                        return this.service.order_info.order_name
                }
            } else {
                return ''
            }
        },
        orderStatus() {
            if (this.service && this.service.order_info) {
                let type = this.service.order_info.order_type_id
                if (['1', '2', '3'].indexOf(type) >= 0) {
                    // bouquet,link,charge
                    switch (this.service.order_info.order_status) {
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
                    switch (this.service.order_info.order_status) {
                        case '1':
                        case '2':
                        case '4':
                            return 'UNPAID'
                            break
                        case '3':
                        case '6':
                            return 'CANCEL'
                            break
                        case '5':
                            return 'SUCCESS'
                            break
                        case '7':
                            return 'REFUNDING'
                            break
                        case '8':
                            return 'REFUNDED'
                            break
                        case '9':
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
    },
    filters: {
        formatDate(date) {
            return dayjs(date).format('D MMM YYYY HH:mm:ss')
        }
    },
    methods: {
        clickQues(item) {
            sessionStorage.setItem('faq_question', JSON.stringify(item))
            this.$router.push({
                path: '/hybrid/faq/customerService',
                query: this.$route.query
            })
        },
        moreQues(item) {
            sessionStorage.setItem('morefaqs', 1)
            this.$router.push({
                path: '/hybrid/faq/customerService',
                query: this.$route.query
            })
        }
    }
}
</script>
<style lang="less" scoped>
.b-order-msg {
    box-shadow: 0px 1px 3px 1px #dddddd;
    border-radius: 5px;
    margin-bottom: 0.8rem;
    .top {
        padding: 0 0.5rem;
        p.time {
            width: 100%;
            color: #aaaaaa;
            font-size: 0.8rem;
            border-bottom: 1px solid #eeeeee;
            padding: 0.2rem 0;
        }
    }
    .b-order-type {
        padding: 0.7em 0;
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
    .gap {
        background-color: #f2f2f2;
        height: 4px;
        width: 100%;
    }
    .bottom {
        padding: 0.7rem 0.5rem;
        p {
            font-size: 0.9rem;
            color: #333333;
            img {
                float: right;
                width: 1.5rem;
                height: 1.5rem;
            }
        }
        li {
            color: #333333;
            font-size: 0.8rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .btn {
            color: #0087eb;
            font-size: 0.8rem;
            margin-top: 0.7rem;
            float: right;
            margin-left: 0.7rem;
            font-weight: bold;
        }
    }
    .more {
        color: #0087eb;
        font-size: 0.8rem;
        font-weight: bold;
        text-align: center;
        padding: 0.7rem 0;
    }
}
</style>
