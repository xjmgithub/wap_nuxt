<template>
    <div>
        <div class="country">
            <p class="title">
                Choose your language
            </p>
            <ul>
                <li v-for="(item,index) in langList" :key="index" @click="chooseLang(item.lang)">
                    {{item.language}}
                    <img src="~assets/img/web/ic_categary.png" class="arrows">
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { setCookie } from '~/functions/utils'
export default {
    layout: 'default',
    data() {
        return {
            langList: [
                {
                    language: 'English',
                    lang: 'en'
                },
                {
                    language: 'French',
                    lang: 'fr'
                },
                {
                    language: 'Kiswahili',
                    lang: 'sw'
                },
                {
                    language: 'português',
                    lang: 'pt'
                }
            ]
        }
    },
    methods: {
        chooseLang(lang) {
            if (lang.indexOf('fr') >= 0) {
                this.$store.commit('SET_LANG', lang)
            } else if (lang.indexOf('sw') >= 0) {
                this.$store.commit('SET_LANG', lang)
            } else if (lang.indexOf('pt') >= 0) {
                this.$store.commit('SET_LANG', lang)
            } else {
                this.$store.commit('SET_LANG', lang)
            }
            setCookie('lang', lang)
            window.history.go(-1)
        }
    },
    head() {
        return {
            title: 'Change language'
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
