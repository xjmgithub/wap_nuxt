<template>
    <div id="pay-form" class="container">
        <template v-for="(item,index) in configs">
            <div v-if="item.displayState!=2" :key="index" class="form-item">
                <div v-if="['select','radio'].indexOf(item.formType)>=0">
                    <p class="network">{{item.name}}</p>
                    <div class="radio-box">
                        <div v-for="(radio,i) in item.optionArr" :key="i" @click="item.value=radio">
                            <label class="radio">
                                <input :name="item.name" :value="radio" :checked="radio === item.value ? 'checked' : false" type="radio" />
                                <i />
                                <span>{{radio}}</span>
                            </label>
                        </div>
                    </div>
                    <div v-show="item.error" class="error">{{item.error}}</div>
                </div>
                <div
                    v-if="item.formType=='tel'"
                    v-show="item.displayState!=3||showCondition.indexOf(item.displayCondition)>=0"
                    class="form-item input-tel"
                >
                    <div v-if="item.countryCallingCode" class="prefix">+{{item.countryCallingCode}}</div>
                    <div class="number">
                        <input v-model="item.value" :placeholder="item.placeholder" type="tel" />
                    </div>
                    <div v-show="item.error" class="error">{{item.error}}</div>
                </div>
                <div
                    v-if="['text','password','email'].indexOf(item.formType)>=0"
                    v-show="item.displayState!=3||showCondition.indexOf(item.displayCondition)>=0"
                    class="form-item input-tel"
                >
                    <div class="number">
                        <input v-model="item.value" :type="item.formType" :placeholder="item.placeholder" />
                    </div>
                    <div v-show="item.error" class="error">{{item.error}}</div>
                </div>
                <div v-if="item.formType=='hidden'">
                    <input v-model="item.value" :name="item.name" type="hidden" />
                </div>
            </div>
        </template>
        <div class="footer">
            <mButton :disabled="false" text="NEXT" class="next" @click="next" />
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import { invoke, commonPayAfter } from '~/functions/pay'
export default {
    layout: 'base',
    components: {
        mButton
    },
    data() {
        return {
            payToken: this.$route.query.payToken || '',
            channel: this.$route.query.payChannelId || '',
            apiInterface: this.$route.query.appInterfaceMode || 3,
            configs: []
        }
    },
    computed: {
        showCondition() {
            const result = []
            this.configs.forEach(item => {
                result.push(`${item.code}=${item.value}`)
            })
            return result
        }
    },
    mounted() {
        const sessionPayToken = sessionStorage.getItem('payToken')
        const sessionChannel = sessionStorage.getItem('payChannel')
        if (!this.payToken && sessionPayToken) this.payToken = sessionPayToken
        if (!this.channel && sessionChannel) this.channel = sessionChannel
        this.$axios.get(`/payment/v2/pay-channels/${this.channel}/form-configs`).then(res => {
            const data = res.data
            if (data && data instanceof Array && data.length > 0) {
                const configs = data.sort(function(a, b) {
                    return a.orderSeq - b.orderSeq
                })
                configs.forEach((item, index) => {
                    if (item.formType == 'radio' || item.formType == 'select') {
                        item.optionArr = item.options.split('|')
                    }
                    item.value = item.defaultValue
                })
                this.configs = configs
            }
        })
    },
    methods: {
        conditionShow(val) {
            const condition = val.split('=')
            let result = false
            this.configs.forEach(item => {
                if (item.formType == 'radio' || item.formType == 'select') {
                    if (item.name == condition[0]) {
                        if (item.value == condition[1]) {
                            result = true
                        }
                    }
                }
            })
            return result
        },
        next() {
            let canSubmit = true
            const optarr = {}
            const configBak = [...this.configs]
            configBak.forEach(item => {
                if (['text', 'password', 'tel', 'email'].indexOf(item.formType) >= 0) {
                    if (!item.value) {
                        item.error = 'Please enter the complete information.'
                        canSubmit = false
                    } else {
                        const reg = new RegExp(item.pattern)
                        if (!reg.test(item.value)) {
                            item.error = `Please enter the correct ${item.name}.`
                            canSubmit = false
                        } else if (item.formType == 'tel') {
                            item.error = ''
                            if (item.countryCallingCode && item.value.indexOf(item.countryCallingCode) !== 0) {
                                if (item.value.indexOf('0') === 0) {
                                    item.value = item.countryCallingCode + item.value.substring(1)
                                } else {
                                    item.value = item.countryCallingCode + item.value
                                }
                            }
                        }
                    }
                }
                optarr[item.code] = item.value
            })
            this.configs = configBak
            if (canSubmit) {
                this.$nuxt.$loading.start()
                this.$store.commit('SHOW_SHADOW_LAYER')
                invoke.call(
                    this,
                    this.payToken,
                    this.channel,
                    data => {
                        this.$nuxt.$loading.finish()
                        this.$store.commit('HIDE_SHADOW_LAYER')
                        commonPayAfter.call(this, data, 3, this.apiInterface)
                    },
                    optarr
                )
            }
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    padding: 3rem 3rem 0;
    background: white;
    height: 100%;
    .form-item {
        margin: 2rem 0;
    }
    .network {
        color: #333333;
        font-size: 1.1rem;
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
    width: 75%;
    margin: 0 auto;
    left: 0;
    right: 0;
}
.input-tel {
    border-bottom: #dddddd solid 1px;
    display: -webkit-box;
    display: flex;
    padding-bottom: 0.1rem;
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
        margin-right: 0.5rem;
    }
    .number {
        -webkit-box-flex: 11;
        flex: 5;
        input {
            width: 100%;
            border: none;
            display: block;
            outline: none;
            &::-webkit-input-placeholder {
                font-size: 1rem;
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
    display: block;
    line-height: 1.65rem;
    height: 1.65rem;
}
.radio-box input {
    position: absolute;
    left: -9999px;
}
.radio-box .img-box {
    display: inline-block;
    margin-left: 1.5rem;
    vertical-align: middle;
}
.radio-box .img-box img {
    height: 1.5rem;
    display: block;
}
.radio-box .radio i {
    display: block;
    position: absolute;
    top: 0.35rem;
    left: 0;
    width: 1.1rem;
    height: 1.1rem;
    outline: 0;
    border: 2px solid #ddd;
    background: #ffffff;
    border-radius: 50%;
}

.radio-box i:after {
    position: absolute;
    content: '';
    top: 0.13rem;
    left: 0.13rem;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background-color: #008be9;
    opacity: 0;
    transition: opacity 0.1s;
    -webkit-transition: opacity 0.1s;
}
.radio-box input:checked + i {
    border: 2px solid #008be9;
}
.radio-box input:checked + i:after {
    opacity: 1;
}
.radio-box span {
    font-weight: bold;
    font-size: 0.9rem;
    margin-left: 1.5rem;
}
.radio-box span.ml15 {
    margin-left: 0.5rem;
}
</style>
