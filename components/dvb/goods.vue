<template>
    <div>
        <div class="money-box clearfix" v-show="recharge_items.length>0">
            <p>{{LANG.select_}}</p>
            <ul>
                <li
                    v-for="(item,index) in goods"
                    :key="index"
                    @click="selected(index)"
                    :class="{selected:index == chargeItemIndex,'center-text':!(item.preferentialPlanVo&&item.preferentialPlanVo.exclusivePrice>0&&item.rate_amount!=item.preferentialPlanVo.exclusivePrice)}"
                >
                    <p>{{ item.rate_display_name | formatDate }}</p>
                    <p>
                        <span>{{ currency }}</span>
                        {{ item | discountAmount }}
                    </p>
                    <p
                        v-if="item.preferentialPlanVo&&item.preferentialPlanVo.exclusivePrice>0&&item.rate_amount!=item.preferentialPlanVo.exclusivePrice"
                    >
                        <del>{{ currency }}{{ item.rate_amount | formatRateAmount }}</del>
                    </p>
                    <img
                        v-if="item.preferentialPlanVo&&item.preferentialPlanVo.firstRechargeGiveMoney>0"
                        class="first-charge-img"
                        src="~assets/img/dvb/ic_gift_def.png"
                    >
                    <div v-if="item.preferentialPlanVo&&item.preferentialPlanVo.type==100" class="christmas">
                        <img src="~assets/img/dvb/img_christmaslogo.png" class="christmaslogo">
                        <span>{{((item.rate_amount-item.preferentialPlanVo.exclusivePrice)*100/item.rate_amount).toFixed(0)}}% OFF</span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="count-box clearfix">
            <p v-show="loaded&&countList.length>1">{{$store.state.lang.results_recharge_amount}}</p>
            <ul class="choose clearfix" v-show="countList.length>1">
                <li v-for="(item,index) in countList" :key="index">
                    <label class="radio">
                        {{ item }}
                        <input
                            type="radio"
                            name="count"
                            :disabled="canBuy?false:'disabled'"
                            :value="item"
                            :checked="index == chargeNumIndex"
                        >
                        <i/>
                    </label>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        goodsList: {
            type: Array(),
            default: new Array()
        }
    },
    data() {
        return {
            goodIndex: 0
        }
    },
    computed: {
        LANG() {
            return this.$store.state.lang
        },
        countList() {
            // TODO
            return false
        },
        goods() {
            // 初始选中最大值
            let maxMoney = 0
            let list = [...this.goodsList]
            let goodIndex = 0
            list.sort((a, b) => {
                return a.rate_amount - b.rate_amount
            })
            this.goodsList.forEach((item, index) => {
                if (item.rate_amount > maxMoney) {
                    maxMoney = item.rate_amount
                    goodIndex = index
                }
                // if (item.recharge_fee_numbers) {
                //     this.countLists[this.countLists.length] = item.recharge_fee_numbers
                // }
            })
            this.goodIndex = goodIndex
            return this.goodsList
        }
    }
}
</script>
