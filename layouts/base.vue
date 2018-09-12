<template>
<div>
    <nuxt/>
    <alert ref="alert"></alert>
    <confirm ref="confirm"></confirm>
    <shadowLayer v-show="layer"></shadowLayer>
</div>
</template>
<script>
import Vue from 'vue'
import alert from '~/components/alert'
import confirm from '~/components/confirm'
import shadowLayer from '~/components/shadow-layer'
export default {
    components: {
        alert,
        confirm,
        shadowLayer
    },
    computed: {
        layer() {
            return this.$store.state.shadowStatus
        }
    },
    created() {
        let _this = this
        Vue.prototype.$alert = (msg, callback) => {
            _this.$refs.alert.show(msg, callback)
        }
        Vue.prototype.$confirm = (msg, callback) => {
            _this.$refs.confirm.show(msg, callback)
        }
    }
}
</script>
<style>
@import '~/assets/css/normalize.css';
html,
body {
    margin: 0px;
    padding: 0px;
    min-height: 100%;
}
</style>