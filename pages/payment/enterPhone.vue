<template>
  <div class="container">
    <p class="network">Network</p>
    <RadioBtn :radioList="radioList" class="radioBtn"></RadioBtn>    
    <PayNumber :signature="signature" :placeholder="placeholder" @changeNumber="changeNumber"></PayNumber>
    <Buttons :buttonList="buttonList"></Buttons>
  </div>

</template>
<script>
    import Buttons from '~/components/buttons'
    import RadioBtn from '~/components/radioBtn'
    import PayNumber from '~/components/payNumber'

    export default {
        data(){
            return {
                buttonList:[
                    { buttonValue:"NEXT",buttonStyle:"color:#AAA; background:#ddd"},
                    { buttonValue:"CANCEL",buttonStyle:"color:#AAA; background:#fff;border:1px solid #AAA"}
                ],
                radioList:[
                    {value:"Glo",checked:false},
                    {value:"Airtel",checked:true}
                ],
                signature:"+234",
                placeholder:"Phone Number",
                number:''
            }
        },
        layout: 'base',
        components: {
            Buttons,RadioBtn,PayNumber
        },
        methods:{
            changeNumber(data){
                this.number = data
            }
        },
        watch:{
            number(val, oldVal){
                if(val.length >= 11){
                    this.buttonList = [
                    { buttonValue:"NEXT",buttonStyle:"color:#FFF; background:#0087EB"},
                    { buttonValue:"CANCEL",buttonStyle:"color:#0087EB; background:#fff;border:1px solid #0087EB"}
                    ]
                }else{
                     this.buttonList = [
                    { buttonValue:"NEXT",buttonStyle:"color:#AAA; background:#ddd"},
                    { buttonValue:"CANCEL",buttonStyle:"color:#AAA; background:#fff;border:1px solid #AAA"}
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
   .container .network{
       color: #333333;
       font-size: 1.3rem;
       line-height:1.4rem;
       padding-bottom:.2rem;
    }
    .radioBtn{
        margin-bottom:3.5rem;
    }
</style>