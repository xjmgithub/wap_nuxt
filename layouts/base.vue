<template>
    <div>
        <loading/>
        <nuxt style="z-index:2;position:absolute;" />
        <alert ref="alert"/>
        <confirm ref="confirm"/>
        <shadowLayer v-show="layer"/>
    </div>
</template>
<script>
import Vue from 'vue'
import alert from '~/components/alert'
import confirm from '~/components/confirm'
import shadowLayer from '~/components/shadow-layer'
import loading from '~/components/loading'
export default {
    components: {
        alert,
        confirm,
        shadowLayer,
        loading
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
            this.$store.commit('SHOW_SHADOW_LAYER')
        }
        Vue.prototype.$confirm = (msg, callback, cancel, yes, no) => {
            _this.$refs.confirm.show(msg, callback, cancel, yes, no)
            this.$store.commit('SHOW_SHADOW_LAYER')
        }
        this.$axios.setHeader('token', this.$store.state.token)
        // this.$axios.setHeader('timeout', 2000)
    }
}
</script>
<style lang="less">
@font-face {
    font-family: Roboto;
    src: url('~assets/fonts/Roboto-Regular.ttf');
    font-style: 'normal';
}
html,
body {
    margin: 0px;
    padding: 0px;
    height: 100%;
    overflow-y: auto;
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
#wrapper{
    min-height: 100%;
}
</style>
