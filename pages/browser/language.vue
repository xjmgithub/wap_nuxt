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
                   lang:'fy'
                },
                {
                   language:'Swahili',
                   lang:'sy'
                },
                {
                   language:'Portuguese',
                   lang:'py'
                }
            ]
        }
    },
    methods: {
        chooseLang(lang){
            this.$store.commit('SET_LANG', lang)
            this.$router.push('/browser')
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
