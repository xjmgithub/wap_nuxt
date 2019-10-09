<template>
    <div class="wrapper">
        <div class="success" v-show="result==1">
            <p class="redeem">
                Redeem Successful!
            </p>
            <p class="desc">
                You have successfully redeemed your voucher, you can now check your voucher in StarTimes ON app and start watching great contents!
            </p>
            <img class="st_logo" src="~assets/img/faq/ic_happy_sl_green.png" />
            <div class="btn">
                DOWNLOAD NOW
            </div>
        </div>
        <div class="fail" v-show="result==2">
            <p class="redeem">
                Redeem Failed!
            </p>
            <p class="desc">
                You have successfully redeemed your voucher, you can now check your voucher in StarTimes ON app and start watching great contents!
            </p>
            <img class="st_logo" src="~assets/img/faq/ic_disappoint_sl_red.png" />
            <div class="btn">
                RETRY
            </div>
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
            result: 2
        }
    },
    methods: {}
}
</script>
<style lang="less" scoped>
.wrapper {
    padding: 4rem 1rem 1rem;
    text-align: center;
    .redeem {
        color: #333333;
        font-size: 1.25rem;
        font-weight: bold;
        width: 100%;
    }
    .desc {
        color: #666666;
        font-size: 0.9rem;
        width: 85%;
        margin: 2rem auto;
    }
    .st_logo {
        width: 6rem;
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
