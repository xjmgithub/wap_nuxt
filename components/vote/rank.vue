<template>
    <div id="show-rank">
        <div v-for="(item,index) in dataList" v-show="dataList.length>0" :key="index" class="ranking-list">
            <span :class="{first:index==0 ,second:index==1,third:index==2}" class="ranking">{{index + 1}}</span>
            <span class="ranking-name">{{item.name}}</span>
            <span class="ranking-poll">{{item.ballot_num}}</span>
        </div>
        <loading v-show="dataList.length<=0" />
    </div>
</template>
<script>
import loading from '~/components/loading'
export default {
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
}
</script>
