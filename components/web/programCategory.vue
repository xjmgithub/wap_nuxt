<template>
    <div class="navContain">
        <ul>
            <li v-for="item in showList" :key="item.id" :class="{choosed:item.id==choosedId}">
                <nuxt-link :to="{path:`/browser/programlist/${item.id}`}">{{item.name}}</nuxt-link>
            </li>
            <li @click="toggleAll">
                <img :class="{updown:showAll}" src="~assets/img/ic_menuarrow_def_w.png">
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data() {
        let choosedId = this.$route.params.id || 0
        return {
            showAll: false,
            choosedId: choosedId,
            list: [
                {
                    id: 0,
                    name: 'All'
                },
                {
                    id: 267,
                    name: 'wwy'
                },
                {
                    id: 78,
                    name: 'Social'
                },
                {
                    id: 77,
                    name: 'Environment'
                },
                {
                    id: 71,
                    name: 'Literature'
                },
                {
                    id: 76,
                    name: 'Medical'
                },
                {
                    id: 70,
                    name: 'Sport'
                },
                {
                    id: 73,
                    name: 'Geographic'
                },
                {
                    id: 75,
                    name: 'Technology'
                },
                {
                    id: 74,
                    name: 'Science'
                },
                {
                    id: 72,
                    name: 'International'
                },
                {
                    id: 69,
                    name: 'Religions'
                },
                {
                    id: 68,
                    name: 'Philosophy'
                },
                {
                    id: 67,
                    name: 'Educate'
                },
                {
                    id: 66,
                    name: 'Culture'
                },
                {
                    id: 65,
                    name: 'Economy'
                },
                {
                    id: 64,
                    name: 'Military'
                },
                {
                    id: 63,
                    name: 'Law'
                },
                {
                    id: 62,
                    name: 'Politic'
                }
            ]
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
    methods: {
        toggleAll() {
            this.showAll = !this.showAll
        }
    }
}
</script>

<style lang="less">
@import '~assets/less/browser/index.less';
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
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            a {
                color: white;
            }
            &.choosed {
                a {
                    color: #ffbc2e;
                }
            }
            img {
                width: 0.6rem;
                transition: transform 0.3s;
                &.updown {
                    transform: rotate(180deg);
                }
            }
        }
    }
}
</style>
