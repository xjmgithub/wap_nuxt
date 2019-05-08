<template>
    <div>
        <div id="box" ref="box" :style="{'left':left, 'top':top}" @touchstart="down" @mousedown="down" @touchmove="move" @mousemove="move" @touchend="up" @mouseup="up" />
    </div>
</template>
<script>
export default {
    layout: 'base',
    data: function() {
        return {
            isDown: false,
            left: '',
            top: ''
        }
    },
    methods: {
        down(event) {
            this.isDown = true
        },
        move(event) {
            if (this.isDown) {
                let e
                if (event.touches) {
                    e = event.touches[0]
                } else {
                    e = event
                }
                const x = e.clientX - (this.$refs.box.offsetWidth /2)
                const y = e.clientY - (this.$refs.box.offsetHeight /2)
                const dw = document.body.clientWidth - this.$refs.box.offsetWidth
                const dh = document.body.clientHeight- this.$refs.box.offsetHeight
                if(x<=dw && x>=0){
                    this.left = x + 'px'
                }else if( x > dw){
                    this.left = dw + 'px'
                }else{
                    this.left = 0
                }
                if(y<=dh && y>=0){
                    this.top = y + 'px'
                }else if( x > dh){
                    this.top = dh + 'px'
                }else if(y<0){
                    this.top = 0
                }
            }
        },
        up() {
            this.isDown = false
        }
    }
}
</script>
<style>
html,body{
    width:100%;
    height:100%;
    min-height:100vh
}
#box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
    height: 100px;
    background: red;
}
</style>
