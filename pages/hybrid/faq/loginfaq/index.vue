<template>
    <div class="wrapper">
        <div class="content" style="min-height:101%">
            <template v-for="(item,index) in renderQueue">
                <signwayTpl v-if="item.tpl=='signway'" :key="index" :item="item" @chooseWay="askQuest" />
                <signQuestionTpl v-if="item.tpl=='list'" :key="index" :item="item" @ask="askQuest" />
                <askTpl v-if="item.tpl=='ask'||item.tpl=='chatask'" :key="index" :question="item.name" />
            </template>
        </div>
        <mInput v-if="reason" @otherReason="sendReason" />
    </div>
</template>
<script>
import signwayTpl from '~/components/faq/signwayTpl'
import signQuestionTpl from '~/components/faq/signQuestionTpl'
import askTpl from '~/components/faq/askTpl'
import mInput from '~/components/faq/input'
import loginfaq from '~/functions/faq/loginfaq'
export default {
    layout: 'base',
    components: {
        signwayTpl,
        signQuestionTpl,
        askTpl,
        mInput
    },
    data() {
        const faq = loginfaq(this)
        return {
            renderQueue: [],
            faq: faq,
            reason: '',
            showTime: ''
        }
    },
    mounted() {
        this.addOperate({
            tpl: 'signway',
            contents: this.faq[1].items,
            name: this.faq[1].name,
            key: this.faq[1].key
        })
        this.sendEvLog({
            category: 'login_feedback',
            action: 'page_show',
            Label: 1,
            Value: 1
        })
        this.showTime = new Date().getTime()
    },
    methods: {
        addOperate(obj) {
            if (obj && obj.tpl) {
                this.renderQueue.push(obj)
                this.refreshScroll()
            }
        },
        refreshScroll() {
            const contain = document.querySelector('.wrapper')
            this.$nextTick(() => {
                contain.scrollIntoView(false);
            })
        },
        askQuest(item, code) {
            this.reason = ''
            console.log(code)
            const clickTime = new Date().getTime()
            const dealTime = clickTime - this.showTime
            if (item.child === 9001) {
                this.sendEvLog({
                    category: 'login_feedback',
                    action: `question[${code}]_click`,
                    label: item.name,
                    Value: 1,
                    deal_time: dealTime
                })
                this.addOperate({
                    tpl: 'ask',
                    name: item.name
                })
                this.addOperate({
                    tpl: 'list',
                    name: this.faq[9001].name
                })
                this.sendEvLog({
                    category: 'login_feedback',
                    action: `question[${this.faq[9001].key}]_show`,
                    label: 1,
                    Value: 1
                })
            } else if (item.child === 9002) {
                this.reason = code
                this.sendEvLog({
                    category: 'login_feedback',
                    action: `question[${code}]_click`,
                    label: item.name,
                    Value: 1,
                    deal_time: dealTime
                })
            } else {
                this.sendEvLog({
                    category: 'login_feedback',
                    action: `question[${code}]_click`,
                    label: item.name,
                    Value: 1,
                    deal_time: dealTime
                })
                this.addOperate({
                    tpl: 'ask',
                    name: item.name
                })
                this.addOperate({
                    tpl: 'list',
                    contents: this.faq[item.child].items,
                    name: this.faq[item.child].name,
                    key: this.faq[item.child].key
                })
                this.sendEvLog({
                    category: 'login_feedback',
                    action: `question[${this.faq[item.child].key}]_show`,
                    label: 1,
                    Value: 1,
                })
            }
        },
        sendReason(con) {
            this.addOperate({
                tpl: 'ask',
                name: con
            })
            this.reason = ''
        }
    }
}
</script>
<style lang="less">
@import '~assets/less/faq/common.less';
@import '~assets/less/faq/loginfaq.less';
body {
    background: #eeeeee;
}
</style>
<style lang="less" scoped>
.wrapper {
    overflow: hidden;
    background: #eeeeee;
    .content{
        padding-bottom: 4.5rem;
        background: #eeeeee;
    }
}
</style>
