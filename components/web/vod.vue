<template>
    <div>
        <div v-if="item.type.indexOf('100')==0" class="recommand">
            <mTitle :show-title="item.name" :icon="true"/>
            <ul :class="{'odd':item.list.length%2!=0,'even':item.list.length%2==0}" class="clearfix">
                <li v-for="(ele,k) in item.list" :key="k" @click="toProgram(item.type,ele.id)">
                    <div :style="'background:url('+ (cdnPicSrc(ele.poster.resources[0].url)|| '/res_nuxt/img/def.png') +') no-repeat'">
                        <span class="show-time">{{ele.durationSecond | formatShowTime}}</span>
                    </div>
                    <span class="title">{{ele.name}}</span>
                </li>
            </ul>
        </div>
        <div v-if="item.type.indexOf('109')==0" class="recommand">
            <mTitle :show-title="item.name" :icon="true"/>
            <ul :class="{'odd':item.list.length%2!=0,'even':item.list.length%2==0}" class="clearfix">
                <li v-for="(ele,k) in item.list" :key="k" @click="toProgram(item.type,ele.id)">
                    <div :style="'background:url('+ (cdnPicSrc(ele.poster) || '/res_nuxt/img/def.png') +') no-repeat'"/>
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
    components: {
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
    methods: {
        toProgram(type, id) {
            if (type.indexOf('109') == 0) {
                this.$router.push(`/browser/program/detail/${id}`)
            }
            if (type.indexOf('100') == 0) {
                this.$router.push(`/browser/program/subdetail/${id}`)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.boxStyle {
    margin: 0 auto;
    border-bottom: 1px solid #d8d8d8;
}
.recommand {
    .boxStyle;
    border-bottom: none;
    &.last {
        border-bottom: 1px solid #d8d8d8;
    }
    .odd {
        li {
            &:nth-child(1) {
                width: 100%;
            }
            &:nth-child(2n + 1) {
                float: right;
            }
        }
    }
    .even {
        li {
            &:nth-child(2n) {
                float: right;
            }
        }
    }
    li {
        list-style: none;
        float: left;
        width: 48%;
        line-height: 1.1rem;
        div {
            position: relative;
            width: 100%;
            background-size: 100% !important;
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
