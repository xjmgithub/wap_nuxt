<template>
    <div id="show-rank">
        <div class="line clearfix">
            <span v-show="app==1" class="invited" @click="handleInvite">invite friends to vote</span>
        </div>
        <div v-for="(item,index) in rankListData" v-show="rankListData.length>0" :key="index" class="ranking-list">
            <span :class="{first:index==0 ,second:index==1,third:index==2}" class="ranking">{{index + 1}}</span>
            <span class="ranking-name">{{item.name}}</span>
            <span class="ranking-poll">{{item.ballot_num}}</span>
        </div>
        <loading v-show="rankListData.length<=0" />
    </div>
</template>
<script>
import loading from '~/components/loading'
export default {
    components: {
        loading
    },
    props: {
        tabMsg: {
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
    computed: {
        rankListData() {
            const temp = this.$store.state.rankList || []
            const rankList = temp.concat()
            rankList.sort(function(a, b) {
                return b.ballot_num - a.ballot_num
            })
            return rankList
        }
    },
    methods: {
        handleInvite() {
            this.sendEvLog({
                category: 'vote_' + this.share.voteName,
                action: 'share_click',
                label: '',
                value: 10
            })
            // const link = window.location.href
            // shareInvite(link, this.share.shareTitle, this.share.shareContent, this.tab_msg.name, this.share.voteName)
        }
    }
}
</script>
