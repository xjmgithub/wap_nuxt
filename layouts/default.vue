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
                    console.log(url)
                    break;
                case 'menu':
                    break;
                case 'tvguide':
                    break;
                case 'phoneplay':
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
