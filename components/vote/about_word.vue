<template>
    <div id="about">
        <p v-for="(item,index) in document" :key="index" :class="item.class">
            {{item.word}}
        </p>
    </div>
</template>
<script>
export default {
    props: {
        document: {
            type: Array,
            default: () => {
                return []
            }
        }
    }
}
</script>
    
