<template>
    <div class="list_faq_item clearfix">
        <div class="content_avatar fl">
            <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
        </div>
        <div class="content_show">
            <img class="arrow" src="~assets/img/faq/Triangle.png">
            <div>
                {{question}}
            </div>
            <ul class="signway-item-wraper clearfix">
                <li v-for="(item,index) in list" :key="index" @click="ask(item)">
                    <span>{{item.name}}</span>
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
        }
    },
    methods: {
        ask(item) {
            this.$emit('chooseWay', item)
        }
    }
}
</script>
