<template>
    <div>
        <div id="wrapper">
            <div class="order-msg" v-if="serviceData.order_info">
                <div class="top">
                    <p class="time">{{serviceData.order_info.order_create_time | formatDate }}</p>
                    <div class="order-type clearfix">
                        <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
                        <div class="right">
                            <p class="order-name">{{serviceData.order_info.order_type }}<span>{{serviceData.order_info.order_amount }}</span></p>
                            <p class="order-status">{{serviceData.order_info.card_no }}<span>{{serviceData.order_info.order_status }}</span></p>
                        </div>
                    </div>
                </div>
                <div class="gap"></div>
                <div class="bottom clearfix">
                    <p class="clearfix">Questions
                        <img src="~assets/img/faq/ic_categary_copy41.png" alt="" @click="moreFaqs">
                    </p>
                    <ul v-if="serviceData.questions">
                        <li v-for="(item,index) in serviceData.questions.slice(0,3)" :key="index" :data-id="item.id">{{item.content}}</li>
                    </ul>
                    <div class="btn" v-for="(item,index) in serviceData.service_components" :key="index">
                        {{item.presentation_name}}
                    </div>
                </div>
                <div class="gap"></div>
                <div class="more" @click="moreOrders">
                    MORE ORDERS
                </div>
            </div>
            <div class="service">
                <nav id="nav">
                    <a :class="{on:serviceTag == 'Hot'}" @click="changeServiceTag('Hot')"><img src="~assets/img/faq/ic_categary_copy42.png" alt=""></a>
                    <a :class="{on:serviceTag == 'ON'}" @click="changeServiceTag('ON')"><img src="~assets/img/faq/ic_categary_copy2.png" alt=""></a>
                    <a :class="{on:serviceTag == 'TV' }" @click="changeServiceTag('TV')"><img src="~assets/img/faq/ic_categary_copy21.png" alt=""></a>
                    <a :class="{on:serviceTag == 'Pay'}" @click="changeServiceTag('Pay')"><img src="~assets/img/faq/ic_categary_copy4.png" alt=""></a>
                    <a :class="{on:serviceTag == 'Account'}" @click="changeServiceTag('Account')"><img src="~assets/img/faq/ic_tv1.png" alt=""></a>
                </nav>
                <div class="questions">
                    <ul v-show="serviceTag == 'Hot'">
                        <li v-for="(item,index) in faqsByTag" :key="index">{{item.content}}</li>
                    </ul>
                    <div v-show="serviceTag == 'ON'">2</div>
                    <div v-show="serviceTag == 'TV'">3</div>
                    <div v-show="serviceTag == 'Pay'">4</div>
                    <div v-show="serviceTag == 'Account'">5</div>
                </div>
            </div>
        </div>
        <div class="costomer">
            <button class="btn">
                COSTOMER SERVICE
            </button>
        </div>
    </div>
</template>
<script>
let moment = require('moment/moment.js')
export default {
    layout: 'base',
    data: function() {
        return {
            serviceTag: 'Hot',
            entranceId: this.$route.query.entrance_id || '',
            serviceData: {},
            faqTagsData: [],
            faqsByTag: [],
            canLoadingMore: true,
            pageSize: 10,
            pageNum: 1
        }
    },
    filters: {
        formatDate(date) {
            return moment(date).format('D MMM YYYY HH-mm:ss')
        }
    },
    mounted() {
        this.$axios
            .get(`/ocs/v1/service?entranceId=${this.entranceId}`, {})
            .then(res => {
                if (res.data) {
                    this.serviceData = res.data.data
                }
            })
        this.$axios.get('/ocs/v1/faqs/Tags', {}).then(res => {
            if (res.data) {
                this.faqTagsData = res.data.data
            }
        })
        this.changeServiceTag(this.serviceTag)
    },
    methods: {
        moreFaqs() {
            let param = {
                order_create_time: this.serviceData.order_info
                    .order_create_time,
                order_type: this.serviceData.order_info.order_type,
                card_no: this.serviceData.order_info.card_no,
                order_status: this.serviceData.order_info.order_status,
                order_amount: this.serviceData.order_info.order_amount
            }
            sessionStorage.setItem('orderMsg', JSON.stringify(param))
            this.$router.push('/hybrid/faq/customerService')
        },
        moreOrders() {
            this.$router.push('/hybrid/faq/moreOrders')
        },
        changeServiceTag(tag) {
            this.serviceTag = tag
            this.$axios
                .get(
                    `/ocs/v1/faqs/byTag?tagId=${this.serviceTag}&
                              pageSize=${this.pageSize}&
                              pageNum=${this.pageNum}`,
                    {}
                )
                .then(res => {
                    if (res.data) {
                        this.faqsByTag = res.data.data.rows
                        if (this.faqsByTag.length <= this.pageSize) {
                            this.canLoadingMore = false
                        }
                    }
                })
        }
    },
    head() {
        return {
            title: 'Online Service'
        }
    }
}
</script>
<style lang="less">
body {
    background: #fff;
}

#wrapper {
    padding: 0.5rem;
    font-family: 'DINPro', Roboto, Arial, Helvetica, Sans-serif;
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

.order-msg {
    box-shadow: 0px 1px 3px 1px #dddddd;
    border-radius: 5px;
    .top {
        padding: 0 0.5rem;
        p.time {
            width: 100%;
            color: #aaaaaa;
            font-size: 0.8rem;
            border-bottom: 1px solid #eeeeee;
            padding: 0.2rem 0;
        }
    }
    .order-type {
        padding: 0.7em 0;
        img {
            width: 2.5rem;
            height: 2.5rem;
            float: left;
        }
        .right {
            margin-left: 3rem;
        }
        .order-name {
            span {
                font-weight: bold;
                float: right;
            }
        }
        .order-status {
            font-size: 0.9rem;
            color: #999999;
            span {
                color: #00cc33;
                float: right;
            }
        }
    }
    .gap {
        background-color: #f2f2f2;
        height: 4px;
        width: 100%;
    }
    .bottom {
        padding: 0.7rem 0.5rem;
        p {
            font-size: 0.9rem;
            color: #333333;
            img {
                float: right;
                width: 1.5rem;
                height: 1.5rem;
            }
        }
        li {
            color: #333333;
            font-size: 0.8rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .btn {
            color: #0087eb;
            font-size: 0.8rem;
            margin-top: 0.7rem;
            float: right;
            margin-left: 0.7rem;
            font-weight: bold;
        }
    }
    .more {
        color: #0087eb;
        font-size: 0.8rem;
        font-weight: bold;
        text-align: center;
        padding: 0.7rem 0;
    }
}
.service {
    margin-top: 1rem;
    #nav {
        width: 100%;
        margin: 0 auto;
        text-align: center;
        padding-bottom: 0.7rem;
        a {
            border-bottom: 3px solid #eeeeee;
            width: 20%;
            display: inline-block;
            padding-bottom: 0.7rem;
            &.on {
                border-bottom: 3px solid #0087eb;
            }
            img {
                width: 1.5rem;
                height: 1.5rem;
            }
        }
    }
    .questions {
        margin-bottom: 4.5rem;
        height: 22rem;
        overflow: auto;
        li {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0.5rem 0;
            color: #333333;
            font-size: 0.8rem;
            & + li {
                border-top: 1px solid #eeeeee;
            }
        }
    }
}
.costomer {
    width: 100%;
    text-align: center;
    color: #0087eb;
    border-top: 1px solid #eeeeee;
    margin-top: 1.5rem;
    padding: 1rem 0;
    position: fixed;
    bottom: 0;
    background: #fff;
    height: 4.25rem;
    button {
        margin: 0 auto;
        border: 1px solid #0087eb;
        border-radius: 2px;
        background: #fff;
        padding: 0.3rem;
        font-weight: bold;
        width: 60%;
    }
}
</style>