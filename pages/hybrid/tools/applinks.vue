<template>
    <div>
        <a :href="link">点击</a>
        <a :href="ioslink">点击scheme唤醒</a>
    </div>
</template>
<script>
import { Base64 } from 'js-base64'
export default {
    layout: 'base',
    data() {
        return {
            link: this.$route.query.link,
            ioslink: 'startimes://?target=' + Base64.encode('startimes://player?vodId=59072')
        }
    }
}
</script>
