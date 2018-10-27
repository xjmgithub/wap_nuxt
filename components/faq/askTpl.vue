<template>
    <div class="list_faq_item list_faq_item_fr clearfix">
        <div class="content_avatar fr">
            <img v-show="user.head" :src="user.head" />
            <img v-show="!user.head" src="~assets/img/faq/1-02.png" />
        </div>
        <div class="content_show fr">
            <img class="arrow" src="~assets/img/faq/Triangle_right.png">
            <div class="faq_content">{{question}}</div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        question: {
            require: true,
            type: String
        }
    },
    data() {
        return {
            user: this.$store.state.user
        }
    }
}
</script>