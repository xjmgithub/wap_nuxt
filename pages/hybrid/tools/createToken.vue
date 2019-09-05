<template>
    <div>
        <input v-model="keyword" type="text" style="width:80%;margin:0 auto;display:block;margin-top:10px;" />
        <div class="btn" @click="search()">搜索</div>
        <div class="btn" @click="del()">删除</div>
        <div class="btn" @click="add(0)">批量生成token</div>
        <div class="btn" @click="exportJson()">导出</div>
        <div v-if="result.length" class="create-result">
            <div v-for="(item,index) in result" :key="index" style="clear:both;">
                <div style="width:5%;float:left;">{{item.id}}</div>
                <div style="width:30%;float:left;">{{item.name}}</div>
                <div style="width:5%;float:left;">{{item.countryCode}}</div>
                <div style="width:10%;float:left;">{{item.roleName}}</div>
                <div style="width:10%;float:left;">{{item.userId}}</div>
                <div style="width:10%;float:left;">{{item.minutes}}</div>
                <div style="width:20%;float:left;">{{item.applicationName}}</div>
            </div>
        </div>
        <div v-show="jsonMap" style="clear:both; margin-top:10px;">{{jsonMap}}</div>
    </div>
</template>
<style>
.btn {
    width: 20%;
    background: #50aeff;
    color: white;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    float: left;
    margin: 2%;
}
</style>
<script>
import countrys from '~/functions/countrys.json'
import dayjs from 'dayjs'
export default {
    layout: 'base',
    data() {
        return {
            result: [],
            keyword: '',
            jsonMap: null
        }
    },
    methods: {
        exportJson() {
            this.jsonMap = {}
            this.result.forEach(item => {
                this.jsonMap[item.countryCode] = item.token
            })
        },
        search() {
            this.$axios({
                url: '/processtoken/list?pageNumber=1&pageSize=50&state=-1&name=' + this.keyword,
                method: 'GET',
                headers: {
                    Authorization:
                        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzaGFuZ3hpbmJvIiwidWlkIjoxNDYsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTU2NzY2MDIzNDU4NCwiZGVwdGlkIjpbXSwiZXhwIjoxNTY3NzQ2NjM0LCJ0ZW5hbnQiOjF9.i_LLgSj1c0DlFYckL1t_eITy52ss9FZoWJCSSsv8FCN69nmNVZWA5muwoeT6rCji7MIUIyNUfVsszoU8Hbkz0w'
                },
                data: {
                    date: new Date().getTime()
                }
            }).then(data => {
                this.result = data.data.rows
            })
        },
        del() {
            this.result.forEach(item => {
                this.delToken(item.id)
            })
        },
        delToken(id) {
            this.$axios({
                url: '/processtoken/delete/' + id,
                method: 'POST',
                headers: {
                    Authorization:
                        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzaGFuZ3hpbmJvIiwidWlkIjoxNDYsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTU2NzY2MDIzNDU4NCwiZGVwdGlkIjpbXSwiZXhwIjoxNTY3NzQ2NjM0LCJ0ZW5hbnQiOjF9.i_LLgSj1c0DlFYckL1t_eITy52ss9FZoWJCSSsv8FCN69nmNVZWA5muwoeT6rCji7MIUIyNUfVsszoU8Hbkz0w'
                },
                data: {
                    date: new Date().getTime()
                }
            })
        },
        add(i) {
            if (i < countrys.length) {
                this.createToken(countrys[i].country, countrys[i].id, data => {
                    this.result.push(data)
                    this.add(i + 1)
                })
            }
        },
        createToken(country, code, callback) {
            const datestr = dayjs().format('MM-DD')
            this.$axios({
                url: '/processtoken/add',
                method: 'POST',
                headers: {
                    Authorization:
                        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzaGFuZ3hpbmJvIiwidWlkIjoxNDYsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTU2NzY2MDIzNDU4NCwiZGVwdGlkIjpbXSwiZXhwIjoxNTY3NzQ2NjM0LCJ0ZW5hbnQiOjF9.i_LLgSj1c0DlFYckL1t_eITy52ss9FZoWJCSSsv8FCN69nmNVZWA5muwoeT6rCji7MIUIyNUfVsszoU8Hbkz0w'
                },
                data: {
                    applicationId: 2,
                    countryCode: country,
                    countryId: code,
                    minutes: 60 * 24 * 365 * 10,
                    // miniutes: 1,
                    name: 'H5-anonys-' + datestr + '-' + country,
                    role: '0',
                    userId: '9999'
                }
            }).then(res => {
                if (res.data.code == 0) {
                    callback(res.data.data)
                }
            })
        }
    }
}
</script>
