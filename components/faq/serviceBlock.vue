<template>
    <div v-if="order.order_type_id" class="b-order-msg">
        <orderBlock :order="order"/>
        <div class="gap"/>
        <div class="bottom clearfix">
            <p class="clearfix">
                Questions
                <img v-if="questions.length>3" src="~assets/img/faq/ic_categary_copy41.png" @click="moreQues()">
            </p>
            <ul v-if="questions.length>0">
                <li v-for="(item,index) in questions.slice(0,3)" :key="index" @click="clickQues(item)">{{item.thema}}</li>
            </ul>
            <div v-for="(item,index) in buttons" :key="index" class="btn">
                <nuxt-link :to="{path:item.service_address,query:$route.query}">{{item.presentation_name}}</nuxt-link>
            </div>
        </div>
        <nuxt-link v-if="showMore" :to="{path:'/hybrid/faq/moreOrders',query:$route.query}" @click="moreOrders">
            <div class="gap"/>
            <div class="more">MORE ORDERS</div>
        </nuxt-link>
    </div>
</template>
<script>
import orderBlock from '~/components/faq/order'
import { getFaqAnswerLabel, getFaqBlockLogLabel } from '~/functions/utils'
export default {
    components: {
        orderBlock: orderBlock
    },
    props: {
        showMore: {
            require: false,
            type: Boolean,
            default: false
        },
        service: {
            require: true,
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            entranceId: this.$route.query.entrance_id
        }
    },
    computed: {
        order() {
            return this.service.order_info || {}
        },
        questions() {
            return this.service.questions || []
        },
        buttons() {
            return this.service.service_components || []
        }
    },
    methods: {
        clickQues(item) {
            sessionStorage.setItem('faq_question', JSON.stringify(item))
            this.$router.push({
                path: '/hybrid/faq/customerService',
                query: this.$route.query
            })
            this.sendEvLog({
                category: 'onlineService',
                action: `answer_${this.entranceId || ''}_click`,
                label: getFaqAnswerLabel.call(this, item.id) + '_1',
                value: 1
            })
        },
        moreQues() {
            sessionStorage.setItem('morefaqs', 1)
            this.sendEvLog({
                category: 'onlineService',
                action: `block_${this.entranceId || ''}_more_click`,
                label: getFaqBlockLogLabel.call(this),
                value: 1
            })
            this.$router.push({
                path: '/hybrid/faq/customerService',
                query: this.$route.query
            })
        },
        moreOrders() {
            this.sendEvLog({
                category: 'onlineService',
                action: `block_moreorders_${this.entranceId || ''}_click`,
                label: getFaqBlockLogLabel.call(this),
                value: 1
            })
        }
    }
}
</script>
<style lang="less" scoped>
.b-order-msg {
    box-shadow: 0px 1px 3px 1px #dddddd;
    border-radius: 2px;
    margin-bottom: 0.8rem;

    .gap {
        background-color: #f2f2f2;
        height: 4px;
        width: 100%;
    }
    .bottom {
        padding: 0.5rem;
        p {
            font-size: 0.9rem;
            color: #333333;
            img {
                float: right;
                width: 1.5rem;
                height: 1.5rem;
            }
        }
        ul {
            padding: 0.3rem 0;
        }
        li {
            color: #333333;
            font-size: 0.8rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 1.2rem;
        }
        .btn {
            font-size: 0.8rem;
            float: right;
            margin-left: 0.7rem;
            font-weight: bold;
            a {
                color: #0087eb;
            }
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
