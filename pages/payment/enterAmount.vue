<template>
  <div class="container">
    <p class="amount">Payments to Xender</p> 
    <PayNumber :signature="signature" :placeholder="placeholder" @changeNumber="changeNumber"></PayNumber>
    <p :class="{balance:true,notenough:isNotEnough}">eWallet Balance:￠<span>{{balance}}</span></p>
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
                number:'',
                isNotEnough:false,
                balance:1235.12
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
                    if(val < this.balance){
                        this.buttonList = [{ buttonValue:"NEXT",buttonStyle:"color:#FFF; background:#0087EB"}]
                    }else{
                        this.buttonList = [{ buttonValue:"RECHARGE",buttonStyle:"color:#AAA; background:#ddd"}]
                        this.isNotEnough = true
                    }
                }else{
                     this.buttonList = [{ buttonValue:"NEXT",buttonStyle:"color:#AAA; background:#ddd"}]
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
    .container p.balance{
        font-size: .8rem;
        color:#333;
        margin-left:3rem;
    }
    .container p.balance.notenough{
       color:red;
    }
</style>