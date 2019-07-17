<template>
    <div class="wrapper" />
</template>
<script>
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



        const iframe = document.createElement('iframe')
        iframe.frameborder = '0'
        iframe.style.cssText = 'display:none;border:0;width:0;height:0;'
        document.body.appendChild(iframe)

        iframe.src = `starba://${path}`

        const s = setTimeout(() => {
            clearTimeout(s)
        }, 2000)
        document.addEventListener('visibilitychange', () => {
            clearTimeout(s)
            this.$nuxt.$loading.finish()
        })
    },
    head() {
        return {
            title: 'StarTimes APP'
        }
    }
}
</script>

