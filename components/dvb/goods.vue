<template>
    <div v-show="list.length>0" :class="{disabled:disabled}">
        <div class="money-box clearfix">
            <p>{{LANG.select_}}</p>
            <ul>
                <li
                    v-for="(item,index) in list"
                    :key="index"
                    :class="{
                        selected:index == goodIndex,
                        'center-text':!(item.preferentialPlanVo&&item.preferentialPlanVo.exclusivePrice>0&&item.rate_amount!=item.preferentialPlanVo.exclusivePrice)
                    }"
                    @click="selected(index)"
                >
                    <p>{{ formatName(item.rate_display_name) }}</p>
                    <p>
                        <span>{{ currency }}</span>
                        {{ formatAmount(discount(item)) }}
                    </p>
                    <p
                        v-if="item.preferentialPlanVo&&item.preferentialPlanVo.exclusivePrice>0&&item.rate_amount!=item.preferentialPlanVo.exclusivePrice"
                    >
                        <del>{{ currency }}{{ formatAmount(item.rate_amount) }}</del>
                    </p>
                    <img
                        v-if="item.preferentialPlanVo&&item.preferentialPlanVo.firstRechargeGiveMoney>0"
                        class="first-charge-img"
                        src="~assets/img/dvb/ic_gift_def.png"
                    >
                </li>
            </ul>
        </div>
        <div class="first-charge" v-show="firstChargeTip">
            <img src="~assets/img/dvb/ic_gift_def.png">
            <div style="width:65%;float:left;">{{firstChargeTip}}</div>
            <div v-show="firstChargeDetails" class="first-charge-detail" @click="showDetails">{{LANG.first_recharge_detail}}</div>
        </div>
        <div class="count-box clearfix" v-show="countList.length>1">
            <p>{{LANG.results_recharge_amount}}</p>
            <ul class="choose clearfix">
                <li v-for="(item,index) in countList" :key="index" @click="numThis(item)">
                    <label class="radio">
                        {{ item }}
                        <input type="radio" name="count" :value="item" :checked="item==num">
                        <i/>
                    </label>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { formatAmount } from '~/functions/utils'
export default {
    props: {
        goodsList: {
            type: Array,
            default: new Array()
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            currency: this.$store.state.country.currencySymbol,
            goodIndex: 0,
            num: 1
        }
    },
    watch: {
        list(nv, ov) {
            let maxMoney = 0
            let list = [...nv]
            list.forEach((item, index) => {
                if (item.rate_amount > maxMoney) {
                    maxMoney = item.rate_amount
                    this.goodIndex = index
                }
            })
        },
        countList(nv, ov) {
            this.num = 1
        }
    },
    computed: {
        LANG() {
            return this.$store.state.lang
        },
        list() {
            let list = [...this.goodsList]
            list.sort((a, b) => {
                return a.rate_amount - b.rate_amount
            })
            return list
        },
        countList() {
            try {
                return this.list[this.goodIndex].recharge_fee_numbers || []
            } catch (err) {
                return []
            }
        },
        firstChargeTip() {
            let item = this.list[this.goodIndex]
            if (item && item.preferentialPlanVo && item.preferentialPlanVo.firstRechargeGiveMoney) {
                return item.preferentialPlanVo.description
            } else {
                return ''
            }
        },
        firstChargeDetails() {
            let item = this.list[this.goodIndex]
            if (item && item.preferentialPlanVo && item.preferentialPlanVo.firstRechargeGiveMoney) {
                return item.preferentialPlanVo.descDetail
            } else {
                return ''
            }
        },
        payAmount() {
            let item = this.list[this.goodIndex]
            return Number(this.discount(item)) * Number(this.num)
        },
        rechargeAmount() {
            let item = this.list[this.goodIndex]
            return Number(item.rate_amount) * Number(this.num) || 0
        },
        rechargeDes() {
            let name = this.list[this.goodIndex].rate_display_name
            return this.formatName(name) + ' x ' + this.num
        }
    },
    updated() {
        this.$emit('update', {
            payAmount: this.payAmount,
            rechargeAmount: this.rechargeAmount,
            rechargeDes: this.rechargeDes
        })
    },
    mounted() {
        this.$emit('update', {  // TODO 待优化
            payAmount: this.payAmount,
            rechargeAmount: this.rechargeAmount,
            rechargeDes: this.rechargeDes
        })
    },
    methods: {
        selected(index) {
            this.goodIndex = index
        },
        numThis(item) {
            this.num = item
        },
        showDetails() {
            this.sendEvLog({
                category: 'dvbservice',
                action: 'promotion_detail_click',
                label: 'DVB_H5',
                value: 10,
                service_type: 'Recharge',
                page_from: 'new'
            })

            this.$alert(this.firstChargeDetails)
        },
        discount(item) {
            if (item.preferentialPlanVo && item.preferentialPlanVo.exclusivePrice > 0) {
                return item.preferentialPlanVo.exclusivePrice
            } else {
                return item.rate_amount
            }
        },
        formatName(str) {
            if (str.indexOf('/') >= 0) {
                return str.split('/')[1]
            } else {
                return str
            }
        },
        formatAmount(num) {
            return formatAmount(num)
        }
    }
}
</script>
<style lang="less" scoped>
.money-box {
    margin-top: 1rem;
    position: relative;
    & > p {
        color: #424242;
        font-weight: bold;
        margin-bottom: 1rem;
        font-size: 0.9rem;
    }
    li {
        list-style: none;
        float: left;
        border: 1px solid #bdbdbd;
        border-radius: 4px;
        display: block;
        text-align: center;
        width: 31%;
        margin: 0 3.5% 3.5% 0;
        position: relative;
        &:before {
            content: '';
            display: inline-block;
            padding-bottom: 100%;
            width: 0.1px;
            vertical-align: middle;
        }
        &:nth-child(3n) {
            margin: 0;
        }
        p {
            margin: 0.3rem 0;
            color: #424242;
            position: absolute;
            text-align: center;
            width: 100%;
            &:nth-child(1) {
                top: 13%;
            }
            &:nth-child(2) {
                font-weight: bold;
                top: 36%;
            }
            &:nth-child(3) {
                font-size: 0.8rem;
                top: 62%;
            }
            & + p {
                span {
                    position: relative;
                    font-size: 0.7rem;
                }
            }
        }
        &.center-text {
            p {
                &:nth-child(1) {
                    top: 26%;
                }
                &:nth-child(2) {
                    font-weight: bold;
                    top: 50%;
                }
            }
        }
        &.selected {
            border: 1px solid #008be9;
            p {
                color: #008be9;
            }
        }
        .first-charge-img {
            height: 1rem;
            position: absolute;
            top: 0.4rem;
            left: 0.35rem;
        }
    }
    .christmas {
        display: none;
    }
}
.count-box {
    position: relative;
    & > p {
        color: #424242;
        font-weight: bold;
        margin: 0;
        margin-bottom: 1rem;
    }
    .choose {
        padding: 0;
        margin: 0;
        width: 100%;
        li {
            width: 25%;
            list-style: none;
            float: left;
            box-sizing: border-box;
            margin-bottom: 0.7rem;
        }
        .radio {
            position: relative;
            padding-left: 1.5rem;
            cursor: pointer;
            display: block;
            color: #424242;
            input {
                position: absolute;
                left: -9999px;
                & + i {
                    &:after {
                        position: absolute;
                        content: '';
                        top: 2px;
                        left: 2px;
                        width: 9px;
                        height: 9px;
                        border-radius: 50%;
                        background-color: #008be9;
                        opacity: 0;
                        transition: opacity 0.1s;
                        -webkit-transition: opacity 0.1s;
                    }
                }
                &:checked {
                    & + i {
                        border: 1px solid #008be9;
                        &:after {
                            opacity: 1;
                        }
                    }
                }
            }
            i {
                display: block;
                position: absolute;
                top: 3px;
                left: 0;
                width: 15px;
                height: 15px;
                outline: 0;
                border: 1px solid #bdbdbd;
                background: #ffffff;
                border-radius: 50%;
            }
        }
        span {
            vertical-align: middle;
            font-weight: bold;
        }
    }
}

.disabled.money-box,
.disabled.count-box {
    li {
        border: 1px solid #bdbdbd;
        &.selected {
            border: 1px solid #bdbdbd;
            p {
                color: #bdbdbd;
            }
        }
        p {
            color: #bdbdbd;
        }
    }

    .choose {
        .radio {
            i {
                border: 1px solid #bdbdbd;
            }
            input {
                &:checked {
                    & + i {
                        border: 1px solid #bdbdbd;
                    }
                }
                & + i {
                    &:after {
                        background-color: #bdbdbd;
                    }
                }
            }
        }
    }
}

.first-charge {
    font-size: 0.9rem;
    overflow: hidden;
    img {
        height: 1rem;
        float: left;
        display: block;
        margin-right: 0.5rem;
        margin-top: 0.08rem;
    }
    .first-charge-detail {
        color: #008be9;
        float: right;
        width: 26%;
        text-align: right;
    }
}
</style>
