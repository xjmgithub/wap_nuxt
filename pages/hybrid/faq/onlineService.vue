<template>
    <div style="height:100vh;display:flex;flex-direction:column;">
        <div id="wrapper">
            <div class="order-msg" v-if="serviceData.order_info">
                <div class="top">
                    <p class="time">{{serviceData.order_info.order_create_time | formatDate }}</p>
                    <div class="order-type clearfix">
                        <img src="~/assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
                        <div class="right">
                            <p class="order-name">{{serviceData.order_info.order_type }}<span>{{serviceData.order_info.order_amount }}</span></p>
                            <p class="order-status">{{serviceData.order_info.card_no }}<span>{{serviceData.order_info.order_status }}</span></p>
                        </div>
                    </div>
                </div>
                <div class="gap"></div>
                <div class="bottom clearfix">
                    <p class="clearfix">Questions
                        <nuxt-link to="/hybrid/faq/customerService">
                            <img src="~/assets/img/faq/ic_categary_copy41.png">
                        </nuxt-link>
                    </p>
                    <ul v-if="serviceData.questions">
                        <li v-for="(item,index) in serviceData.questions.slice(0,3)" :key="index" :data-id="item.id" @click="saveFaq(item)">{{item.content}}</li>
                    </ul>
                    <div class="btn" v-for="(item,index) in serviceData.service_components" :key="index">
                        {{item.presentation_name}}
                    </div>
                </div>
                <div class="gap"></div>
                <nuxt-link to="/hybrid/faq/moreOrders">
                    <div class="more">
                        MORE ORDERS
                    </div>
                </nuxt-link>
            </div>
            <div class="service" v-if="faqTagsData">
                <nav id="nav">
                    <a v-for="(item,index) in faqTagsData" :key="index" :class="{on:item.checked}" @click="changeServiceTag(item.id)">
                        <div :class="item.class"></div>
                    </a>
                </nav>
                <div class="questions">
                    <div v-for="(item,index) in faqTagsData" :key="index" v-show="item.checked">
                        <ul>
                            <li v-for="(item2,index2) in item.faqs" :key="index2" @click="saveFaq(item)">{{item2.content}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="costomer">
            <nuxt-link to="/hybrid/faq/customerService?config_id=&directory_id=">
                <button class="btn">
                    COSTOMER SERVICE
                </button>
            </nuxt-link>
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
            faqsByTag: {},
            canLoadingMore: true,
            pageSize: 10,
            pageNum: [1, 1, 1, 1, 1],
            isLoading: false,
            tagImg: {}
        }
    },
    filters: {
        formatDate(date) {
            return moment(date).format('D MMM YYYY HH-mm:ss')
        }
    },
    mounted() {
        localStorage.removeItem('faq_question')

        // 服务块
        this.$axios
            .get(`/ocs/v1/service?entranceId=${this.entranceId}`, {})
            .then(res => {
                if (res.data) {
                    this.serviceData = res.data.data
                    localStorage.setItem(
                        'orderMsg',
                        JSON.stringify(this.serviceData.order_info)
                    )
                    localStorage.setItem(
                        'serviceModuleId',
                        this.serviceData.service_module.id
                    )
                }
            })

        this.$axios.get('/ocs/v1/faqs/Tags').then(res => {
            if (res.data) {
                let arr = []
                let firstTagId = null
                res.data.data.forEach((item, index) => {
                    let checked = index <= 0 ? true : false
                    if (index == 0) firstTagId = item.tagging_id
                    let logoMap = {
                        hot: 'tab_hot',
                        on: 'tab_on',
                        tv: 'tab_tv',
                        pay: 'tab_pay',
                        account: 'tab_account'
                    }

                    arr.push({
                        id: item.tagging_id,
                        name: item.tagging_name,
                        checked: checked,
                        class:
                            logoMap[item.tagging_name.toLowerCase()] ||
                            'tab_hot',
                        page: 1, // 每个页默认加载起始页,
                        untilTotal: false,
                        faqs: []
                    })
                })
                this.faqTagsData = arr
                this.changeServiceTag(firstTagId)

                this.$nextTick(() => {
                    let collect = document.querySelectorAll('.questions div')
                    for (let i = 0; i < collect.length; i++) {
                        collect[i].addEventListener('scroll', this.handleScroll)
                    }
                })
            }
        })
    },
    methods: {
        getfaqsByTag(tagid, moretag) {
            let tag = {}
            this.faqTagsData.forEach(item => {
                if (item.id == tagid) {
                    tag = item
                }
            })
            if (!moretag && tag.page > 1) return
            this.$axios
                .get(
                    `/ocs/v1/faqs/byTag?tagId=${tagid}&
                                    pageSize=${this.pageSize}&
                                    pageNum=${tag.page}`
                )
                .then(res => {
                    this.isLoading = false
                    if (res.data) {
                        tag.faqs = tag.faqs.concat(res.data.data.rows)
                        tag.page = tag.page + 1

                        // TODO 设置untilTotal
                    }
                })
        },
        changeServiceTag(tagId) {
            this.faqTagsData.forEach(item => {
                if (item.id == tagId) {
                    item.checked = true
                } else {
                    item.checked = false
                }
            })

            this.getfaqsByTag(tagId)
        },
        handleScroll(evt) {
            let container = evt.target
            let child = evt.target.querySelector('ul')
            let childHeight = child.offsetHeight
            let scrollTop = container.scrollTop

            // TODO untilTotal
            if (childHeight - scrollTop <= 150 && this.isLoading == false) {
                this.isLoading = true
                let checkedId = null
                this.faqTagsData.forEach(item => {
                    if (item.checked == true) {
                        checkedId = item.id
                    }
                })

                this.getfaqsByTag(checkedId, true)
            }
        },
        saveFaq(content) {
            localStorage.setItem('faq_question', JSON.stringify(content))
            this.$router.push('/hybrid/faq/customerService')
        },
        
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
        display: flex;
        a {
            border-bottom: 3px solid #eeeeee;
            flex: 1;
            display: block;
            padding-bottom: 0.7rem;

            div {
                width: 100%;
                height: 2rem;
                background-size: 100% 100%;
                &.tab_hot {
                    background: url('~/assets/img/faq/ic_favorite_def_g.png');
                }
                &.tab_on {
                    background: url('~/assets/img/faq/ic_OTT_def_g.png');
                }
                &.tab_tv {
                    background: url('~/assets/img/faq/ic_TV_def_g.png');
                }
                &.tab_pay {
                    background: url('~/assets/img/faq/ic_changecard_def_g.png');
                }
                &.tab_account {
                    background: url('~/assets/img/faq/ic_accountconfirm_def_g.png');
                }
            }

            &.on {
                border-bottom: 3px solid #0087eb;
                div {
                    &.tab_hot {
                        background: url('~/assets/img/faq/ic_favorite_def_blue.png');
                    }
                    &.tab_on {
                        background: url('~/assets/img/faq/ic_OTT_def_b.png');
                    }
                    &.tab_tv {
                        background: url('~/assets/img/faq/ic_TV_def_blue.png');
                    }
                    &.tab_pay {
                        background: url('~/assets/img/faq/ic_changecard_def_blue.png');
                    }
                    &.tab_account {
                        background: url('~/assets/img/faq/ic_accountconfirm_def_blue.png');
                    }
                }
            }
        }
    }
    .questions {
        // margin-bottom: 4.5rem;
        // overflow: scroll;
        flex: 1;
        overflow: hidden;
        div {
            overflow: auto;
            height: 100%;
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