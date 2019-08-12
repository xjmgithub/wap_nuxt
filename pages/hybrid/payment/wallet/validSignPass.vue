<template>
    <div class="container">
        <div class="input-item">
            <div class="label">
                Enter sign in password
                <img v-show="isCiphertext==1" class="open-close" src="~assets/img/ic_hide_def_g.png" @click="isCiphertext=2" />
                <img v-show="isCiphertext==2" class="open-close" src="~assets/img/ic_show_def_g.png" @click="isCiphertext=1" />
            </div>
            <input v-model="password" :type="pwdType" />
        </div>
        <div class="footer">
            <mButton :disabled="password.length<6" @click="checkSignPass" text="NEXT" />
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
export default {
    layout: 'base',
    components: {
        mButton
    },
    data() {
        return {
            password: '',
            isCiphertext: 1
        }
    },
    computed: {
        pwdType() {
            return this.isCiphertext === 1 ? 'password' : 'text'
        }
    },
    methods: {
        checkSignPass(num) {
            // TODO check sigin
            this.$router.push({
                path: '/hybrid/payment/wallet/setPassword',
                query: {
                    channel: this.$route.query.channel,
                    payToken: this.$route.query.payToken
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    padding: 3rem 1rem;
    input {
        border: none;
        outline: none;
        border-bottom: #dddddd solid 1px;
        width: 100%;
        height: 2rem;
        line-height: 2rem;
    }
    .input-item {
        margin-top: 2rem;
    }
    .open-close {
        width: 1.5rem;
        height: 1.5rem;
        float: right;
    }
}
.footer {
    position: fixed;
    bottom: 3rem;
    width: 75%;
    margin: 0 auto;
    left: 0;
    right: 0;
    text-align: center;
}
</style>
