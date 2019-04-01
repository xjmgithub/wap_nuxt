<template>
    <div class="wrapper">
        <div v-show="loaded&&orderList">
            <div class="orders" style="padding-bottom:5rem;">
                <div v-for="(item,index) in orderList" :key="index" class="order-contain" @click="check(item.id)">
                    <orderBlock :order="item">
                        <input :checked="item.id==checkedId" type="radio" name="order">
                        <i/>
                    </orderBlock>
                </div>
            </div>
            <div class="ok">
                <button class="btn" @click="submit">OK</button>
            </div>
        </div>
        <div v-show="loaded&&!orderList" class="no-orders">
            <img src="~assets/img/faq/Group5.png" alt>
            <p>No Orders.</p>
        </div>
    </div>
</template>
<script>
import orderBlock from '~/components/faq/order'
export default {
    layout: 'base',
    components: {
        orderBlock: orderBlock
    },
    data: function() {
        return {
            entranceId: this.$route.query.entrance_id || '',
            orderList: [],
            checkedId: null,
            loaded: false
        }
    },
    computed: {
        checked() {
            let result = this.orderList[0]
            this.orderList.forEach(item => {
                if (item.id == this.checkedId) result = item
            })
            return result
        }
    },
    mounted() {
        const cachedOrder = sessionStorage.getItem('orderMsg')
        this.$nextTick(() => this.$nuxt.$loading.start())
        this.$axios
            .get(`/ocs/v1/service/module/moreOrder?entranceId=${this.entranceId}`, {
                headers: {
                    'x-clientType': 1,
                    'x-appVersion': '5300'
                }
            })
            .then(res => {
                this.$nextTick(() => this.$nuxt.$loading.finish())
                if (res.data) {
                    res.data.data
                        .sort((a, b) => {
                            return a.order_info.order_create_time > b.order_info.order_create_time ? -1 : 1
                        })
                        .forEach(item => {
                            this.orderList.push(item.order_info)
                        })
                    if (cachedOrder) {
                        this.checkedId = JSON.parse(cachedOrder).id
                    } else {
                        this.checkedId = this.orderList[0].id
                    }
                }
                this.loaded = true
            })
    },
    methods: {
        check(id) {
            this.checkedId = id
        },
        submit() {
            if (this.checkedId) {
                sessionStorage.setItem('orderMsg', JSON.stringify(this.checked))
                this.$router.push({
                    path: '/hybrid/faq/complain',
                    query: this.$route.query
                })
            }
        }
    },
    head() {
        return {
            title: 'Orders'
        }
    }
}
</script>
<style lang="less" scoped>
body {
    background: #fff;
    height: 100%;
}

.order-contain {
    box-shadow: 0px 1px 3px 1px #dddddd;
    border-radius: 5px;
    width: 95%;
    margin: 1rem 2.5% 0 2.5%;
    background: #fff;
}

.clearfix:after {
    display: block;
    visibility: hidden;
    clear: both;
    height: 0;
    content: '';
}

.clearfix {
    zoom: 1;
}

.ok {
    width: 100%;
    text-align: center;
    border-top: 1px solid #eeeeee;
    padding: 1rem 0;
    background: #fff;
    height: 4.25rem;
    margin-top: 1.5rem;
    position: fixed;
    bottom: 0;
    button {
        margin: 0 auto;
        border: 1px solid #0087eb;
        border-radius: 2px;
        background: #fff;
        padding: 0.6rem;
        color: #0087eb;
        font-weight: bold;
        width: 60%;
        outline: none;
    }
}
</style>
