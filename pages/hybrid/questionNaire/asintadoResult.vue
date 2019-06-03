<template>
    <div id="result">
        <div class="container">
            <div class="share" @click="toShare()">
                <img src="~assets/img/naire/ic_share_def_g.png"> SHARE TO MY FRIENDS
            </div>
        </div>
    </div>
</template>
<script>
import asintado from '~/functions/asintado'
export default {
    layout: 'base',
    data() {
        return {
            userGender: this.$route.query.userGender,
            result:[]
        }
    },
    mounted(){
        const tmp = asintado()
        const data = tmp[this.userGender]
        console.log(data)
    },
    methods: {
        toShare() {}
    },
    head() {
        return {
            title: 'Characteristic Test Result'
        }
    }
}
</script>
<style>
html {
    background: linear-gradient(180deg, rgba(85, 85, 85, 1) 0%, rgba(201, 183, 166, 1) 100%);
}
</style>
<style lang="less" scoped>
#result {
    .container {
        width: 95%;
        margin: 0 2.5%;
        text-align: center;
    }
    .share {
        display: inline-block;
        padding: 0 1rem;
        color: #63428a;
        font-size: 0.95rem;
        vertical-align: middle;
        background: linear-gradient(180deg, rgba(235, 202, 77, 1) 0%, rgba(235, 200, 112, 1) 34%, rgba(188, 147, 43, 1) 100%);
        border-radius: 20px;
        font-weight: bold;
        margin-top: 1rem;
        height: 2.5rem;
        line-height: 2.5rem;
        img {
            width: 1.5rem;
        }
    }
}
</style>
