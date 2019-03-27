<template>
    <div class="list_faq_item clearfix">
        <div class="content_avatar fl">
            <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
        </div>
        <div class="content_show">
            <img class="arrow" src="~assets/img/faq/Triangle.png">
            <div v-if="!question" class="hint">
                <span >You may ask:</span>
            </div>
            <div v-else :class="{haslist:list.length > 0}" class="quest">
                <span>{{question}}</span>
            </div>
            <ul class="ques-item-wraper clearfix">
                <li v-for="(item,index) in list" :key="index" @click="ask(item)">
                    <span class="recommend_q_con">{{item.name}}</span>
                    <img class="forward_arrow" src="~assets/img/faq/ic_categary_copy41.png">
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        list: {
            require: true,
            type: Array,
            default: () => []
        },
        question: {
            require: true,
            type: String,
            default: ''
        },
        key: {
            require: true,
            type: String,
            default: ''
        },
    },
    methods: {
        ask(item) {
            this.$emit('ask', item, this.key)
        }
    }
}
</script>
