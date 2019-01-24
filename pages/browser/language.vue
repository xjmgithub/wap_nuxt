<template>
    <div class="wrapper ">
        <div class="country">
            <p class="title">Choose your language</p>
            <ul>
                <li v-for="(item,index) in langList" :key="index" @click="chooseLang(item.lang)" >
                    {{item.language}}
                    <img src="~assets/img/web/ic_categary.png" class="arrows">
                </li>
            </ul>

        </div>
    </div>
</template>
<script>
import LANG from '~/languages/'
import {setCookie } from '~/functions/utils'
export default {
    layout:'default',
    data(){
        return{
            langList:[
                {
                   language:'English',
                   lang:'en'
                },
                {
                   language:'French',
                   lang:'fr'
                },
                {
                   language:'Kiswahili',
                   lang:'sw'
                },
                {
                   language:'português',
                   lang:'pt'
                }
            ]
        }
    },
    methods: {
        chooseLang(lang){
            if (lang.indexOf('fr') >= 0) {
                this.$store.commit('SET_LANG_TYPE',lang)
                this.$store.commit('SET_LANG', LANG.fy)
            } else if (lang.indexOf('sw') >= 0) {
                this.$store.commit('SET_LANG_TYPE',lang)
                this.$store.commit('SET_LANG', LANG.sy)
            } else if (lang.indexOf('pt') >= 0) {
                this.$store.commit('SET_LANG_TYPE',lang)
                this.$store.commit('SET_LANG', LANG.py)
            } else {
                this.$store.commit('SET_LANG_TYPE',lang)
                this.$store.commit('SET_LANG', LANG.en)
            }
            setCookie('lang',lang)
            window.history.go(-1)
        }
    },
    head() {
    return {
        title: 'Language'
    }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.wrapper{
    .country{
        width: 94%;
        margin: 0 auto;
        .title{
            font-size: 1.1rem;
            font-weight: bold;
            padding-top:.5rem;
        }
        ul{
            li{
                list-style: none;
                border-top:1px solid #DDDDDD;
                padding:1rem 0 1rem .5rem;
                position: relative;
                color:#212121;
                &:first-child{
                    border: none;
                }
                img{
                    &.arrows{
                        position: absolute;
                        right:0;
                        width:1.5rem
                    }
                }
            }
        }
    }
}
</style>
