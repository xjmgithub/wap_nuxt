<template>
    <div class="channel">
        <p>{{channelName}}</p>
        <p>{{description}}</p>
        <div class="total">
            <div class="now" :style="{ width: rate + '%'}" />
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
        state:{
            type:Number,
            default:0
        },
        rate:{
            type:Number,
            default:30
        }
    }
}
</script>
<style lang="less" scope>
.channel {
    height: 5.5rem;
    border: 1px solid #d8d8d8;
    position: relative;
    padding: 0.3rem;
    border-radius: 5px;
    box-shadow: 1px 3px 3px 0px rgba(0, 0, 0, 0.3);
    & > p {
        font-size: 0.9rem;
        font-weight: bold;
        & + p {
            font-weight: normal;
            font-size: 0.8rem;
            color: #aaaaaa;
            height: 2.5rem;
            // overflow:hidden;
            // text-overflow:ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
    }
    .total {
        width: 95%;
        height: 4px;
        background-color: #dbdbdb;
        border-radius: 2px;
        position: absolute;
        bottom: 0.5rem;
        left: 2.5%;
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
            border-radius: 4px;
            padding: 0 0.2rem;
            &.trial {
                background-color: #0087eb;
                color: #ffffff;
            }
            &.vip {
                background-color: #FABE00;
                color:#B27100;
            }
        }
    }
}
</style>
                            