<template>
    <div id="result">
        <div class="container">
            <div class="des">
                <p>My Charactersitics:</p>
                <span>{{rolePercent}}</span>
                <span v-for="(item,index) in result" :key="index">{{item.desLong}}</span>
            </div>
            <div class="share" @click="toShare()">
                <img src="~assets/img/naire/ic_share_def_g.png"> SHARE TO MY FRIENDS
            </div>
        </div>
    </div>
</template>
<script>
import asintado from '~/functions/asintado'
export default {
    layout: 'base',
    filters: {},
    data() {
        return {
            userGender: this.$route.query.gender,
            result: [],
            rolePercent: ''
        }
    },
    mounted() {
        const characterResult = localStorage.getItem('character_result')
        if (!characterResult) {
            const tmp = asintado()
            const data = tmp[this.userGender]
            this.result.push(data.Asintado[Math.floor(Math.random() * data.Asintado.length)])
            this.result.push(data.GOT[Math.floor(Math.random() * data.GOT.length)])
            this.result.push(data.Avengers[Math.floor(Math.random() * data.Avengers.length)])
            console.log(this.result)
            localStorage.setItem('character_result', JSON.stringify(this.result))
        } else {
            this.result = JSON.parse(characterResult)
        }
        this.getPercent()
    },
    methods: {
        getPercent() {
            const percent = localStorage.getItem('percent')
            if (!percent) {
                const p1 = Math.floor(Math.floor(Math.random() * 33))
                const p2 = Math.floor(Math.floor(Math.random() * 33))
                const p3 = 100 - p1 - p2 // 最大值
                this.rolePercent = `You're ${p3}%${this.result[0].roleName},${p1}%${this.result[1].roleName},${p2}%${this.result[2].roleName}.`
                localStorage.setItem('percent', this.rolePercent)
            } else {
                this.rolePercent = percent
            }
        },
        toShare() {}
    },
    head() {
        return {
            title: 'Characteristic Test Result'
        }
    }
}
</script>
<style>
html {
    background: linear-gradient(180deg, rgba(85, 85, 85, 1) 0%, rgba(201, 183, 166, 1) 100%);
}
</style>
<style lang="less" scoped>
#result {
    .container {
        width: 95%;
        margin: 0 2.5%;
        text-align: center;
    }
    .des {
        text-align: left;
        padding: 0 0.5rem;
        margin: 1rem 0;
        p {
            background: linear-gradient(360deg, rgba(191, 143, 22, 1) 0%, rgba(237, 213, 154, 1) 100%);
            background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }
        span {
            color: #ffffff;
        }
    }
    .share {
        display: inline-block;
        padding: 0 1rem;
        color: #63428a;
        font-size: 0.95rem;
        vertical-align: middle;
        background: linear-gradient(180deg, rgba(235, 202, 77, 1) 0%, rgba(235, 200, 112, 1) 34%, rgba(188, 147, 43, 1) 100%);
        border-radius: 20px;
        font-weight: bold;
        margin-top: 1rem;
        height: 2.5rem;
        line-height: 2.5rem;
        img {
            width: 1.5rem;
        }
    }
}
</style>
