<template>
    <div>
        <div :class="{focus:focus_tel,error:error_tel}" class="input-tel">
            <div class="prefix">
                +{{prefix}}
            </div>
            <div class="number">
                <input v-model="tel" @focus="focus_tel=true" @blur="focus_tel=false" type="tel" placeholder="Enter your Phone Number">
            </div>
            <div v-show="error_tel" class="error">
                {{error_tel}}
            </div>
        </div>
        <div class="get-code">
            <input
                :class="{focus:focus_code,error:error_code}"
                v-model="vscode"
                @focus="focus_code=true"
                @blur="focus_code=false"
                type="text"
                maxlength="4"
                placeholder="Click to get verification code"
            >
            <div :class="{disabled:!canGetCode}" @click="getCode" class="btn">
                {{codeDuring>0?`${codeDuring}s`:'Get code'}}
            </div>
            <div v-show="error_code" class="error_code">
                {{error_code}}
            </div>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
export default {
    props: {
        prefix: {
            type: String,
            required: true
        },
        type: {
            type: Number,
            default: 0
        }
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
                    url: this.type ? '/ums/v1/user/code/sms' : '/ums/v1/register/code/sms'
                }).then(res => {
                    if (res.data.code === 0) {
                        this.$emit('pass', true)
                    } else {
                        this.$emit('pass', false)
                        this.error_code = 'This code you entered is incorrect. Please try again.'
                    }
                })
            } else {
                this.$emit('pass', false)
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
        getCode() {
            // TODO 防止多次点击
            if (!this.canGetCode || this.waiting_res) return false
            this.waiting_res = true
            const url = this.type ? '/ums/v1/user/code/sms' : '/ums/v2/register/code/sms'
            this.$axios.get(`${url}?phone=${this.tel}&phoneCc=${this.prefix}&index=1`).then(res => {
                this.waiting_res = false
                if (res.data.code === 0) {
                    this.codeDuring = 60
                } else {
                    this.error_tel = 'Please confirm you have entered the right number.'
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.input-tel {
    border-bottom: #dddddd solid 1px;
    display: -webkit-box;
    display: flex;
    padding-bottom: 5px;
    margin: 1rem 0 2.5rem;
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
        line-height: 1.5rem;
        height: 1.5rem;
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
            height: 1.5rem;
            line-height: 1.5rem;
            outline: none;
            &::-webkit-input-placeholder {
                font-size: 0.9rem;
            }
        }
    }
    .error {
        position: absolute;
        bottom: -2.4rem;
        font-size: 0.8rem;
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
            font-size: 0.9rem;
        }
        outline: none;
        margin-right: 0.5rem;
    }

    .btn {
        flex: 1;
        max-width: 10rem;
        background: #0087eb;
        color: white;
        font-size: 0.9rem;
        font-weight: bold;
        text-align: center;
        height: 2.3rem;
        line-height: 2.3rem;
        cursor: pointer;
        &.disabled {
            background: #dddddd;
            color: #aaaaaa;
        }
    }
    .error_code {
        position: absolute;
        bottom: -2.4rem;
        font-size: 0.8rem;
        color: red;
    }
}
</style>
