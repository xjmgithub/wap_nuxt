<template>
    <div>
        <mheader @redirect="goToPage"/>
        <nuxt/>
    </div>
</template>

<script>
import mheader from '~/components/header.vue'
export default {
    components: {
        mheader
    },
    methods:{
        goToPage(url){
            switch(url){
                case 'home':
                    this.$router.push('/browser')
                    break;
                case 'menu':
                    this.$router.push('/browser/menu')
                    break;
                case 'tvguide':
                    this.$router.push('/browser/tvguide')
                    break;
                case 'phoneplay':
                    this.$router.push('/browser/phoneplay')
                    break;
            }
        }
    },
    created(){
        this.$axios.setHeader('token', this.$store.state.token)
    }
}
</script>

<style scoped>
html,
body {
    padding: 0;
    margin: 0;
}

</style>
