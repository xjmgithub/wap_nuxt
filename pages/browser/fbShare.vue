<template>
    <div>
        <div class="page-header">
            <h1>Share Dialog</h1>
        </div>
        <p>Click the button below to trigger a Share Dialog</p>
        <div id="shareBtn" class="shareBtn">Share</div>
    </div>
</template>
<script>
import { initFacebookLogin } from '~/functions/utils'
export default {
    layout: 'base',
    mounted(){
        initFacebookLogin()
       document.getElementById('shareBtn').onclick = function() {
            // eslint-disable-next-line no-undef
            FB.ui({
                method: 'share',
                display: 'popup',
                href: 'http://m.startimestv.com/browser/program/subdetail/3816?subId=31629',
            }, function(response){});
        }
    },
    head() {
        return {
            title: 'Facebook Share',
            meta: [
                { property: 'og:url', content: 'http://www.nytimes.com/2015/02/19/arts/international/when-great-minds-dont-think-alike.html' },
                { property: 'og:type', content: 'article' },
                { property: 'og:title', content: 'When Great Minds Don’t Think Alike' },
                { property: 'og:description', content: 'How much does culture influence creative thinking?' },
                {
                    property: 'og:image',
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
