<template>
    <div class="container">
        <verifyTel ref="phone" :disabled="reset" :title="title" :prefix="prefix" @canNext="canStep1=true" />
        <!-- TODO SETPASSWORD -->
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            loadStatus: true
        }
    },
    mounted() {
        this.$axios
            .get('/vup/v1/ums/user/area', {
                headers: {
                    versionCode: '5300',
                    clientType: 'android'
                }
            })
            .then(res => {
                const configs = res.data && res.data.appFBConfigs
                let type = true
                configs.forEach(item => {
                    if (item.functionBlockType === 91) {
                        if (item.validType === 2) {
                            type = true
                        } else {
                            type = false
                        }
                    }
                })
                if (type === true) {
                    this.$router.replace('/hybrid/payment/wallet/validPhone?init=true')
                } else {
                    this.$router.replace('/hybrid/payment/wallet/validEmail?init=true')
                }
            })
    }
}
</script>
