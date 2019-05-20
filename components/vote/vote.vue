<template>
    <div id="show-player">
        <ul class="clearfix">
            <li v-for="(item,index) in dataList" :key="index" data-id="item.id">
                <div class="img-box">
                    <img :src="cdnPicSrc(item.icon)" class="icon">
                </div>
                <span class="player-name">{{item.name}}</span>
                <div class="flowers">
                    <span class="flower-count">{{item.ballot_num }}</span>
                    <span>votes</span>
                </div>
                <span
                    :class="{'send':item.state === 1,'sent':item.state <=0}"
                    class="flower-state"
                    @click="handleVote(item)"
                >{{item.state | canVoteState}}</span>
            </li>
        </ul>
        <loading v-show="advisorList.length<=0" />
    </div>
</template>
<script>
import loading from '~/components/loading'
import { toNativePage } from '~/functions/utils'
export default {
    filters: {
        canVoteState(state) {
            if (state === -1) {
                return 'UNSTART'
            } else if (state === -2) {
                return 'END'
            } else if (state === 0) {
                return 'SENT'
            } else if (state === 1) {
                return 'SEND'
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
            
        },
    }
}
</script>
