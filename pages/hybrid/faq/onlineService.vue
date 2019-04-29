<template>
    <div class="wrapper">
        <div class="container">
            <serviceBlock :service="service" :show-more="true"/>
            <div v-if="faqTags" class="service">
                <div id="nav">
                    <a v-for="(item,index) in faqTags" :key="index" :class="{on:item.checked}" @click="changeTag(item.id)">
                        <div :class="item.class"/>
                    </a>
                </div>
                <div class="questions">
                    <div v-for="(item,index) in faqTags" v-show="item.checked" :key="index">
                        <ul v-if="item.faqs.length>0">
                            <li v-for="(item2,index2) in item.faqs" :key="index2" @click="clickQues(item2)" v-html="item2.thema"/>
                        </ul>
                        <loading v-else/>
                    </div>
                </div>
            </div>
        </div>
        <div class="costomer">
            <nuxt-link :to="{path:'/hybrid/faq/customerService',query:$route.query}">
                <button class="btn">CUSTOMER SERVICE</button>
            </nuxt-link>
        </div>
    </div>
</template>
<script>
import serviceBlock from '~/components/faq/serviceBlock'
import { getFaqLogLabel, getFaqAnswerLabel, getFaqBlockLogLabel } from '~/functions/utils'
import loading from '~/components/loading'
export default {
    layout: 'base',
    components: {
        serviceBlock,
        loading
    },
    data: function() {
        return {
            pageSize: 20,
            isLoading: false,
            entranceId: this.$route.query.entrance_id || ''
        }
    },
    async asyncData({ app: { $axios }, route, store }) {
        const logoMap = {
            hot: 'tab_hot',
            on: 'tab_on',
            tv: 'tab_tv',
            pay: 'tab_pay',
            account: 'tab_account'
        }
        let tags = []
        let service = {}

        try {
            $axios.setHeader('token', store.state.token)
            $axios.setHeader('x-clientType', 1)
            $axios.setHeader('x-appVersion', 51120)
            const res1 = await $axios.get(`/ocs/v1/faqs/Tags`)
            const res2 = await $axios.get(`/ocs/v1/service/module/show?entranceId=${route.query.entrance_id}`)
            res1.data.data.forEach((item, index) => {
                tags.push({
                    id: item.tagging_id,
                    name: item.tagging_name,
                    checked: index <= 0,
                    class: logoMap[item.tagging_name.toLowerCase()] || 'tab_hot',
                    page: 1,
                    untilTotal: false,
                    faqs: []
                })
            })
            service = res2.data.data
        } catch (e) {
            tags = [] // TODO 跳转失败页面
            service = {}
        }
        return {
            faqTags: tags || [],
            service: service
        }
    },
    mounted() {
        document.querySelector('.wrapper').style.height = window.innerHeight + 'px'

        this.sendEvLog({
            category: 'onlineService',
            action: `dialog_${this.entranceId || ''}_show`,
            label: getFaqLogLabel.call(this),
            value: 1
        })

        sessionStorage.removeItem('faq_question')
        sessionStorage.removeItem('morefaqs')

        this.changeTag(this.faqTags[0].id || 1)

        this.$nextTick(() => {
            const collect = document.querySelectorAll('.questions div')
            for (let i = 0; i < collect.length; i++) {
                collect[i].addEventListener('scroll', this.handleScroll)
            }
        })

        if (this.service && this.service.service_module) {
            sessionStorage.setItem('serviceModuleId', this.service.service_module.id)
            sessionStorage.setItem('orderMsg', JSON.stringify(this.service.order_info))

            this.sendEvLog({
                category: 'onlineService',
                action: `block_${this.entranceId || ''}_show`,
                label: getFaqBlockLogLabel.call(this),
                value: 1
            })
        }
    },
    methods: {
        getfaqsByTag(tagId, moretag) {
            let tag = {}
            this.faqTags.forEach(item => {
                item.checked = item.id == tagId
                if (item.id == tagId) {
                    tag = item
                }
            })
            if (!moretag && tag.page > 1) return
            if (tag.untilTotal) return
            this.$axios.get(`/ocs/v1/faqs/byTag?tagId=${tagId}&pageSize=${this.pageSize}&pageNum=${tag.page}`).then(res => {
                this.isLoading = false
                if (res.data) {
                    tag.faqs = tag.faqs.concat(res.data.data.rows)
                    tag.page = tag.page + 1
                    if (tag.faqs.length >= res.data.data.total) {
                        tag.untilTotal = true
                    }
                }
            })
        },
        changeTag(tagId) {
            this.sendEvLog({
                category: 'onlineService',
                action: `cat_${tagId || ''}_click`,
                label: getFaqLogLabel.call(this),
                value: 1
            })
            this.getfaqsByTag(tagId)
        },
        handleScroll(evt) {
            const container = evt.target
            const child = evt.target.querySelector('ul')
            const childHeight = child.offsetHeight
            const scrollTop = container.scrollTop

            if (childHeight - scrollTop - container.offsetHeight <= 150 && this.isLoading === false) {
                this.isLoading = true
                let checkedId = null
                this.faqTags.forEach(item => {
                    if (item.checked === true) {
                        checkedId = item.id
                    }
                })

                this.getfaqsByTag(checkedId, true)
            }
        },
        clickQues(item) {
            sessionStorage.setItem('faq_question', JSON.stringify(item))
            this.$router.push({
                path: '/hybrid/faq/customerService',
                query: this.$route.query
            })
            this.sendEvLog({
                category: 'onlineService',
                action: `answer_${this.entranceId || ''}_click`,
                label: getFaqAnswerLabel.call(this, item.id) + '_0',
                value: 1
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
<style lang="less" scoped>
.wrapper {
    background: white;
    display: -webkit-box;
    width: 100%;
    /* 
    autoprefixer: off 
    https://github.com/Fyrd/caniuse/issues/3429
    */
    -webkit-box-orient: vertical;
}
.container {
    padding: 0.5rem 0.5rem 0;
    -webkit-box-flex: 12;
    display: -webkit-box;
    background: #fff;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
}
.service {
    -webkit-box-flex: 1;
    display: -webkit-box;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    #nav {
        width: 100%;
        margin: 0 auto;
        text-align: center;
        padding-bottom: 0.6rem;
        display: -webkit-box;
        a {
            border-bottom: 3px solid #eeeeee;
            -webkit-box-flex: 1;
            display: block;
            padding-bottom: 0.7rem;

            div {
                width: 1.4rem;
                margin: 0 auto;
                height: 1.5rem;
                background-size: contain !important;
                &.tab_hot {
                    background: url('~assets/img/faq/ic_favorite_def_g.png') no-repeat center;
                }
                &.tab_on {
                    background: url('~assets/img/faq/ic_OTT_def_g.png') no-repeat center;
                }
                &.tab_tv {
                    background: url('~assets/img/faq/ic_TV_def_g.png') no-repeat center;
                }
                &.tab_pay {
                    background: url('~assets/img/faq/ic_changecard_def_g.png') no-repeat center;
                }
                &.tab_account {
                    background: url('~assets/img/faq/ic_accountconfirm_def_g.png') no-repeat center;
                }
            }

            &.on {
                border-bottom: 3px solid #0087eb;
                div {
                    &.tab_hot {
                        background: url('~assets/img/faq/ic_favorite_def_blue.png') no-repeat center;
                    }
                    &.tab_on {
                        background: url('~assets/img/faq/ic_OTT_def_b.png') no-repeat center;
                    }
                    &.tab_tv {
                        background: url('~assets/img/faq/ic_TV_def_blue.png') no-repeat center;
                    }
                    &.tab_pay {
                        background: url('~assets/img/faq/ic_changecard_def_blue.png') no-repeat center;
                    }
                    &.tab_account {
                        background: url('~assets/img/faq/ic_accountconfirm_def_blue.png') no-repeat center;
                    }
                }
            }
        }
    }
    .questions {
        -webkit-box-flex: 1;
        overflow: hidden;
        position: relative;
        > div {
            overflow-y: auto;
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
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
    border-top: 1px solid #eeeeee;
    padding: 0.7rem 0;
    background: #fff;
    button {
        margin: 0 auto;
        border: 1px solid #0087eb;
        color: #0087eb;
        border-radius: 2px;
        background: #fff;
        padding: 0.6rem;
        font-weight: bold;
        width: 60%;
        outline: none;
    }
}
</style>
