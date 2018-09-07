<template>
  <div class="container">
      <img src="~assets/img/pay/pic_done_b.png" alt="">
    <p class="success">
        Payment Successful
    </p> 
    <p class="money">
        50.00 <span>Ksh</span>
    </p> 
    <p class="msg">
        Thanks for your payment. Your account has been successfully paymented. Please click "OK" if you are not redirected within 5s.
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
    .container{
        padding: 5rem 1rem 0;
        text-align: center;
    }
    .container img{
        width:3rem;
        height:3rem;
    }
    .container .success{
        color:#0087EB;
        font-size:1.2rem;
        margin-top:.75rem;
    }
    .container .money{
        color:#212121;
        font-size:2.25rem;
        font-weight:bold;
        margin:1rem 0 1.5rem;
    }
    .container .money span{
        font-size: 1.25rem;
    }
    .container .msg{
       color:#666;
       font-size:1rem;
       line-height:1.25rem;
       text-align: left;
    }

</style>