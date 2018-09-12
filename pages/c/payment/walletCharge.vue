<template>
    <div>
        <div class="eWallet">
            <p class="cardNo">eWallet No. {{walletAccount}}</p>
            <div>
                <span class="balance">Balance：</span>
                <span class="currency">{{currency}}</span>
                <span class="money">{{walletLeft}}</span>
            </div>
        </div>
        <RadioBtn :radioList="radioList" class="radioBtn"></RadioBtn>  
        <div class="footer">
            <Button :disabled="false" :text="'NEXT'" @click="nextStep"></Button>
        </div>
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
    </div>
</template>
<script>
import Button from '~/components/button'
import RadioBtn from '~/components/radioBtn'
export default {
    layout: 'base',
    data() {
        return {
            walletAccount: '',
            walletLeft: 0,
            currency: '',
            radioList: []
        }
    },
    mounted() {
        this.walletAccount = window.sessionStorage.getItem('wallet_account')
        this.walletLeft = window.sessionStorage.getItem('wallet_left')
        this.currency = window.sessionStorage.getItem('currency')
        this.$axios.setHeader('token', this.$store.state.token)
        this.$axios.get('/mobilewallet/v1/recharge-channels').then(res => {
            let list = []
            if(res.data&&res.data.length>0){
                res.data.forEach((item,index)=>{
                    list.push({
                        code:item.id,
                        value:item.name,
                        imgUrl:item.logoUrl||'',
                        checked:index ? false : true
                    })
                })
                this.radioList = list
            }
        })
    },
    components: {
        Button,
        RadioBtn
    },
    filters: {
        // TODO FILTERS
    },
    methods: {
        nextStep() {
            // TODO
        }
    }
}
</script>
<style>
.eWallet {
    width: 100%;
    height: 6rem;
    padding: 1rem;
    background: #0087eb;
    color: #fff;
}
.eWallet .cardNo {
    display: inline-block;
    height: 1.7rem;
    line-height: 1.7rem;
    font-size: 0.9rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.2471);
    padding: 0 0.8rem;
    margin-bottom: 0.5rem;
}
.eWallet .balance {
    font-size: 0.9rem;
    opacity: 0.8;
    padding-left: 0.8rem;
}
.eWallet .currency {
    font-weight: bold;
}
.eWallet .money {
    font-size: 1.5rem;
    font-weight: bold;
}
.radioBtn {
    margin-left: 0.8rem;
    margin-top: 1.5rem;
}
.footer {
    position: fixed;
    bottom: 2rem;
    width: 16rem;
    margin: 0 auto;
    left: 0;
    right: 0;
}
</style>
