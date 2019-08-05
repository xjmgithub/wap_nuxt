<template>
    <div class="Mr-Right">
        <div class="title">
            <img src="~assets/img/vote/Banner2.jpg">
        </div>
        <div class="rule">
            <h3>Vote Rules</h3>
            <p>Every week watch Hello Mr. Right on Rembo TV / Novela E Plus / Star Times ON, and vote each week for your favorite couple of that week, you’ll stand a chance to win a latest Vivo smart phone. Here is how it works:</p>
            <p>1.Watch Hello Mr. Right and log in StarTimes ON to vote for your favorite couple of that week, each voter get 3 votes a day.</p>
            <p>2.Voters can only vote for the couple of that week, while the couples of the previous weeks would be closed temporarily for voters before the 12th episode.</p>
            <p>3.Vote for couples of the whole season would open once again for voters from the day of the 12th episode (Oct 21st) till Oct 31st 24:00.</p>
            <p>4.The couple with the most votes would get 2 Vivo smart phones while 3 lucky audiences would be randomly picked from all voters with each getting a Vivo smart phone.</p>
            <div>
                <p>One Lucky user will get a VIVO Phone, with
                    <span>AI Triple Camera(Front 16 MP, Rear 13MP+8MP+2MP), 5000mAh Battery, 6.35-inch Halo FullView Display, 4GB+64GB ROM</span>
                </p>
                <span>
                    <img src="~assets/img/vote/VIVO.jpg">
                </span>
            </div>
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
            margin-bottom: 0.5rem;
        }
    }
    .rule {
        color: #ffffff;
        padding: 0 5%;
        font-size: 0.88rem;
        & > p {
            margin: 0.5rem 0;
        }
        h3 {
            margin-top: 0;
        }
        span {
            color: #ff3e75;
            font-weight: bold;
        }
        div {
            margin: 0.5rem 0;
            p {
                width: 55%;
                display: inline-block;
                vertical-align: middle;
            }
            & > span {
                width: 40%;
                display: inline-block;
                margin-left: 0.5rem;
                img {
                    width: 100%;
                }
            }
        }
    }
}
</style>


