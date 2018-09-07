<template>
    <div id="wrapper">
        <div class="tab">
            <div>
                <img src="~/assets/img/users/ic_telephone_def_g.png" />
            </div>
            <div>
                <img src="~/assets/img/users/ic_email_def_gray.png" />
            </div>
        </div>
        <div class="by_tel">
            <div class="country_choose">
                <img src="~/assets/img/users/ic_countryTan_def.png" />
                <span>Tanzania</span>
            </div>
            <input-tel></input-tel>
            <tel-getcode></tel-getcode>
            <div>
                
            </div>
        </div>
        <div class="by_email">

        </div>
    </div>
</template>
<script>
    export default {
        layout: 'base',
        head() {
            return {
                title: 'Register',
                meta: [
                    { name: 'format-detection', content: 'email=no' },
                    { name: 'format-detection', content: 'telephone=no' },
                ]
            }
        }
    }
</script>