<template>
    <div class="workshop">
        <codeNum></codeNum>
        <password placeholder="sdfas"></password>
    </div>
</template>
<script>
import codeNum from '~/components/codeNum'
import password from '~/components/password'
export default {
    layout: 'base',
    components: {
        codeNum,
        password
    },
    data() {
        return {}
    }
}
</script>
<style scoped>
.workshop {
    padding: 1rem;
}
</style>
