<template>
    <div id="show-player">
        <ul class="clearfix">
            <li v-for="(item,index) in dataList" :key="index" data-id="item.id">
                <div class="img-box" @click="playVod(item)">
                    <img :src="cdnPicSrc(item.icon)" class="icon">
                    <img src="~assets/img/vote/playButton.png" class="playbutton">
                </div>
                <span class="player-name">{{item.name}}</span>
                <span
                    :class="{'vote':item.state >= 1,'voted':item.state <=0}"
                    class="vote-state"
                    @click="handleVote(item)"
                >{{item.state | canVoteState}}</span>
            </li>
        </ul>
        <loading v-show="dataList.length<=0" />
    </div>
</template>
<script>
import loading from '~/components/loading'
export default {
    filters: {
        canVoteState(state) {
            if (state === -1) {
                return 'UNSTART'
            } else if (state === -2) {
                return 'END'
            } else if (state === 0) {
                return 'VOTED'
            } else if (state >= 1) {
                return 'VOTE'
            }
        }
    },
    components: {
        loading
    },
    props: {
        dataList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    methods: {
        handleVote(item) {
            this.$emit('onVote',item)
        },
        playVod(item) {
            this.$emit('toPlay',item)
        }
    }
}
</script>
