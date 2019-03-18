<template>
    <div v-if="item.logo" class="channels">
        <img :src="item.logo.resources[0].url.replace('http:','https:')" alt>
        <div class="celDetail">
            <p>
                {{item.name}}
                <span v-show="item.isDTT" class="dtt">
                    <img src="~assets/img/web/ic_guide_dtt.png" alt>
                    {{item.dttChannel}}
                </span>
                <span v-show="item.isDTH" class="dth">
                    <img src="~assets/img/web/ic_guide_dth.png" alt>
                    {{item.dthChannel}}
                </span>
            </p>
            <div v-for="(item1,index) in 3" :key="index">
                <span :class="{current:index==0}" class="playTime">14:00</span>
                <div :class="{current:index==0}" class="playTitle">World Cup Goals 2019
                    <div v-show="index==0" class="total">
                        <div :style="{ width: '50%'}" class="progress"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import localforage from 'localforage'
export default {
    props: {
        item: {
            type: Object,
            require: true,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            loading: false,
            loaded: false,
            epg: []
        }
    },
    computed: {
        scrollPage() {
            return this.$store.state.scrollPage
        }
    },
    watch: {
        scrollPage() {
            this.getEPG()
        }
    },
    mounted() {
        localforage.config({
            driver: localforage.INDEXEDDB,
            name: 'StarTimes'
        })
        this.$nextTick(() => {
            setTimeout(() => {
                this.getEPG()
            }, 1000)
        })
    },
    methods: {
        getEPG() {
            const top = this.$el.getBoundingClientRect().top
            const screenHeight = window.screen.availHeight
            if (this.loading || this.loaded) return false
            if (top < screenHeight) {
                this.loading = true
                const channelID = this.item.id
                localforage
                    .getItem('channel_' + channelID)
                    .then(val => {
                        if (!val) {
                            this.$axios
                                .get(`/cms/programs?channelID=${channelID}&startDate=1552838400000&endDate=1552924799999&count=100`)
                                .then(res => {
                                    this.loading = false
                                    this.loaded = true
                                    this.epg = res.data
                                    localforage.setItem('channel_' + channelID, res.data || '')
                                })
                        } else {
                            this.epg = val
                        }
                    })
                    .catch(function(err) {
                        console.log(err)
                    })
            }
        }
    }
}
</script>
<style lang="less" scoped>
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
</style>
