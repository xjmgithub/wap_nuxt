<template>
    <div>
        <div class="page-header">
            <h1>Share Dialog</h1>
        </div>
        <p>Click the button below to trigger a Share Dialog</p>
        <div class="shareBtn" @click="fbshare">Share</div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    methods: {
        fbshare() {
            FB.ui(
                {
                    method: 'share',
                    display: 'popup',
                    href: 'http://m.startimestv.com/browser/program/subdetail/3816?subId=31629'
                },
                function(response) {}
            )
        }
    },
    mounted(){
        this.fbshare()
    },
    head() {
        return {
            title: 'Facebook Share',
            meta: [
                { name: 'og:url', content: 'http://www.nytimes.com/2015/02/19/arts/international/when-great-minds-dont-think-alike.html' },
                { name: 'og:type', content: 'article' },
                { name: 'og:title', content: 'When Great Minds Don’t Think Alike' },
                { name: 'og:description', content: 'How much does culture influence creative thinking?' },
                {
                    name: 'og:image',
                    content: 'http://static01.nyt.com/images/2015/02/19/arts/international/19iht-btnumbers19A/19iht-btnumbers19A-facebookJumbo-v2.jpg'
                }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
.shareBtn {
    color: #ffffff;
    background: #5bb75b;
    padding: 0.5rem 0;
    text-align: center;
    width: 100px;
    margin: 1rem;
    border-radius: 5px;
}
</style>
