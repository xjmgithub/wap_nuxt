<template>
    <nav id="nav">
        <a v-for="(item,index) in tab" :key="index" :class="{on:tabIndex == index}" @click="doChange(item,index)">
            {{item.name}}
        </a>
    </nav>
</template>
<script>
export default {
    layout: 'base',
    props: {
        tab: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            tabIndex: 0
        }
    },
    methods: {
        doChange(item, index) {
            this.tabIndex = index
            this.$emit('onChange', item, index)
        }
    }
}
</script>

