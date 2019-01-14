<template>
    <div class="wrapper">
        <download class="clearfix"/>
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
import download from '~/components/web/download'
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
    components:{
        channel,
        download
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
