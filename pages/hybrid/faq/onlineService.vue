<template>
    <div style="height:100vh;display:flex;flex-direction:column;">
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
                        <li v-for="(item,index) in serviceData.questions.slice(0,3)" :key="index" :data-id="item.id" @click="saveFaq('orderFaq',item.content)">{{item.content}}</li>
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
            <div class="service" v-if="faqTagsData">
                <nav id="nav">
                    <a v-for="(item,index) in faqTagsData" :key="index" :class="{on:serviceTagId == item.tagging_id}" @click="changeServiceTag(index,item.tagging_id,item.tagging_name)">
                        <img src="~assets/img/faq/ic_favorite_def_blue.png" v-show="item.tagging_name == 'Hot' && serviceTagId == item.tagging_id">
                        <img src="~assets/img/faq/ic_favorite_def_g.png" v-show="item.tagging_name == 'Hot'    && serviceTagId != item.tagging_id">
                        <img src="~assets/img/faq/ic_OTT_def_b.png" v-show="item.tagging_name == 'ON' && serviceTagId == item.tagging_id">
                        <img src="~assets/img/faq/ic_OTT_def_g.png" v-show="item.tagging_name == 'ON' && serviceTagId != item.tagging_id">
                        <img src="~assets/img/faq/ic_TV_def_blue.png" v-show="item.tagging_name == 'TV' && serviceTagId == item.tagging_id">
                        <img src="~assets/img/faq/ic_TV_def_g.png" v-show="item.tagging_name == 'TV' && serviceTagId != item.tagging_id">
                        <img src="~assets/img/faq/ic_changecard_def_blue.png" v-show="item.tagging_name == 'Pay' && serviceTagId == item.tagging_id">
                        <img src="~assets/img/faq/ic_changecard_def_g.png" v-show="item.tagging_name == 'Pay' && serviceTagId != item.tagging_id">
                        <img src="~assets/img/faq/ic_accountconfirm_def_blue.png" v-show="item.tagging_name == 'Account' && serviceTagId == item.tagging_id">
                        <img src="~assets/img/faq/ic_accountconfirm_def_g.png" v-show="item.tagging_name == 'Account' && serviceTagId != item.tagging_id">
                    </a>
                </nav>
                <div class="questions">
                    <div ref="scrollTop" v-show="serviceTagName">
                        <ul ref="child">
                            <li>asdfasdf1</li>
                            <li>asdfasdf2</li>
                            <li>asdfasdf3</li>
                            <li>asdfasdf4</li>
                            <li>asdfasdf5</li>
                            <li>asdfasdf6</li>
                            <li>asdfasdf1</li>
                            <li>asdfasdf2</li>
                            <li>asdfasdf3</li>
                            <li>asdfasdf4</li>
                            <li>asdfasdf5</li>
                            <li>asdfasdf6</li>
                        </ul>
                    </div>
                    <div v-show="serviceTagName == 'ON'">2</div>
                    <div v-show="serviceTagName == 'TV'">3</div>
                    <div v-show="serviceTagName == 'Pay'">4</div>
                    <div v-show="serviceTagName == 'Account'">5</div>
                </div>
            </div>
        </div>
        <div class="costomer">
            <button class="btn" @click="costomerService">
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
            serviceTagId: '',
            serviceTagName: 'Hot',
            entranceId: this.$route.query.entrance_id || '',
            serviceData: {},
            faqTagsData: [],
            faqsByTag: {
                Hot: [],
                ON: [],
                TV: [],
                Pay: [],
                Account: []
            },
            canLoadingMore: true,
            pageSize: 10,
            pageNum: [1, 1, 1, 1, 1],
            page: 0,
            isLoading: 0
        }
    },
    filters: {
        formatDate(date) {
            return moment(date).format('D MMM YYYY HH-mm:ss')
        }
    },
    mounted() {
        let _this = this
        this.$axios
            .get(`/ocs/v1/service?entranceId=${this.entranceId}`, {})
            .then(res => {
                if (res.data) {
                    _this.serviceData = res.data.data
                    let param = {
                        order_create_time:
                            _this.serviceData.order_info.order_create_time,
                        order_type: _this.serviceData.order_info.order_type,
                        card_no: _this.serviceData.order_info.card_no,
                        order_status: _this.serviceData.order_info.order_status,
                        order_amount: _this.serviceData.order_info.order_amount
                    }
                    localStorage.setItem('orderMsg', JSON.stringify(param))
                }
            })
        this.$axios.get('/ocs/v1/faqs/Tags', {}).then(res => {
            if (res.data) {
                _this.faqTagsData = res.data.data
                _this.serviceTagId = 0
            }
        })
        this.changeServiceTag(0, this.serviceTagId, 'Hot')
        this.$refs.scrollTop.addEventListener('scroll', this.handleScroll)
    },
    methods: {
        moreFaqs() {
            localStorage.removeItem('orderFaq')
            this.$router.push('/hybrid/faq/customerService')
        },
        moreOrders() {
            this.$router.push('/hybrid/faq/moreOrders')
        },
        changeServiceTag(page, tagId, tagName) {
            let _this = this
            this.page = page
            this.serviceTagId = tagId
            this.serviceTagName = tagName
            if (_this.faqsByTag[this.serviceTagName].length <= 0) {
                _this.$axios
                    .get(
                        `/ocs/v1/faqs/byTag?tagId=${_this.serviceTagId}&
                                    pageSize=${_this.pageSize}&
                                    pageNum=${_this.pageNum[_this.page]}`,
                        {}
                    )
                    .then(res => {
                        if (res.data) {
                            _this.faqsByTag[_this.serviceTagName] =
                                res.data.data.rows
                            if (res.data.data.rows <= _this.pageSize) {
                                _this.canLoadingMore = false
                            }
                        }
                    })
            }
        },
        handleScroll() {
            let _this = this
            let childHeight = this.$refs.child.offsetHeight
            let scrollTop = this.$refs.scrollTop.scrollTop
            if (
                childHeight - scrollTop <= 150 &&
                _this.canLoadingMore &&
                this.isLoading == 0
            ) {
                this.isLoading = 1
                this.$axios
                    .get(
                        `/ocs/v1/faqs/byTag?tagId=${this.serviceTagId}&
                                pageSize=${this.pageSize}&
                                pageNum=${this.pageNum[this.page] + 1}`,
                        {}
                    )
                    .then(res => {
                        if (res.data) {
                            res.data.data.rows.forEach(ele =>
                                _this.faqsByTag[this.serviceTagName].push(ele)
                            )
                            _this.$nextTick(() => {
                                this.isLoading = 0
                            })
                            if (res.data.data.rows.length <= _this.pageSize) {
                                _this.canLoadingMore = false
                            }
                        }
                    })
            }
        },
        saveFaq(faqName, content) {
            localStorage.setItem(faqName, JSON.stringify(content))
        },
        costomerService() {
            localStorage.removeItem('tagFaq')
        }
    },
    head() {
        return {
            title: 'Online Service'
        }
    }
}
</script>
<style lang="less" scoped>
html {
    overflow-y: hidden;
}
body {
    background: #fff;
}

#wrapper {
    padding: 0.5rem;
    font-family: 'DINPro', Roboto, Arial, Helvetica, Sans-serif;
    flex: 12;
    display: flex;
    flex-direction: column;
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
    flex: 1;
    display: flex;
    flex-direction: column;
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
        // margin-bottom: 4.5rem;
        // overflow: scroll;
        flex: 1;
        overflow:hidden;
        div{
            overflow: auto;
            height:100%;
        }
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
    padding: 1rem 0;
    background: #fff;
    height: 4.25rem;
    flex: 1;
    button {
        margin: 0 auto;
        border: 1px solid #0087eb;
        border-radius: 2px;
        background: #fff;
        padding: 0.3rem;
        font-weight: bold;
        width: 60%;
        outline: none;
    }
}
</style>