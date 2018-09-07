<template>
  <div class="radio-box">
    <div v-for="(item,i) in radioList" :key="i">
      <label class="radio">
        <input type="radio" name="pay-options" value="item.value" checked="item.checked"/>
        <i></i>
        <span>{{item.value}}</span>
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

.radio-box .radio i {
  display: block;
  position: absolute;
  top: 0.13rem;
  left: 0;
  width: .94rem;
  height: .94rem;
  outline: 0;
  border: 1px solid #008be9;
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

.radio-box input:checked + i:after {
  opacity: 1;
}
.radio-box span {
  margin-left: 1.5rem;
  font-weight: bold;
  font-size: 0.9rem;
}
</style>