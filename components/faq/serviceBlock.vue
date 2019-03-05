<template>
    <div class="b-order-msg" v-show="service.order_info">
        <orderBlock :order="service.order_info"/>
        <div class="gap"/>
        <div class="bottom clearfix">
            <p class="clearfix">
                Questions
                <img @click="moreQues(service.id)" src="~assets/img/faq/ic_categary_copy41.png">
            </p>
            <ul v-if="service.questions">
                <li v-for="(item,index) in service.questions.slice(0,3)" :key="index" @click="clickQues(item)">{{item.thema}}</li>
            </ul>
            <div class="btn" v-for="(item,index) in service.service_components" :key="index">
                <a :href="item.service_address">{{item.presentation_name}}</a>
            </div>
        </div>
        <div v-if="showMore" class="gap"/>
        <nuxt-link v-if="showMore" @click="moreOrders" :to="{path:'/hybrid/faq/moreOrders',query:$route.query}">
            <div class="more">MORE ORDERS</div>
        </nuxt-link>
    </div>
</template>
<script>
import orderBlock from '~/components/faq/order'
import { getFaqBlockLogLabel } from '~/functions/utils'
export default {
    props: {
        showMore: {
            require: false,
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            entranceId: this.$route.query.entrance_id,
            service: {}
        }
    },
    components: {
        orderBlock: orderBlock
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
            this.sendEvLog({
                category: 'onlineService',
                action: `block_${this.entranceId || ''}_more_click`,
                label: getFaqBlockLogLabel(this),
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
                label: getFaqBlockLogLabel(this),
                value: 1
            })
        }
    },
    mounted() {
        this.$axios
            .get(`/ocs/v1/service/module/show?entranceId=${this.entranceId}`, {
                headers: {
                    'x-clientType': 1,
                    'x-appVersion': '5300'
                }
            })
            .then(res => {
                if (res.data && res.data.data) {
                    this.service = res.data.data
                    sessionStorage.setItem('serviceModuleId', this.service.service_module.id)
                    sessionStorage.setItem('orderMsg', JSON.stringify(this.service.order_info))

                    this.sendEvLog({
                        category: 'onlineService',
                        action: `block_${this.entranceId || ''}_show`,
                        label: getFaqBlockLogLabel(this),
                        value: 1
                    })
                    this.sendEvLog({
                        category: 'onlineService',
                        action: `block_moreorders_${this.entranceId || ''}_show`,
                        label: getFaqBlockLogLabel(this),
                        value: 1
                    })
                }
            })
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
        li {
            color: #333333;
            font-size: 0.8rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .btn {
            font-size: 0.8rem;
            margin-top: 0.3rem;
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
