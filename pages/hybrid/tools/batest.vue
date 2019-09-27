<template>
    <div>
        <div style="width:100%;height:10rem;text-align:center;line-height:10rem;" @click="callup">点击唤醒ba</div>
        <div style="width:100%;height:10rem;text-align:center;line-height:10rem;" @click="callOn">点击唤醒ON</div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    methods: {
        callup() {
            window.location.href = 'starba://platformapi/webtoapp'
        },
        callOn() {
            window.location.href = 'starvideo://platformapi/webtoapp'
        }
    }
}
</script>
