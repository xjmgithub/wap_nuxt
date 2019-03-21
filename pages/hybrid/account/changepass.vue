<template>
    <div class="wrapper">
        <div class="input-item">
            <div class="label">
                Create a Password
            </div>
            <input v-model="pass" type="text" @blur="checkpass">
        </div>
        <div class="input-item">
            <div class="label">
                Confirm New Password
            </div>
            <input v-model="repass" type="text" @blur="checkpass">
        </div>
        <div class="input-item invite">
            <div class="label">
                Invitation Code(Optional)
            </div>
            <input v-model="inviteCode" type="text" @blur="checkpass">
        </div>
        <div class="footer">
            <mButton :disabled="false" :text="'NEXT'" @click="nextStep" />
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
            countryId: this.$route.query.countryId || '',
            phone: this.$route.query.phone || '',
            phoneCc: this.$route.query.phoneCc || '',
            verifyCode: this.$route.query.code || '',
            email: this.$route.query.email || '',
            pass: '',
            repass: '',
            inviteCode: ''
        }
    },
    methods: {
        checkpass() {
            // TODO 格式化
        },
        nextStep() {
            // TODO 校验

            const options = {
                verifyCode: this.verifyCode,
                pwd: this.pass,
                invitedId: this.inviteCode
            }
            if (this.phone) {
                options.phoneCc = this.phoneCc
                options.phone = this.phone
                options.countryId = this.countryId
                options.type = 10
            } else {
                options.email = this.email
                options.type = 0
            }

            this.$axios.post('/ums/v1/register', options).then(res => {
                if (res.data.code === 0) {
                    this.$router.push('/hybrid/account/login')
                } else {
                    this.error_code = 'This code you entered is incorrect. Please try again.'
                }
            })
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
.footer {
    position: fixed;
    bottom: 2rem;
    width: 75%;
    margin: 0 auto;
    left: 0;
    right: 0;
}
</style>
