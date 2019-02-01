<template>
    <div class="password-box">
        <p class="pwd-type">{{placeholder}}</p>
        <img class="open-close" src="~assets/img/ic_hide_def_g.png" v-if="toggleView&&isCiphertext==1" alt @click="isCiphertext=2">
        <img class="open-close" src="~assets/img/ic_show_def_g.png" v-if="toggleView&&isCiphertext==2" alt @click="isCiphertext=1">
        <div class="pwd-input">
            <!-- TODO 支持自定义化数量 -->
            <div class="input-item" v-html="N1"/>
            <div class="input-item" v-show="length>=2" v-html="N2"/>
            <div class="input-item" v-show="length>=3" v-html="N3"/>
            <div class="input-item" v-show="length>=4" v-html="N4"/>
            <div class="input-item" v-show="length>=5" v-html="N5"/>
            <div class="input-item" v-show="length>=6" v-html="N6"/>
        </div>
        <input type="tel" :maxlength="length" v-model="password" class="hidden-pwd">
    </div>
</template>
<script>
export default {
    props: {
        length: {
            type: String, // max length 6
            default: '6'
        },
        placeholder: {
            type: String,
            required: true
        },
        toggleView: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            password: '',
            isCiphertext: 1
        }
    },
    computed: {
        pwdType() {
            return this.isCiphertext == 1 ? 'password' : 'text'
        },
        N1() {
            if (this.isCiphertext == 1) {
                return this.password.substr(0, 1) ? '&bull;' : ''
            } else {
                return this.password.substr(0, 1) || ''
            }
        },
        N2() {
            if (this.isCiphertext == 1) {
                return this.password.substr(1, 1) ? '&bull;' : ''
            } else {
                return this.password.substr(1, 1) || ''
            }
            return this.password.substr(1, 1) || ''
        },
        N3() {
            if (this.isCiphertext == 1) {
                return this.password.substr(2, 1) ? '&bull;' : ''
            } else {
                return this.password.substr(2, 1) || ''
            }
        },
        N4() {
            if (this.isCiphertext == 1) {
                return this.password.substr(3, 1) ? '&bull;' : ''
            } else {
                return this.password.substr(3, 1) || ''
            }
        },
        N5() {
            if (this.isCiphertext == 1) {
                return this.password.substr(4, 1) ? '&bull;' : ''
            } else {
                return this.password.substr(4, 1) || ''
            }
        },
        N6() {
            if (this.isCiphertext == 1) {
                return this.password.substr(5, 1) ? '&bull;' : ''
            } else {
                return this.password.substr(5, 1) || ''
            }
        }
    },
    watch: {
        password(val, oldVal) {
            if (val.length >= this.length) {
                this.$emit('endinput', true)
            } else {
                this.$emit('endinput', false)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.password-box {
    position: relative;
    .pwd-type {
        color: #212121;
        font-size: 1rem;
        line-height: 1.5rem;
        margin-bottom: 1rem;
        display: inline-block;
    }
    .open-close {
        width: 1.5rem;
        height: 1.5rem;
        float: right;
    }
    .pwd-input {
        width: 100%;
        display: flex;
        height: 2.2rem;
        .input-item {
            flex: 1;
            margin-right: 0.7rem;
            border-bottom: 1px solid #ddd;
            height: 2.2rem;
            background: #fff;
            text-align: center;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    input {
        color: transparent;
    }
    .hidden-pwd {
        width: 100%;
        position: absolute;
        top: 2.2rem;
        left: 0;
        opacity: 0;
    }
}
</style>
