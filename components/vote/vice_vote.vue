<template>
    <div id="show-advisor">
        <div class="leftflower">left flower：{{leftflower}}</div>
        <ul class="clearfix">
            <li v-for="(item,index) in advisor" :key="index" data-id="item.id">
                <div class="img-box">
                    <img :src="item.icon" class="icon">
                </div>
                <span class="player-name">{{item.name}}</span>
                <div class="flowers">
                    <img src="~assets/img/vote/flower.png" class="send-flower">
                    <img src="~assets/img/vote/btn_flower.png" class="bgt">
                    <span class="flower-count">{{item.ballot_num }}</span>
                    <span>flowers</span>
                </div>
                <span class="flower-state" @click="doVote(item)" :class="{'send':item.state == 1,'sent':item.state <=0}">{{item.state | canVoteState}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    layout: 'base',
    props: {
        advisor: {
            type: Array,
            default: function() {
                return []
            }
        },
        leftflower: {
            type: Number,
            default: 1
        }
    },
    methods: {
        doVote(data) {
            if (data.state <= 0) {
                //TODO 给用户不能操作的提示
                return
            }
            this.$emit('onVote', data)
        }
    },
    filters: {
        canVoteState(state) {
            if (state == -1) {
                return  'UNSTART' 
            } else if (state == -2) {
                return  'END'
            } else if (state == 0) {
                return  'SENT'
            } else if (state == 1) {
                return  'SEND'
            }
        }
    }
}
</script>
<style lang="less">
</style>

