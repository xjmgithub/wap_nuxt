<template>
    <div class="">
        <div class="search">
            <form @submit.prevent="search">
                <input v-model="content" type="text">
            </form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            content: ''
        }
    },
    methods:{
        search(){
            this.$emit('otherReason',this.content)
        }
    }
}
</script>
<style lang="less" scoped>
.search{
    width:95%;
    margin: 0 auto;
    input {
        width: 100%;
        outline-style: none;
        border-radius: 2px;
        box-shadow: 0px 1px 2px 0px rgba(189,189,189,1);
        border: none;
        height: 2.5rem;
        line-height: 1.25rem;
        margin-top:1rem;
    }
}

</style>
