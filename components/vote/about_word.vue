<template>
    <div id="about">
        <div class="word">
            <div class=" title clearfix">
                <span class="vote-title">{{share.voteName}}</span>
                <span class="invited" v-show="app==1" @click="handleInvite">invite friends to vote</span>
            </div>
            <p v-for="(item,index) in document" :key="index" :class="item.class">{{item.word}}</p>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    props: {
        document: {
            type: Array,
            default: () => {
                return []
            }
        },
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
    }
}
</script>
<style lang="less">
</style>

    
