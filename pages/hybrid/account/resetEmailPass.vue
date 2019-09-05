<template>
    <div class="wrapper">
        <div class="by_email">
            <div :class="{focus:focus_email,error:error_email}" class="input-email">
                <div class="number">
                    <div class="tag" :class="{focus:focus_email,error:error_email}">{{enter_email}}</div>
                    <input v-model="email" type="email" :placeholder="focus_email?'':enter_email" @focus="focusEmail" @blur="focus_email=false" />
                    <div v-show="showAutoInput" class="auto-input">
                        <div @click="autoInput('gmail')">{{email}}gmail.com</div>
                        <div @click="autoInput('yahoo')">{{email}}yahoo.com</div>
                        <div @click="autoInput('hotmail')">{{email}}hotmail.com</div>
                    </div>
                </div>
                <div v-show="error_email" class="error" v-html="error_email"></div>
            </div>
        </div>
        <div class="next-btn">
            <mButton
                :disabled="(!new RegExp(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/).test(email))||disabled"
                :text="next"
                @click="getEmailCode"
            />
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
export default {
    layout: 'base',
    components: {
        mButton
    },
    data() {
        return {
            email: '',
            enter_email: this.$store.state.lang.enter_your_email_addr,
            next: this.$store.state.lang.text_onair_next,
            focus_email: false,
            error_email: '',
            error_email_code: '',
            showAutoInput: false,
            error_email_false: this.$store.state.lang.error_email_false,
            disabled: false,
        }
    },
    computed: {},
    watch: {
        email(nv, ov) {
            this.haveGetEmailCode = false
            this.error_email = ''
            const str = this.email.substr(this.email.length - 1, 1)
            if (this.email.length > 1 && str == '@') {
                this.showAutoInput = true
            } else {
                this.showAutoInput = false
            }
        }
    },
    mounted() {},
    methods: {
        focusEmail() {
            this.focus_email = true
        },
        getEmailCode() {
            this.disabled = true
            this.$axios({
                url: `ums/v1/register/password/change?email=${this.email}`,
                method: 'get'
            })
                .then(res => {
                    if (res.data.code === 0) {
                        this.$alert(this.$store.state.lang.forget_password_mail_security_link_email, () => {
                            window.location.href = '/hybrid/account/signIn'
                        })
                    } else if (res.data.code === 9) {
                        this.error_email = this.$store.state.lang.email_address_has_not_been
                        this.disabled = false
                    } else {
                        this.$alert(this.$store.state.lang.password_reset_failed)
                        this.disabled = false
                    }
                })
                .catch(() => {this.disabled = false})
        },
        autoInput(str) {
            this.email += str + '.com'
            this.showAutoInput = false
        }
    },
    head() {
        return {
            title: this.$store.state.lang.reset_pass
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    position: static;
    padding: 0 1.2rem;
    .by_email {
        height: 8.5rem;
        padding-top: 3.3rem;
        .input-email {
            width: 100%;
            border-bottom: #dddddd solid 1px;
            padding-bottom: 5px;
            margin-bottom: 2.6rem;
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
                .tag {
                    position: absolute;
                    left: 0;
                    top: -1.2rem;
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
                    width: 100%;
                    border: none;
                    display: block;
                    padding: 0 0.5rem;
                    height: 1.5rem;
                    line-height: 1.5rem;
                    outline: none;
                    color: #333333;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
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
                left: 0;
                bottom: -1.5rem;
                font-size: 0.8rem;
                color: red;
            }
        }
    }
    .next-btn {
        width: 80%;
        margin: 0 auto 1.8rem;
    }
}
</style>
