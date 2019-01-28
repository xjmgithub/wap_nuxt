<template>
    <div class="wrapper">
        <download class="clearfix"/>
        <div class="poster">
            <img :src="sPoster" alt class="cover">
            <span class="program-name">{{sName}}</span>
            <p>{{sDescription}}</p>
        </div>
        <div class="poster father">
            <nuxt-link to="/browser/programlist/program">
                <span class="program-name">{{pName}}</span>
                <div class="clearfix">
                    <p v-html="pDescription"/>
                    <img :src="pPoster" alt>
                </div>
            </nuxt-link>
        </div>
        <div class="clips">
            <p>{{$store.state.lang.officialwebsitemobile_subprogramdetails_clips}}</p>
            <ul class="clearfix">
                <li v-for="(item,index) in subProgram" :key="index" @click="toSubProgramDetail(item.id)">
                    <div>
                        <img :src="item.poster.resources[0].url">
                        <span class="show-time">{{item.durationSecond | formatShowTime}}</span>
                    </div>
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import download from '~/components/web/download'
export default {
    layout: 'default',
    data() {
        return {
            pPoster: '',
            pId: this.$route.query.proId,
            pName: '',
            pDescription: '',
            sPoster: '',
            sId: this.$route.query.subId,
            sName: '',
            sDescription: '',
            subProgram: []
        }
    },
    mounted() {
        let program = sessionStorage.getItem('program')
        if (program) {
            let info = JSON.parse(program)
            this.pPoster = info.poster
            this.pId = info.id
            this.pName = info.name
            this.pDescription = info.programAbstract
        }
        if(this.pId){
            this.getSubProgram()
        }
    },
    methods: {
        getSubProgram() {
            this.$axios.get(`/vup/v1/program/${this.pId}/sub-vods`).then(res => {
                let data = res.data.data
                if (data && data.length > 0) {
                    this.subProgram = data
                    this.toSubProgramDetail(this.sId)
                }
            })
        },
        toSubProgramDetail(id) {
            this.subProgram.forEach(ele => {
                if(ele.id == id){
                    this.sPoster = ele.poster.resources[0].url
                    this.sName = ele.name
                    this.sDescription = ele.summary
                }
            });
        }
    },
    filters:{
        formatShowTime(val){
            if(val<60){
                let tmp = val < 10 ? '0'+val : val
                return '00:'+ val
            }else if(val>=60 && val<360){
                let min = Math.floor(val / 60) < 10 ? '0'+ Math.floor(val / 60) : Math.floor(val / 60)
                let sec = Math.floor(val % 60) < 10 ? '0'+ Math.floor(val % 60) : Math.floor(val % 60)
                return min + ':' + sec
            }else if(val>=360){
                let hour = Math.floor(val / 360) < 10 ? '0'+ Math.floor(val / 360) : Math.floor(val / 360)
                let min = Math.floor(val % 360 / 60) < 10 ? '0'+ Math.floor(val % 360 / 60) : Math.floor(val % 360 / 60)
                let sec = Math.floor(val % 60) < 10 ? '0'+ Math.floor(val % 60) : Math.floor(val % 60)
                return hour +':' + min + ':' + sec
            }
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
.wrapper {
    img {
        border-radius:2px;
    }
    .poster {
        width: 94%;
        margin: 0.5rem auto;
        border-bottom: 1px solid #d8d8d8;
        padding-bottom: 0.5rem;
        .cover {
            width: 100%;
            height: 11rem;
            margin-bottom:0.5rem;
        }
        .program-name {
            font-weight: bold;
            color: #333333;
            margin: 0.5rem 0;
            line-height:2rem;
        }
        p {
            color: #666666;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            font-size: 0.9rem;
        }
        &.father {
            padding-bottom: 0.5rem;
            p {
                width: 60%;
                float: left;
                font-size: 0.85rem;
                height: auto;
                word-break: break-all;
            }
            img {
                display: block;
                width: 38%;
                float: right;
                height: 5rem;
            }
        }
    }
    .clips {
        width: 94%;
        margin: 0.5rem auto;
        p {
            color: #111111;
            margin: 0.5rem 0;
            font-weight: bold;
        }
        ul {
            li {
                list-style: none;
                float: left;
                width: 48%;
                line-height: 1.1rem;
                &:nth-child(2n) {
                    float: right;
                }
                div {
                    position: relative;
                    .show-time{
                        position: absolute;
                        bottom:0;
                        right:0;
                        padding:0 .2rem;
                        background:rgba(0,0,0,1);
                        color:#FFFFFF;
                        font-size: .8rem;
                    }
                    img{
                    width:100%;
                    display: block;
                    height:5rem;
                    }
                }
                span {
                    font-size: 0.85rem;
                    color: #666666;
                }
            }
        }
    }
}
</style>
