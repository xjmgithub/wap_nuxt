<template>
    <div>
        <div class="title">{{item.name}}</div>
        <ul>
            <li v-for="child in item.child" :key="child.id">
                <nuxt-link>{{child.name}}</nuxt-link>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    }
}
</script>
