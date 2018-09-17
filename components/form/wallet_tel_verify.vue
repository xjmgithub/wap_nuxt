<template>
    <div>
        <div class="title">Enter cellphone number</div>
        <div class="input-tel">
            <div class="prefix">+{{prefix}}</div>
            <div class="number">
                <input type="tel" :class="{focus:focus_tel,error:error_tel}" v-model="tel" @focus="focus_tel=true" @blur="focus_tel=false" placeholder="Cellphone number" />
            </div>
            <div class="get-code">
                <div class="btn" :class="{disabled:!canGetCode}" @click="getCode">{{codeDuring>0?`${codeDuring}s`:'Get Code'}}</div>
            </div>
            <div class="error" v-show="error_tel">{{error_tel}}</div>
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
                        'content-type': 'application/x-www-form-urlencoded'
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
                        this.$emit('pass')
                    } else {
                        this.error_code =
                            'This code you entered is incorrect. Please try again.'
                    }
                })
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
            codeDuring: 0
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
            if (!this.canGetCode) return false
            let accountNo = window.sessionStorage.getItem('wallet_account')
            this.$axios
                .post(`/mobilewallet/uc/v2/accounts/${accountNo}/verify-code`,{
                    phone:this.tel,
                    phoneCc:this.prefix
                })
                .then(res => {
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
.title {
    line-height: 2rem;
    height: 2rem;
}
.input-tel {
    display: -webkit-box;
    display: flex;
    padding-bottom: 5px;
    position: relative;
    &:after {
        content: '0';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    .prefix {
        max-width: 3.5rem;
        line-height: 2rem;
        height: 2rem;
        float: left;
        -webkit-box-flex: 1;
        flex: 1;
        margin-right: 0.3rem;
    }
    .number {
        -webkit-box-flex: 11;
        flex: 5;
        input {
            width: 100%;
            border: none;
            display: block;
            height: 2rem;
            line-height: 2rem;
            outline: none;
            border-bottom: #dddddd solid 1px;
            &::-webkit-input-placeholder {
                font-size: 0.9rem;
            }
            &.focus {
                border-bottom: #0087eb solid 1px;
            }
            &.error {
                border-bottom: red solid 1px;
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
    position: relative;
    flex: 2;
    .btn {
        max-width: 10rem;
        margin-left: 0.3rem;
        background: #0087eb;
        color: white;
        font-size: 0.8rem;
        text-align: center;
        height: 2rem;
        line-height: 2rem;
        cursor: pointer;
        &.disabled {
            background: #eeeeee;
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