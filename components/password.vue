<template>
  <div class="password-box">
    <p class="pwd-type">{{pwdType}}</p>
    <input type="password" maxlength="1" onkeyup="T1_onkeyup()" >
    <input type="password" maxlength="1" onkeyup="T1_onkeyup()" >
    <input type="password" maxlength="1" onkeyup="T1_onkeyup()" >
    <input type="password" maxlength="1" onkeyup="T1_onkeyup()" >
    <input type="password" maxlength="1" onkeyup="T1_onkeyup()" >
    <input type="password" maxlength="1" onkeyup="T1_onkeyup()" >
  </div> 
</template>
<script>
    export default {
        props:["pwdType"]
    }
</script>
<style scoped>
  .password-box .pwd-type{
      color:#212121;
      font-size: 1rem;
      line-height: 1.5rem;
      margin-bottom: 1rem;
  }
  .password-box input{
      border:none;
      border-bottom: 1px solid #ddd;
      outline: none;
      width:2.55rem;
      text-align: center;
  }
  .password-box input + input{
      margin-left:.5rem;
  }
</style>