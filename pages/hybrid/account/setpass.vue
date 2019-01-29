<template>
    <div class="wrapper">
        <div class="input-item">
            <div class="label">
                Create a Password
                <img
                    class="open-close"
                    src="~assets/img/ic_hide_def_g.png"
                    v-if="isCiphertext==1"
                    alt
                    @click="isCiphertext=2"
                >
                <img
                    class="open-close"
                    src="~assets/img/ic_show_def_g.png"
                    v-if="isCiphertext==2"
                    alt
                    @click="isCiphertext=1"
                >
            </div>
            <input
                :type="pwdType"
                v-model="pass"
                placeholder="Password(6-18 digits or letters)"
                @blur="checkpass"
            >
        </div>
        <div class="input-item">
            <div class="label">
                Confirm New Password
                <img
                    class="open-close"
                    src="~assets/img/ic_hide_def_g.png"
                    v-if="isCiphertext_confirm==1"
                    alt
                    @click="isCiphertext_confirm=2"
                >
                <img
                    class="open-close"
                    src="~assets/img/ic_show_def_g.png"
                    v-if="isCiphertext_confirm==2"
                    alt
                    @click="isCiphertext_confirm=1"
                >
            </div>
            <input
                :type="pwdType_confirm"
                placeholder="Password(6-18 digits or letters)"
                v-model="repass"
                @blur="checkpass"
            >
        </div>
        <div class="input-item invite">
            <div class="label">Invitation Code(Optional)</div>
            <input type="text" v-model="inviteCode" @blur="checkpass">
        </div>
        <div class="footer">
            <mButton :disabled="disabled" :text="'NEXT'" @click="nextStep"/>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import qs from 'qs'
import { setCookie, initUser } from '~/functions/utils'
export default {
    layout: 'base',
    data() {
        return {
            countryId: this.$route.query.countryId || '',
            phone: this.$route.query.phone || '',
            phoneCc: this.$route.query.phoneCc || '',
            verifyCode: this.$route.query.code || '',
            email: this.$route.query.email || '',
            pass: '',
            repass: '',
            inviteCode: '',
            isCiphertext: 1,
            isCiphertext_confirm: 1,
            disabled: true
        }
    },
    methods: {
        checkpass() {
            // TODO 格式化
        },
        nextStep() {
            // TODO 校验

            let options = {
                verifyCode: this.verifyCode,
                pwd: this.pass,
                invitedId: this.inviteCode,
                invitedChannel:0,
                deviceId:this.$store.state.deviceId,
                countryId:2
            }
            if (this.phone) {
                options.phoneCc = this.phoneCc
                options.phone = this.phone
                options.countryId = this.countryId
                options.type = 10
            } else {
                options.email = this.email
                options.type = 0
            }

            this.$axios.post('/ums/v3/register', options).then(res => {
                if (res.data.code == 0) {
                    let params = {}
                    if (this.phone) {
                        params = {
                            applicationId: 2,
                            phoneCc: this.phoneCc,
                            phone: this.phone,
                            pwd: this.pass,
                            deviceId: this.$store.state.deviceId,
                            type: 10
                        }
                    } else {
                        params = {
                            applicationId: 2,
                            deviceId: this.$store.state.deviceId,
                            type: 0,
                            email: this.email,
                            pwd: this.pass
                        }
                    }

                    this.$axios.post('/ums/v1/user/login', params).then(res => {
                        if (res.data.code == 0) {
                            this.$store.commit('SET_TOKEN', res.data.data.token)
                            this.$store.commit('SET_USER', res.data.data)
                            setCookie('token', res.data.data.token)
                            window.localStorage.setItem('user', JSON.stringify(res.data.data))
                            let pre = sessionStorage.getItem('login_prefer') || ''
                            if (this.pre) {
                                window.location.href = this.pre
                            } else {
                                this.$router.replace('/browser')
                            }
                        } else {
                            this.$alert(res.data.message)
                        }
                    })
                } else {
                    this.error_code = 'This code you entered is incorrect. Please try again.'
                }
            })
        }
    },
    components: {
        mButton
    },
    computed: {
        pwdType() {
            return this.isCiphertext == 1 ? 'password' : 'text'
        },
        pwdType_confirm() {
            return this.isCiphertext_confirm == 1 ? 'password' : 'text'
        }
    },
    watch: {
        pass: function(val, oldVal) {
            if (/^[a-zA-Z0-9]{6,18}$/.test(val) && val == this.repass) {
                this.disabled = false
            } else {
                this.disabled = true
            }
        },
        repass: function(val, oldVal) {
            if (/^[a-zA-Z0-9]{6,18}$/.test(val) && val == this.pass) {
                this.disabled = false
            } else {
                this.disabled = true
            }
        }
    }
}
</script>
<style scoped>
.wrapper {
    padding: 3rem 1rem;
}
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
.label {
    font-size: 0.8rem;
}
.open-close {
    width: 1.5rem;
    height: 1.5rem;
    float: right;
}
.footer {
    position: fixed;
    bottom: 2rem;
    width: 75%;
    margin: 0 auto;
    left: 0;
    right: 0;
}
</style>
