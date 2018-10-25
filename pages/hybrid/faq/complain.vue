<template>
    <div id="wrapper">
        <div class="order-msg" v-if="order.order_status">
            <p class="time">{{order.order_create_time | formatDate }}
                <nuxt-link to="/hybrid/faq/chooseOrder">
                    <img src="~assets/img/faq/ic_Setting_def_g.png" alt="">
                </nuxt-link>
            </p>
            <div class="order-type clearfix">
                <img src="~/assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
                <div class="right">
                    <p class="order-name">{{order.order_type }}
                        <span>{{order.order_amount }}</span>
                    </p>
                    <p class="order-status">{{order.card_no }}
                        <span>{{order.order_status }}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="choose-order" v-else>
            <nuxt-link to="/hybrid/faq/chooseOrder">
                <div>
                    <img src="~/assets/img/faq/ic_add_def_g.png"> Choose An Order
                </div>
            </nuxt-link>
        </div>
        <div class="problem">
            <p>Your Problem</p>
            <select name="problem" v-model="problemId" v-if="questionsList&&questionsList.length>0">
                <option value='' disabled>Please select the problem you need to solve</option>
                <option v-for="item in questionsList" :key="item.id" :value="item.id">{{item.name}}</option>
            </select>
            <select name="channel-type" v-on:change="changeChannelID">
                <option value="Select Channel Type" disabled>Select Channel Type</option>
                <option :value="item.id" v-for="item in channelList" :key="item.id">{{item.name}}</option>
            </select>
            <p>Detail Description</p>
            <textarea name="" id="" cols="35" rows="5" placeholder="To rapidly help solve the problem,please show us the screenshots of your payment"></textarea>
        </div>
        <div class="gap"></div>
        <div class="personal">
            <p>Personal Information</p>
            <ul>
                <li>
                    <p class="p-name">Account
                        <span>*</span>
                    </p>
                    <p class="p-value">{{user.id}}</p>
                </li>
                <li>
                    <p class="p-name">Country
                        <span>*</span>
                    </p>
                    <p class="p-value">{{user.countryCode}}</p>
                </li>
                <li>
                    <p class="p-name">Device
                        <span>*</span>
                    </p>
                    <p class="p-value">{{deviceInfo}}</p>
                </li>
            </ul>
        </div>
        <div class="submit">
            <button class="btn">SUBMIT</button>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            indexId: 'Select Channel Type',
            indexId2: 'Select Channel Name',
            indexNum: 0,
            order: {},
            user: this.$store.state.user,
            deviceInfo: '',
            type: this.$route.query.type || 1, // 1 代表支付相关 2 代表频道相关 0 公共相关
            questionsList: [],
            problemId: '',
            channelList: []
        }
    },
    methods: {
        changeChannelID(item) {
            console.log(item)
        }
    },
    computed: {
        channelNameList: function() {
            return false
            for (var i = 0; i < this.channel_type.length; i++) {
                if (this.channel_type[i].text == this.indexNum) {
                    return this.channel_type[i].ZY
                }
            }
        }
    },
    mounted() {
        let order = localStorage.getItem('orderMsg')
        if (order) {
            this.order = JSON.parse(order)
        } else {
            this.order = {}
        }

        let ua = window.navigator.userAgent
        let deviceInfo = ua.match(/\(([^)]*)\)/)[1].split(';')
        this.deviceInfo = deviceInfo[deviceInfo.length - 1].split('like')[0]

        // more faqs
        let serviceModuleId = localStorage.getItem('serviceModuleId')
        let faq_question = localStorage.getItem('faq_question')
        this.$axios
            .get(`/ocs/v1/moreFaqs?serviceModuleId=${serviceModuleId}`)
            .then(res => {
                if (res.data.code == 0) {
                    let list = []
                    res.data.data.forEach((item, index) => {
                        list.push({
                            id: item.id,
                            name: item.content
                        })
                    })
                    this.questionsList = list
                    if (faq_question) {
                        this.problemId = JSON.parse(faq_question).id
                    }
                }
            })

        this.$axios.get(`/cms/vup/channels/dispark/categories`).then(res => {
            if (res.data && res.data instanceof Array) {
                this.channelList = res.data
            }
        })
    },
    head() {
        return {
            title: 'Complain'
        }
    }
}
</script>
<style lang="less" scoped>
body {
    background: #fff;
}

.wrapper {
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

.gap {
    background-color: #f2f2f2;
    height: 4px;
    width: 100%;
}

.order-msg {
    box-shadow: 0px 1px 3px 1px #dddddd;
    border-radius: 2px;
    padding: 0.5rem;
    width: 95%;
    margin: 0.5rem 2.5% 0 2.5%;
    position: relative;
    .time {
        width: 100%;
        color: #aaaaaa;
        font-size: 0.8rem;
        border-bottom: 1px solid #eeeeee;
        padding: 0.2rem 0;
        img {
            position: absolute;
            display: block;
            width: 1.2rem;
            right: 0.4rem;
            top: 0.4rem;
        }
    }
}

.choose-order {
    box-shadow: 0px 1px 3px 1px #dddddd;
    padding: 1.3rem;
    width: 95%;
    margin: 0.5rem 2.5% 0 2.5%;
    border-radius: 2px;
    div {
        width: 100%;
        text-align: center;
        color: #212121;
        font-size: 0.85rem;
        font-weight: bold;
        img {
            vertical-align: sub;
            margin-right: 0.2rem;
            width: 0.9rem;
        }
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

.problem {
    padding: 0.5rem;
    p {
        margin: 0.6rem 0 0.3rem 0;
        color: #212121;
        font-weight: bold;
        font-size: 0.9rem;
    }
    select {
        border: 1px solid #dddddd;
        width: 100%;
        font-size: 0.8rem;
        padding: 0.3rem;
        margin-bottom: 0.3rem;
        border-radius: 4px;
    }
    textarea {
        font-size: 0.8rem;
        border: 1px solid #dddddd;
        width: 100%;
        padding: 0.3rem;
        border-radius: 2px;
    }
}

.personal {
    width: 95%;
    margin: 0 2.5% 4.5rem 2.5%;
    & > p {
        margin: 0.6rem 0 0.3rem 0;
        color: #212121;
        font-weight: bold;
        font-size: 0.9rem;
    }
    ul {
        box-shadow: 0px 1px 3px 1px #dddddd;
        padding: 0.5rem 0.8rem;
        border-radius: 5px;
        li {
            padding: 0.5rem 0;
            p {
                display: inline-block;
                color: #212121;
                font-size: 0.8rem;
                &.p-name {
                    width: 30%;
                    border-right: 1px solid #eeeeee;
                    span {
                        color: #0087e0;
                    }
                }
                &.p-value {
                    font-weight: bold;
                    margin-left: 1.5rem;
                }
            }
            & + li {
                border-top: 1px solid #eeeeee;
            }
        }
    }
}

.submit {
    width: 100%;
    text-align: center;
    color: #0087eb;
    border-top: 1px solid #eeeeee;
    margin-top: 1.5rem;
    padding: 1rem 0;
    position: fixed;
    bottom: 0;
    height: 4.25rem;
    background: #fff;

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