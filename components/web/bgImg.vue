<template>
    <div :class="bouquetName" class="bouquet_img"/>
</template>
<script>
export default {
    props: {
        bouquetName: {
            type: String,
            default: ''
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
