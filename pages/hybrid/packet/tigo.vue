<template>
    <div class="wrapper">
        <div class="by_tel">
            <verifyTigo ref="telpicker" :prefix="phonePrefix" :input_label="input_label" />
        </div>
        <div class="footer">
            <mButton :disabled="false" :text="'OK'" @click="nextStep" />
        </div>
    </div>
</template>
<script>
import verifyTigo from '~/components/form/verify_tigo'
import mButton from '~/components/button'
export default {
    layout: 'base',
    components: {
        verifyTigo,
        mButton
    },
    data() {
        return {
            phonePrefix: '255 0',
            input_label: 'Input phone number to continue'
        }
    },
    mounted() {
        this.$axios
            .get('/ums/v1/user/carrier')
            .then(res => {
                if (res.data && res.data.data && res.data.data.phoneNumber) {
                    this.$refs.telpicker.setTel(res.data.data.phoneNumber)
                    this.sendEvLog({
                        category: 'flow_packet',
                        action: 'tigo_packet_show',
                        label: res.data.data.phoneNumber,
                        value: 1
                    })
                } else {
                    this.sendEvLog({
                        category: 'flow_packet',
                        action: 'tigo_packet_show',
                        label: 'none',
                        value: 1
                    })
                }
            })
            .catch(() => {
                this.sendEvLog({
                    category: 'flow_packet',
                    action: 'tigo_packet_show',
                    label: 'none',
                    value: 1
                })
            })
    },
    methods: {
        nextStep() {
            const phone = this.$refs.telpicker.tel
            this.sendEvLog({
                category: 'flow_packet',
                action: 'tigo_packet_submit',
                label: phone,
                value: 1
            })
            if (phone.length < 9) {
                this.$refs.telpicker.show_error = true
                this.$refs.telpicker.error_tel = 'Must be 9 digits'
            } else {
                window.location.href = 'http://www.tigosports.co.tz/Home/Home?MSISDN=255' + phone + '&ConsumerName=Startimes'
            }
        }
    },
    head() {
        return {
            title: 'Tigo'
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    padding: 1rem 0.8rem;
    .by_tel {
        padding-top: 5rem;
    }
    .footer {
        position: fixed;
        bottom: 2rem;
        width: 75%;
        margin: 0 auto;
        left: 0;
        right: 0;
    }
}
</style>
