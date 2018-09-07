<template>
  <div class="container">
    <Password :pwdType="pwdType" ></Password>
    <div class="forgot-pwd">
        <a href="#" >Forgot payment password?</a>
    </div>
    <Buttons :buttonList="buttonList"></Buttons>
  </div>

</template>
<script>
    import Buttons from '~/components/buttons'
    import Password from '~/components/password'

    export default {
        data(){
            return {
                buttonList:[
                    { buttonValue:"PAY NOW",buttonStyle:"color:#AAA; background:#ddd"},
                ],
                pwdType:"Enter Payment Password"
            }
        },
        layout: 'base',
        components: {
            Buttons,Password
        },
    }

</script>
<style scoped>
   .container{
      padding: 6rem 1rem 0 1rem;
      font-size: 1rem;
    }
    .forgot-pwd{
        text-align: right;
    }
    .forgot-pwd a {
        color:#0087EB;
        font-size: .9rem;
        font-weight: bold;
        display: inline-block;
        border-bottom:1px solid #0087EB;
        padding-top:.3rem;
    }
</style>