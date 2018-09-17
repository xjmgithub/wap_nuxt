<template>
    <div class="container">
        <verifyEmail></verifyEmail>
    </div>
</template>
<script>
import verifyEmail from '~/components/form/wallet_email_verify'
export default {
    layout: 'base',
    components: {
        verifyEmail
    }
}
</script>
<style lang="less" scoped>
.container {
    padding:3rem 1rem;
}
</style>