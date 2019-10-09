<template>
    <div class="wrapper">
        <img class="st_logo" src="~assets/img/ic_upgrade_icon.png" />
        <p class="redeem">
            Redeem your StarTimes voucher
        </p>
        <p class="desc">
            Please enter your voucher code to redeem the voucher into your StarTimes account.
        </p>
        <div class="input">
            <input type="text" v-model="code">
        </div>
        <div class="btn">
            REDEEM VOUCHER
        </div>
        <div class="sign-out">
            Sign Out
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            pre: this.$route.query.pre,
            code: 'V123456789012345'
        }
    },
    mounted() {
        if (this.pre) {
            sessionStorage.setItem('login_prefer', this.pre)
        }
    },
    methods: {}
}
</script>
<style lang="less" scoped>
.wrapper {
    padding: 3.5rem 1rem 1rem;
    text-align: center;
    .st_logo {
        width: 65%;
    }
    .redeem {
        color: #333333;
        font-size: 1.2rem;
        font-weight: bold;
        margin: 2rem auto;
        width: 100%;
    }
    .desc {
        color: #666666;
        font-size: 0.8rem;
        width: 85%;
        margin: 0 auto;
    }
    .input {
        width: 85%;
        margin: 2rem auto;
        border: 1px solid #999999;
        border-radius: 2px;
        input {
            width: 100%;
            color: #666666;
            font-size: 1.2rem;
            font-weight: bold;
            text-align: center;
            background: #eeeeee;
            padding: 0.5rem 0;
            outline: none;
            border: none;
        }
    }
    .btn {
        width: 85%;
        margin: 2rem auto;
        text-align: center;
        color: #ffffff;
        font-weight: bold;
        background: #0087eb;
        padding: 0.7rem 0;
    }
    .sign-out {
        position: fixed;
        bottom: 1rem;
        width: 50%;
        text-align: center;
        color: #0087eb;
        text-decoration: underline;
        font-size: 0.9rem;
        left: 50%;
        margin-left: -25%;
    }
}
</style>
