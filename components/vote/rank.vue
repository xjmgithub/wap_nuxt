<template>
    <div id="show-rank">
        <div class="line clearfix">
            <span class="invited" v-show="app==1" @click="handleInvite">invite friends to vote</span>
        </div>
        <div v-show="rankListData.length>0" class="ranking-list" v-for="(item,index) in rankListData" :key="index">
            <span class="ranking" :class="{first:index==0 ,second:index==1,third:index==2}">{{index + 1}}</span>
            <span class="ranking-name">{{item.name}}</span>
            <span class="ranking-poll">{{item.ballot_num}}</span>
        </div>
        <loading v-show="rankListData.length<=0" />
    </div>
</template>
<script>
import loading from '~/components/loading'
export default {
    layout: 'base',
    props: {
        tab_msg: {
            type: Object,
            default: () => {
                return {}
            }
        },
        share: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            app: this.$store.state.appType
        }
    },
    methods: {
        handleInvite() {
            this.sendEvLog({
                category: 'vote_'+this.share.voteName,
                action: 'share_click',
                label: '',
                value: 10
            })
            let link = window.location.href
            shareInvite(link, this.share.shareTitle, this.share.shareContent, this.tab_msg.name, this.share.voteName)
        }
    },
    computed: {
        rankListData() {
            let temp = this.$store.state.rankList || []
            let rankList = temp.concat()
            rankList.sort(function(a, b) {
                return b.ballot_num - a.ballot_num
            })
            return rankList
        }
    },
    components: {
        loading
    }
}
</script>
<style lang="less">
</style>

