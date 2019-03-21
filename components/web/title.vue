<template>
    <div class="title">
        <h3 v-if="!icon">
            <div class="dot">‧</div>
            <div>{{showTitle}}</div>
        </h3>
        <h3 v-else class="flytitle">
            <div>{{showTitle}}</div>
        </h3>
    </div>
</template>
<script>
export default {
     props: {
        showTitle: {
            type: String,
            default: '',
            required: true
        },
        icon:{
            type:Boolean,
            default:false,
            required: false
        }
    }
}
</script>
<style lang="less" scoped>
.title {
         h3 {
        margin: 0.4rem 0;
        color: #333333;
        font-weight: bold;
        div {
            margin-right: 0.3rem;
            font-size: 1.1rem;
            line-height: 2.5rem;
            &.dot {
                font-size: 2.5rem;
                height: 1rem;
                line-height: 2.3rem;
                float: left;
            }
        }
        &.flytitle {
            background: url('~assets/img/web/ON-RIGHT.png') no-repeat left center;
            background-size: 1rem;
            padding-left: 1.5rem;
        }
    }
}
</style>
