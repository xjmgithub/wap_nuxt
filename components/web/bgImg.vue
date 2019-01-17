<template>
    <div :class="className" class="bouquet_img"/>
</template>
<script>
export default {
    props: {
        bouquetName: {
            type: String,
            default: ''
        },
        tvPlatForm: {
            type: String,
            default: ''
        }
    },
    computed: {
        className(){
            if(this.tvPlatForm == 'DTT'){
                let data = this.bouquetName.toLowerCase()
                let tmp = ''
                if (data == 'sport plus') tmp = 'dtt-sportsplus'
                else if (data == 'unique') tmp = 'dtt-unique'
                else if (data == 'classique') tmp = 'dtt-classique'
                else if (data == 'nova') tmp = 'dtt-nova'
                else if (data == 'basique') tmp = 'dtt-basique'
                else if (data == 'sport play') tmp = 'dtt-sportsplay'
                return tmp
            }else if(this.tvPlatForm == 'DTH'){
                let data = this.bouquetName.toLowerCase()
                let tmp = ''
                if (data == 'sport plus') tmp = 'dth-sportsplus'
                else if (data == 'super') tmp = 'dth-super'
                else if (data == 'smart') tmp = 'dth-smart'
                else if (data == 'engilsh') tmp = 'dth-engilsh'
                else if (data == 'indian') tmp = 'dth-indian'
                else if (data == 'chinese') tmp = 'dth-chinese'
                else if (data == 'sport play') tmp = 'dth-sportsplay'
                return tmp
            }
        }
    },
}
</script>
<style lang="less" scoped>
.bouquet_img{
    width:100%;
    background-size: 100% !important;
    &::before{
        content: '';
        display: inline-block;
        padding-bottom: 64%;
        width: 0.1px;
        vertical-align: middle;
    }
    &.dtt-sportsplus{
        background: url("~assets/img/web/pic_sportsplus_dtt.png") no-repeat ;
    }
    &.dtt-unique{
        background: url("~assets/img/web/pic_unique_dtt.png") no-repeat center;
    }
    &.dtt-classique{
        background: url("~assets/img/web/pic_classique_dtt.png") no-repeat center;
    }
    &.dtt-nova{
        background: url("~assets/img/web/pic_nova_dtt.png") no-repeat center;
    }
    &.dtt-basique{
        background: url("~assets/img/web/pic_basique_dtt.png") no-repeat center;
    }
    &.dtt-sportsplay{
        background: url("~assets/img/web/pic_sportsplay_dtt.png") no-repeat center;
    }

    &.dth-sportsplus{
        background: url("~assets/img/web/pic_sportsplus_dth.png") no-repeat center;
    }
    &.dth-super{
        background: url("~assets/img/web/pic_super_dth.png") no-repeat center;
    }
    &.dth-smart{
        background: url("~assets/img/web/pic_smart_dth.png") no-repeat center;
    }
    &.dth-engilsh{
        background: url("~assets/img/web/pic_engilsh_dth.png") no-repeat center;
    }
    &.dth-indian{
        background: url("~assets/img/web/pic_indian_dth.png") no-repeat center;
    }
    &.dth-chinese{
        background: url("~assets/img/web/pic_Chinese_dth.png") no-repeat center;
    }
    &.dth-sportsplay{
        background: url("~assets/img/web/pic_sportsplay_dth.png") no-repeat center;
    }
}
</style>
