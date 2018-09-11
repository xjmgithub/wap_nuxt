<template>
    <div class="password-box">
        <p class="pwd-type">{{placeholder}}</p>
        <div class="pwd-input">
            <input type="password" maxlength="1" v-model="N1" ref="T1"  @keydown="T1_onkeyup()" />
            <input type="password" maxlength="1" v-model="N2" ref="T2"  @keydown="T2_onkeyup()" />
            <input type="password" maxlength="1" v-model="N3" ref="T3"   @keydown="T3_onkeyup()" />
            <input type="password" maxlength="1" v-model="N4" ref="T4"  @keydown="T4_onkeyup()" />
            <input type="password" maxlength="1" v-model="N5" ref="T5" @keydown="T5_onkeyup()" />
            <input type="password" maxlength="1" v-model="N6" ref="T6"   @keydown="T6_onkeyup()" />
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            placeholder: {
                type: String,
                required: true
            },
            toggleView:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                N1: "",
                N2: "",
                N3: "",
                N4: "",
                N5: "",
                N6: ""
            }
        },
        methods: {
            T1_onkeyup() {
                if (this.$refs.T1.value != '') this.$refs.T2.focus();
            },
            T2_onkeyup() {
                if (this.$refs.T2.value != '') this.$refs.T3.focus();
                if (this.$refs.T2.value == '') this.$refs.T1.focus();
            },
            T3_onkeyup() {
                if (this.$refs.T3.value != '') this.$refs.T4.focus();
                if (this.$refs.T3.value == '') this.$refs.T2.focus();
            },
            T4_onkeyup() {
                if (this.$refs.T4.value != '') this.$refs.T5.focus();
                if (this.$refs.T4.value == '') this.$refs.T3.focus();
            },
            T5_onkeyup() {
                if (this.$refs.T5.value != '') this.$refs.T6.focus();
                if (this.$refs.T5.value == '') this.$refs.T4.focus();
            },
            T6_onkeyup() {
                if (this.$refs.T6.value != '') {
                    this.$refs.T6.blur();
                    this.enterPwd()
                }
                if (this.$refs.T6.value == '') this.$refs.T5.focus();
            },
            enterPwd() {
                this.$emit("setPassword", this.password)
            }
        },
        computed: {
            password() {
                return '' + this.N1 + this.N2 + this.N3 + this.N4 + this.N5 + this.N6
            },
        }
    }
</script>
<style lang="less" scoped>
.password-box .pwd-type {
    color: #212121;
    font-size: 1rem;
    line-height: 1.5rem;
    margin-bottom: 1rem;
}

.pwd-input {
    width: 100%;
    input {
        width: 13%;
        display: block;
        border: none;
        border-bottom: 1px solid #ddd;
        outline: none;
        text-align: center;
        margin-right: 4.4%;
        float: left;
        &:last-child {
            margin-right: 0;
        }
    }
}
</style>