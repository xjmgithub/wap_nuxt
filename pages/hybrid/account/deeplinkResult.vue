<template>
    <div class="wrapper">
        <div v-show="result==0" class="success">
            <p class="redeem">
                {{$store.state.lang.redeem_success_title}}
            </p>
            <p class="desc">
                {{$store.state.lang.redeem_success_content}}
            </p>
            <img class="st_logo" src="~assets/img/users/ic_success_def.png" />
            <div class="btn" @click="download">
                {{$store.state.lang.deeplink_download_now}}
            </div>
        </div>
        <div v-show="result>0&&result<=4" class="fail">
            <p class="redeem">
                {{$store.state.lang.redeem_fail_title}}
            </p>
            <p class="desc">
                {{failMessage}}
            </p>
            <img class="st_logo" src="~assets/img/users/ic_failed_def.png" />
            <div class="btn" @click="retry">
                {{$store.state.lang.retry_button}}
            </div>
        </div>
        <div class="sign-out" @click="signOut">
            {{$store.state.lang.sign_out}}
        </div>
    </div>
</template>
<script>
import { callApp, downApk } from '~/functions/app'
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
                tmp = this.$store.state.lang.redeem_fail_encrp
            } else if (this.result == 2) {
                tmp = this.$store.state.lang.redeem_fail_redeemed
            } else if (this.result == 3) {
                tmp = this.$store.state.lang.redeem_fail_failed
            } else if (this.result == 4) {
                tmp = this.$store.state.lang.redeem_fail_used
            } else if (this.result == 5) {
                tmp = this.$store.state.lang.redeem_fail_invalidcode
            }
            return tmp
        }
    },
    mounted() {
        this.sendEvLog({
            category: 'deeplink_result',
            action: 'page_show',
            label: this.result > 0 ? 'fail' : 'success',
            value: 1
        })
    },
    methods: {
        download() {
            this.sendEvLog({
                category: 'deeplink_result',
                action: 'download_click',
                label: 'success',
                value: 1
            })
            callApp.call(this, '', () => {
                this.$confirm(
                    this.$store.state.lang.vote_downloadtips,
                    () => {
                        this.sendEvLog({
                            category: 'deeplink_result',
                            action: 'download_popup',
                            label: 'success',
                            value: 1
                        })
                        downApk.call(this)
                    },
                    () => {},
                    this.$store.state.lang.deeplink_download_now,
                    this.$store.state.lang.vote_cancel
                )
            })
        },
        retry() {
            this.sendEvLog({
                category: 'deeplink_result',
                action: 'retry_click',
                label: 'fail',
                value: 1
            })
            this.$router.go(-1)
        },
        signOut() {
            const path = window.location.pathname + window.location.search
            document.cookie.split(';').forEach(function(c) {
                document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
            })
            localStorage.clear()
            window.location.href = '/hybrid/account/signIn?pre=' + encodeURIComponent(path)
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
