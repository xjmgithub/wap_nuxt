<template>
    <div class="email-cont">
        <div class="title">Enter your email</div>
        <div class="input-email" :class="{focus:focus_email,error:error_email}">
            <div class="number">
                <input type="email" v-model="email" @focus="focus_email=true" @blur="focus_email=false" placeholder="Enter your email" />
            </div>
            <div class="error" v-show="error_email">{{error_email}}</div>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
export default {
    props: {
        type: {
            default: 0
        }
    },
    watch: {
        email(nv, ov) {
            this.error_email = ''
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
                        email: this.email,
                        code: nv
                    }),
                    url: this.type
                        ? '/ums/v1/user/code/verify'
                        : '/ums/v1/register/code/verify'
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
            email: '',
            vscode: '',
            focus_email: false,
            error_email: '',
            focus_code: false,
            error_code: '',
            codeDuring: 0
        }
    },
    computed: {
        canGetCode() {
            let reg_email = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/
            return reg_email.test(this.email) && this.codeDuring <= 0
        }
    },
    methods: {
        getCode() {
            if (!this.canGetCode) return false
            this.$axios
                .get(`/mobilewallet/uc/v2/accounts/${accountNo}/verify-code-mail`,{
                    email:this.email
                })
                .then(res => {
                    if (res.data.code == 0) {
                        this.codeDuring = 60
                    } else {
                        this.error_email =
                            'Please confirm you have entered the right email.'
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
.email-cont {
    padding-top: 2.5rem;
}
.title {
    line-height: 2rem;
    height: 2rem;
}
.input-email {
    border-bottom: #dddddd solid 1px;
    display: -webkit-box;
    display: flex;
    padding-bottom: 5px;
    margin: 0rem ;
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