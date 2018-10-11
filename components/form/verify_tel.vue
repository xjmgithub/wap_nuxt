<template>
    <div>
        <div class="input-tel" :class="{focus:focus_tel,error:error_tel}">
            <div class="prefix">+{{prefix}}</div>
            <div class="number">
                <input type="tel" v-model="tel" @focus="focus_tel=true" @blur="focus_tel=false" placeholder="Enter your Phone Number" />
            </div>
            <div class="error" v-show="error_tel">{{error_tel}}</div>
        </div>
        <div class="get-code">
            <input type="text" maxlength="4" :class="{focus:focus_code,error:error_code}" v-model="vscode" @focus="focus_code=true" @blur="focus_code=false" placeholder="Click to get verification code" />
            <div class="btn" :class="{disabled:!canGetCode}" @click="getCode">{{codeDuring>0?`${codeDuring}s`:'Get Code'}}</div>
            <div class="error_code" v-show="error_code">{{error_code}}</div>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
export default {
    props: {
        prefix: {
            required: true
        },
        type: {
            default: 0
        }
    },
    watch: {
        tel(nv, ov) {
            this.error_tel = ''
        },
        vscode(nv, ov) {
            this.error_code = ''
            if (nv.length >= 4) {
                this.$axios({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        token: this.$store.state.token
                    },
                    data: qs.stringify({
                        phoneCc: this.prefix,
                        phone: this.tel,
                        code: nv
                    }),
                    url: this.type
                        ? '/ums/v1/user/code/sms'
                        : '/ums/v1/register/code/sms'
                }).then(res => {
                    if (res.data.code == 0) {
                        this.$emit('pass', true)
                    } else {
                        this.$emit('pass', false)
                        this.error_code =
                            'This code you entered is incorrect. Please try again.'
                    }
                })
            } else {
                this.$emit('pass', false)
            }
        }
    },
    mounted() {
        let _this = this
        this.timer = setInterval(() => {
            _this.codeDuring--
        }, 1000)
    },
    data() {
        return {
            tel: '',
            vscode: '',
            focus_tel: false,
            error_tel: '',
            focus_code: false,
            error_code: '',
            codeDuring: 0,
            waiting_res: false
        }
    },
    computed: {
        canGetCode() {
            return this.tel.length >= 6 && this.codeDuring <= 0
        }
    },
    methods: {
        getCode() {
            // TODO 防止多次点击
            if (!this.canGetCode || this.waiting_res) return false
            this.waiting_res = true
            let url = this.type
                ? '/ums/v1/user/code/sms'
                : '/ums/v1/register/code/sms'
            this.$axios
                .get(`${url}?phone=${this.tel}&phoneCc=${this.prefix}`)
                .then(res => {
                    this.waiting_res = false
                    if (res.data.code == 0) {
                        this.codeDuring = 60
                    } else {
                        this.error_tel =
                            'Please confirm you have entered the right number.'
                    }
                })
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
}
</script>
<style lang="less" scoped>
.input-tel {
    border-bottom: #dddddd solid 1px;
    display: -webkit-box;
    display: flex;
    padding-bottom: 5px;
    margin: 1rem 0 2rem;
    position: relative;
    &.focus {
        border-bottom: #0087eb solid 1px;
    }
    &.error {
        border-bottom: red solid 1px;
    }
    &:after {
        content: '0';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    .prefix {
        max-width: 3.5rem;
        border-right: #dddddd solid 1px;
        line-height: 1.2rem;
        height: 1.2rem;
        float: left;
        -webkit-box-flex: 1;
        flex: 1;
    }
    .number {
        -webkit-box-flex: 11;
        flex: 5;
        input {
            width: 100%;
            border: none;
            display: block;
            padding: 0 0.5rem;
            outline: none;
            &::-webkit-input-placeholder {
                font-size: 0.5rem;
            }
        }
    }
    .error {
        position: absolute;
        bottom: -1.4rem;
        font-size: 0.5rem;
        color: red;
    }
}
.get-code {
    display: flex;
    margin: 1.5rem 0;
    position: relative;
    input {
        display: block;
        flex: 2.6;
        border: none;
        border-bottom: #dddddd solid 1px;
        &.focus {
            border-bottom: #0087eb solid 1px;
        }
        &.error {
            border-bottom: red solid 1px;
        }
        &::-webkit-input-placeholder {
            font-size: 0.5rem;
        }
        outline: none;
        margin-right: 0.5rem;
    }

    .btn {
        flex: 1;
        max-width: 10rem;
        background: #0087eb;
        color: white;
        font-size: 0.8rem;
        text-align: center;
        height: 2rem;
        line-height: 2rem;
        cursor: pointer;
        &.disabled {
            background: #dddddd;
            color: #aaaaaa;
        }
    }
    .error_code {
        position: absolute;
        bottom: -1.4rem;
        font-size: 0.5rem;
        color: red;
    }
}
</style>