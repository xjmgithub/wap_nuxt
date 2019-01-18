<template>
    <div class="wrapper ">
        <download class="clearfix"/>
        <div class="poster">
            <img src="~assets/img/web/pic1.png" alt="">
            <span class="program-name">Game of Hrones</span>
            <p>England wins on penalties(3-4),England defeated Colombia to reach the quarter-finals of the 2018 FIF…</p>
        </div>
        <div class="clips">
            <p>{{$store.state.lang.officialwebsitemobile_subprogramdetails_clips}}</p>
            <ul class="clearfix">
                <li>
                    <img src="~assets/img/web/pic2.jpg" alt="">
                    <span>Wonderful cilps from Game of Hroones1</span>
                </li>
                <li>
                    <img src="~assets/img/web/pic3.jpg" alt="">
                    <span>Wonderful cilps from Game of Hroones2</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import download from '~/components/web/download'
export default {
    layout:'default',
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
        img{
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
            height:3rem;
            line-height: 1.5rem;
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
