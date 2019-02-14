<template>
    <div id="pay-form" class="container">
        <template v-for="(item,index) in configs">
            <div class="form-item" :key="index" v-if="item.displayState!=2">
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
                                <input
                                    type="radio"
                                    :name="item.name"
                                    :value="radio"
                                    :checked="radio == item.defaultValue ? 'checked' : false"
                                >
                                <i />
                                <span>{{radio}}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div
                    class="form-item input-tel"
                    v-if="item.formType=='tel'"
                    :data-show="item.displayCondition"
                    :data-state="item.displayState"
                    :data-id="item.code"
                    :data-type="item.formType"
                    :data-reg="item.pattern"
                    :data-precode="item.countryCallingCode"
                    :data-name="item.name"
                >
                    <div v-if="item.countryCallingCode" class="prefix">+{{item.countryCallingCode}}</div>
                    <div class="number">
                        <input type="tel" :placeholder="item.placeholder">
                    </div>
                </div>
                <div
                    class="form-item input-tel"
                    v-if="item.formType=='text'||item.formType=='password'||item.formType=='email'"
                    :data-show="item.displayCondition"
                    :data-state="item.displayState"
                    :data-id="item.code"
                    :data-type="item.formType"
                    :data-reg="item.pattern"
                    :data-name="item.name"
                >
                    <div class="number">
                        <input :type="item.formType" :placeholder="item.placeholder">
                    </div>
                </div>
                <div>
                    <input :name="item.name" v-model="item.defaultValue" type="hidden">
                </div>
            </div>
        </template>
        <div class="footer">
            <mButton class="next" :disabled="false" text="NEXT" />
            <!-- <mButton class="cancel" :disabled="false" text="CANCEL" /> -->
        </div>
    </div>
</template>
<script>
import mButton from '~/components/button'
import $ from 'jquery'
export default {
    layout: 'base',
    data() {
        return {
            payToken: this.$route.query.payToken,
            payChannelId: this.$route.query.payChannelId,
            configs: []
        }
    },
    components: {
        mButton
    },
    mounted() {
        this.$axios.get(`/payment/v2/pay-channels/${this.payChannelId}/form-configs`).then(res => {
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
                this.$nextTick(function() {
                    ifShow()
                })
            }
        })

        let _this = this

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
                var items = $('[data-id]').filter(':visible')
                var optarr = {}
                for (var i = 0; i < items.length; i++) {
                    var item = $(items[i])
                    var id = item.data('id')
                    var name = item.data('name')
                    var type = item.data('type')
                    var value = getItemVal(id)

                    if (type == 'text' || type == 'password' || type == 'tel' || type == 'email') {
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
                            var reg = new RegExp(item.data('reg'))
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
                                if (type == 'tel') {
                                    var precode = item.data('precode')
                                    if (precode && value.indexOf(precode) != 0) {
                                        if (value.indexOf('0') == 0) {
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

                _this.$axios
                    .post('/payment/api/v2/invoke-payment', {
                        payToken: _this.payToken,
                        payChannelId: _this.payChannelId,
                        tradeType: 'JSAPI',
                        signType: 'MD5',
                        extendInfo: optarr
                    })
                    .then(res => {
                        if (res.data && res.data.resultCode == 0) {
                            if (_this.paymethod.appInterfaceMode == 2) {
                                // open other payment
                                window.open(res.data.tppRedirectUrl)
                                _this.$router.push(`/hybrid/payment/payResult?payToken=${_this.payToken}`)
                            } else if (_this.paymethod.appInterfaceMode == 3) {
                                // processing
                                _this.$router.push(`/hybrid/payment/payResult?payToken=${this.payToken}`)
                            } else {
                                // SDK 和 其他 不支持,
                                // payType 1 钱包支付
                                _this.$alert('The payment method is not supported for the time being')
                            }
                        } else {
                            // TODO fail
                            _this.$router.push(`/hybrid/payment/payResult?payToken=${_this.payToken}`)
                        }
                    })
            })

        function ifShow() {
            var conditionShow = $('[data-state="3"]')
            for (var i = 0; i < conditionShow.length; i++) {
                var item = $(conditionShow[i])
                var condition = item.data('show').split('=')
                var key = condition[0]
                var destValue = condition[1]
                var realValue = getItemVal(key)
                if (realValue == destValue) {
                    item.show()
                } else {
                    item.hide()
                }
            }
        }

        function getItemVal(key) {
            var item = $('[data-id="' + key + '"]')
            var type = item.data('type')
            var value = ''
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
                    break
            }
            return value
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    padding: 3rem 3rem 0;
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
