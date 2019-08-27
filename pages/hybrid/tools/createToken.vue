<template>
    <div>
        <div>
            <span v-for="(item,index) in arr" :key="index">{{item.code}}|</span>
        </div>
        <div>{{ids.toString()}}</div>
        <div>{{result}}</div>
        <textarea v-model="del"></textarea>
        <div @click="delbyIds()">删除</div>
    </div>
</template>
<script>
import countrys from '~/functions/countrys.json'
export default {
    layout:'base',
    data() {
        return {
            arr: [],
            result: '',
            ids: [],
            del: ''
        }
    },
    mounted() {
        this.s(0)
    },
    methods: {
        delbyIds() {
            this.del.forEach(item => {
                this.delToken(item)
            })
        },
        delToken(id) {
            this.$axios({
                url: 'http://op-test1.startimes.me/processtoken/delete/' + id,
                method: 'POST',
                data: {
                    date: new Date().getTime()
                }
            })
        },
        s(i) {
            if (i < 2) {
                this.createToken(countrys[i].id, countrys[i].code, (id, token) => {
                    this.arr.push({
                        code: countrys[i].code,
                        token: token
                    })
                    this.ids.push(id)
                    this.s(i + 1)
                })
            } else {
                this.arr.forEach(item => {
                    this.result[item.code] = item.token
                })
            }
        },
        createToken(id, code, callback) {
            this.$axios({
                url: 'http://op-test1.startimes.me/processtoken/add',
                method: 'POST',
                headers: { 'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzaGFuZ3hpbmJvIiwidWlkIjoxNDYsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTU2NjU1ODIwNjI0OCwiZGVwdGlkIjpbXSwiZXhwIjoxNTY2NjQ0NjA2LCJ0ZW5hbnQiOjF9.eYM3wO-fPAqUurnFeCxUrs_n8iy6y74BhvSKM_CoXzZ8jZPWqG_lcv-FkPleHhNZgP3pr-rENu5jXAy04mKJYw' },
                data: {
                    applicationId: 2,
                    countryCode: id,
                    countryId: code,
                    minutes: 60 * 24 * 365 * 10,
                    name: 'H5',
                    role: '0',
                    userId: '9999'
                }
            })
                .then(res => {
                    if (res.data.code == 0) {
                        callback(res.data.data.id, res.data.data.token)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}
</script>
