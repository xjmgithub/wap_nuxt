<template>
    <div class="container">
        <verifyTel prefix="234"></verifyTel>
    </div>
</template>
<script>
import verifyTel from '~/components/form/wallet_tel_verify'
export default {
    layout: 'base',
    components: {
        verifyTel
    }
}
</script>
<style lang="less" scoped>
.container {
    padding:3rem 1rem;
}
</style>