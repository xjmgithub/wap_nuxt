<template>
  <div class="container">
      <h3>Recharge by mpesa</h3>
      <h4 class="description">Description</h4>
    <ul>
        <li>1. Select "Lipa na M-PESA".</li>
        <li>2. Go to "Pay Bill" option.</li>
        <li>3. Enter Account <span>No.91000023658</span></li>
        <li>4. Enter Amount and Continue.</li>
        <li>5. Confirm your payment information.</li>
        <li>6. Enter M-PESA PIN and Send.</li>
    </ul> 
    <Buttons :buttonList="buttonList"></Buttons>
  </div>

</template>
<script>
    import Buttons from '~/components/buttons'
    export default {
        data(){
            return {
                buttonList:[
                    { buttonValue:"NEXT",buttonStyle:"color:#fff; background:#0087EB"}
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
        font-size: .9rem;
        color:#333;
    }
    .container h3{
       text-align: center;
       font-weight: bold;
       font-size: 1.25rem;
    }
    .container h4{
       font-weight: bold;
       padding:1rem 0;
       margin-top:.5rem;
       font-size: 1.125rem;
       border-bottom:1px solid #e0e0e0;
    }
    .container ul{
       padding-top:1rem;
       font-size: .9rem;
       color:#666;
    }
    .container ul li{
       height: 1.5rem;
    }
    .container li span{
       font-size: 1rem;
       color:#333;
       font-weight: 600;
    }

</style>