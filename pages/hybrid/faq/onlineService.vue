<template>
    <div class="container">
        <div id="wrapper">
            <serviceBlock :service="serviceData" showMore="true"></serviceBlock>
            <div class="service" v-if="faqTagsData">
                <nav id="nav">
                    <a v-for="(item,index) in faqTagsData" :key="index" :class="{on:item.checked}" @click="changeServiceTag(item.id)">
                        <div :class="item.class"></div>
                    </a>
                </nav>
                <div class="questions">
                    <div v-for="(item,index) in faqTagsData" :key="index" v-show="item.checked">
                        <ul>
                            <li v-for="(item2,index2) in item.faqs" :key="index2" @click="clickQues(item2)">{{item2.thema}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="costomer">
            <nuxt-link :to="{path:'/hybrid/faq/customerService',query:$route.query}">
                <button class="btn">
                    COSTOMER SERVICE
                </button>
            </nuxt-link>
        </div>
    </div>
</template>
<script>
import serviceBlock from '~/components/faq/serviceBlock'
export default {
    layout: 'base',
    data: function() {
        return {
            serviceData: {},
            faqTagsData: [],
            faqsByTag: {},
            pageSize: 20,
            isLoading: false
        }
    },
    mounted() {
        localStorage.removeItem('faq_question')
        localStorage.removeItem('serviceModuleId')
        console.log(123)

        let entranceId = this.$route.query.entrance_id || ''

        // 服务块
        this.$axios
            .get(`/ocs/v1/service/module/show?entranceId=${entranceId}`, {
                headers: {
                    'x-clientType': 1,
                    'x-appVersion': '5300'
                }
            })
            .then(res => {
                if (res.data && res.data.data) {
                    this.serviceData = res.data.data
                    localStorage.setItem(
                        'orderMsg',
                        JSON.stringify(this.serviceData.order_info)
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
                        page: 1,
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
            if (tag.untilTotal) return
            this.$axios
                .get(
                    `/ocs/v1/faqs/byTag?tagId=${tagid}&pageSize=${
                        this.pageSize
                    }&pageNum=${tag.page}`
                )
                .then(res => {
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
            
            if (childHeight - scrollTop -container.offsetHeight <= 150 && this.isLoading == false) {
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
        clickQues(item) {
            localStorage.setItem('faq_question', JSON.stringify(item))
            this.$router.push({
                path: '/hybrid/faq/customerService',
                query: this.$route.query
            })
        }
    },
    components: {
        serviceBlock
    },
    head() {
        return {
            title: 'Online Service'
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    background: #fff;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
#wrapper {
    padding: 0.5rem;
    flex: 12;
    display: flex;
    background: #fff;
    flex-direction: column;
}
.service {
    flex: 1;
    display: flex;
    flex-direction: column;
    #nav {
        width: 100%;
        margin: 0 auto;
        text-align: center;
        padding-bottom: 0.6rem;
        display: flex;
        a {
            border-bottom: 3px solid #eeeeee;
            flex: 1;
            display: block;
            padding-bottom: 0.7rem;

            div {
                width: 1.4rem;
                margin: 0 auto;
                height: 1.5rem;
                background-size: contain !important;
                &.tab_hot {
                    background: url('~/assets/img/faq/ic_favorite_def_g.png')
                        no-repeat center;
                }
                &.tab_on {
                    background: url('~/assets/img/faq/ic_OTT_def_g.png')
                        no-repeat center;
                }
                &.tab_tv {
                    background: url('~/assets/img/faq/ic_TV_def_g.png')
                        no-repeat center;
                }
                &.tab_pay {
                    background: url('~/assets/img/faq/ic_changecard_def_g.png')
                        no-repeat center;
                }
                &.tab_account {
                    background: url('~/assets/img/faq/ic_accountconfirm_def_g.png')
                        no-repeat center;
                }
            }

            &.on {
                border-bottom: 3px solid #0087eb;
                div {
                    &.tab_hot {
                        background: url('~/assets/img/faq/ic_favorite_def_blue.png')
                            no-repeat center;
                    }
                    &.tab_on {
                        background: url('~/assets/img/faq/ic_OTT_def_b.png')
                            no-repeat center;
                    }
                    &.tab_tv {
                        background: url('~/assets/img/faq/ic_TV_def_blue.png')
                            no-repeat center;
                    }
                    &.tab_pay {
                        background: url('~/assets/img/faq/ic_changecard_def_blue.png')
                            no-repeat center;
                    }
                    &.tab_account {
                        background: url('~/assets/img/faq/ic_accountconfirm_def_blue.png')
                            no-repeat center;
                    }
                }
            }
        }
    }
    .questions {
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