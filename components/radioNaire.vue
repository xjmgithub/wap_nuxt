<template>
    <div class="radio-box">
        <div v-for="(item,i) in radioList" :key="i">
            <label class="radio">
                <input
                    type="radio"
                    :name="item.name"
                    :value="item.code"
                    @click="checkThis(item.code)"
                >
                <i/>
                <span>{{item.value}}</span>
            </label>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        radioList: {
            type: Array,
            required: true,
            default: new Array()
        }
    },
    methods: {
        checkThis(code) {
            this.$emit('pick', code)
        }
    }
}
</script>
<style scoped>
.radio-box > div {
    margin: 0.3rem 0;
}
.radio-box .radio {
    position: relative;
    cursor: pointer;
    /* display: block; */
}
.radio-box input {
    position: absolute;
    left: -9999px;
}
.radio-box .radio i {
    display: block;
    position: absolute;
    top: 0.14rem;
    left: 0;
    width: 1rem;
    height: 1rem;
    outline: 0;
    border: 2px solid #ddd;
    background: #ffffff;
    border-radius: 50%;
}
.radio-box i:after {
    position: absolute;
    content: '';
    top: 0.125rem;
    left: 0.125rem;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: #008be9;
    opacity: 0;
    transition: opacity 0.1s;
    -webkit-transition: opacity 0.1s;
}
.radio-box input:checked + i {
    border: 2px solid #008be9;
}
.radio-box input:checked + i:after {
    opacity: 1;
}
.radio-box span {
    font-size: 0.9rem;
    margin-left: 1.5rem;
}

</style>
