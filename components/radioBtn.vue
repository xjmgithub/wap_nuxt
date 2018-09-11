<template>
  <div class="radio-box">
    <div v-for="(item,i) in radioList" :key="i">
      <label class="radio">
        <input type="radio" name="pay-options" value="item.value" checked="item.checked"/>
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
  props: ["radioList"]
};
</script>
<style scoped>
.radio-box > div {
  margin-top: 0.4rem;
}
.radio-box .radio {
  position: relative;
  cursor: pointer;
}
.radio-box input {
  position: absolute;
  left: -9999px;
}
.radio-box .img-box {
  display: inline-block;
  width:2rem;
  margin-left: 1.5rem;
  vertical-align: middle
}
.radio-box .img-box img{
  height:1.5rem;
  width:100%;
  display: block;
}
.radio-box .radio i {
  display: block;
  position: absolute;
  top: 0.35rem;
  left: 0;
  width: .94rem;
  height: .94rem;
  outline: 0;
  border: 1px solid #ddd;
  background: #ffffff;
  border-radius: 50%;
  
}

.radio-box i:after {
  position: absolute;
  content: "";
  top: 0.13rem;
  left: 0.13rem;
  width: 0.56rem;
  height: 0.56rem;
  border-radius: 50%;
  background-color: #008be9;
  opacity: 0;
  transition: opacity 0.1s;
  -webkit-transition: opacity 0.1s;
}
.radio-box input:checked + i{
  border: 1px solid #008be9;
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
   margin-left: .6rem;
}
</style>