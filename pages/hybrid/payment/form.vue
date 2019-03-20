<template>
    <div id="pay-form" class="container">
        <template v-for="(item,index) in configs">
            <div v-if="item.displayState!=2" :key="index" class="form-item">
                <div
                    v-if="item.formType=='select'||item.formType=='radio'"
                    :data-show="item.displayCondition"
                    :data-state="item.displayState"
                    :data-id="item.code"
                    :data-type="item.formType"
                >
                    <p class="network">{{item.name}}</p>
                    <div class="radio-box">
                        <div v-for="(radio,i) in item.optionArr" :key="i">
                            <label class="radio">
                                <input :name="item.name" :value="radio" :checked="radio === item.defaultValue ? 'checked' : false" type="radio">
                                <i/>
                                <span>{{radio}}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div
                    v-if="item.formType=='tel'"
                    :data-show="item.displayCondition"
                    :data-state="item.displayState"
                    :data-id="item.code"
                    :data-type="item.formType"
                    :data-reg="item.pattern"
                    :data-precode="item.countryCallingCode"
                    :data-name="item.name"
                    class="form-item input-tel"
                >
                    <div v-if="item.countryCallingCode" class="prefix">+{{item.countryCallingCode}}</div>
                    <div class="number">
                        <input :placeholder="item.placeholder" type="tel">
                    </div>
                </div>
                <div
                    v-if="item.formType=='text'||item.formType=='password'||item.formType=='email'"
                    :data-show="item.displayCondition"
                    :data-state="item.displayState"
                    :data-id="item.code"
                    :data-type="item.formType"
                    :data-reg="item.pattern"
                    :data-name="item.name"
                    class="form-item input-tel"
                >
                    <div class="number">
                        <input :type="item.formType" :placeholder="item.placeholder">
                    </div>
                </div>
                <div>
                    <input v-model="item.defaultValue" :name="item.name" type="hidden">
                </div>
            </div>
        </template>
        <div class="footer">
            <mButton :disabled="false" class="next" text="NEXT"/>
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import $ from 'jquery'
import { invoke, commonPayAfter } from '~/functions/pay'
export default {
    layout: 'base',
    components: {
        mButton
    },
    data() {
        return {
            payToken: this.$route.query.payToken,
            payChannelId: this.$route.query.payChannelId,
            apiInterface:this.$store.query.appInterfaceMode||3,
            configs: []
        }
    },
    mounted() {
        this.$axios.get(`/payment/v2/pay-channels/${this.payChannelId}/form-configs`).then(res => {
            const data = res.data
            if (data && data instanceof Array && data.length > 0) {
                const configs = data.sort(function(a, b) {
                    return a.orderSeq - b.orderSeq
                })
                configs.forEach((item, index) => {
                    if (item.options) {
                        item.optionArr = item.options.split('|')
                    }
                })
                this.configs = configs
                this.$nextTick(function() {
                    ifShow()
                })
            }
        })

        const _this = this

        $('#pay-form')
            .on('change', 'input[type="radio"]', function() {
                ifShow()
            })
            .on('change', 'input[type="checkbox"]', function() {
                ifShow()
            })
            .on('blur', 'input[type="text"],input[type="password"],input[type="tel"],input[type="email"]', function() {
                ifShow()
            })
            .on('click', '.cancel', function() {
                _this.$router.go(-1)
            })
            .on('click', '.next', function() {
                const items = $('[data-id]').filter(':visible')
                const optarr = {}
                for (let i = 0; i < items.length; i++) {
                    const item = $(items[i])
                    const id = item.data('id')
                    const name = item.data('name')
                    const type = item.data('type')
                    let value = getItemVal(id)

                    if (type === 'text' || type === 'password' || type === 'tel' || type === 'email') {
                        if (!value) {
                            item.find('.error')
                                .remove()
                                .end()
                                .append(
                                    '<div class="error" style="position: absolute;bottom: -1.4rem;font-size: 0.5rem;color: red;">Please enter the complete information.</div>'
                                )
                            item.css({
                                'border-bottom': '#dddddd solid 1px'
                            })
                            return false
                        } else {
                            const reg = new RegExp(item.data('reg'))
                            if (!reg.test(value)) {
                                item.find('.error')
                                    .remove()
                                    .end()
                                    .append(
                                        '<div class="error" style="position: absolute;bottom: -1.4rem;font-size: 0.5rem;color: red;">Please enter the correct ' +
                                            name +
                                            '.</div>'
                                    )
                                item.css({
                                    'border-bottom': '#red solid 1px'
                                })
                                return false
                            } else {
                                item.css({
                                    'border-bottom': '#dddddd solid 1px'
                                })
                                item.find('.error').remove()
                                if (type === 'tel') {
                                    const precode = item.data('precode')
                                    if (precode && value.indexOf(precode) !== 0) {
                                        if (value.indexOf('0') === 0) {
                                            value = precode + value.substring(1)
                                        } else {
                                            value = precode + value
                                        }
                                    }
                                }
                            }
                        }
                    }

                    optarr[id] = value
                }
                _this.$nuxt.$loading.start()
                _this.$store.commit('SHOW_SHADOW_LAYER')
                invoke.call(
                    _this,
                    _this.payToken,
                    _this.payChannelId,
                    data => {
                        _this.$nuxt.$loading.finish()
                        _this.$store.commit('HIDE_SHADOW_LAYER')
                        commonPayAfter.call(_this, data, 3, _this.apiInterface)
                    },
                    optarr
                )
            })

        function ifShow() {
            const conditionShow = $('[data-state="3"]')
            for (let i = 0; i < conditionShow.length; i++) {
                const item = $(conditionShow[i])
                const condition = item.data('show').split('=')
                const key = condition[0]
                const destValue = condition[1]
                const realValue = getItemVal(key)
                if (realValue === destValue) {
                    item.show()
                } else {
                    item.hide()
                }
            }
        }

        function getItemVal(key) {
            const item = $('[data-id="' + key + '"]')
            const type = item.data('type')
            let value = ''
            switch (type) {
                case 'select':
                case 'radio':
                    value = item.find('input:checked').val()
                    break
                case 'password':
                case 'text':
                case 'tel':
                case 'email':
                case 'hidden':
                    value = item.find('input').val()
                    break
                default:
                    return ''
            }
            return value
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    padding: 3rem 3rem 0;
    background: white;
    height:100%;
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
