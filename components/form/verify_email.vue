<template>
    <div class="email-cont">
        <div :class="{focus:focus_email,error:error_email}" class="input-email">
            <div class="number">
                <input v-model="email" type="email" placeholder="Enter your email address" @focus="focus_email=true" @blur="focus_email=false">
                <div v-show="showAutoInput" class="auto-input">
                    <div class="gmail" @click="autoInput('gamil.com')">{{email}}{{str_gmail}}</div>
                    <div class="fotmail" @click="autoInput('fotmail.com')">{{email}}{{str_fotmail}}</div>
                    <div class="yahoo" @click="autoInput('yahoo.com')">{{email}}{{str_yahoo}}</div>
                </div>
            </div>
            <div v-show="error_email" class="error" v-html="emailError">
                <!-- {{error_email}} -->
            </div>
        </div>
        <getCode ref="emailpicker" :email="email" @errorEmail="showError" @emailCanNext="emCanNext" @vscode="vsCode"/>
    </div>
</template>
<script>
import getCode from '~/components/form/get_code'
export default {
    components: {
        getCode,
    },
    props: {
        type: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            email: '',
            vscode: '',
            focus_email: false,
            error_email: '',
            focus_code: false,
            error_code: '',
            codeDuring: 0,
            waiting_res: false,
            str_gmail: 'gamil.com',
            str_fotmail: 'fotmail.com',
            str_yahoo: 'yahoo.com',
            showAutoInput: false,
        }
    },
    computed: {
        emailError() {
            if(this.error_email == 'You are not a new user because you have registered once.') {
                return this.error_email+'<a href="/hybrid/account/signIn" style="color:#0087eb;text-decoration:underline"> Sign in</a>'
            }
            return this.error_email;
        }
    },
    watch: {
        email(nv, ov) {
            this.error_email = '';
            const str = this.email.substr((this.email.length-1), 1);
            if(this.email.length > 1 && str == '@') {
                this.showAutoInput = true;
            } else {
                this.showAutoInput = false;
            }
        },
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
        autoInput(str) {
            this.email += str;
            this.showAutoInput = false;
        },
        showError(msg) {
            this.error_email = msg
        },
        emCanNext(bool) {
            this.$emit("emailCanNext",bool)
        },
        vsCode(vscode) {
            this.vscode = vscode;
        }
    }
}
</script>
<style lang="less" scoped>
.email-cont {
    padding-top: 2.5rem;
}
.input-email {
    width: 100%;
    border-bottom: #dddddd solid 1px;
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
    .number {
        width: 100%;
        position: relative;
        input {
            width: 100%;
            border: none;
            display: block;
            outline: none;
            padding-left: 0.4rem;
            &::-webkit-input-placeholder {
                font-size: 0.9rem;
            }
        }
        .auto-input {
            width: 100%;
            position: absolute;
            top: 1.6rem;
            left: 0;
            border: 1px solid #dddddd;
            background-color: #ffffff;
            z-index: 10;
            div {
                width: 100%;
                height: 3rem;
                line-height: 3rem;
                border-bottom: 1px solid #dddddd;
                &.yahoo {
                    border: 0;
                }
                color: #999999;
                padding-left: 0.4rem;
                font-size: 0.9rem;
            }
        }
    }
    .error {
        height: 1rem;
        position: absolute;
        bottom: -1.5rem;
        font-size: 0.8rem;
        color: red;
    }
}
</style>
