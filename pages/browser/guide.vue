<template>
    <div class="wrapper wide">
        <download class="clearfix"/>
        <div class="guide">
            <div class="search">
                <input type="text" placeholder="Search your favorite channels">
                <img src="~assets/img/web/ic_search.png" @click="search">
            </div>
            <div class="channels" v-for="(item ,i) in 5" :key="i">
                <img src="~assets/img/web/fox.jpg" alt="">
                <div class="celDetail">
                    <p>Fox news
                        <span class="dtt"><img src="~assets/img/web/ic_guide_dtt.png" alt="">135</span>
                        <span class="dth"><img src="~assets/img/web/ic_guide_dth.png" alt="">35</span>
                    </p>
                    <div v-for="(item,i) in 3" :key="i">
                        <span class="playTime" :class="{current:i==0}">14:00</span>
                        <div class="playTitle" :class="{current:i==0}"> World Cup Goals 2019
                            <div class="total" v-show="i==0">
                                <div class="progress" :style="{ width: '50%'}"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import download from '~/components/web/download'
export default {
    data(){
        return{
            channelList:[]
        }
    },
    methods:{
        search(){
            
        }
    },
    components: {
        download
    },
    filters: {
        formatPlayTime(time) {
            let tmp = new Date(time)
            let hours = tmp.getHours() >= 10 ? tmp.getHours() : '0' + tmp.getHours()
            let minutes = tmp.getMinutes() >= 10 ? tmp.getMinutes() : '0' + tmp.getMinutes()
            return hours + ':' + minutes
        }
    },
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.guide{
    width: 100%;
    padding: 0 0.8rem;
    .search{
        position: relative;
        margin:.5rem 0;
        input{
            width: 100%;
            padding-left:1rem;
            border-radius: 4px;
            border:1px solid #979797;
            height:2.5rem;
            line-height: 2.5rem;
            &::-webkit-input-placeholder{
                color:#BDBDBD;
                font-size: .95rem;
            }
            & + img{
                position: absolute;
                right:.8rem;
                top:50%;
                width:1.5rem;
                height:1.5rem;
                margin-top:-.75rem;
            }
        }
    }
    .channels{
        padding:1rem 0;
        border-bottom:1px solid #D8D8D8;
        img{
            width: 30%;
        }
        .celDetail{
            float: right;
            width:68%;
            padding-top:.3rem;
            p{
                span{
                    float: right;
                    margin-left:.5rem;
                    font-size: .95rem;
                    &.dtt{
                        color:#5EB108;
                    }
                    &.dth{
                        color:#E7336E;
                }
                    img{
                        width: 1rem;
                        height:1rem;
                        vertical-align: top;
                    }
                }
            }
            & > div{
                margin:.3rem 0;
            }
        }
        .playTime {
            font-size: 0.95rem;
            color: #000000;
            width: 20%;
            display: inline-block;
            vertical-align: top;
            &.current {
                color: #0084e5;
            }
        }
        .playTitle {
            font-size: 0.95rem;
            color: #333333;
            display: inline-block;
            width: 78%;
            vertical-align: top;
            &.current {
                color: #0084e5;
            }
            .total {
                width: 100%;
                height: 4px;
                background-color: #dddddd;
                border-radius: 4px;
                margin: 0.3rem 0;
                .progress {
                    background-color: #0084e5;
                    height: 4px;
                    border-radius: 4px;
                }
            }
        }
    }
}
</style>


