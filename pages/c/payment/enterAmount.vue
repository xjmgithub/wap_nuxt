<template>
  <div class="container">
    <p class="amount">Payments to Xender</p> 
    <PayNumber :signature="signature" :placeholder="placeholder" @changeNumber="changeNumber"></PayNumber>
    <span class="balance">eWallet Balance: ￠ 1235.12</span>
    <Buttons :buttonList="buttonList"></Buttons>
  </div>

</template>
<script>
    import Buttons from '~/components/buttons'
    import PayNumber from '~/components/payNumber'

    export default {
        data(){
            return {
                buttonList:[
                    { buttonValue:"NEXT",buttonStyle:"color:#AAA; background:#ddd"},
                ],
                signature:"Ksh",
                placeholder:"Payment amount",
                number:''
            }
        },
        layout: 'base',
        components: {
            Buttons,PayNumber
        },
        methods:{
            changeNumber(data){
                this.number = data
            }
        },
        watch:{
            number(val, oldVal){
                if(val  > 0){
                    this.buttonList = [
                    { buttonValue:"NEXT",buttonStyle:"color:#FFF; background:#0087EB"},
                    ]
                }else{
                     this.buttonList = [
                    { buttonValue:"NEXT",buttonStyle:"color:#AAA; background:#ddd"},
                ]
                }
                
            }
        }
    }

</script>
<style scoped>
   .container{
      padding: 6rem 0 0 3rem;
    }
   .container .amount{
       color: #333333;
       font-size: 1.3rem;
       line-height:1.4rem;
       padding-bottom:3.2rem;
       font-weight: bold;
    }
    .container span.balance{
        font-size: .8rem;
        color:#333;
        margin-left:3rem;
    }
</style>