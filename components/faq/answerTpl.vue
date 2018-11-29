<template>
    <div class="list_faq_item clearfix">
        <div class="content_avatar fl">
            <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
        </div>
        <div class="welcome-wraper">
            <img class="arrow" src="~assets/img/faq/Triangle.png">
            <span class="welcome-item">{{answer}}</span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        answer: {
            require: true,
            type: String,
            default: ''
        }
    }
}
</script>