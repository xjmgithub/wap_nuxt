<template>
    <div class="search">
        <textarea v-model="content" @keydown.enter="search"/>
    </div>
</template>
<script>
export default {
    data() {
        return {
            content: ''
        }
    },
    methods: {
        search() {
            this.$emit('otherReason', this.content)
        }
    }
}
</script>
<style lang="less" scoped>
.search {
    position: fixed;
    bottom: 0.6rem;
    width: 100%;
    textarea {
        display: block;
        width: 95%;
        margin: 0 auto;
        outline-style: none;
        border-radius: 2px;
        box-shadow: 0px 1px 2px 0px rgba(189, 189, 189, 1);
        border: none;
        padding: 0.5rem;
        height: 2rem;
        line-height: 1.2rem;
    }
}
</style>
