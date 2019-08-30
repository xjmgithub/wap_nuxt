<template>
    <div class="wrapper">
        <div class="container">
            <div class="vote-box"></div>
            <div class="share"></div>
            <div class="lottery-box">
                <div class="lottery-title"></div>
                <div class="lottery-count"></div>
                <div class="lottery">
                    <ul>
                        <li>
                            <div :class="index==0?'active':''">
                                <div class="prize">
                                    <p>Coupons</p>
                                </div>
                                <div class="mask"></div>
                            </div>
                            <div :class="index==1?'active':''">
                                <div class="prize">
                                    <p>DVB包+月会员</p>
                                </div>
                                <div class="mask"></div>
                            </div>
                            <div :class="index==2?'active':''">
                                <div class="prize">
                                    <p>Try Again</p>
                                </div>
                                <div class="mask"></div>
                            </div>
                        </li>
                        <li>
                            <div class="getLuck" @click="startLottery">
                                <p>START</p>
                            </div>
                        </li>
                        <li>
                            <div :class="index==5?'active':''">
                                <div class="prize">
                                    <p>More Votes</p>
                                </div>
                                <div class="mask"></div>
                            </div>
                            <div :class="index==4?'active':''">
                                <div class="prize">
                                    <p>月会员</p>
                                </div>
                                <div class="mask"></div>
                            </div>
                            <div :class="index==3?'active':''">
                                <div class="prize">
                                    <!-- <img src="~assets/img/vote/luck-icon.png" alt /> -->
                                    <p>Sorry</p>
                                </div>
                                <div class="mask"></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="msg-box">
            <ul ref="msg" class="msg" :class="{anim:animate==true}">
                <li v-for="item in items" :key="item.key">{{item.name}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            title: '积分转盘',
            index: -1, // 当前转动到哪个位置，起点位置
            count: 6, // 总共有多少个位置
            timer: 0, // 每次转动定时器
            speed: 200, // 初始转动速度
            times: 0, // 转动次数
            cycle: 30, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
            prize: -1, // 中奖位置
            click: true,

            animate: false,
            items: [
                {
                    key: 1,
                    name: '消息1'
                },
                {
                    key: 2,
                    name: '消息2'
                },
                {
                    key: 3,
                    name: '消息3'
                },
                {
                    key: 4,
                    name: '消息4'
                },
                {
                    key: 5,
                    name: '消息5'
                }
            ]
        }
    },

    mounted() {
        setInterval(this.scroll, 2000)
    },

    methods: {
        // 消息轮播
        scroll() {
            const msg = this.$refs.msg
            msg.style.marginTop = '-30px'
            this.animate = !this.animate
            setTimeout(() => {
                this.items.push(this.items[0])
                this.items.shift()
                msg.style.marginTop = '0'
                this.animate = !this.animate // 避免回滚
            }, 500)
        },

        // 开始抽奖
        startLottery() {
            if (!this.click) {
                return
            }
            this.speed = 200
            this.click = false
            this.startRoll()
        },
        // 开始转动
        startRoll() {
            this.times += 1 // 转动次数
            this.oneRoll() // 转动过程调用的每一次转动方法，这里是第一次调用初始化

            // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
            if (this.times > this.cycle + 10 && this.prize === this.index) {
                clearTimeout(this.timer) // 清除转动定时器，停止转动
                // this.prize = -1
                this.times = 0
                console.log('你已经中奖了，位置' + this.index)
                if (this.index === 0) {
                    setTimeout(() => {
                        this.$alert(
                            'Coupons',
                            () => {
                                this.click = true
                            },
                            '收下了'
                        )
                    }, 1000)
                } else if (this.index === 1) {
                    setTimeout(() => {
                        this.$alert(
                            'DVB包+月会员~',
                            () => {
                                this.click = true
                            },
                            '收下了'
                        )
                    }, 1000)
                } else if (this.index === 2) {
                    setTimeout(() => {
                        this.$alert(
                            'Try Again~',
                            () => {
                                this.click = true
                                this.startLottery()
                            },
                            'Try Again'
                        )
                    }, 1000)
                } else if (this.index === 3) {
                    setTimeout(() => {
                        this.$alert(
                            'sorry~',
                            () => {
                                this.click = true
                            },
                            'Got It'
                        )
                    }, 1000)
                } else if (this.index === 4) {
                    setTimeout(() => {
                        this.$alert(
                            '月会员~',
                            () => {
                                this.click = true
                            },
                            '收下了'
                        )
                    }, 1000)
                } else if (this.index === 5) {
                    setTimeout(() => {
                        this.$alert(
                            'You Have Got ' + Math.ceil(Math.random() * 5) + ' Votes~',
                            () => {
                                this.click = true
                            },
                            '收下了'
                        )
                    }, 1000)
                }
            } else {
                if (this.times < this.cycle) {
                    this.speed -= 10 // 加快转动速度
                } else if (this.times === this.cycle) {
                    // TODO后台取得一个中奖位置 随机数代替
                    const index = Math.floor(Math.random() * 10) > 5 ? 5 : Math.floor(Math.random() * 5)
                    // const index = 2
                    this.prize = index
                    console.log(`中奖位置${this.prize}`)
                } else if (this.times > this.cycle + 10 && ((this.prize === 0 && this.index === 5) || this.prize === this.index + 1)) {
                    this.speed += 110
                } else {
                    this.speed += 20
                }

                if (this.speed < 40) {
                    this.speed = 40
                }
                this.timer = setTimeout(this.startRoll, this.speed)
            }
        },

        // 每一次转动
        oneRoll() {
            let index = this.index // 当前转动到哪个位置
            const count = this.count // 总共有多少个位置
            index += 1
            if (index > count - 1) {
                index = 0
            }
            this.index = index
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    .lottery-box {
        padding: 0 3rem;
        position: relative;
        padding-top: 0 3rem;

        .lottery {
            width: 100%;
            height: 100%;
            margin: 0 auto;
            position: relative;

            ul {
                position: absolute;
                top: 5rem;
                left: 50%;
                margin-left: -8rem;
                width: 6rem;
                height: 6rem;

                li {
                    height: 5rem;
                    display: flex;
                    margin-top: 0.4rem;

                    > div {
                        flex: 1;
                        margin-right: 0.4rem;
                        height: 100%;
                        text-align: center;
                        position: relative;

                        .prize {
                            width: 5.5rem;
                            height: 5rem;
                            font-size: 0.8rem;
                            line-height: 5rem;
                            margin: 0;
                            background-color: #faf;
                        }

                        .mask {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            opacity: 0.3;
                            background-color: #000;
                            display: none;
                        }
                    }

                    > div.active {
                        .mask {
                            display: block;
                        }
                    }

                    > div:first-child {
                        margin-left: 0.4rem;
                    }

                    > div.getLuck {
                        border: 1px solid black;
                        p {
                            font-size: 1.2rem;
                            font-weight: 600;
                            line-height: 1.1;
                            margin-top: 0.7rem;
                        }
                    }
                }

                li:last-child {
                    margin-bottom: 0.4rem;
                }
            }
        }
    }
    .msg-box {
        width: 300px;
        height: 32px;
        line-height: 30px;
        overflow: hidden;
        padding-left: 30px;
        border: 1px solid black;
        transition: all 0.5s;
    }
    .anim {
        transition: all 0.5s;
    }
    .msg li {
        list-style: none;
        line-height: 30px;
        height: 30px;
    }
}
</style>
