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
        let config = JSON.parse(window.localStorage.getItem('wallet_config'))
        let phoneIsSet = config.phone
        let emailIsSet = config.email
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
                if (phoneIsSet == 'false') {
                    this.$router.replace('/c/payment/wallet/validPhone')
                }
            } else {
                if (emailIsSet == 'false') {
                    this.$router.replace('/c/payment/wallet/validEmail')
                }
            }
        })
    },
    components: {
        loading
    }
}
</script>