<template>
    <div class="list_faq_item clearfix">
        <div class="content_avatar fl">
            <img src="~assets/img/faq/ic_onlineservice_def_multicolor.png">
        </div>
        <div class="content_show">
            <img class="arrow" src="~assets/img/faq/Triangle.png">
            <div class="result-wraper" v-html="content"></div>
            <div>
                <div class="btn">COMPLAIN</div>
                <div class="clear"></div>
                <div class="attitude-container">
                    <div class="yes-item">
                        <img src="~assets/img/faq/ic_happy_def_g.png" alt="">
                        <span>YES</span>
                    </div>
                    <div class="no-item">
                        <img src="~assets/img/faq/ic_disappoint_def_g.png" alt="">
                        <span>NO</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        content: {
            require: true,
            type: String
        }
    }
}
</script>
<style>
/* for v-html */
.result-wraper p:first-child {
    padding-top: 9px;
}

.result-wraper p {
    line-height: 1.5;
    font-size: 14px;
    word-wrap: break-word;
    word-break: normal;
    color: #757575;
}

.result-wraper p img {
    display: block;
    width: 70% !important;
    height: auto !important;
    margin: 0 auto;
}

.result-wraper p span {
    display: inline-block;
    max-width: 100%;
    color: #212121 !important;
}

.result-wraper p a {
    color: #2196f3 !important;
    text-decoration: none !important;
}
</style>