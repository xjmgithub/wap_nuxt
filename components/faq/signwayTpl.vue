<template>
    <div class="list_faq_item clearfix">
        <div class="content_avatar fl">
            <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
        </div>
        <div class="content_show">
            <img class="arrow" src="~assets/img/faq/Triangle.png">
            <div>
                {{item.name}}
            </div>
            <ul class="signway-item-wraper clearfix">
                <li v-for="(way,index) in item.contents" :key="index" @click="ask(way)">
                    <span>{{way.name}}</span>
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
        ask(way) {
            this.$emit('chooseWay', way,this.item.key)
        }
    }
}
</script>
