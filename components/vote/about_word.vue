<template>
    <div id="about">
        <div class="content" @scroll.prevent>
            <slot name="content"/>
        </div>
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
    
