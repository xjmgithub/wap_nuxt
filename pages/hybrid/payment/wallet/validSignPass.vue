<template>
    <div class="container">
        <div class="input-item" :class="{error:error_password}">
            <div class="label">
                {{$store.state.lang.enter_signin_pass}}
                <img v-show="isCiphertext==1" class="open-close" src="~assets/img/ic_hide_def_g.png" @click="isCiphertext=2" />
                <img v-show="isCiphertext==2" class="open-close" src="~assets/img/ic_show_def_g.png" @click="isCiphertext=1" />
            </div>
            <input v-model="password" :type="pwdType" />
            <div class="error-text">{{error_password}}</div>
            <div class="forget-pass">
                <a href="javascript:void(0)" @click="resetPass">{{$store.state.lang.fotget_signin_pass}}</a>
            </div>
        </div>
        <div class="footer">
            <mButton :disabled="password.length<6" :text="$store.state.lang.text_onair_next" @click="checkSignPass" />
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import countrys from '~/functions/countrys.json'
import { setCookie } from '~/functions/utils'
export default {
    layout: 'base',
    components: {
        mButton
    },
    data() {
        return {
            password: '',
            isCiphertext: 1,
            error_password: '',
            merchantAppId: ''
        }
    },
    computed: {
        pwdType() {
            return this.isCiphertext === 1 ? 'password' : 'text'
        }
    },
    watch: {
        password(nv, ov) {
            this.error_password = ''
        }
    },
    mounted() {
        const sessionAppId = sessionStorage.getItem('merchantAppId')
        if (!this.merchantAppId && sessionAppId) this.merchantAppId = sessionAppId
        this.sendEvLog({
            category: 'set_password',
            action: 'valid_signin_show',
            label: 1,
            value: 1,
            merchant_app_id: this.merchantAppId,
            data_source: 2
        })
    },
    methods: {
        resetPass() {
            sessionStorage.setItem('set_pass_pre', '/hybrid/payment/wallet/validSignPass')
            this.$router.push('/hybrid/account/resetpass')
        },
        checkSignPass(num) {
            this.sendEvLog({
                category: 'set_password',
                action: 'valid_signin_next_click',
                label: 1,
                value: 1,
                merchant_app_id: this.merchantAppId,
                data_source: 2
            })
            // TODO check sigin
            const user = this.$store.state.user
            let opt = {}
            // 处理用户信息
            if (user.type == 'Tenbre') {
                opt = {
                    applicationId: 2,
                    deviceId: this.$store.state.deviceId,
                    type: '0',
                    email: user.userName,
                    pwd: this.password
                }
            } else {
                let pre = ''
                let phone = ''
                countrys.forEach(item => {
                    if (item.phonePrefix && user.userName.indexOf(item.phonePrefix) == 0) {
                        pre = item.phonePrefix
                        phone = user.userName.substr(item.phonePrefix.length)
                    }
                })

                opt = {
                    applicationId: 2,
                    phoneCc: pre,
                    phone: phone,
                    pwd: this.password,
                    deviceId: this.$store.state.deviceId,
                    type: 10
                }
            }

            this.$axios
                .post('/ums/v3/user/login', opt)
                .then(res => {
                    if (res.data.code == 0) {
                        this.$store.commit('SET_TOKEN', res.data.data.token)
                        setCookie('token', res.data.data.token)
                        this.$router.push('/hybrid/payment/wallet/setPassword')
                    } else {
                        this.error_password = this.$store.state.lang.password_error
                    }
                })
                .catch(() => {
                    this.error_password = this.$store.state.lang.password_error
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
    .error {
        input {
            border-bottom: red solid 1px;
        }
        .error-text {
            color: red;
            line-height: 1.5rem;
        }
    }
    .forget-pass {
        text-decoration: underline;
        color: #0087eb;
        text-align: right;
        line-height: 2rem;
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
