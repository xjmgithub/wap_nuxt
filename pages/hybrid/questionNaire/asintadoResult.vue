<template>
    <div id="result">
        <div class="character">
            <div class="guide">
                <div class="logo">I AM...</div>
                <nuxt-link :to="`/hybrid/questionNaire/asintado`">
                    <span class="try">TRY AGAIN</span>
                </nuxt-link>
            </div>
            <div class="atlas clearfix">
                <div class="asintado">
                    <img src="~assets/img/naire/Ana.png" alt="">
                </div>
                <div class="other">
                    <img src="~assets/img/naire/Daenerys.png" alt="">
                </div>
                <div class="other">
                    <img src="~assets/img/naire/Yvonne.png" alt="">
                </div>
                <img src="~assets/img/naire/triangle.png" class="triangle">
            </div>
        </div>
        <div class="container">
            <div class="des">
                <p>My Charactersitics:</p>
                <span>{{rolePercent}}</span>
                <span v-for="(item,index) in result" :key="index">{{item.long_des}}</span>
            </div>
            <div class="share" @click="toShare()">
                <img src="~assets/img/naire/ic_share_def_g.png"> SHARE TO MY FRIENDS
            </div>
            <div v-show="programList.length>0" class="clips">
                <p>Highlights</p>
                <ul class="clearfix">
                    <li v-for="(item,index) in programList" :key="index">
                        <nuxt-link :to="`/browser/program/detail/${item.pro_id}`">
                            <div>
                                <img v-if="item.poster">
                                <img v-else src="~assets/img/web/pic3.png">
                                <!-- <span class="show-time">{{item | formatShowTime}}</span> -->
                                <span class="show-time">{{item.time}}</span>
                            </div>
                            <p class="title" v-html="item.name" />
                        </nuxt-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    filters: {},
    data() {
        return {
            result: [],
            rolePercent: '',
            programList: [
                {
                    name: 'Wild beasts',
                    poster: '',
                    id: 371,
                    time: '30:26'
                },
                {
                    name: 'Highlights for 3rd Julu',
                    poster: '',
                    id: 371,
                    time: '50:26'
                },
                {
                    name: 'Highlights for 3rd Julu',
                    poster: '',
                    id: 371,
                    time: '50:26'
                },
                {
                    name: 'King Kong Mc Dancing to One Rand S2',
                    poster: '',
                    id: 371,
                    time: '50:26'
                },
                {
                    name: 'Highlights for 3rd Julu',
                    poster: '',
                    id: 371,
                    time: '50:26'
                },
                {
                    name: 'King Kong Mc Dancing to One Rand S2',
                    poster: '',
                    id: 371,
                    time: '50:26'
                },
                {
                    name: 'Highlights for 3rd Julu',
                    poster: '',
                    id: 371,
                    time: '50:26'
                },
                {
                    name: 'King Kong Mc Dancing to One Rand S2',
                    poster: '',
                    id: 371,
                    time: '50:26'
                },
                {
                    name: 'Highlights for 3rd Julu',
                    poster: '',
                    id: 371,
                    time: '50:26'
                },
                {
                    name: 'King Kong Mc Dancing to One Rand S2',
                    poster: '',
                    id: 371,
                    time: '34:06'
                }
            ],
            ikey: this.$route.query.ikey
        }
    },
    mounted() {
        this.$axios.get(`./hybrid/api/episode/result?ikey=${this.ikey}`).then(res => {
            if (res.data && res.data.length > 0) {
                this.result = res.data
                this.getPercent()
            }
        })
    },
    methods: {
        getPercent() {
            let asin, got, aven
            this.result.forEach(ele => {
                if (ele.fk_episode == 1) {
                    asin = ele.percent + '%' + ele.name
                } else if (ele.fk_episode == 2) {
                    got = ele.percent + '%' + ele.name
                } else {
                    aven = ele.percent + '%' + ele.name
                }
            })
            this.rolePercent = `You're ${asin},${got},${aven}.`
        },
        toShare() {}
    },
    head() {
        return {
            title: 'Characteristic Test Result'
        }
    }
}
</script>
<style lang="less" scoped>
#result {
    background: url('~assets/img/naire/background2.png') no-repeat, linear-gradient(180deg, rgba(85, 85, 85, 1) 0%, rgba(201, 183, 166, 1) 100%);
    background-size: contain;
    min-height: 100vh;
    width: 100%;
    .character {
        width: 100%;
        padding-top: 0.8rem ;
        .guide {
            height: 2.5rem;
            line-height: 2.5rem;
            .logo {
                color: #ffffff;
                background: url('~assets/img/naire/group.png') no-repeat;
                background-size: contain;
                width: 25%;
                text-align: center;
                height: 2.5rem;
                line-height: 2.5rem;
                font-weight: bold;
                display: inline-block;
            }
            .try {
                float: right;
                color: #ffffff;
                font-weight: bold;
                text-decoration: underline;
                margin-right: 1rem;
            }
        }
        .atlas {
            text-align: center;
            position: relative;
            clear: both;
            .asintado {
                width: 50%;
                margin: 0 auto;
            }
            .other {
                width: 50%;
                float: left;
            }
            img {
                width: 60%;
                &.triangle {
                    width: 54%;
                    position: absolute;
                    left: 23%;
                    top: 2.8rem;
                    z-index: 1;
                }
            }
        }
    }
    .container {
        width: 95%;
        margin: 0 2.5%;
        text-align: center;
        .des {
            text-align: left;
            padding: 1rem 0.5rem 0;
            p {
                background: linear-gradient(360deg, rgba(191, 143, 22, 1) 0%, rgba(237, 213, 154, 1) 100%);
                background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 0.5rem;
                font-weight: bold;
            }
            span {
                color: #ffffff;
            }
        }
        .share {
            display: inline-block;
            padding: 0 1rem;
            color: #63428a;
            font-size: 0.95rem;
            vertical-align: middle;
            background: linear-gradient(180deg, rgba(235, 202, 77, 1) 0%, rgba(235, 200, 112, 1) 34%, rgba(188, 147, 43, 1) 100%);
            border-radius: 20px;
            font-weight: bold;
            margin: 1rem 0;
            height: 2.5rem;
            line-height: 2.5rem;
            img {
                width: 1.5rem;
            }
        }
        .clips {
            text-align: left;
            padding: 0 3% 1rem;
            background: #ffffff;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
            border-radius: 13px;
            & > p {
                color: #333333;
                font-weight: bold;
                padding: 0.5rem 0;
            }
            li {
                list-style: none;
                float: left;
                width: 48%;
                line-height: 1.1rem;
                position: relative;
                &:nth-child(2n) {
                    float: right;
                }
                div {
                    position: relative;
                    width: 100%;
                    &:before {
                        content: '';
                        display: inline-block;
                        padding-bottom: 56%;
                        width: 0.1px;
                        vertical-align: middle;
                    }
                    .show-time {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        padding: 0 0.2rem;
                        background: rgba(0, 0, 0, 0.6);
                        color: #ffffff;
                        font-size: 0.8rem;
                    }
                    img {
                        width: 100%;
                        position: absolute;
                        height: 100%;
                    }
                }
                .title {
                    font-size: 0.95rem;
                    color: #666666;
                    display: -webkit-box;
                    overflow: hidden;
                    height: 2.6rem;
                    padding-top: 0.4rem;
                    -webkit-line-clamp: 2;
                    /* autoprefixer: off */
                    -webkit-box-orient: vertical;
                }
            }
        }
    }
    .clearfix:after {
        display: block;
        visibility: hidden;
        clear: both;
        height: 0;
        content: '';
    }
    .clearfix {
        zoom: 1;
    }
}
</style>
