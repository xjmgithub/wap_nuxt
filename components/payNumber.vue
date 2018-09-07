<template>
  <div class="pay-number">
      <span class="signature">{{signature}}</span>
      <input type="tel"  maxlength="11" :placeholder="placeholder" v-model="number" @input="changeNumber"/>
      <span class="dialog" v-show="isFocus">{{ placeholder }}</span>
  </div>
</template>
<script>
    export default {
        props:["signature","placeholder"],
        data(){
            return {
                isFocus:false,
                number:''
            }
        },
        methods:{
            changeNumber(){
               this.$emit("changeNumber",this.number)
            }
        },
        watch:{
            number(val, oldVal){
                this.isFocus = val.length > 0 ? true : false

            }
        }
    }
</script>
<style scoped>
  .pay-number{
      position: relative;
  }
  .pay-number span{
      display: inline-block;
      height:1.5rem;
  }
  .pay-number .signature{
      width:3rem;
  }
  .pay-number input{
      border:none;
      height:1.5rem;
      outline:none;
      border-bottom:1px solid  #DDD;
      font-size: 1rem;
  }
   .pay-number .dialog{
      color:#0087EB;
      font-size: .75rem;
      position: absolute;
      top:-1.2rem;
      left:3rem;
      z-index:-99;
  }
</style>