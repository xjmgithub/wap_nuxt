<template>
    <div class="list_faq_item list_faq_item_fr clearfix">
        <div class="content_avatar fr">
            <img v-if="user.head" :src="user.head.replace('http:','https:')">
            <img v-if="!user.head" src="~assets/img/faq/1-02.png">
        </div>
        <div class="content_show fr">
            <img class="arrow" src="~assets/img/faq/Triangle_right.png">
            <div class="faq_content" v-html="question"/>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        question: {
            require: true,
            type: String,
            default: ''
        }
    },
    data() {
        return {
            user: this.$store.state.user
        }
    }
}
</script>
