<template>
    <div class="radio-box">
        <div v-for="(item,i) in radioList" :key="i">
            <label class="radio">
                <div class="img-box" :class="item.className"/>
                <span v-if="i==0" >{{item.value}} {{ balance }}</span>
                <span v-else>{{item.value}} </span>
                <input type="radio" name="pay-options" value="item.code" @click="checkThis(i)" :checked="item.checked?true:false">
                <i/>
                
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
        },
        balance:{
            type: String,
            required: true,
            default: ''
        }
    },
    methods: {
        checkThis(code) {
            this.$emit('pick', code)
        }
    }
}
</script>
<style lang="less" scoped>
.radio-box .img-box {
    display: inline-block;
    vertical-align: middle;
    height: 1.3rem;
    width:1.3rem;
    background-size: 100% !important;
    &.balance{
        background: url("~assets/img/dvb/ic_ewallet_balance.png") no-repeat ;
    }
   
}
.radio-box > div {
    margin-top: 0.4rem;
}
.radio-box .radio {
    position: relative;
    cursor: pointer;
    display: block;
    line-height: 1.65rem;
    height: 1.65rem;
}
.radio-box input {
    position: absolute;
    left: -9999px;
}

.radio-box .radio i {
    width: 1.1rem;
    height: 1.1rem;
    outline: 0;
    border: 2px solid #ddd;
    background: #ffffff;
    border-radius: 50%;
    float:right;
    position: relative;
    top:.35rem;
}

.radio-box i:after {
    position: absolute;
    content: '';
    top: 0.13rem;
    left: 0.13rem;
    width: 0.6rem;
    height: 0.6rem;
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
    margin-left: .5rem;
}
</style>
