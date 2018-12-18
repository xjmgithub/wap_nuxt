<template>
    <div id="show-rank">
        <div class="ranking-list" v-for="(item,index) in rank" :key="index">
            <span class="ranking" :class="{first:index==0 ,second:index==1,third:index==2}">{{index + 1}}</span>
            <span class="ranking-name">{{item.name}}</span>
            <span class="ranking-poll">{{item.ballot_num}}</span>
        </div> 
    </div>
</template>
<script>
export default {
    layout: 'base',
    props: {
        rank: {
            type: Array,
            default: function() {
                return []
            }
        }
    }
}
</script>
<style lang="less">
</style>

