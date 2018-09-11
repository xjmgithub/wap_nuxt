<template>
  <div class="container">
    <p>
        1. After you click on the “PAY” ,you will need to enter your phone number and PIN number information on the next page. 
    </p> 
    <p>
        2. Please complete the payment as soon as possible.
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
                    { buttonValue:"PAY",buttonStyle:"color:#fff; background:#0087EB"}
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
    }
    .container p{
       color:#666;
       line-height:1.5rem;
    }

</style>