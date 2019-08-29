<template>
    <div class="wrapper">
        <div class="input-item">
            <div class="label">
                <img v-if="isCiphertext==1" class="open-close" src="~assets/img/ic_hide_def_g.png" alt @click="isCiphertext=2" />
                <img v-if="isCiphertext==2" class="open-close" src="~assets/img/ic_show_def_g.png" alt @click="isCiphertext=1" />
            </div>
            <div class="tag" :class="{focus:focus_ps,error:error_ps}">{{$store.state.lang.register_input_enter_password_tip}}</div>
            <input
                v-model="pass"
                :class="{focus:focus_ps,error:error_ps}"
                :type="pwdType"
                :placeholder="focus_ps?'':enter_ps"
                @focus="focusPass"
                @blur="checkPass"
            />
            <div v-if="error_ps" class="error-tip">{{error_ps}}</div>
        </div>
        <div class="input-item">
            <div class="label">
                <img v-if="isCiphertext_confirm==1" class="open-close" src="~assets/img/ic_hide_def_g.png" alt @click="isCiphertext_confirm=2" />
                <img v-if="isCiphertext_confirm==2" class="open-close" src="~assets/img/ic_show_def_g.png" alt @click="isCiphertext_confirm=1" />
            </div>
            <div class="tag" :class="{focus:focus_reps,error:error_reps}">{{$store.state.lang.register_input_enter_password_again_tip}}</div>
            <input
                v-model="repass"
                :class="{focus:focus_reps,error:error_reps}"
                :type="pwdType_confirm"
                :placeholder="focus_reps?'':enter_reps"
                @focus="focusRepass"
                @blur="checkRepass"
            />
            <div v-if="error_reps" class="error-tip">{{error_reps}}</div>
        </div>
        <div class="footer">
            <mButton :disabled="!abled" :text="next" @click="nextStep" />
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import { login } from '~/functions/utils'
export default {
    layout: 'base',
    components: {
        mButton
    },
    data() {
        return {
            phone: this.$route.query.phone || '',
            phoneCc: this.$route.query.phoneCc || '',
            verifyCode: this.$route.query.code || '',
            email: this.$route.query.email || '',
            pass: '',
            repass: '',
            inviteCode: '',
            isCiphertext: 1,
            isCiphertext_confirm: 1,
            abled: false,
            focus_ps: false,
            focus_reps: false,
            error_ps: '',
            error_reps: '',
            enter_ps: this.$store.state.lang.register_input_enter_password,
            enter_reps: this.$store.state.lang.register_input_enter_password_again,
            next: this.$store.state.lang.text_onair_next,
            error_setpass: this.$store.state.lang.error_setpass,
            error_setrepass: this.$store.state.lang.error_setrepass
        }
    },
    computed: {
        pwdType() {
            return this.isCiphertext === 1 ? 'password' : 'text'
        },
        pwdType_confirm() {
            return this.isCiphertext_confirm === 1 ? 'password' : 'text'
        }
    },
    watch: {
        pass(nv, ov) {
            this.abled = false
            this.error_ps = ''
            this.error_reps = ''
            if (nv == this.repass && /^[a-zA-Z0-9]{6,18}$/.test(nv)) {
                this.abled = true
            } else if (!/^[a-zA-Z0-9]{6,18}$/.test(nv)) {
                this.abled = false
            } else {
                this.abled = false
            }
        },
        repass(nv, ov) {
            this.abled = false
            this.error_ps = ''
            this.error_reps = ''
            if (nv == this.pass && /^[a-zA-Z0-9]{6,18}$/.test(this.pass)) {
                this.abled = true
            } else if (!/^[a-zA-Z0-9]{6,18}$/.test(this.pass)) {
                this.abled = false
            } else {
                this.abled = false
            }
        }
    },
    methods: {
        focusPass() {
            this.focus_ps = true
            this.error_ps = ''
        },
        focusRepass() {
            this.focus_reps = true
            this.error_reps = ''
        },
        checkPass() {
            this.focus_ps = false
            if (this.repass == this.pass && /^[a-zA-Z0-9]{6,18}$/.test(this.pass)) {
            } else if (!/^[a-zA-Z0-9]{6,18}$/.test(this.pass) && this.pass) {
                this.error_ps = this.error_setpass
            } else if (this.repass) {
                this.error_reps = this.error_setrepass
            }
        },
        checkRepass() {
            this.focus_reps = false
            if (this.repass == this.pass && /^[a-zA-Z0-9]{6,18}$/.test(this.pass)) {
            } else if (!/^[a-zA-Z0-9]{6,18}$/.test(this.pass) && this.pass) {
                this.error_ps = this.error_setpass
            } else if (this.repass) {
                this.error_reps = this.error_setrepass
            }
        },
        nextStep() {
            this.abled = false
            const options = {
                verifyCode: this.verifyCode,
                pwd: this.pass,
                deviceId: this.$store.state.deviceId,
                activity: 'invite_new'
            }
            this.inviteCode = sessionStorage.getItem('invite_code')
            if (this.inviteCode) {
                options.invitedId = this.inviteCode
            }
            if (this.phone) {
                options.phoneCc = this.phoneCc
                options.phone = this.phone
                options.type = 10
                this.sendEvLog({
                    category: 'register',
                    action: 'register_passwd_submit',
                    label: 'register phone',
                    value: 0
                })
            } else {
                options.email = this.email
                options.type = 0
                this.sendEvLog({
                    category: 'register',
                    action: 'register_passwd_submit',
                    label: 'register email',
                    value: 0
                })
            }
            this.sendEvLog({
                category: 'register',
                action: 'register_passwd_submit',
                label: this.phone ? 'register phone' : 'register email',
                value: 0
            })
            this.$axios.post('/ums/v3/register', options).then(res => {
                if (res.data.code === 0) {
                    this.$alert(
                        this.$store.state.lang.tips_register_successful,
                        () => {
                            let params = {}
                            if (this.phone) {
                                this.sendEvLog({
                                    category: 'register',
                                    action: 'register_passwd_ok',
                                    label: 'register phone',
                                    value: 0
                                })
                                params = {
                                    applicationId: 2,
                                    phoneCc: this.phoneCc,
                                    phone: this.phone,
                                    pwd: this.pass,
                                    deviceId: this.$store.state.deviceId,
                                    type: 10
                                }
                            } else {
                                this.sendEvLog({
                                    category: 'register',
                                    action: 'register_passwd_ok',
                                    label: 'register email',
                                    value: 0
                                })
                                params = {
                                    applicationId: 2,
                                    deviceId: this.$store.state.deviceId,
                                    type: 0,
                                    email: this.email,
                                    pwd: this.pass
                                }
                            }
                            login.call(this, params, () => {
                                const pre = sessionStorage.getItem('register_prefer') || ''
                                if (pre) {
                                    window.location.href = pre
                                } else {
                                    this.$router.replace('/browser')
                                }
                            })
                        },
                        this.$store.state.lang.login_title
                    )
                } else {
                    this.sendEvLog({
                        category: 'register',
                        action: 'register_passwd_err',
                        label: 1,
                        value: 0
                    })
                    this.$alert(this.$store.state.lang.error_register_tip, () => {}, this.$store.state.lang.got_it)
                    this.abled = true
                }
            })
        }
    },
    head() {
        return {
            title: this.$store.state.lang.set_password
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    padding: 0 1rem;
    .input-item {
        margin: 2rem 0 3rem;
        width: 100%;
        height: 3rem;
        position: relative;
        .label {
            .open-close {
                width: 1.5rem;
                height: 1.5rem;
                position: absolute;
                top: 1.2rem;
                right: 0;
            }
        }
        font-size: 0.8rem;
        .passText,
        .repassText {
            position: absolute;
            top: 0;
            left: 0;
            color: #0087eb;
        }
        .tag {
            position: absolute;
            left: 0;
            top: 0;
            font-size: 0.8rem;
            color: transparent;
            &.focus {
                color: #0087eb;
            }
            &.error {
                color: red;
            }
        }
        input {
            padding: 1rem 0 0 0.4rem;
            border: none;
            outline: none;
            border-bottom: #dddddd solid 1px;
            width: 100%;
            height: 3rem;
            color: #111111;
            &::-webkit-input-placeholder {
                color: #999999;
            }
            &.focus {
                border-bottom: 1px solid #0087eb;
            }
            &.error {
                border-bottom: 1px solid red;
            }
        }
        .error-tip {
            color: red;
            padding: 0.4rem;
        }
    }
    .footer {
        width: 80%;
        margin: 5rem auto;
    }
    .false-dialog {
        width: 15rem;
        height: 8rem;
        background-color: #fff;
        font-size: 1rem;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -4rem;
        margin-left: -7.5rem;
        border-radius: 0.2rem;
        z-index: 999;
        p {
            color: #000000;
            margin: 1.5rem;
            line-height: 1.3rem;
        }
        .got-it {
            width: 100%;
            height: 2rem;
            line-height: 2rem;
            color: #0087eb;
            padding-right: 1.5rem;
            text-align: right;
        }
    }
}
</style>
