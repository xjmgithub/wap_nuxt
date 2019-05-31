<template>
    <div class="wrapper"/>
</template>
<script>
import CallApp from 'callapp-lib'
import { Base64 } from 'js-base64'
export default {
    layout: 'base',
    data() {
        return {
            langType: this.$store.state.langType,
            appType: 0
        }
    },
    mounted() {
        const scheme = 'starba'
        let path = 'platformapi/webtoapp'

        if (this.$route.query.target) {
            let target = this.$route.query.target
            for (const i in this.$route.query) {
                if (i != 'target') {
                    target.indexOf('?') > 0
                        ? (target = target + '&' + i + '=' + this.$route.query[i])
                        : (target = target + '?' + i + '=' + this.$route.query[i])
                }
            }
            path = path + '?target=' + Base64.encode(target.replace(/&/g, '**'))
        }

        const callLib = new CallApp({
            scheme: {
                protocol: scheme
            }
        })
        callLib.open({
            path: path,
            callback() {
                console.log('唤醒失败')
            }
        })
    },
    head() {
        return {
            title: 'StarTimes APP'
        }
    }
}
</script>

