<template>
    <div class="container">
        <loading v-show="loadStatus"/>
        <!-- TODO SETPASSWORD -->
    </div>
</template>
<script>
import loading from '~/components/loading'
export default {
    layout: 'base',
    components: {
        loading
    },
    data() {
        return {
            loadStatus: true
        }
    },
    mounted() {
        let config = JSON.parse(window.localStorage.getItem('wallet_config'))
        let phoneIsSet = config.phone
        let emailIsSet = config.email
        this.$axios
            .get('/vup/v1/ums/user/area', {
                headers: {
                    versionCode: '5300',
                    clientType: 'android'
                }
            })
            .then(res => {
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
                    // if (phoneIsSet == 'false') {
                    this.$router.replace('/hybrid/payment/wallet/validPhone?init=true')
                    // }
                } else {
                    // if (emailIsSet == 'false') {
                    this.$router.replace('/hybrid/payment/wallet/validEmail?init=true')
                    // }
                }
            })
    }
}
</script>
