<template>
  <div class="container">
      <img src="~assets/img/pay/img_failed_def_b.png" alt="">
    <p class="fail">
        Payment Failed
    </p> 
    <p class="msg">
        Thanks for your payment. But You have insufficent funds.
    </p> 
    <Buttons :buttonList="buttonList"></Buttons>
  </div>

</template>
<script>
    import Buttons from '~/components/buttons'
    export default {
        data(){
            return {
                 buttonList:[
                    { buttonValue:"OK",buttonStyle:"color:#fff; background:#0087EB"}
                ]
            }
        },
        layout: 'base',
        components: {
            Buttons
        },
    }

</script>
<style scoped>
    html, body {
        
    }
    .container{
      text-align: center;
      padding: 5rem 1rem 0;
      min-height: 100vh;
      background: #eee;
    }
     .container img{
         width:13rem;
         height:13rem;
    }
    .container .fail{
        color:#FF6100;
        font-size:1.2rem;
        margin-top:3rem;
        margin-bottom:.5rem;
        line-height:1.5rem;
        font-weight: bold;
    }
    .container .msg{
      color:#666;
      font-size: 0.9rem;
      line-height:1.25rem;
    }

</style>