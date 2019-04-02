<template>
    <div class="list_faq_item clearfix">
        <div class="content_avatar fl">
            <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
        </div>
        <div class="content_show">
            <img class="arrow" src="~assets/img/faq/Triangle.png">
            <div v-if="!item.name" class="hint">
                <span >You may ask:</span>
            </div>
            <div v-else :class="{haslist:item.contents && item.contents.length}" class="quest">
                <span>{{item.name}}</span>
            </div>
            <ul class="ques-item-wraper clearfix">
                <li v-for="(ques,index) in item.contents" :key="index" @click="ask(ques)">
                    <span class="recommend_q_con">{{ques.name}}</span>
                    <img class="forward_arrow" src="~assets/img/faq/ic_categary_copy41.png">
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        item: {
            require: true,
            type: Object,
            default: () => {}
        },
    },
    methods: {
        ask(ques) {
            this.$emit('ask', ques,this.item.key)
        }
    }
}
</script>
