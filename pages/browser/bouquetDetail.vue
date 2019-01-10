<template>
    <div class="wrapper">
        <div class="bouquets">
            <span>Dish</span>
        </div>
    </div>
</template>

<script>
export default {
    layout:'default',
    data(){
        return{
            detailList:[]
        }
    },
    mounted() {
        let packageCode = this.$route.query.packageCode
        let id = this.$route.query.id
        console.log(id)
        this.$axios.get(
            `/cms/v2/vup/snapshot/channels?count=500&platformTypes=1&platformTypes=0&packageCode=${packageCode}`
        ).then(res => {
            let countChannel = res.data
            let platformInfo, packages, detail
            if(countChannel.length > 0){
                countChannel.forEach(channel => {
                    platformInfo = channel.ofAreaTVPlatforms[0].platformInfos
                    platformInfo.forEach(platform=>{
                        packages = platform.packages
                        packages.forEach(detail=>{
                            if(detail.id == id){
                                this.detailList.push(channel)
                            }
                        })
                    })
                });
            }
        console.log(this.detailList)
        })
    },
    head() {
        return {
            title: 'bouquetDetail'
        }
    }
}
</script>

<style lang="less">
@import '~assets/less/browser/index.less';
.bouquets{
    width: 94%;
    margin: 0 auto;
    border-bottom: 1px solid #d8d8d8;
    & > span {
        font-size: 0.95rem;
        color: #333333;
        font-weight: 600;
    }
}
   
</style>
