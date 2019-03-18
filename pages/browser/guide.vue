<template>
    <div class="wrapper">
        <div class="guide">
            <div class="search">
                <input type="text" placeholder="Search your favorite channels">
                <img @click="search" src="~assets/img/web/ic_search.png">
            </div>
            <div v-for="(item ,i) in channelList" :key="i" class="channels">
                <img :src="item.logo.resources[0].url.replace('http:','https:')" alt="">
                <div class="celDetail">
                    <p>{{item.name}}
                        <span v-show="item.isDTT" class="dtt"><img src="~assets/img/web/ic_guide_dtt.png" alt="">{{item.dttChannel}}</span>
                        <span v-show="item.isDTH" class="dth"><img src="~assets/img/web/ic_guide_dth.png" alt="">{{item.dthChannel}}</span>
                    </p>
                    <div :class="{show:item.epgList}">
                        <div v-for="(ele,k) in item.epgList" :key="k" >
                            <span v-show="ele.length==0">no epg for today</span>
                            <span :class="{current:index==0}" class="playTime">14:00</span>
                            <div :class="{current:index==0}" class="playTitle"> World Cup Goals 2019
                                <div v-show="index==0" class="total">
                                    <div :style="{ width: '50%'}" class="progress" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    filters: {
        formatPlayTime(time) {
            const tmp = new Date(time)
            const hours = tmp.getHours() >= 10 ? tmp.getHours() : '0' + tmp.getHours()
            const minutes = tmp.getMinutes() >= 10 ? tmp.getMinutes() : '0' + tmp.getMinutes()
            return hours + ':' + minutes
        }
    },
    data() {
        const tmp = new Date().toLocaleDateString()
        const start = new Date(new Date(tmp)).getTime() // 00:00:00
        const end = new Date(new Date(tmp)).getTime() + 24 * 60 * 60 * 1000 - 1 // 23:59:59
        return {
            channelList: [],
            startDate:start,
            endDate:end,
            flag: true

        }
    },
    mounted() {
        this.getChannelList()
         this.$nextTick(() => {
            const contain = document.querySelector('.wrapper')
            contain.addEventListener('scroll', function() {
                console.log(contain.scrollTop)
                if (contain.scrollTop % 132 >= 66) {
                    const index = (contain.scrollTop) / 132 + 3
                    this.getEpg(index)
                }
            })
        })
    },
    methods: {
        search() {},
        getChannelList(){
            this.$nextTick(() => this.$nuxt.$loading.start())
            this.$axios.get(`/cms/v2/vup/snapshot/channels?count=1000&platformTypes=1&platformTypes=0`).then(res => {
                this.$nextTick(() => this.$nuxt.$loading.finish())
                const data = res.data
                data.forEach(ele => {
                    ele.epgList = []
                    if (ele.ofAreaTVPlatforms[0] && ele.ofAreaTVPlatforms[0].platformInfos) {
                        const platformInfos = ele.ofAreaTVPlatforms[0].platformInfos
                        platformInfos.forEach(plat => {
                            ele.isDTT = plat.tvPlatForm === 'DTT' ? true : ''
                            ele.isDTH = plat.tvPlatForm === 'DTH' ? true : ''
                            ele.dttChannel = plat.tvPlatForm === 'DTT' ? plat.channelNumber : ''
                            ele.dthChannel = plat.tvPlatForm === 'DTH' ? plat.channelNumber : ''
                        })
                    }
                })
                this.channelList = data
                this.getEpg(0)
                this.getEpg(1)
                this.getEpg(2)
                this.getEpg(3)
            })
        },
        getEpg(index){
            const id = this.channelList[index].id
            if(this.flag){
                this.flag = false
                this.$axios.get(`/cms/programs?channelID=${id}&startDate=${this.startDate}&endDate=${this.endDate}`).then(res => {
                    const data = res.data
                    console.log(data)
                    this.channelList[index].epgList = data
                    this.flag = true
                })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.guide {
    width: 100%;
    padding: 0 0.8rem;
    .search {
        position: relative;
        margin: 0.5rem 0;
        input {
            width: 100%;
            padding-left: 1rem;
            border-radius: 4px;
            border: 1px solid #979797;
            height: 2.5rem;
            line-height: 2.5rem;
            outline-style: none;
            &::-webkit-input-placeholder {
                color: #bdbdbd;
                font-size: 0.95rem;
            }
            & + img {
                position: absolute;
                right: 0.8rem;
                top: 50%;
                width: 1.5rem;
                height: 1.5rem;
                margin-top: -0.75rem;
            }
        }
    }
    .channels {
        padding: 1rem 0;
        border-bottom: 1px solid #d8d8d8;
        img {
            width: 30%;
        }
        .celDetail {
            float: right;
            width: 68%;
            padding-top: 0.3rem;
            p {
                span {
                    float: right;
                    margin-left: 0.5rem;
                    font-size: 0.95rem;
                    &.dtt {
                        color: #5eb108;
                    }
                    &.dth {
                        color: #e7336e;
                    }
                    img {
                        width: 1rem;
                        height: 1rem;
                        vertical-align: top;
                    }
                }
            }
            & > div {
                margin: 0.3rem 0;
                background-color: #eeeeee;
                width:100%;
                height:5rem;
                .show{
                    background-color: #ffffff;
                }
            }
        }
        .playTime {
            font-size: 0.95rem;
            color: #000000;
            width: 20%;
            display: inline-block;
            vertical-align: top;
            &.current {
                color: #0084e5;
            }
        }
        .playTitle {
            font-size: 0.95rem;
            color: #333333;
            display: inline-block;
            width: 78%;
            vertical-align: top;
            &.current {
                color: #0084e5;
            }
            .total {
                width: 100%;
                height: 4px;
                background-color: #dddddd;
                border-radius: 4px;
                margin: 0.3rem 0;
                .progress {
                    background-color: #0084e5;
                    height: 4px;
                    border-radius: 4px;
                }
            }
        }
    }
}
</style>


