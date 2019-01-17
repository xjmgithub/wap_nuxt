<template>
    <div class="channel" @click="toLive">
        <p>{{channelName}}</p>
        <p>{{description}}</p>
        <div class="total">
            <div class="now" :style="{ width: rate + '%'}"/>
        </div>
        <div class="state">
            <p v-show="state==1" class="trial">TRIAL</p>
            <p v-show="state==2" class="vip">VIP</p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        channelName: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        state: {
            type: Number,
            default: 0
        },
        rate: {
            type: Number,
            default: 30
        }
    },
    methods:{
        toLive(){
            this.$emit('onLive')
        }
    }
}
</script>
<style lang="less" scope>
.channel {
    height: 5.5rem;
    position: relative;
    padding: 0.5rem;
    box-shadow: 1px 2px 4px -1px rgba(0, 0, 0, 0.4);
    & > p {
        font-size: 0.85rem;
        font-weight: bold;
        & + p {
            font-weight: normal;
            font-size: 0.8rem;
            color: #aaaaaa;
            height: 2.6rem;
            // overflow:hidden;
            // text-overflow:ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
    }
    .total {
        width: 100%;
        height: 4px;
        background-color: #dbdbdb;
        border-radius: 2px;
        margin-top:0.2rem;
        .now {
            background-color: #0087eb;
            width: 30%;
            height: 4px;
            border-radius: 3px;
        }
    }
    .state {
        position: absolute;
        top: 0;
        right: 0;
        display: block;
        font-size: 0.8rem;
        p {
            border-radius: 3px;
            padding: 0 0.4rem;
            font-size: 0.7rem;
            line-height: 0.9rem;
            &.trial {
                background-color: #0087eb;
                color: #ffffff;
            }
            &.vip {
                background-color: #fabe00;
                color: #b27100;
            }
        }
    }
}
</style>
                            