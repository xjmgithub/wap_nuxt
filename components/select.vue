<template>
    <div class="container" v-if="list.length>0">
        <div class="checked" @click="showList">
            <span v-show="selected.id">{{selected.name}}</span>
            <span v-show="!selected.id" class="placeholder">{{placeholder}}</span>
            <img src="~/assets/img/ic_sl_g.png" />
        </div>
        <ul class="list" v-show="$store.state.selectCompId==compSelectId">
            <li v-for="(item,index) in list" :key="index" @click="choose(item)">{{item.name}}</li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        list: {
            type: Array,
            require: true
            /* 
            {
                id:id,
                name:name
            }
            */
        },
        default: {
            require: false
        },
        placeholder: {
            require: false,
            type: String,
            default: 'please select a value',
            initState: false
        }
    },
    data() {
        return {
            renderList: [],
            selected: {},
            compSelectId:null
        }
    },
    watch: {
        list(nv, ov) {
            this.init()
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.renderList = this.list
            // 处理default值
            if (this.default || this.default == 0) {
                if (this.default instanceof Object) {
                    this.choose(this.default)
                } else {
                    this.list.forEach(item => {
                        if (item.id == this.default) {
                            this.choose(item)
                        }
                    })
                }
            }
            this.initState = true
        },
        showList(){
            let s = this.$store.state.selectCompId + 1
            this.$store.commit('ADD_SELECT_COMP',s)
            this.compSelectId = this.$store.state.selectCompId
        },
        choose(obj) {
            if (this.list.length > 0) {
                let tmp = this.selected
                this.list.forEach(item => {
                    if (item.id == obj.id) {
                        this.selected = item
                    }
                })
                if (tmp.id != this.selected.id) {
                    this.$emit('change', this.selected)
                }
            }
            let s = this.$store.state.selectCompId + 1
            this.$store.commit('ADD_SELECT_COMP',s)
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    position: relative;
    font-size: 0.85rem;
    width: 100%;
    margin: 0.5rem 0;
    .checked {
        border: #ccc solid 1px;
        border-radius: 2px;
        height: 2rem;
        line-height: 2rem;
        padding: 0 0.6rem;
        position: relative;
        span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
        }
        img {
            position: absolute;
            right: 0.5rem;
            top: 0.5rem;
            height: 0.85rem;
        }
        .placeholder {
            color: #dddddd;
        }
    }
    .list {
        position: absolute;
        border: #ccc solid 1px;
        border-radius: 2px;
        width: 100%;
        display: block;
        top: 0;
        background: white;
        z-index: 999;
        li {
            padding: 0.3rem 0.5rem;
            font-size: 0.8rem;
            &:hover{
                background:#dddddd;
            }
        }
    }
}
</style>