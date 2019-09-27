<template>
    <div style="width:100%;height:10rem;text-align:center;line-height:10rem;" @click="callup">点击唤醒app</div>
</template>
<script>
export default {
    layout: 'base',
    methods: {
        callup() {
            window.location.href = 'starba://platformapi/webtoapp'
        }
    }
}
</script>
