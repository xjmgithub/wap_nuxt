<template>
    <div class="wrapper">
        <download class="clearfix"/>
        <div class="poster">
            <img :src="sPoster" alt="" class="cover">
            <span class="program-name">{{sName}}</span>
            <p>{{sDescription}}</p>
        </div>
        <div class="poster father ">
            <nuxt-link to="/browser/programlist/program">
                <span class="program-name">{{pName}}</span>
                <div class="clearfix">
                    <p>{{pDescription}}</p>
                    <img :src="pPoster" alt="">
                </div>
            </nuxt-link>
        </div>
        <div class="clips">
            <p>{{$store.state.lang.officialwebsitemobile_subprogramdetails_clips}}</p>
            <ul class="clearfix">
                <li v-for="(item,index) in subProgram" :key="index" @click="toSubProgramDetail(item)">
                    <img :src="item.poster.resources[0].url">
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import download from '~/components/web/download'
export default {
    layout:'default',
    data(){
      return{
            pPoster:'',
            pId:'',
            pName:'',
            pDescription:'',
            sPoster:'',
            sId:'',
            sName:'',
            sDescription:'',
            subProgram:[]
      } 
    },
    mounted() {
        let program = sessionStorage.getItem('program')
        let subprogram = sessionStorage.getItem('subprogram')
        if(program){
            let info = JSON.parse(program) 
            this.pPoster = info.poster
            this.pId = info.id
            this.pName = info.name
            this.pDescription = info.description
            this.getSubProgram()
        }
        if(subprogram){
            let info = JSON.parse(subprogram) 
            this.sPoster = info.poster.resources[0].url
            this.sId = info.id
            this.sName = info.name
            this.sDescription = info.description
        }
    },
    methods: {
        getSubProgram(){
            this.$axios.get(`/vup/v1/program/${this.pId}/sub-vods`).then(res => {
                let data = res.data.data
                if(data && data.length > 0){
                    this.subProgram = data
                }
            })
        },
        toSubProgramDetail(item){
            sessionStorage.setItem('subprogram',JSON.stringify(item))
            this.$router.go(0)
        }
    },
    components:{
        download
    },
    head() {
        return {
            title: 'List'
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.wrapper{
    .poster{
        width: 94%;
        margin: .5rem auto;
        border-bottom: 1px solid #D8D8D8;
        padding-bottom: .5rem;
        .cover{
            width:100%;
        }
        .program-name{
            font-weight: bold;
            color:#333333;
            margin:.5rem 0;
        } 
        p{
            color:#666666;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            font-size:.9rem;
        }
        &.father{
            padding-bottom:.5rem;
            p{
                width:60%;
                float: left;
                font-size: .85rem;
                height:auto;
            }
            img{
                display: block;
                width:38%;
                float:right;
            }
        }
    }
    .clips{
        width: 94%;
        margin: .5rem auto;
        p{
            color:#111111;
            margin:.5rem 0;
            font-weight: bold;
        }
        ul{
            li{
                list-style: none;
                float: left;
                width: 48%;
                line-height: 1.1rem;
                &:nth-child(2n){
                    float: right;
                }
                img{
                    width:100%;
                    display: block;
                }
                span{
                    font-size: .85rem;
                    color:#666666;
                }
            }
        }
    }
}
</style>
