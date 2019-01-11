<template>
    <div class="wrapper">
        <p class="download clearfix" @click="tolandingPage">Download StarTimes On App to watch! <span>GO ></span></p>
        <div class="channelList">
            <p class="title">{{channelList.length}} Channels live on StarTimes On</p>
            <channel 
                v-for="(item,index) in channelList" 
                :key="index" 
                class="piece"
                :channel-name="item.name"
                :description="item.describes"
                :state="item.channel.billingType"
                :rate="item.rate"/>
        </div>
    </div>
</template>

<script>
import channel from '~/components/web/channel'
export default {
    layout:"default",
    data(){
        return{
            channelList:[]
        }
    },
    mounted() {
        this.$axios.get(`/cms/vup/channels/dispark/categories`).then(res => {
                let data = res.data
                if (data.length > 0) {
                    data.forEach(ele => {
                        let disparkChannel =  ele.disparkChannel
                        disparkChannel.forEach(item=>{
                            if(item.programVO){
                                let tmp = new Date(item.programVO.startDate).getHours()  
                                let startDate = tmp > 0 ? tmp +':00' : '0' + tmp + ':00' 
                                item.describes = startDate + ' ' + item.programVO.name
                                let totalTime = item.programVO.endDate - item.programVO.startDate
                                let nowTime = new Date().getTime() - item.programVO.startDate
                                item.rate = Math.floor( (nowTime / totalTime) * 100)
                            }else{
                                item.rate = Math.floor( Math.random() * 100)
                            }
                            this.channelList.push(item)
                        })
                    });
                }
            })
    },
    methods:{
        tolandingPage(){
            this.$router.push('/hybrid/lands')
        }
    },
    components:{
        channel
    },
    head() {
        return {
            title: 'phoneplay'
        }
    }
}
</script>

<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.wrapper{
    .download{
        padding:.5rem .8rem;
        background-color: #FFBE19;
        font-weight: bold;
        font-size: .9rem;
        span{
            color:#0087EB;
            float: right;
        }
    }
    .channelList{
        padding:.8rem;
        .title{
            font-weight: bold;
            padding:0
        }
        .piece{
            margin:.8rem 0;
        }
    }
}
</style>
