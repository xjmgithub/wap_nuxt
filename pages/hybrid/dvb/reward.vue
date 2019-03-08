<template>
    <div class="wrapper">
        <div class="top">
            <p>You’ll get the reward once you link the decoder with App account. If you haven't linked, please LINK first.</p>
        </div>
        <div class="policy">
            <p class="title">
                Reward Policy
            </p>
            <table>
                <tr>
                    <th width="30%" class="status">
                        Decoder Status
                    </th>
                    <th width="40%">
                        Bouquet Subscribed
                    </th>
                    <th width="30%">
                        Reward After 'LINK'
                    </th>
                </tr>
                <tr>
                    <td>Dormant</td> 
                    <td>Any Bouquet</td>
                    <td>
                        <span>7 days</span> Classic/Super bouquet free experience
                    </td>
                </tr>
                <tr>
                    <td rowspan="2">
                        Active
                    </td>
                    <td>
                        <p>NOVA/Basic on DTT</p>NOVA/Smart on DTH
                    </td>
                    <td>
                        <span>8 days</span> free subscription for current bouquet
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Classic on DTT</p>Super / French / Chinese on DTH
                    </td>
                    <td>
                        <span>10 days</span> free subscription for current bouquet
                    </td>
                </tr>
                <tr class="remarks">
                    <td>Remarks</td>
                    <td colspan="2">
                        Each user(device/decoder) only has one chance to enjoy this reward.
                    </td>
                </tr>
                <tr class="last">
                    <td colspan="3">
                        Terms And Conditions Apply
                    </td>
                </tr>
            </table>
        </div>
        <mButton :text="'GO TO LINK'" @click="goToLink" class="btn" />
        <mButton :text="'GET REWARD'" @click="getReward" class="btn" />
    </div>
</template>
<script>
import mButton from '~/components/button'
import { toNativePage } from '~/functions/utils'
export default {
    layout: 'base',
    components: {
        mButton
    },
    data() {
        return {
            getRewarding: false
        }
    },
    methods: {
        goToLink() {
            toNativePage('com.star.mobile.video.dvbservice.DvbServiceActivity')
        },
        getReward() {
            if (this.getRewarding) return false
            this.getRewarding = true
            this.$axios
                .post('/self/v1/gift-award/after-link')
                .then(res => {
                    this.getRewarding = false
                    const data = res.data
                    if (data.code === 200) {
                        this.$alert('Congratulations! Redeem succesfully.')
                    } else if (data.code === '402') {
                        this.$alert('You need link first.')
                    } else if (data.code === '201') {
                        this.$alert('Your account has redeemed once.')
                    } else if (data.code === '202') {
                        this.$alert('Your smartcard has redeemed once.')
                    } else if (data.code === '203') {
                        this.$alert('Your phone has redeemed once.')
                    } else if (data.code === '403') {
                        this.$alert('Smartcard exception, please contact call center.')
                    } else {
                        this.$alert('Network erro, please try again. Or contact call center.')
                    }
                })
                .catch(() => {
                    this.$alert('Network erro, please try again. Or contact call center.')
                })
        }
    },
    head() {
        return {
            title: 'Reward'
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    // background: url('~assets/img/dvb/bg_color.png') no-repeat;
    // background-size: 100%;
    // position: static;
    background: linear-gradient( #0007ac 20%,#0007ac 0,#ffffff 100%);
    .top {
        background: url('~assets/img/dvb/head.png') no-repeat;
        height: 7rem;
        padding-top: 1.7rem;
        background-size: 100%;
        p {
            width: 90%;
            margin: 0 auto;
            color: #ffffff;
            font-weight: bold;
        }
    }
    .policy {
        width: 90%;
        margin: 0 auto;
        .title {
            color: #05528b;
            font-size: 0.9rem;
            font-weight: bold;
            text-align: center;
            background-color: #d5e4ff;
            height: 2.5rem;
            line-height: 2.5rem;
            width: 100%;
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;
        }
        table {
            background-color: #ffffff;
            font-size: 0.8rem;
            width: 100%;
            display: block;
            border-bottom-right-radius: 5px;
            border-bottom-left-radius: 5px;
            tr {
                border-bottom: 2px solid rgba(0, 135, 235, 0.1);
                &.last {
                    border-bottom: none;
                    td {
                        padding-bottom: 1.5rem;
                        font-weight: normal;
                    }
                }
                &.remarks {
                    td {
                        color: #05528b;
                        font-weight: bold;
                    }
                }
                th {
                    padding: 0.4rem;
                    color: #05528b;
                    &.status {
                        width: 20%;
                    }
                    & + th {
                        width: 40%;
                        border-left: 2px solid rgba(0, 135, 235, 0.1);
                    }
                }
                td {
                    padding: 0.4rem;
                    color: #333333;
                    span {
                        font-size: 0.9rem;
                        color: #05528b;
                        font-weight: bold;
                    }
                    & + td {
                        border-left: 2px solid rgba(0, 135, 235, 0.1);
                    }
                }
            }
        }
    }
    .btn {
        width: 75%;
        margin: 1.5rem auto;
    }
}
</style>
