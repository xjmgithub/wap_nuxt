<template >
    <div>
        <div class="eWallet">
            <p class="cardNo">eWallet No. 91000000008</p>
            <div>
                <span class="balance">Balance：</span>
                <span class="currency">₦</span>
                <span class="money">30.00</span>
            </div>
        </div>
        <RadioBtn :radioList="radioList" class="radioBtn"></RadioBtn>    
        <Buttons :buttonList="buttonList"></Buttons>
    </div>
</template>
<script>
    import Buttons from '~/components/buttons'
    import RadioBtn from '~/components/radioBtn'

    export default {
         layout: 'base',
         data(){
             return {
                 buttonList:[{ buttonValue:"NEXT",buttonStyle:"color:#fff; background:#0087EB"}],
                 radioList:[
                    {value:"Glo",imgUrl:require('../../assets/img/pay/MTN.png'),checked:false},
                    {value:"Airtel",imgUrl:require('../../assets/img/pay/Glo.png'),checked:true}
                 ]
             }
         },
        components: {
            Buttons,RadioBtn
        },
    }
</script>
<style>
    .eWallet{
        width: 100%;
        height:6rem;
        padding:1rem;
        background:#0087EB;
        color:#fff;
    }
    .eWallet .cardNo{
        display: inline-block;
        height:1.7rem;
        line-height: 1.7rem;
        font-size: .9rem;
        border-radius: 1rem;
        background: rgba(255, 255, 255, .2471);
        padding:0 .8rem;
        margin-bottom:.5rem;

    }
    .eWallet .balance{
        font-size: .9rem;
        opacity: .8;
        padding-left:.8rem;
    }
    .eWallet .currency{
        font-weight: bold;
    }
    .eWallet .money{
        font-size: 1.5rem;
        font-weight: bold;
    }
    .radioBtn{
        margin-left:.8rem;
        margin-top:1.5rem;
    }
</style>
