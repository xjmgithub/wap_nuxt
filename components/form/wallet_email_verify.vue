<template>
    <div class="email-cont">
        <div class="title">
            Enter your email
        </div>
        <div :class="{focus:focus_email,error:error_email}" class="input-email">
            <div class="number">
                <input
                    :disabled="disabled"
                    v-model="email"
                    @focus="focus_email=true"
                    @blur="focus_email=false"
                    type="email"
                    placeholder="Enter your email"
                >
            </div>
            <div v-show="error_email" class="error">
                {{error_email}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            email: '',
            focus_email: false,
            error_email: '',
            codeDuring: 0,
            waiting_res: false
        }
    },
    computed: {
        canGetCode() {
            const regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/
            return regEmail.test(this.email) && this.codeDuring <= 0
        }
    },
    watch: {
        email(nv, ov) {
            this.error_email = ''
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
            if (!this.canGetCode || this.waiting_res) return false
            this.waiting_res = true
            const accountNo = ''
            this.$axios
                .get(`/mobilewallet/uc/v2/accounts/${accountNo}/verify-code-mail`, {
                    email: this.email
                })
                .then(res => {
                    this.waiting_res = false
                    if (res.data.code === 0) {
                        this.codeDuring = 60
                    } else {
                        this.error_email = 'Please confirm you have entered the right email.'
                    }
                })
        },
        setEmail(val) {
            this.email = val
        }
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
    font-size: 1rem;
    margin-bottom: 0.5rem;
}
.input-email {
    border-bottom: #dddddd solid 1px;
    /*     display: -webkit-box;
    display: flex; */
    margin: 0rem;
    position: relative;
    margin-bottom: 0.5rem;
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
            height: 2.5rem;
            padding-left: 0.5rem;
            &::-webkit-input-placeholder {
                font-size: 1rem;
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
</style>
