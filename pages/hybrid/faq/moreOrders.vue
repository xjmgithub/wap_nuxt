<template>
    <div>
        <div class="wrapper">
            <serviceBlock v-for="(item,index) in serviceList" :key="index" :service="item"/>
        </div>
        <loading v-show="loadStatus" />
    </div>
</template>
<script>
import serviceBlock from '~/components/faq/serviceBlock'
import loading from '~/components/loading'
export default {
    layout: 'base',
    data: function() {
        return {
            serviceList: [],
            loadStatus: true
        }
    },
    components: {
        serviceBlock,
        loading
    },
    mounted() {
        let entranceId = this.$route.query.entrance_id || ''
        this.$axios
            .get(`/ocs/v1/service/module/moreOrder?entranceId=${entranceId}`, {
                headers: {
                    'x-clientType': 1,
                    'x-appVersion': '5300'
                }
            })
            .then(res => {
                this.loadStatus = false
                if (res.data) {
                    this.serviceList = res.data.data
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
