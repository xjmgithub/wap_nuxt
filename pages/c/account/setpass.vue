<template>
    <div class="wrapper">
        <div class="input-item">
            <div class="label">Create a Password</div>
            <input type="text" v-model="pass" @blur="checkpass" />
        </div>
        <div  class="input-item">
            <div class="label">Confirm New Password</div>
            <input type="text" v-model="repass" @blur="checkpass" />
        </div>
        <div class="input-item invite">
            <div class="label">Invitation Code(Optional)</div>
            <input type="text" v-model="inviteCode" @blur="checkpass" />
        </div>
        <div class="footer">
            <Button :disabled="false" :text="'NEXT'" @click="nextStep"></Button>
        </div>
    </div>
</template>
<script>
import Button from '~/components/button'
export default {
    layout: 'base',
    data() {
        return {
            countryId: this.$router.query.countryId || '',
            phone: this.$router.query.phone || '',
            phoneCc: this.$router.query.phoneCc || '',
            verifyCode: this.$router.query.code || '',
            email: this.$router.query.email || '',
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

            let options = {
                verifyCode: this.verifyCode,
                pwd: this.pass,
                invitedId: this.inviteCode
            }
            if (this.phone) {
                options.phoneCc = this.phoneCc
                options.phone = this.phone
                options.countryId = this.countryId
            } else {
                options.email = this.email
            }
            this.$axios.setHeader('token', this.$store.state.token)
            this.$axios({
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: qs.stringify(options),
                url: '/ums/v1/register'
            }).then(res => {
                if (res.data.code == 0) {
                    // TODO  注册成功
                } else {
                    this.error_code = 'This code you entered is incorrect. Please try again.'
                }
            })
        }
    },
    components: {
        Button
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
    width: 16rem;
    margin: 0 auto;
    left: 0;
    right: 0;
}
</style>