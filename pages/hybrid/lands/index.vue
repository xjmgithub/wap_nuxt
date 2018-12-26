<template>
    <div id="wrapper">test</div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {}
    },
    mounted() {
        var timeout
        var t = Date.now()
        var interval = 2000
        timeout && clearTimeout(timeout)
        timeout = setTimeout(function() {
            if (Date.now() - t < interval + 800) {
                location.href = 'http://www.baidu.com'
            }
        }, interval)

        var iframe = document.createElement('iframe')
        iframe.setAttribute('src', 'starvideo://platformapi/webtoapp')
        iframe.setAttribute('style', 'display:none')
        document.body.appendChild(iframe)
        setTimeout(function() {
            document.body.removeChild(iframe)
        }, 200)
    },
    head() {
        return {
            title: 'landingpage'
        }
    }
}
</script>
