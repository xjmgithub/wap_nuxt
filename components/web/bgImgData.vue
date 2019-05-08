<template>
    <div class="package">
        <img v-if="imgPath" :src="cdnPicSrc(imgPath)">
        <div v-else class="nopic">
            <div>{{packageName}}</div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        imgPath: {
            required: true,
            type: String,
            default: ''
        },
        packageName: {
            required: true,
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="less" scoped>
.package {
    width: 100%;
    img {
        display: block;
        width: 100%;
    }
    .nopic {
        background: url('~assets/img/web/wap_ccard.png');
        background-size: 100% 100%;
        border-radius: 3px;
        text-align: center;
        font-size: 0.9rem;
        position: relative;
        &::before {
            content: '';
            display: inline-block;
            padding-bottom: 56%;
            width: 0.1px;
            vertical-align: middle;
        }
        & > div {
            position: absolute;
            top: 0.4rem;
            left: 0.6rem;
        }
    }
}
</style>
