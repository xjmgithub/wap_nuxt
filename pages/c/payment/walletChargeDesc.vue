<template>
    <div class="container">
        <h3>Recharge by {{name}}</h3>
        <h4 class="description">Description</h4>
        <div class="desc">
            {{desc}}
        </div>
        <div class="footer">
            <mButton :disabled="false" :text="'NEXT'" @click="nextStep"></mButton>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
export default {
    data() {
        return {
            name: '',
            desc: '',
            code: ''
        }
    },
    layout: 'base',
    components: {
        mButton
    },
    mounted() {
        let channelInfo = JSON.parse(
            window.sessionStorage.getItem('wallet_charge_channel')
        )
        this.name = channelInfo.value
        this.desc = channelInfo.desc
        this.code = channelInfo.code
    },
    // beforeDestroy() {
    //     window.sessionStorage.removeItem('wallet_charge_channel')
    // },
    methods: {
        nextStep() {
            console.log(123)
        }
    }
}
</script>
<style scoped>
.container {
    padding: 5rem 1rem 0;
    font-size: 0.9rem;
    color: #333;
}
.container h3 {
    text-align: center;
    font-weight: bold;
    font-size: 1.25rem;
}
.container h4 {
    font-weight: bold;
    padding: 1rem 0;
    margin-top: 0.5rem;
    font-size: 1.125rem;
    border-bottom: 1px solid #e0e0e0;
}
.container ul {
    padding-top: 1rem;
    font-size: 0.9rem;
    color: #666;
}
.container ul li {
    height: 1.5rem;
}
.container li span {
    font-size: 1rem;
    color: #333;
    font-weight: 600;
}
.desc{
    padding:1rem;
}
.footer {
    position: fixed;
    bottom: 2rem;
    width: 16rem;
    margin: 0 auto;
    left: 0;
    right: 0;
}

</style>