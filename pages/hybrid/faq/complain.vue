<template>
    <div class="wrapper">
        <div v-if="order.order_status" class="order-contain">
            <orderBlock :order="order">
                <nuxt-link :to="{'path':'/hybrid/faq/chooseOrder',query:$route.query}">
                    <img src="~assets/img/faq/ic_Setting_def_g.png" alt>
                </nuxt-link>
            </orderBlock>
        </div>
        <div v-else class="choose-order">
            <nuxt-link to="/hybrid/faq/chooseOrder">
                <div>
                    <img src="~assets/img/faq/ic_add_def_g.png"> Choose An Order
                </div>
            </nuxt-link>
        </div>
        <div class="problem">
            <p>Your Problem</p>
            <mselect ref="questionSelect" :list="questionsList" :default="question" placeholder="Please choose your question" @change="setQuestion" />
            <mselect v-if="type[1]" ref="channelSelect" :list="channelList" placeholder="Please choose channel type" @change="setChannelName" />
            <mselect v-if="type[1]" ref="channelNameSelect" :list="channelNameList" placeholder="Please choose channel name" />
            <mselect
                v-if="!type[0]&&!type[1]"
                ref="countrySelect"
                :list="countryList"
                :default="defaultCountry"
                placeholder="Please choose your country"
            />
            <p>Detail Description</p>
            <textarea
                v-model="moredes"
                cols="35"
                rows="5"
                placeholder="To rapidly help solve the problem,please show us the screenshots of your payment"
            />
        </div>
        <div class="gap" />
        <div class="personal">
            <p>Personal Information</p>
            <ul>
                <li>
                    <p class="p-name">
                        Account
                        <span>*</span>
                    </p>
                    <p class="p-value">
                        {{user.id}}
                    </p>
                </li>
                <li>
                    <p class="p-name">
                        Country
                        <span>*</span>
                    </p>
                    <p class="p-value">
                        {{user.countryCode}}
                    </p>
                </li>
                <li v-if="carrier">
                    <p class="p-name">
                        Telecom Info
                        <span>*</span>
                    </p>
                    <p class="p-value">
                        {{carrier}}
                    </p>
                </li>
                <li v-if="unitType">
                    <p class="p-name">
                        Device
                        <span>*</span>
                    </p>
                    <p class="p-value">
                        {{unitType}}
                    </p>
                </li>
            </ul>
        </div>
        <div class="submit">
            <button class="btn" @click="submit">
                SUBMIT
            </button>
        </div>
    </div>
</template>
<script>
import mselect from '~/components/select'
import orderBlock from '~/components/faq/order'
import {getFaqAnswerLabel} from '~/functions/utils'
export default {
    layout: 'base',
    components: {
        mselect: mselect,
        orderBlock: orderBlock
    },
    data() {
        return {
            indexId: 'Select Channel Type',
            indexId2: 'Select Channel Name',
            indexNum: 0,
            order: {},
            user: this.$store.state.user,
            carrier: this.$store.state.carrier,
            unitType: this.$store.state.phoneModel,
            type: [0, 0],
            questionsList: [],
            question: null,
            channelList: [],
            channelNameList: [],
            countryList: [],
            defaultCountry: null,
            moredes: ''
        }
    },
    mounted() {
        const order = sessionStorage.getItem('orderMsg')
        if (order) {
            this.order = JSON.parse(order)
        } else {
            this.order = {}
        }

        const ua = window.navigator.userAgent
        const deviceInfo = ua.match(/\(([^)]*)\)/)[1].split(';')
        this.deviceInfo = deviceInfo[deviceInfo.length - 1].split('like')[0]

        // more faqs
        const serviceModuleId = sessionStorage.getItem('serviceModuleId')

        // 如果是从首页的单个faq默认选中
        // let faq_question = sessionStorage.getItem('faq_question')

        this.$axios.get(`/ocs/v1/moreFaqs?serviceModuleId=${serviceModuleId}`).then(res => {
            if (res.data.code === 200) {
                const list = []
                res.data.data.forEach((item, index) => {
                    list.push({
                        id: item.id,
                        name: item.thema,
                        tags: item.tags
                    })
                })
                this.questionsList = list
                const question = this.$route.query.question
                if (question) {
                    // this.question = JSON.parse(faq_question).id
                    this.question = question
                }
            }
        })

        // 渠道分类
        this.$axios.get(`/cms/vup/channels/dispark/categories`).then(res => {
            if (res.data && res.data instanceof Array) {
                res.data.forEach(item => {
                    item.disparkChannel.forEach(i => {
                        i.id = i.channelId
                    })
                })
                this.channelList = res.data
            }
        })

        // country
        this.$axios.get(`/cms/vup/v2/areas?versionCode=${this.$store.state.appVersionCode}`).then(res => {
            if (res.data && res.data instanceof Array) {
                this.countryList = res.data
                this.countryList.forEach(item => {
                    if (item.country) {
                        if (item.country.toLowerCase() === this.user.countryCode.toLowerCase()) {
                            this.defaultCountry = item.id
                        }
                    }
                })
            }
        })
    },
    methods: {
        setChannelName(item) {
            this.channelNameList = item.disparkChannel
        },
        setQuestion(question) {
            const tags = question.tags
            const type = [0, 0] // 1 支付，2频道
            if (tags && tags.length > 0) {
                tags.forEach(item => {
                    if (item.tagging_name === 'pay') {
                        type[0] = 1
                    }
                    if (item.tagging_name === 'channel') {
                        type[1] = 1
                    }
                })
            }
            this.type = type
        },
        submit() {
            const order = sessionStorage.getItem('orderMsg')

            if (this.type[1]) {
                if (!this.$refs.channelSelect.selected.id) {
                    this.$alert('Please select a channel type')
                    return false
                }
                if (!this.$refs.channelNameSelect.selected.id) {
                    this.$alert('Please select a channel Name')
                    return false
                }
            }
            if (!this.type[0] && !this.type[1]) {
                if (!this.$refs.countrySelect.selected.id) {
                    this.$alert('Please select a country')
                    return false
                }
            }

            if (!this.moredes) {
                this.$alert('Please fill in the problem description')
                return false
            }

            const param = {
                orderType: order ? JSON.parse(order).order_type_id : '',
                orderNo: order ? JSON.parse(order).order_no : '',
                orderName: order ? JSON.parse(order).order_name : '',
                orderCreateTime: order ? JSON.parse(order).order_create_time : '',
                userAccount: this.user.id,
                userId: this.user.id,
                unitType: this.unitType || '',
                operatorInfo: this.carrier || '',
                problemId: this.$refs.questionSelect.selected.id,
                problem: this.$refs.questionSelect.selected.name,
                problemChannelTypeKey: this.type[1] ? this.$refs.channelSelect.selected.id : '',
                problemChannelTypeValue: this.type[1] ? this.$refs.channelSelect.selected.name : '',
                problemChannelNameKey: this.type[1] ? this.$refs.channelNameSelect.selected.id : '',
                problemChannelNameValue: this.type[1] ? this.$refs.channelNameSelect.selected.name : '',
                problemCountryId: !this.type[0] && !this.type[1] ? this.$refs.countrySelect.selected.id : '',
                problemCountryCode: !this.type[0] && !this.type[1] ? this.$refs.countrySelect.selected.name : '',
                message: this.moredes,
                channelNameAdditional: '',
                channelType: ''
            }

            this.$axios
                .post(`/csms-service/v1/standard-leaving-message-records`, param, {
                    headers: {
                        'x-clientType': 1,
                        'x-appVersion': '5300'
                    }
                })
                .then(res => {
                    if (res.data.code === 200) {
                        sessionStorage.setItem('addMsg', JSON.stringify(Object.assign({}, param)))
                        this.$router.replace({
                            path: '/hybrid/faq/customerService',
                            query: this.$route.query
                        })
                    }
                })

            this.sendEvLog({
                category: 'onlineService',
                action: `stdservice_${this.$route.query.entrance_id || ''}_submit`,
                label: getFaqAnswerLabel(this, this.$route.query.question),
                value: 1
            })
        }
    },
    head() {
        return {
            title: 'Complain'
        }
    }
}
</script>
<style lang="less">
@import '~assets/less/faq/common.less';
</style>
<style lang="less" scoped>
.wrapper {
    background: #ffffff;
}

.order-contain {
    box-shadow: 0px 1px 3px 1px #dddddd;
    border-radius: 5px;
    width: 95%;
    margin: 1rem 2.5% 0 2.5%;
    background: #fff;
}

.gap {
    background-color: #f2f2f2;
    height: 4px;
    width: 100%;
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
        padding: 0.6rem;
        color: #0087eb;
        font-weight: bold;
        width: 60%;
        outline: none;
    }
}
</style>
