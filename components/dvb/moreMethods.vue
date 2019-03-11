<template>
    <div>
        <div class="blank_bottom">&nbsp;</div>
        <div @click="showAllWays" class="more-services">
            <p>
                {{$store.state.lang.more_recharge_method}}
                <span class="all">
                    {{$store.state.lang.membership_all}}
                    <img src="~assets/img/dvb/ic_right_def_r.png" alt>
                </span>
            </p>
        </div>
    </div>
</template>
<script>
import { toNativePage } from '~/functions/utils'
export default {
    props: {
        newUser: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isApp: this.$store.state.appType
        }
    },
    methods: {
        showAllWays() {
            if (this.isApp === 1) {
                this.sendEvLog({
                    category: 'dvbservice',
                    action: 'other_paymentWay_click',
                    label: this.newUser ? 'NewCardUser' : 'AddCardUser',
                    value: 10,
                    service_type: 'Recharge',
                    page_from: 'new'
                })
                toNativePage('com.star.mobile.video.smartcard.recharge.RechargeActivity?fromNewRecharge=true')
            }
        }
    }
}
</script>
<style lang="less" scoped>
.blank_bottom {
    height: 0.8rem;
    background: #eee;
}
.more-services {
    min-height: 3rem;
    color: #424242;
    padding:0 1rem;
    & > p {
        font-weight: bold;
        position: relative;
        margin-top: 1rem;
    }
    span {
        &.all {
            font-weight: 400;
            float: right;
            margin-right: 0.9rem;
            color: #757575;
            img {
                vertical-align: middle;
                position: absolute;
                right: 0;
                top: 1px;
            }
        }
    }
}
</style>
