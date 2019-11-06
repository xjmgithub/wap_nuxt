<template>
    <div>
        <h3>
            提示：该页面仅支持 startimesON apk
            http://confluence.startimes.me/pages/viewpage.action?pageId=49479819
        </h3>
        <div class="item" @click="toNativePage('com.star.mobile.video.activity.HomeActivity')">
            <img src="~assets/img/tools/home.jpg" />
            Home页
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.activity.BrowserActivity?loadUrl=http://m.startimestv.com/hybrid/tools/calltest')">
            <img src="~assets/img/tools/webview.jpg" />
            H5专题页
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.player.PlayerLiveActivity?channelID=444')">
            <img src="~assets/img/tools/webview.jpg" />
            直播页
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.player.PlayerVodActivity?vodId=119770')">
            <img src="~assets/img/tools/webview.jpg" />
            点播页
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.home.HomeActivity?fragmentTag=LIVE_CHANNEL')">
            <img src="~assets/img/tools/webview.jpg" />
            Live TV页
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.home.HomeActivity?fragmentTag=Me')">
            <img src="~assets/img/tools/webview.jpg" />
            Me 页面
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.appversion.CurrentVersionAppDetailActivity')">
            <img src="~assets/img/tools/webview.jpg" />
            升级页面
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.soccer.SoccerMatchActivity?leagueId=xxx')">
            <img src="~assets/img/tools/webview.jpg" />
            赛事专题页
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.me.mycoins.MyCoinsActivity')">
            <img src="~assets/img/tools/webview.jpg" />
            My Coins页
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.me.tellfriend.TellFriendActivity')">
            <img src="~assets/img/tools/webview.jpg" />
            Tell Friends页面(旧)
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.smartcard.recharge.RechargeActivity')">
            <img src="~assets/img/tools/webview.jpg" />
            充值选择页
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.smartcard.changebouquet.ChangeBouquetActivity')">
            <img src="~assets/img/tools/webview.jpg" />
            换包页(Bouquet)
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.me.orders.DecoderSubscriptionOrdersActivity')">
            <img src="~assets/img/tools/webview.jpg" />
            DVB订单页(Decoder Subscription Orders）
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.me.orders.RechargeOrderActivity')">
            <img src="~assets/img/tools/webview.jpg" />
            充值订单列表页(Decoder Subscription Orders）
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.me.orders.ChangeBouquetOrderActivity')">
            <img src="~assets/img/tools/webview.jpg" />
            换包订单列表页(Decoder Subscription Orders）
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.me.statement.StatementActivity')">
            <img src="~assets/img/tools/webview.jpg" />
            钱包交易记录页（Account Statement）
        </div>
        <div class="item" @click="toNativePage('com.star.mobile.video.me.product.MembershipListActivity')">
            <img src="~assets/img/tools/webview.jpg" />
            会员商品详情
        </div>
    </div>
</template>
<script>
import { toNativePage } from '~/functions/app'
export default {
    layout: 'base',
    data() {
        return {}
    },
    methods: {
        toNativePage(page) {
            toNativePage(page)
        }
    }
}
</script>
<style>
h3{
    color:red;
    margin:1rem;
}
img{
    width:10rem;
    display:block;
    margin:0 auto;
}
.item{
    text-align: center;
    line-height: 2rem;
    border-bottom:solid 1px #ccc;
    margin:1rem 0;
}
</style>
