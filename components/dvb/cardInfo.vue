<template>
    <div class="card-box">
        <div class="card-msg">
            <p>
                <span>{{LANG.smart_card_no_content}}</span>
                {{ cardNum | formatCard }}
            </p>
            <p v-if="state==='PUNISH_STOP'" class="state">
                <img src="~assets/img/dvb/ic_dormant.png">
                {{LANG.dormant}}
            </p>
            <p v-else-if="state==='VALID'" class="state">
                <img src="~assets/img/dvb/ic_active.png">
                <span v-if="stopDays" style="font-size:1rem;">{{LANG.dvb_acitve_to}} {{stopDays}}</span>
                <span v-if="!stopDays" style="font-size:1rem;">{{LANG.active_}}</span>
            </p>
            <p v-else-if="state === 'PAUSE'" class="state">
                <img src="~assets/img/dvb/ic_suspended_def_y.png">
                {{LANG.link_suspend}}
            </p>
            <p v-else-if="money" class="state">{{LANG.smart_card_balance}} {{money | formatAmount}}</p>
        </div>
        <div class="card-type">
            <p class="platform">
                <img v-show="tv_platform==='DTH'" src="~assets/img/dvb/ic_dth.png">
                <img v-show="tv_platform==='DTT'" src="~assets/img/dvb/ic_dtt.png">
                {{ program }}
            </p>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
import { formatAmount } from '~/functions/utils'
export default {
    filters: {
        formatAmount(num) {
            return formatAmount(num)
        },
        formatCard(val) {
            const len = val.length
            let result = ''
            for (let i = 0; i < len; i++) {
                result += val[i]
                if (i === 2 || i === 6) {
                    result += ' '
                }
            }
            return result
        }
    },
    data() {
        return {
            state: '',
            stopDays: '',
            money: '',
            tv_platform: 'DTH',
            program: '',
            cardNum: ''
        }
    },
    computed: {
        LANG() {
            return this.$store.state.lang
        }
    },
    mounted() {
        const param = JSON.parse(sessionStorage.getItem('order-info'))
        this.state = param.smartcard_status
        this.stopDays = param.stop_days ? dayjs(param.stop_days).format('MMM DD YYYY') : ''
        this.money = param.money
        this.program = param.program_name
        this.cardNum = param.cardNo
    }
}
</script>
<style lang="less" scoped>
.card-box {
    width: 95%;
    margin: 0.4rem auto 0.6rem;
    color: #424242;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    .card-msg {
        background: url('~assets/img/dvb/cardbg.jpg') no-repeat;
        background-size: 101% 100%;
        padding: 0.5rem;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        p {
            margin: 0.4rem;
            color: #fff;
            font-size: 1.3rem;
            font-weight: bold;
            span {
                font-size: 1.2rem;
                font-weight: normal;
            }
            &.state {
                font-size: 0.875rem;
                img {
                    width: 1rem;
                    vertical-align: middle;
                    margin-right: 0.5rem;
                }
            }
        }
    }
    .card-type {
        height: 2.5rem;
        line-height: 2.5rem;
        background: white;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        color: #424242;
        font-size: 0.875rem;
        p {
            &.platform {
                margin: 0;
                padding-left: 0.5rem;
                img {
                    width: 1.5rem;
                    vertical-align: middle;
                    margin-right: 0.5rem;
                }
            }
        }
    }
}
</style>
