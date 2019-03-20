<template>
    <div class="wrapper">
        <div class="country">
            <p class="title">
                Choose your country
            </p>
            <ul>
                <li v-for="(item,index) in countryList" v-show="item.id!=8" :key="index" @click="chooseCountry(item)">
                    <img :src="item.nationalFlag.replace('http:','https:')" alt class="nationalFlag">
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
import { setCookie } from '~/functions/utils'
export default {
    data() {
        return {
            countryList: countrys,
            user: this.$store.state.user
        }
    },
    mounted() {
        this.$nextTick(() => this.$nuxt.$loading.finish())
    },
    methods: {
        chooseCountry(item) {
            setCookie('country', item.country)
            setCookie('gtoken', tokenMap[item.country])
            this.$store.commit('SET_AREA_INFO', item)
            this.$store.commit('SET_GTOKEN', tokenMap[item.country])
            this.$router.replace('/browser')
        }
    },
    head() {
        return {
            title: 'Change country'
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.country {
    .title {
        font-size: 1.1rem;
        font-weight: bold;
        padding-top: 1rem;
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
</style>
