<template>
    <div class="wrapper">
        <div class="country">
            <p class="title">Choose your country</p>
            <ul>
                <li v-for="(item,index) in countryList" :key="index" @click="chooseCountry(item)" v-show="item.id!=8">
                    <img :src="item.nationalFlag" alt class="nationalFlag">
                    {{item.name}}
                    <img src="~assets/img/web/ic_categary.png" class="arrows">
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import countrys from '~/functions/countrys.json'
import tokenMap from '~/functions/token.json'
import qs from 'qs'
export default {
    layout: 'default',
    data() {
        return {
            countryList: countrys,
            user: this.$store.state.user
        }
    },
    methods: {
        chooseCountry(item) {
            this.$store.commit('SET_AREA_INFO', item)

            // TODO COOKIE
            // TODO 更新用户国家
            // 更换 token
            if (this.user.role) {
                this.$axios({
                    url: '/ums/v1/user/country',
                    method: 'PUT',
                    data: qs.stringify({
                        countryId: item.id
                    }),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(res => {
                    let data = res.data
                    if (data && data.code == 0) {
                        this.$store.commit('SET_TOKEN', data.data)
                        window.history.go(-1)
                    } else {
                        this.$alert('update user country error')
                    }
                })
            } else {
                this.$store.commit('SET_TOKEN', tokenMap[item.country])
                window.history.go(-1)
            }
        }
    },
    head() {
        return {
            title: 'Country'
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.wrapper {
    .country {
        width: 94%;
        margin: 0 auto;
        .title {
            font-size: 1.1rem;
            font-weight: bold;
            padding-top: 0.5rem;
        }
        ul {
            li {
                list-style: none;
                border-top: 1px solid #dddddd;
                padding: 1rem 0 1rem 0.5rem;
                position: relative;
                &:first-child {
                    border: none;
                }
                img {
                    &.nationalFlag {
                        width: 1.5rem;
                        margin-right: 0.3rem;
                    }
                    &.arrows {
                        position: absolute;
                        right: 0;
                        width: 1.5rem;
                    }
                }
            }
        }
    }
}
</style>
