<template>
    <div>
        <img v-show="toggleView&&isCiphertext==1" class="open-close" src="~assets/img/ic_hide_def_g.png" @click="isCiphertext=2" />
        <img v-show="toggleView&&isCiphertext==2" class="open-close" src="~assets/img/ic_show_def_g.png" @click="isCiphertext=1" />
        <div class="password-box">
            <div class="pwd-input" style="clear:both;">
                <div class="input-item" v-html="N1" />
                <div v-show="length>=2" class="input-item" v-html="N2" />
                <div v-show="length>=3" class="input-item" v-html="N3" />
                <div v-show="length>=4" class="input-item" v-html="N4" />
                <div v-show="length>=5" class="input-item" v-html="N5" />
                <div v-show="length>=6" class="input-item" v-html="N6" />
            </div>
            <input v-model="password" :maxlength="length" type="tel" class="hidden-pwd" @focus="focusPass" />
        </div>
    </div>
</template>
<script>
export default {
    props: {
        length: {
            type: Number, // max length 6
            default: 6
        },
        toggleView: {
            type: Boolean,
            default: false
        },
        defaultView: {
            type: Number,
            default: 1 // 1 密码格式，0 数字格式
        }
    },
    data() {
        return {
            password: '',
            isCiphertext: this.defaultView
        }
    },
    computed: {
        pwdType() {
            return this.isCiphertext === 1 ? 'password' : 'text'
        },
        N1() {
            if (this.isCiphertext === 1) {
                return this.password.substr(0, 1) ? '&bull;' : ''
            } else {
                return this.password.substr(0, 1) || ''
            }
        },
        N2() {
            if (this.isCiphertext === 1) {
                return this.password.substr(1, 1) ? '&bull;' : ''
            } else {
                return this.password.substr(1, 1) || ''
            }
        },
        N3() {
            if (this.isCiphertext === 1) {
                return this.password.substr(2, 1) ? '&bull;' : ''
            } else {
                return this.password.substr(2, 1) || ''
            }
        },
        N4() {
            if (this.isCiphertext === 1) {
                return this.password.substr(3, 1) ? '&bull;' : ''
            } else {
                return this.password.substr(3, 1) || ''
            }
        },
        N5() {
            if (this.isCiphertext === 1) {
                return this.password.substr(4, 1) ? '&bull;' : ''
            } else {
                return this.password.substr(4, 1) || ''
            }
        },
        N6() {
            if (this.isCiphertext === 1) {
                return this.password.substr(5, 1) ? '&bull;' : ''
            } else {
                return this.password.substr(5, 1) || ''
            }
        }
    },
    watch: {
        password(val, oldVal) {
            if (val.length >= this.length) {
                this.$emit('endinput', val)
            } else {
                this.$emit('inputing', val)
            }
        }
    },
    methods: {
        focusPass() {
            this.sendEvLog({
                category: 'register',
                action: 'register_verifycode',
                label: 1,
                value: 0
            })
        }
    }
}
</script>
<style lang="less">
.open-close {
    width: 1.5rem;
    height: 1.5rem;
    float: right;
}
.password-box {
    position: relative;
    clear: both;
    .pwd-input {
        width: 100%;
        display: -webkit-box;
        display: flex;
        height: 2.2rem;
    }
    .input-item {
        -webkit-box-flex: 1;
        flex: 1;
        margin-right: 0.7rem;
        border-bottom: 1px solid #ddd;
        height: 2.2rem;
        line-height: 2.2rem;
        background: #fff;
        text-align: center;
        &:last-child {
            margin-right: 0;
        }
    }
    &.error {
        .input-item {
            border-bottom: 1px solid red;
        }
    }
    input {
        color: transparent;
    }
    .hidden-pwd {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
    }
}
</style>
