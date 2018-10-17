<template>
    <div id="wrapper">
        <div class="list_faq_item clearfix">
            <div class="content_avatar fl"><img src="~assets/img/faq/ic_onlineservice_def_multicolor.png"></div>
            <div class="welcome-wraper ">
                <img class="arrow" src="~assets/img/faq/Triangle.png">
                <span class="welcome-item">Hello, This is Amy. Welcome to the StarTimes’ Online Service.</span>
            </div>
        </div>
        <div class="list_faq_item  clearfix">
            <div class="content_avatar fr"><img src="~assets/img/faq/1-02.png"></div>
            <div class="content_show fr">
                <img class="arrow" src="~assets/img/faq/Triangle_right.png">
                <div class="faq_content">How to recharge</div>
            </div>
        </div>
        <div class="order-msg">
            <p class="time">9 Dec 2018 19:34:35</p>
            <div class="order-type clearfix">
                <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
                <div class="right">
                    <p class="order-name">DVB Recharge<span>￥980 </span></p>
                    <p class="order-status">Card No. 0213 9030 831<span>Successful</span></p>
                </div>
            </div>
        </div>
        <div class="list_faq_item clearfix">
            <div class="content_avatar fl"><img src="~assets/img/faq/ic_onlineservice_def_multicolor.png"></div>
            <div class="welcome-wraper ">
                <img class="arrow" src="~assets/img/faq/Triangle.png">
                <span class="welcome-item">1. Please make sure you have signed in the authorized account that you subscribed StarTimes ON. 2. Please make sure the channel is in the plan you have subscribed. 3. Please make sure the internet connection is working.</span>
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
        <div class="live-chat">
            <button class="btn">
                LIVE CHAT
            </button>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    head() {
        return {
            title: 'Customer Service'
        }
    },
    watch: {
        $route(nv,ov){
            console.log(nv)
        }
    },
    mounted() {
        this.$router.push({ query: { liuyan: 1 } })
    }
}
</script>
<style lang="less">
body {
    background: #eee;
}
.wrapper {
    font-family: 'DINPro', Roboto, Arial, Helvetica, Sans-serif;
}
.fl {
    float: left;
}

.fr {
    float: right;
}
.clearfix:after {
    display: block;
    visibility: hidden;
    clear: both;
    height: 0;
    content: '';
}
.clearfix {
    zoom: 1;
}
.clear {
    clear: both;
}
.list_faq_item {
    margin-left: 8px;
    margin-right: 8px;
    padding-top: 1rem;
    .content_avatar {
        img {
            width: 36px;
            height: 36px;
        }
    }
    .welcome-wraper {
        display: inline-block;
        width: auto;
        margin-left: 10px;
        background: #fff;
        border-radius: 5px;
        max-width: 75%;
        position: relative;
        padding: 0.6rem 0.8rem;
        .welcome-item {
            display: inline-block;
            margin: 0;
            height: auto;
            line-height: 1.2rem;
            font-size: 0.8rem;
            color: #333333;
        }
        img.arrow {
            width: 8px;
            height: 12px;
            position: absolute;
            top: 13px;
            left: -8px;
        }
        .btn {
            color: #0087eb;
            font-size: 0.8rem;
            margin: 0.7rem 0;
            float: right;
            font-weight: 600;
        }
        .attitude-container {
            padding-top: 0.6rem;
            color: #212121;
            font-size: 0.9rem;
            border-top: 1px solid #eeeeee;
            div {
                display: inline-block;
                text-align: center;
                line-height: 1.3rem;
                &:last-child {
                    margin-left: 20px;
                }
            }
            img {
                width: 25px;
                height: 25px;
                margin: 0 auto;
                display: block;
            }
        }
    }
}
.content_show {
    display: inline-block;
    width: auto;
    margin-right: 10px;
    background: #0087eb;
    border-radius: 5px;
    max-width: 75%;
    position: relative;
    .faq_content {
        display: inline-block;
        margin: 0;
        padding: 0.6rem;
        height: auto;
        line-height: 1.2rem;
        font-size: 0.8rem;
        color: #fff;
    }
    img {
        width: 8px;
        height: 12px;
        position: absolute;
        top: 13px;
        right: -8px;
    }
}
.order-msg {
    box-shadow: 0px 1px 3px 1px #dddddd;
    border-radius: 5px;
    padding: 0.5rem;
    width: 95%;
    margin: 1rem 2.5% 0 2.5%;
    background: #fff;
    .time {
        width: 100%;
        color: #aaaaaa;
        font-size: 0.8rem;
        border-bottom: 1px solid #eeeeee;
        padding: 0.2rem 0;
    }
}
.order-type {
    padding: 0.7em 0;
    img {
        width: 2.5rem;
        height: 2.5rem;
        float: left;
    }
    .right {
        margin-left: 3rem;
    }
    .order-name {
        span {
            font-weight: bold;
            float: right;
        }
    }
    .order-status {
        font-size: 0.9rem;
        color: #999999;
        span {
            color: #00cc33;
            float: right;
        }
    }
}

.live-chat {
    width: 100%;
    background: #fff;
    text-align: center;
    color: #0087eb;
    border-top: 1px solid #eeeeee;
    margin-top: 1.5rem;
    padding: 1rem 0;
    position: fixed;
    bottom: 0;
    button {
        margin: 0 auto;
        border: 1px solid #0087eb;
        border-radius: 2px;
        background: #fff;
        padding: 0.3rem;
        font-weight: bold;
        width: 60%;
    }
}
</style>