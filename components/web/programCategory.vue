<template>
    <div>
        <ul>
            <li v-for="item in list" :key="item.id" :class="{choosed:item.id==choosedId}">{{item.name}}</li>
            <li @click="toggleAll">
                <img src="~assets/img/ic_menuarrow_def_w.png">
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data() {
        let choosedId = this.$route.query.tagId
        return {
            showAll: false,
            choosedId:choosedId,
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
