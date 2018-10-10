<template>
  <div class="radio-box">
    <div v-for="(item,i) in radioList" :key="i">
      <label class="radio">
        <input type="radio" name="pay-options" value="item.code" @click="checkThis(item.code)" :checked="item.checked?true:false"/>
        <i></i>
        <div class="img-box" v-show="item.imgUrl">
          <img :src="item.imgUrl" alt=""> 
        </div>
        <span :class="{ml15:item.imgUrl!=''}">{{item.value}}</span>
      </label>
    </div>
  </div>
</template>
<script>
export default {
  props: ["radioList"],
  methods:{
      checkThis(code){
          this.$emit('pick',code)
      }
  }
}
</script>
<style scoped>
.radio-box > div {
    margin-top: 0.4rem;
}
.radio-box .radio {
    position: relative;
    cursor: pointer;
    display: block;
    line-height:1.65rem;
    height:1.65rem;
}
.radio-box input {
    position: absolute;
    left: -9999px;
}
.radio-box .img-box {
    display: inline-block;
    margin-left: 1.5rem;
    vertical-align: middle;
}
.radio-box .img-box img {
    height: 1.5rem;
    display: block;
}
.radio-box .radio i {
    display: block;
    position: absolute;
    top: 0.35rem;
    left: 0;
    width: 1.1rem;
    height: 1.1rem;
    outline: 0;
    border: 2px solid #ddd;
    background: #ffffff;
    border-radius: 50%;
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
    font-weight: bold;
    font-size: 0.9rem;
    margin-left: 1.5rem;
}
.radio-box span.ml15 {
    margin-left: 0.5rem;
}
</style>