<template>
    <div class="Mr-Right">
        <div class="title">
            <img src="~assets/img/vote/Banner3.jpg">
        </div>
        <div class="rule">
            <h3>Vote Rules</h3>
            <p>Watch Nigeria Hello Mr.Right and you will have a chance to win a big prize sponsored by Bedmate. The total value of the prize exceeds 1.5million Naira. Download APP StarTimes ON from Google Play or Apple store, and vote for your favourite couples.</p>
            <p>From 1st Nov, you can vote for you favourite couples every day on StarTimes ON, the vote will end one week after the last episode aired, the couples who win the top three votes will get a big prize. </p>
            <p>We will also randomly pick three lucky participants, each of them will win a Bedmate furniture. </p>
            <p>Don't be hesitate, come and vote. Bedmate furniture is waiting for you!</p>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base'
}
</script>
<style lang="less" scoped>
.Mr-Right {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background: #f5a189;
    padding-bottom: 2rem;
    .title {
        img {
            display: block;
            width: 100%;
            margin-bottom: 0.5rem;
        }
    }
    .rule {
        color: #ffffff;
        padding: 0 5%;
        font-size: 0.95rem;
        & > p {
            margin: 0.8rem 0;
        }
        h3 {
            margin-top: 0;
        }
    }
}
</style>


