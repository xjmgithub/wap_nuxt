<template>
    <div class="container">
        <template v-for="(item,index) in configs">
            <div class="form-item" :key="index" v-if="item.displayState!=2">
                <!-- 1 永久可见，2 永不可见，3 条件可见 -->
                <div v-if="item.formType=='select'||item.formType=='radio'">
                    <!-- TODO v-show="condition" -->
                    <p class="network">{{item.name}}</p>
                    <div class="radio-box">
                        <div v-for="(radio,i) in item.optionArr" :key="i">
                            <label class="radio">
                                <input type="radio" name="pay-options" value="radio" @click="checkThis(radio)" :checked="radio==item.defaultValue?true:false" />
                                <i></i>
                                <span>{{radio}}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="form-item input-tel" v-if="item.formType=='tel'" :class="{focus:focus_tel,error:error_tel}">
                    <div v-if="item.countryCallingCode" class="prefix">+{{item.countryCallingCode}}</div>
                    <div class="number">
                        <input type="tel" :placeholder="item.placeholder" />
                    </div>
                </div>
                <div class="form-item input-tel" v-if="item.formType=='text'||item.formType=='password'||item.formType=='email'" :class="{focus:focus_tel,error:error_tel}">
                    <div class="number">
                        <input :type="item.formType" :placeholder="item.placeholder" />
                    </div>
                </div>
                <div>
                    <input :name="item.name" v-model="item.defaultValue" type="hidden">
                </div>
            </div>
        </template>
        <div class="footer">
            <mButton :disabled="false" text="OK"></mButton>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
export default {
    layout: 'base',
    data() {
        return {
            payChannelId: this.$route.query.payChannelId,
            configs: [],
            radioList: [
                { value: 'Glo', imgUrl: '', checked: false },
                { value: 'Airtel', imgUrl: '', checked: true }
            ],
            signature: '+234',
            placeholder: 'Phone Number',
            number: ''
        }
    },
    components: {
        mButton
    },
    methods: {
        changeNumber(data) {
            this.number = data
        }
    },
    mounted() {
        this.$axios.setHeader('token', this.$store.state.token)
        this.$axios
            .get(`/payment/v2/pay-channels/${this.payChannelId}/form-configs`)
            .then(res => {
                let data = res.data
                if (data && data instanceof Array && data.length > 0) {
                    let configs = data.sort(function(a, b) {
                        return a.orderSeq - b.orderSeq
                    })
                    configs.forEach((item, index) => {
                        if (item.options) {
                            item.optionArr = item.options.split('|')
                        }
                    })
                    this.configs = configs
                }
            })
    },
    watch: {
        number(val, oldVal) {
            if (val.length >= 11) {
            } else {
            }
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    padding: 3rem 3rem 0;
    .form-item {
        margin: 2.5rem 0;
    }
    .network {
        color: #333333;
        font-size: 1.2rem;
        line-height: 1.4rem;
        padding-bottom: 0.2rem;
    }
}
.radioBtn {
    margin-bottom: 3.5rem;
}
.footer {
    position: fixed;
    bottom: 2rem;
    width: 16rem;
    margin: 0 auto;
    left: 0;
    right: 0;
}
.input-tel {
    border-bottom: #dddddd solid 1px;
    display: -webkit-box;
    display: flex;
    padding-bottom: 5px;
    margin: 1rem 0 2rem;
    position: relative;
    &.focus {
        border-bottom: #0087eb solid 1px;
    }
    &.error {
        border-bottom: red solid 1px;
    }
    &:after {
        content: '0';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    .prefix {
        max-width: 3.5rem;
        border-right: #dddddd solid 1px;
        line-height: 1.2rem;
        height: 1.2rem;
        float: left;
        -webkit-box-flex: 1.2;
        flex: 1.2;
    }
    .number {
        -webkit-box-flex: 11;
        flex: 5;
        input {
            width: 100%;
            border: none;
            display: block;
            padding: 0 0.5rem;
            outline: none;
            &::-webkit-input-placeholder {
                font-size: 0.8rem;
            }
        }
    }
    .error {
        position: absolute;
        bottom: -1.4rem;
        font-size: 0.5rem;
        color: red;
    }
}
.radio-box > div {
    margin-top: 0.4rem;
}
.radio-box .radio {
    position: relative;
    cursor: pointer;
}
.radio-box input {
    position: absolute;
    left: -9999px;
}
.radio-box .img-box {
    display: inline-block;
    width: 2rem;
    margin-left: 1.5rem;
    vertical-align: middle;
}
.radio-box .img-box img {
    height: 1.5rem;
    width: 100%;
    display: block;
}
.radio-box .radio i {
    display: block;
    position: absolute;
    top: 0.35rem;
    left: 0;
    width: 0.94rem;
    height: 0.94rem;
    outline: 0;
    border: 1px solid #ddd;
    background: #ffffff;
    border-radius: 50%;
}

.radio-box i:after {
    position: absolute;
    content: '';
    top: 0.13rem;
    left: 0.13rem;
    width: 0.56rem;
    height: 0.56rem;
    border-radius: 50%;
    background-color: #008be9;
    opacity: 0;
    transition: opacity 0.1s;
    -webkit-transition: opacity 0.1s;
}
.radio-box input:checked + i {
    border: 1px solid #008be9;
}
.radio-box input:checked + i:after {
    opacity: 1;
}
.radio-box span {
    font-weight: bold;
    margin-left: 1.5rem;
}
.radio-box span.ml15 {
    margin-left: 0.6rem;
}
</style>