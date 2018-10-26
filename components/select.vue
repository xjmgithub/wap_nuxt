<template>
    <div class="container" v-if="list.length>0">
        <div class="checked" @click="showList=true">
            <span v-if="selected">{{selected.name}}</span>
            <span v-if="!selected" class="placeholder">{{placeholder}}</span>
            <img src="~/assets/img/ic_sl_g.png" />
        </div>
        <ul class="list" v-show="showList">
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
        placeholder: {
            require: false,
            type: String,
            default: 'please select a value'
        }
    },
    data() {
        return {
            showList: false,
            selected: null
        }
    },
    watch: {
        list(nv, ov) {
            this.selected = null
        }
    },
    mounted() {
        if (this.list.length > 0) {
            this.initData()
        }
    },
    methods: {
        choose(item) {
            if (this.selected) {
                if (item.id != this.selected.id) {
                    this.selected = item
                    this.$emit('change', item)
                }
            } else {
                this.selected = item
                this.$emit('change', item)
            }
            this.showList = false
        },
        setValue(val) {
            if (val instanceof Object) {
                this.choose(val)
            } else {
                if (this.list.length > 0) {
                    this.list.forEach(item => {
                        if (item.id == val) {
                            this.choose(item)
                        }
                    })
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    position: relative;
    font-size: 0.9rem;
    width: 100%;
    margin: 0.5rem 0;
    .checked {
        border: #ccc solid 1px;
        border-radius: 2px;
        height: 2rem;
        line-height: 2rem;
        padding: 0 0.6rem;
        position: relative;
        img {
            position: absolute;
            right: 0.5rem;
            top: 0.5rem;
            height: 0.8rem;
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
            padding: 0 0.5rem;
            height: 2rem;
            line-height: 2rem;
            font-size: 0.9rem;
            // border-bottom:#ccc solid 1px;
        }
    }
}
</style>