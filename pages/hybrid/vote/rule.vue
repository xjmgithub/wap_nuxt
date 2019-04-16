<template>
    <div class="Mr-Right">
        <div class="title">
            <img src="~assets/img/vote/pic_title.png">
        </div>
        <div class="rule">
            <h3>Vote Rules</h3>
            <p>From Apr 21st to Jul 16th you have 3 votes every day. Vote for couples you like to help them win!</p>
            <div>
                <p>One lucky user will get a
                    <span> 32'' Digital TV+Satellite Dish+3 months subscription.</span>
                </p>
                <span>
                    <img src="~assets/img/vote/satellite.png">
                </span>
            </div>
            <div>
                <p>Top 3 voted couples will win full
                    <span>Solar Kit+24inch Digital TV+Satellite Dish+4 light bulbs+Solar Power System.</span>
                </p>
                <span>
                    <img src="~assets/img/vote/solar_power.png">
                </span>
            </div>
            <p>After voting for weekly candidates, you can still vote for your favorite couples 14th-16th Jul. Rank results will be decided by both weekly votes and final votes.</p>
            <h4>Tips for you to win lucky prize:</h4>
            <p>More times you vote, more likely you win big user prize. So make sure you vote everyday! Sign in to get more chances to win.</p>
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
        }
    }
    .rule {
        color: #ffffff;
        padding: 0 5%;
        font-size: 0.88rem;
        h3 {
            margin-top: 0;
        }
        span {
            color: #FF3E75;
            font-weight: bold;
        }
        div {
            p {
                width: 55%;
                display: inline-block;
                vertical-align: middle;
            }
            &>span {
                width: 40%;
                display: inline-block;
                margin-left:.5rem;
                img {
                    width:100% ;
                }
            }
        }
    }
}
</style>


