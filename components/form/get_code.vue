<template>
    <div>
        <div class="get-code">
            <codeNum ref="codeNum" class="code_num" :class="{error:error_state}" :default-view="0" :length="4" @vscode="codeNum" />
            <div :class="{disabled:!canGetCode}" class="btn" @click="getCode">{{codeDuring>0?`${codeDuring}s`:'Get Code'}}</div>
            <div v-show="error_code" class="error_code">{{error_code}}</div>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
import codeNum from '~/components/password'
export default {
    components: {
        codeNum
    },
    props: {
        type: {
            type: Number,
            default: 0
        },
        prefix: {
            type: String,
            default: '234'
        },
        tel: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            vscode: '',
            error_tel: '',
            error_email: '',
            error_code: '',
            error_state: false,
            codeDuring: 0,
            waiting_res: false
        }
    },
    computed: {
        canGetCode() {
            if (this.tel) {
                return this.tel.length >= 6 && this.codeDuring <= 0
            } else {
                const regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/
                return regEmail.test(this.email) && this.codeDuring <= 0
            }
        }
    },
    watch: {
        vscode(nv, ov) {
            this.error_code = ''
            this.error_state = false
            this.$emit('phoneCanNext', false)
            this.$emit('emailCanNext', false)
            if (this.vscode.length >= 4) {
                this.$emit('vscode', nv)
                if (this.tel) {
                    this.$axios({
                        method: 'POST',
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            token: this.$store.state.token
                        },
                        data: qs.stringify({
                            phoneCc: this.prefix,
                            phone: this.tel,
                            code: this.vscode
                        }),
                        url: this.type ? '/ums/v1/user/code/sms' : '/ums/v1/register/code/sms'
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.$emit('phoneCanNext', true)
                        } else {
                            this.error_code = 'This code you entered is incorrect. Please try again.'
                            this.error_state = true
                        }
                    })
                } else {
                    this.$axios({
                        method: 'POST',
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            token: this.$store.state.token
                        },
                        data: qs.stringify({
                            email: this.email,
                            code: nv
                        }),
                        url: this.type ? '/ums/v1/user/code/verify' : '/ums/v1/register/code/verify'
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.$emit('emailCanNext', true)
                        } else {
                            this.error_code = 'This code you entered is incorrect. Please try again.'
                            this.error_state = true
                        }
                    })
                }
            }
        }
    },
    mounted() {
        const _this = this
        this.timer = setInterval(() => {
            _this.codeDuring--
        }, 1000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
        codeNum(code) {
            this.vscode = code
        },
        getCode() {
            // TODO 防止多次点击
            if (!this.canGetCode || this.waiting_res) {
                return false
            }
            this.waiting_res = true
            if (this.tel) {
                const url = this.type ? '/ums/v1/user/code/sms' : '/ums/v2/register/code/sms'
                this.$axios.get(`${url}?phone=${this.tel}&phoneCc=${this.prefix}&index=1`).then(res => {
                    this.waiting_res = false
                    if (res.data.code === 0) {
                        this.codeDuring = 60
                    } else if (res.data.code === 2) {
                        this.error_tel = 'You are not a new user because you have registered once.'
                        this.$emit('errorTel', this.error_tel)
                    } else {
                        this.error_tel = 'This phone number you entered is incorrect. Please try again.'
                        this.$emit('errorTel', this.error_tel)
                    }
                })
            } else {
                const url = this.type ? '/ums/v1/register/password/change' : '/ums/v1/register/code/email'
                this.$axios.get(`${url}?email=${this.email}`).then(res => {
                    this.waiting_res = false
                    if (res.data.code === 0) {
                        this.codeDuring = 60
                    } else if (res.data.code === 2) {
                        this.error_email = 'You are not a new user because you have registered once.'
                        this.$emit('errorEmail', this.error_email)
                    } else {
                        this.error_email = 'This email you entered is incorrect. Please try again.'
                        this.$emit('errorEmail', this.error_email)
                    }
                })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.get-code {
    display: flex;
    height: 4rem;
    position: relative;
    .code_num {
        height: 4.5rem;
        flex: 2;
        margin-right: 10px;
        margin-top: 1rem;
    }
    .btn {
        flex: 1;
        margin-top: 0.8rem;
        max-width: 10rem;
        background: #0087eb;
        color: white;
        font-size: 0.9rem;
        font-weight: bold;
        text-align: center;
        height: 2.4rem;
        line-height: 2.4rem;
        cursor: pointer;
        &.disabled {
            background: #dddddd;
            color: #aaaaaa;
        }
    }
    .error_code {
        position: absolute;
        bottom: -1rem;
        font-size: 0.8rem;
        color: red;
    }
}
</style>
