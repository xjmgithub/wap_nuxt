<template>
    <div class="list_faq_item clearfix">
        <div class="content_avatar fl">
            <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
        </div>
        <div class="content_show">
            <img class="arrow" src="~assets/img/faq/Triangle.png">
            <div class="hint">You may ask:</div>
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
            default: new Array()
        },
        dtype: {
            require: false,
            type: Number,
            default: 0
        }
    },
    methods: {
        ask(item) {
            this.$emit('ask', item, this.dtype)
        }
    }
}
</script>
