<template>
    <div @click="logout">logout</div>
</template>
<script>
export default {
    layout: 'base',
    methods: {
        logout() {
            document.cookie.split(';').forEach(function(c) {
                document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
            })
            localStorage.clear()
            alert('logout success')
        }
    }
}
</script>