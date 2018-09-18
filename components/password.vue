<template>
    <div class="password-box">
        <p class="pwd-type">{{placeholder}}</p>
        <img class="open-close" src="~/assets/img/ic_hide_def_g.png" v-if="toggleView&&isCiphertext==1" alt="" @click="isCiphertext=2">
        <img class="open-close" src="~/assets/img/ic_show_def_g.png" v-if="toggleView&&isCiphertext==2" alt="" @click="isCiphertext=1">
        <div class="pwd-input">
            <input :type="pwdType" v-model="N1" disabled/>
            <input :type="pwdType" v-model="N2" disabled/>
            <input :type="pwdType" v-model="N3" disabled/>
            <input :type="pwdType" v-model="N4" disabled/>
            <input :type="pwdType" v-model="N5" disabled/>
            <input :type="pwdType" v-model="N6" disabled/>
        </div>
        <input type="tel" maxlength="6" v-model="password" class="hidden-pwd">
    </div>
</template>
<script>
export default {
    props: {
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
            return this.password.substr(0, 1) || ''
        },
        N2() {
            return this.password.substr(1, 1) || ''
        },
        N3() {
            return this.password.substr(2, 1) || ''
        },
        N4() {
            return this.password.substr(3, 1) || ''
        },
        N5() {
            return this.password.substr(4, 1) || ''
        },
        N6() {
            return this.password.substr(5, 1) || ''
        }
    },
    watch: {
        password(val, oldVal) {
            if (val.length >= 6) {
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
        input {
            width: 13%;
            display: block;
            border: none;
            border-bottom: 1px solid #ddd;
            outline: none;
            text-align: center;
            margin-right: 4.4%;
            background: #fff;
            float: left;
            &:last-child {
                margin-right: 0;
            }
        }
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