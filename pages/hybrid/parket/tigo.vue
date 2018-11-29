<template>
    <div id="wrapper">
        <div class="by_tel">
            <verifyTigo ref="telpicker" :prefix="phonePrefix" :error_tel="error_tel" :input_label="input_label"/>
        </div>
        <div class="footer">
            <mButton :disabled="false" :text="'OK'" @click="nextStep"/>
        </div>
    </div>
</template>
<script>
import verifyTigo from '~/components/form/verify_tigo'
import mButton from '~/components/button'
 export default {
      layout: 'base',
      data(){
          return {
            phonePrefix:"255 0",
            error_tel:'',
            input_label:'Input phone number to continue'
          }
      },
      methods: {
          nextStep(){
                let phone = this.$refs.telpicker.tel
                console.log(phone)
                if(phone.length < 9){
                    this.error_tel = 'Must be 9 digits'
                    console.log(111)
                }else{
                    window.location.href = 'http://www.tigosports.co.tz/Home/Home?MSISDN=255' + phone + '&ConsumerName=Startimes'
                }
          }
      },
      head() {
        return {
            title: 'Tigo'
        }
    },
     components: {
        verifyTigo,
        mButton
    },
 }   
</script>
<style   lang="less" scoped>
#wrapper {
    padding: 1rem 0.8rem;
    .by_tel {
        padding-top: 5rem;
    }
    .footer {
        position: fixed;
        bottom: 2rem;
        width: 75%;
        margin: 0 auto;
        left: 0;
        right: 0;
    }
}
</style>
