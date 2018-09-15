<template>
    <div class="container">
        <loading v-show="loadStatus"></loading>
    </div>
</template>
<script>
import loading from '~/components/loading'
export default {
    layout: 'base',
    data() {
        return {
            loadStatus: true
        }
    },
    mounted() {
        let phoneIsSet = window.sessionStorage.getItem('wallet_phone')
        let emailIsSet = window.sessionStorage.getItem('wallet_email')
        this.$axios.setHeader('clientType', 'android')
        this.$axios.setHeader('versionCode', '5300')
        this.$axios.get('/vup/v1/ums/user/area', {}).then(res => {
            let configs = res.data && res.data.appFBConfigs
            let type = true
            configs.forEach(item => {
                if (item.functionBlockType == 91) {
                    if (item.validType == 2) {
                        type = true
                    } else {
                        type = false
                    }
                }
            })

            if (type == true) {
                if (!phoneIsSet) {
                    this.$router.replace('/c/payment/wallet/valid_phone_s1')
                }
            } else {
                if (!emailIsSet) {
                    this.$router.replace('/c/payment/wallet/valid_email')
                }
            }
        })
    },
    components: {
        loading
    }
}
</script>