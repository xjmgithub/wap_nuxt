<template>
    <div class="wrapper">
        <serviceBlock v-for="(item,index) in serviceList" :key="index" :service="item"/>
    </div>
</template>
<script>
import serviceBlock from '~/components/faq/serviceBlock'
export default {
    layout: 'base',
    components: {
        serviceBlock
    },
    data: function() {
        return {
            serviceList: []
        }
    },
    mounted() {
        const entranceId = this.$route.query.entrance_id || ''
        this.$nextTick(() => this.$nuxt.$loading.start())
        this.$axios
            .get(`/ocs/v1/service/module/moreOrder?entranceId=${entranceId}`, {
                headers: {
                    'x-clientType': 1,
                    'x-appVersion': '5300'
                }
            })
            .then(res => {
                this.$nextTick(() => this.$nuxt.$loading.finish())
                if (res.data) {
                    this.serviceList = res.data.data.sort((a, b) => {
                        return a.order_info.order_create_time > b.order_info.order_create_time ? -1 : 1
                    })
                }
            })
    },
    head() {
        return {
            title: 'More Orders'
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    background: #fff;
    padding: 0.5rem;
}
</style>
