<template>
    <div>
        <input v-model="count" type="number">
        <button @click="submit">提交</button>
        <div>{{success}}</div>
    </div>
</template>
<script>
import qs from 'qs'
import { getRandomInt } from '~/functions/utils'
export default {
    layout: 'base',
    data() {
        return {
            count: 0,
            success: 0
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$nuxt.$loading.finish()
        })
    },
    methods: {
        submit() {
            if (!isNaN(this.count) && this.count > 0) {
                for (let i = 0; i < this.count; i++) {
                    this.$axios({
                        url: '/ums/v1/user/login',
                        method: 'POST',
                        data: {
                            applicationId: 1,
                            deviceType: 1,
                            deviceId: 'A0044' + getRandomInt(100000, 10000000),
                            versionCode: 5500,
                            fcmToken: 'ABCD100003211',
                            type: -1
                        }
                    })
                        .then(res => {
                            this.$axios({
                                url: '/voting/v1/ticket/sign-in',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    token: res.data.data.token
                                },
                                data: qs.stringify({
                                    vote_id: 8
                                })
                            })
                                .then(res => {
                                    if (res.data.code == 0) {
                                        this.success++
                                    }
                                })
                                .catch(e => {
                                    console.log(e)
                                })
                        })
                        .catch(e => {
                            console.log(e)
                        })
                }
            }
        }
    }
}
</script>
