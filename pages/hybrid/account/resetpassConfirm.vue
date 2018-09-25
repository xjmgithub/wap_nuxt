<template>
    <div class="wrapper">
        <div class="input-item">
            <div class="label">Create a Password
                <img class="open-close" src="~/assets/img/ic_hide_def_g.png" v-if="isCiphertext==1" alt="" @click="isCiphertext=2">
                <img class="open-close" src="~/assets/img/ic_show_def_g.png" v-if="isCiphertext==2" alt="" @click="isCiphertext=1">
            </div>
            <input :type="pwdType" v-model="pass" @blur="checkpass" />
        </div>
        <div class="input-item">
            <div class="label">Confirm New Password
                <img class="open-close" src="~/assets/img/ic_hide_def_g.png" v-if="isCiphertext_confirm==1" alt="" @click="isCiphertext_confirm=2">
                <img class="open-close" src="~/assets/img/ic_show_def_g.png" v-if="isCiphertext_confirm==2" alt="" @click="isCiphertext_confirm=1">
            </div>
            <input :type="pwdType_confirm" v-model="repass" @blur="checkpass" />
        </div>
        <div class="footer">
            <mButton :disabled="false" :text="'NEXT'" @click="nextStep"></mButton>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import qs from 'qs'
export default {
    layout: 'base',
    data() {
        return {
            phone: this.$route.query.phone || '',
            phoneCc: this.$route.query.phoneCc || '',
            verifyCode: this.$route.query.code || '',
            email: this.$route.query.email || '',
            pass: '',
            repass: '',
            isCiphertext: 1,
            isCiphertext_confirm: 1
        }
    },
    methods: {
        checkpass() {
            // TODO 格式化
        },
        nextStep() {
            // TODO 校验
            let url = '/ums/v1/user/phone/pwd/reset'
            let options = {
                code: this.verifyCode,
                newPassword: this.pass
            }
            if (this.phone) {
                options.phoneCc = this.phoneCc
                options.phone = this.phone
            } else {
                options.email = this.email
                options.type = 0
            }

            this.$axios({
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify(options),
                url: url
            }).then(res => {
                if (res.data.code == 0) {
                    this.$router.push('/hybrid/account/login')
                } else {
                    this.$alert(
                        'This code you entered is incorrect. Please try again.'
                    )
                }
            })
        }
    },
    components: {
        mButton
    },
    computed: {
        pwdType() {
            return this.isCiphertext == 1 ? 'password' : 'text'
        },
        pwdType_confirm() {
            return this.isCiphertext_confirm == 1 ? 'password' : 'text'
        }
    }
}
</script>
<style scoped>
.wrapper {
    padding: 3rem 1rem;
}
input {
    border: none;
    outline: none;
    border-bottom: #dddddd solid 1px;
    width: 100%;
    height: 2rem;
    line-height: 2rem;
}
.input-item {
    margin-top: 2rem;
}
.label {
    font-size: 0.8rem;
}
.open-close {
    width: 1.5rem;
    height: 1.5rem;
    float: right;
}
.footer {
    position: fixed;
    bottom: 2rem;
    width: 16rem;
    margin: 0 auto;
    left: 0;
    right: 0;
}
</style>