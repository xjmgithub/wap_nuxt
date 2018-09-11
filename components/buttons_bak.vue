<template>
  <div class="btn-box">
    <div v-for="(item,i) in buttonList" :key="i">
      <button type="button" :style="item.buttonStyle" >{{item.buttonValue}}</button>
    </div>
  </div>
</template>
<script>
    export default {
        props:["buttonList"]
    }
</script>
<style scoped>
  div.btn-box{
    position: absolute;
    bottom:2.5rem;
    left: 0;
    width: 100%;
  }
  button{
    border:none;
    width:70%;
    height:2.25rem;
    display: block;
    margin: 0 auto;
    margin-top:.7rem;
  }
</style>