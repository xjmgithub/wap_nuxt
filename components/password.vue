<template>
  <div class="password-box">
    <p class="pwd-type">{{pwdType}}</p>
    <input type="password" maxlength="1" v-model="N1" ref="T1" @keyup="T1_onkeyup()" />
    <input type="password" maxlength="1" v-model="N2" ref="T2" @keyup="T2_onkeyup()" />
    <input type="password" maxlength="1" v-model="N3" ref="T3" @keyup="T3_onkeyup()" />
    <input type="password" maxlength="1" v-model="N4" ref="T4" @keyup="T4_onkeyup()" />
    <input type="password" maxlength="1" v-model="N5" ref="T5" @keyup="T5_onkeyup()" />
    <input type="password" maxlength="1" v-model="N6" ref="T6" @keyup="T6_onkeyup()" />
  </div> 
</template>
<script>
    export default {
        props:["pwdType"],
        data(){
            return {
                N1:"",
                N2:"",
                N3:"",
                N4:"",
                N5:"",
                N6:"",
                password:""

            }
        },
        methods:{
            T1_onkeyup(){
                if (this.$refs.T1.value !='')  this.$refs.T2.focus();
            },
            T2_onkeyup(){
                if (this.$refs.T2.value !='')  this.$refs.T3.focus();
                if (this.$refs.T2.value =='')  this.$refs.T1.focus();
            },
            T3_onkeyup(){
                if (this.$refs.T3.value !='')  this.$refs.T4.focus();
                if (this.$refs.T3.value =='')  this.$refs.T2.focus();
            },
            T4_onkeyup(){
                if (this.$refs.T4.value !='')  this.$refs.T5.focus();
                if (this.$refs.T4.value =='')  this.$refs.T3.focus();
            },
            T5_onkeyup(){
                if (this.$refs.T5.value !='')  this.$refs.T6.focus();
                if (this.$refs.T5.value =='')  this.$refs.T4.focus();
            },
            T6_onkeyup(){
                if (this.$refs.T6.value !='')  this.$refs.T6.blur();
                if (this.$refs.T6.value =='')  this.$refs.T5.focus();
            },
        },
        computed:{
            
        }
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