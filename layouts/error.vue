<template>
    <section class="container">
        <h1 class="title">
            {{ error.statusCode }}
        </h1>
        <h2 class="info">
            {{ error.message }}
        </h2>
    </section>
</template>
<script>
export default {
    layout: 'base',
    props: {
        error: {
            type: Object,
            require: true,
            default: null
        }
    }
}
</script>
<style scoped>
.title {
    margin-top: 15px;
    font-size: 5em;
}
.info {
    font-weight: 300;
    color: #9aabb1;
    margin: 0;
}
.button {
    margin-top: 50px;
}
</style>
