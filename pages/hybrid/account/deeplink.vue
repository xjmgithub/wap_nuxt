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
            <input v-model="code" type="text" readonly>
        </div>
        <div class="btn" @click="redeemVoucher">
            REDEEM VOUCHER
        </div>
        <div class="sign-out" @click="signOut">
            Sign Out
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            vcode: decodeURIComponent(this.$route.query.vcode),
            code: ''
        }
    },
    mounted() {
        this.code = this.vcode.substring(0, this.vcode.indexOf('@'))
    },
    methods: {
        redeemVoucher() {
            const index = this.vcode.indexOf('@')
            const ciphertext = encodeURIComponent(this.vcode.substring(index + 1)).replace(/%20/g, '%2B')
            this.$axios.post(`/promotion-coupon/v1/short-link/addPromotion?code=${this.code}&ciphertext=${ciphertext}`).then(res => {
                if (res.data.code === 0) {
                    this.$router.push('/hybrid/account/deeplinkResult')
                } else if (res.data.code > 0 && res.data.code <= 4) {
                    this.$router.push('/hybrid/account/deeplinkResult?result=' + res.data.code)
                } else {
                    this.$alert(res.data.message)
                }
            })
        },
        signOut() {
            document.cookie.split(';').forEach(function(c) {
                document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
            })
            localStorage.clear()
            window.location.href = '/hybrid/account/signIn?pre=' + decodeURIComponent(sessionStorage.getItem('login_prefer'))
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    padding: 3.5rem 1rem 1rem;
    text-align: center;
    .st_logo {
        width: 55%;
        margin-bottom: 0.5rem;
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
        margin: 2.4rem auto;
        border: 1px solid #999999;
        border-radius: 2px;
        input {
            width: 100%;
            color: #666666;
            font-size: 1.2rem;
            font-weight: bold;
            text-align: center;
            background: #eeeeee;
            outline: none;
            border: none;
            height: 2.5rem;
            line-height: 2.5rem;
        }
    }
    .btn {
        width: 85%;
        margin: 2rem auto;
        text-align: center;
        color: #ffffff;
        font-weight: bold;
        background: #0087eb;
        height: 2.5rem;
        line-height: 2.5rem;
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
