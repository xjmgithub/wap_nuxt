<template>
    <div class="wrapper">
        <div class="content" style="min-height:101%">
            <template v-for="(item,index) in renderQueue">
                <signwayTpl v-if="item.tpl=='signway'" :key="index" :dtype="item.key" :list="item.contents" :question="item.name" @chooseWay="askQuest" />
                <signQuestionTpl v-if="item.tpl=='list'" :key="index" :dtype="item.key" :list="item.contents" :question="item.name" @ask="askQuest" />
                <askTpl v-if="item.tpl=='ask'||item.tpl=='chatask'" :key="index" :question="item.name" />
            </template>
            <inputTpl v-if="reason" @otherReason="sendReason" />
        </div>
    </div>
</template>
<script>
import signwayTpl from '~/components/faq/signwayTpl'
import signQuestionTpl from '~/components/faq/signQuestionTpl'
import askTpl from '~/components/faq/askTpl'
import inputTpl from '~/components/faq/inputTpl'
import loginfaq from '~/functions/faq/loginfaq'
export default {
    layout: 'base',
    components: {
        signwayTpl,
        signQuestionTpl,
        askTpl,
        inputTpl
    },
    data() {
        const faq = loginfaq(this)
        return {
            renderQueue: [],
            faq:faq,
            reason:''
        }
    },
    mounted() {
        this.addOperate({
            tpl: 'signway',
            contents: this.faq[1].items,
            name: this.faq[1].name,
            key:this.faq[1].key
        })
    },
    methods: {
        addOperate(obj) {
            if (obj && obj.tpl) {
                this.renderQueue.push(obj)
            }
        },
        askQuest(item,key) {
            this.reason = ''
            if (item.child === 9001) {
               this.addOperate({
                    tpl: 'ask',
                    name: item.name
                })
                this.addOperate({
                    tpl: 'list',
                    name: this.faq[9001].name
                })
            } else if (item.child === 9002) {
                // TODO 弹出 form input 
                this.reason = ''
            }else {
                this.addOperate({
                    tpl: 'ask',
                    name: item.name
                })
                this.addOperate({
                    tpl: 'list',
                    contents: this.faq[item.child].items,
                    name: this.faq[item.child].name
                })
            }
        },
        sendReason(con){
            this.reason = ''
            this.addOperate({
                tpl: 'ask',
                name:con
            })
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
    padding-bottom:1.5rem;
}
</style>
