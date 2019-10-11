<template>
    <div class="wrapper">
        <div v-show="result==0" class="success">
            <p class="redeem">
                Redeem Successful!
            </p>
            <p class="desc">
                You have successfully redeemed your voucher, you can now check your voucher in StarTimes ON app and start watching great contents!
            </p>
            <img class="st_logo" src="~assets/img/users/ic_success_def.png" />
            <div class="btn" @click="download">
                DOWNLOAD NOW
            </div>
        </div>
        <div v-show="result>0&&result<=4" class="fail">
            <p class="redeem">
                Redeem Failed!
            </p>
            <p class="desc">
                {{failMessage}}
            </p>
            <img class="st_logo" src="~assets/img/users/ic_failed_def.png" />
            <div class="btn" @click="retry">
                RETRY
            </div>
        </div>
        <div class="sign-out" @click="signOut">
            Sign Out
        </div>
    </div>
</template>
<script>
import { invokeByIframe, downApk } from '~/functions/app'
export default {
    layout: 'base',
    data() {
        return {
            result: this.$route.query.result || 0
        }
    },
    computed: {
        failMessage() {
            let tmp = ''
            if (this.result === 0) return tmp
            if (this.result == 1) {
                tmp = 'The code is different from ciphertext'
            } else if (this.result == 2) {
                tmp = 'You have redeemed this batch of coupon, please use another account to redeem'
            } else if (this.result == 3) {
                tmp = 'Coupon conversion failure'
            } else if (this.result == 4) {
                tmp = 'The activation code has been redeemed'
            }
            return tmp
        }
    },
    methods: {
        download() {
            invokeByIframe.call(this, 'com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.href, () => {
                this.$confirm(
                    'Download StarTimes ON app',
                    () => {
                        downApk.call(this)
                    },
                    () => {},
                    'Download',
                    'Cancel'
                )
            })
        },
        retry() {
            this.$router.go(-1)
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
    padding: 4rem 1rem 1rem;
    text-align: center;
    .redeem {
        color: #333333;
        font-size: 1.5rem;
        font-weight: bold;
        width: 100%;
    }
    .desc {
        color: #666666;
        width: 85%;
        margin: 1.5rem auto 2rem;
        font-size: 0.9rem;
    }
    .st_logo {
        width: 5rem;
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
