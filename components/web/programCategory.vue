<template>
    <div class="navContain">
        <ul>
            <li v-for="item in showList" :key="item.id" :class="{choosed:item.id==choosedId}">
                <nuxt-link :to="{path:`/browser/programlist/${item.id}`}">
                    {{item.name}}
                </nuxt-link>
            </li>
            <li style="float:right" @click="toggleAll">
                <img :class="{updown:showAll}" src="~assets/img/ic_menuarrow_def_w.png">
            </li>
        </ul>
    </div>
</template>
<script>
import { getQaCategory, getOnlineCategory } from '~/functions/program/category'
import env from '~/env'
export default {
    data() {
        let choosedId = this.$route.params.id || 0
        let list = getOnlineCategory()
        if (env.msHost.indexOf('qa') > 0 || env.msHost.indexOf('dev') > 0) {
            list = getQaCategory()
        }
        list.sort((a, b) => {
            return a.weight - b.weight
        })
        choosedId = choosedId || list[0].id
        return {
            showAll: true,
            choosedId: choosedId,
            list: list
        }
    },
    computed: {
        showList() {
            if (this.showAll) {
                return this.list
            } else {
                return this.list.slice(0, 7)
            }
        }
    },
    mounted() {
        this.showList.forEach((item, index) => {
            if (item.id === this.choosedId) {
                if (index > 6) {
                    this.showAll = true
                } else {
                    this.showAll = false
                }
            }
        })
    },
    methods: {
        toggleAll() {
            this.showAll = !this.showAll
        }
    }
}
</script>
<style lang="less" scoped>
.navContain {
    background: #222527;
    overflow: hidden;
    zoom: 1;
    ul {
        li {
            display: block;
            width: 21%;
            margin: 0 2%;
            float: left;
            text-align: center;
            height: 2.3rem;
            line-height: 2.3rem;
            font-size: 0.9rem;
            a {
                display: block;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                color: white;
            }
            &.choosed {
                a {
                    color: #ffbc2e;
                }
            }
            img {
                width: 0.5rem;
                transition: transform 0.3s;
                &.updown {
                    transform: rotate(180deg);
                }
            }
        }
    }
}
</style>
