<template>
    <div>
        <div id="box" ref="box" :style="{'left':left, 'top':top}" @touchstart="down" @mousedown="down" @touchmove="move" @mousemove="move" @touchend="up" @mouseup="up" />
        <div class="open-layer" />
        <div class="open">
            <div class="top">
                <img src="~assets/img/vote/open_top.png">
                <p>
                    <span>{{time}}s</span>
                    <span @click="aboutCard = true">About</span>
                </p>
                <div class="btn">JOIN NOW!</div>
            </div>
            <div class="bot">
                <img src="~assets/img/vote/open_bot.png">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data: function() {
        return {
            isDown: false,
            left: '',
            top: '',
            time: 4
        }
    },
    mounted() {
        const timer = setInterval(() => {
            if (this.time <= 0) {
                clearInterval(timer)

                return
            }
            this.time--
        }, 1000)
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
                const x = e.clientX - this.$refs.box.offsetWidth / 2
                const y = e.clientY - this.$refs.box.offsetHeight / 2
                const dw = document.body.clientWidth - this.$refs.box.offsetWidth
                const dh = document.body.clientHeight - this.$refs.box.offsetHeight
                if (x <= dw && x >= 0) {
                    this.left = x + 'px'
                } else if (x > dw) {
                    this.left = dw + 'px'
                } else {
                    this.left = 0
                }
                if (y <= dh && y >= 0) {
                    this.top = y + 'px'
                } else if (y > dh) {
                    this.top = dh + 'px'
                } else if (y < 0) {
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
<style lang="less">
html,
body {
    width: 100%;
    height: 100%;
    min-height: 100vh;
}
#box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
    height: 100px;
    background: red;
}
.open1 {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    position: fixed;
    left: 0;
    bottom: 0;
    background: #000000;
    z-index: 100;
    .top {
        position: fixed;
        top: 0;
        z-index: 101;
        p {
            position: fixed;
            top: 0;
            padding: 1rem;
            color: #ffffff;
            font-weight: bold;
            width: 100%;
            span {
                &:nth-child(2) {
                    float: right;
                    text-decoration: underline;
                }
            }
        }
        .btn {
            width: 80%;
            text-align: center;
            background: #c79e5f;
            color: #ffffff;
            height: 2.5rem;
            line-height: 2.5rem;
            margin: 0 auto;
        }
    }
    .bot {
        position: fixed;
        bottom: 0;
    }
    img {
        width: 100%;
    }
}
.open-layer {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    position: fixed;
    left: 0;
    bottom: 0;
    background: #000000;
}
.open {
    z-index: 1001;
    .top {
        position: fixed;
        top: 0;
        p {
            position: fixed;
            top: 0;
            padding: 1rem;
            color: #ffffff;
            font-weight: bold;
            width: 100%;
            span {
                &:nth-child(2) {
                    float: right;
                    text-decoration: underline;
                }
            }
        }
        .btn {
            width: 80%;
            text-align: center;
            background: #c79e5f;
            color: #ffffff;
            height: 2.5rem;
            line-height: 2.5rem;
            margin: 0 auto;
        }
    }
    .bot {
        position: fixed;
        bottom: 0;
    }
    img {
        width: 100%;
    }
}
</style>
