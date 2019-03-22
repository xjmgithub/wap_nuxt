<template>
    <div>
        <div v-if="item.type.indexOf('100')==0" class="recommand">
            <mTitle :show-title="item.name" :icon="true" />
            <ul class="clearfix">
                <li v-for="(ele,k) in item.list" :key="k" :class="{bigFirst:item.list.length%2!=0&&k==0}" @click="toProgram(item.type,ele.id)">
                    <div :style="'background:url('+ele.poster.resources[0].url.replace('http:','https:')+')'">
                        <span class="show-time">{{ele.durationSecond | formatShowTime}}</span>
                    </div>
                    <span class="title">{{ele.name}}</span>
                </li>
            </ul>
        </div>
        <div v-if="item.type.indexOf('109')==0" class="recommand">
            <mTitle :show-title="item.name" :icon="true" />
            <ul class="clearfix">
                <li v-for="(ele,k) in item.list" :key="k" :class="{bigFirst:item.list.length%2!=0&&k==0}" @click="toProgram(item.type,ele.id)">
                    <div :style="'background:url('+ele.poster.replace('http:','https:')+')'"/>
                    <span class="title">{{ele.name}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import mTitle from '~/components/web/title'
import { formatTime } from '~/functions/utils'
export default {
    filters: {
        formatShowTime(val) {
            return formatTime(val)
        }
    },
    components:{
        mTitle
    },
    props: {
        item: {
            type: Object,
            require: true,
            default() {
                return {}
            }
        }
    },
    mounted(){
        console.log(this.item)
    },
    methods:{
        toProgram(type,id){
            console.log(id)
            if(type.indexOf('109')==0){
                this.$router.push(`/browser/program/detail/${id}`)
            }
            if(type.indexOf('100')==0){
                this.$axios.get(`/cms/program_detail/byvod/${id}`).then(res=>{
                    this.$router.push(`/browser/program/subdetail/${res.data.id}?subId=${id}`)
                })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.boxStyle {
    margin: 0 auto;
    border-bottom: 1px solid #d8d8d8;
    h3 {
        margin: 0.4rem 0;
        color: #333333;
        font-weight: bold;
        div {
            margin-right: 0.3rem;
            font-size: 1.1rem;
            line-height: 2.5rem;
            &.dot {
                font-size: 2.5rem;
                height: 1rem;
                line-height: 2.3rem;
                float: left;
            }
        }
        img {
            width: auto;
            float: left;
            display: block;
        }
        &.flytitle {
            background: url('~assets/img/web/ON-RIGHT.png') no-repeat left center;
            background-size: 1rem;
            padding-left: 1.5rem;
        }
    }
}
.recommand {
    .boxStyle;
    border-bottom: none;
    &.last {
        border-bottom: 1px solid #d8d8d8;
    }
    li {
        list-style: none;
        float: left;
        width: 48%;
        line-height: 1.1rem;
        &:nth-child(2n) {
            float: right;
        }
        &.bigFirst {
            width: 100%;
        }
        div {
            position: relative;
            width: 100%;
            background-size: contain !important;
            &:before {
                content: '';
                display: inline-block;
                padding-bottom: 56%;
                width: 0.1px;
                vertical-align: middle;
            }
            .show-time {
                position: absolute;
                bottom: 0;
                right: 0;
                padding: 0 0.2rem;
                background: rgba(0, 0, 0, 1);
                color: #ffffff;
                font-size: 0.8rem;
            }
            img {
                width: 100%;
                display: block;
                height: 100%;
            }
        }
        span {
            font-size: 0.85rem;
            color: #666666;
            &.title {
                display: -webkit-box;
                overflow: hidden;
                height: 2.6rem;
                padding-top: 0.4rem;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
        }
    }
}
</style>
