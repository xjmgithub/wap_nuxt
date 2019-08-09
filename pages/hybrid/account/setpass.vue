<template>
    <div class="wrapper">
        <div class="input-item">
            <div class="label">
                <img v-if="isCiphertext==1" class="open-close" src="~assets/img/ic_hide_def_g.png" alt @click="isCiphertext=2">
                <img v-if="isCiphertext==2" class="open-close" src="~assets/img/ic_show_def_g.png" alt @click="isCiphertext=1">
            </div>
            <div v-show="focus_ps" class="passText">Please enter 6-18 digits or letters</div>
            <input v-model="pass" :class="{focus:focus_ps,error:error_ps}" :type="pwdType" placeholder="Enter Password" @focus="focusPass" @blur="checkPass" >
            <div v-if="error_ps" class="error-tip">{{error_ps}}</div>
        </div>
        <div class="input-item">
            <div class="label">
                <img v-if="isCiphertext_confirm==1" class="open-close" src="~assets/img/ic_hide_def_g.png" alt @click="isCiphertext_confirm=2">
                <img v-if="isCiphertext_confirm==2" class="open-close" src="~assets/img/ic_show_def_g.png" alt @click="isCiphertext_confirm=1">
            </div>
            <div v-show="focus_reps" class="repassText">Corfirm Password</div>
            <input v-model="repass" :class="{focus:focus_reps,error:error_reps}" :type="pwdType_confirm" placeholder="Corfirm Password" @focus="focusRepass" @blur="checkRepass" >
            <div v-if="error_reps" class="error-tip">{{error_reps}}</div>
        </div>
        <div class="footer">
            <mButton :disabled="!abled" :text="'NEXT'" @click="nextStep" />
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
        pass (nv, ov) {
            this.abled = false;
            this.error_ps = '';
            this.error_reps = '';
            if(nv == this.repass && /^[a-zA-Z0-9]{6,18}$/.test(nv)) {
                this.abled = true;
            } else if (!(/^[a-zA-Z0-9]{6,18}$/.test(nv))) {
                this.abled = false;
            } else {
                this.abled = false;
            }
         },
        repass (nv, ov) {
            this.abled = false;
            this.error_ps = '';
            this.error_reps = '';
            if(nv == this.pass && /^[a-zA-Z0-9]{6,18}$/.test(this.pass)) {
                this.abled = true;
            } else if (!(/^[a-zA-Z0-9]{6,18}$/.test(this.pass))) {
                this.abled = false;
            } else {
                this.abled = false;
            }
        }
    },
    methods: {
        focusPass() {
            this.focus_ps = true;
            this.error_ps = '';
        },
        focusRepass() {
            this.focus_reps = true;
            this.error_reps = '';
        },
        checkPass() {
            this.focus_ps = false;
            if(this.repass == this.pass && /^[a-zA-Z0-9]{6,18}$/.test(this.pass)) {
            } else if (!(/^[a-zA-Z0-9]{6,18}$/.test(this.pass)) && this.pass) {
                this.error_ps = 'Password must be 6-18 digits or letters!'
            } else if (this.repass) {
                this.error_reps = 'The two passwords you entered did not match!'
            }
        },
        checkRepass() {
            this.focus_reps = false;
            if(this.repass == this.pass && /^[a-zA-Z0-9]{6,18}$/.test(this.pass)) {
            } else if (!(/^[a-zA-Z0-9]{6,18}$/.test(this.pass)) && this.pass) {
                this.error_ps = 'Password must be 6-18 digits or letters!'
            } else if (this.repass) {
                this.error_reps = 'The two passwords you entered did not match!'
            }
        },
        nextStep() {
            // TODO 校验
            const options = {
                verifyCode: this.verifyCode,
                pwd: this.pass,
                invitedChannel: 0,
                deviceId: this.$store.state.deviceId,
                activity: 'invite_new',
            }
            this.inviteCode = sessionStorage.getItem('invite_code');
            if(this.inviteCode){
                options.invitedId = this.inviteCode;
            }
            if (this.phone) {
                options.phoneCc = this.phoneCc
                options.phone = this.phone
                options.type = 10
            } else {
                options.email = this.email
                options.type = 0
            }

            this.$axios.post('/ums/v3/register', options).then(res => {
                if (res.data.code === 0) {
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
                    // sessionStorage.setItem('login_prefer','/hybrid/account/toGooglePlay')
                    login(this, params)
                } else {
                    this.error_code = 'This code you entered is incorrect. Please try again.'
                }
            })
        }
    },
    head() {
        return {
            title: 'Set Password'
        }
    },
}
</script>
<style lang="less" scoped>
.wrapper {
    padding: 0 1rem;
    .input-item {
        margin-top: 1.5rem;
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
        font-size: 0.9rem;
        .passText, .repassText {
            position: absolute;
            top: 0;
            left: 0;
            color: #0087EB;
            padding-left: 0.4rem;
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
            border-bottom: 1px solid #0087EB;
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
        position: fixed;
        bottom: 2rem;
        width: 75%;
        margin: 0 auto;
        left: 0;
        right: 0;
    }
}
</style>
