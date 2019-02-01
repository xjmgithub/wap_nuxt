<template>
    <div>
        <div class="title">{{title}}</div>
        <div class="input-tel">
            <div class="prefix">+{{prefix}}</div>
            <div class="number">
                <input
                    type="tel"
                    :disabled="disabled"
                    :class="{focus:focus_tel,'input-error':error_tel}"
                    v-model="tel"
                    @focus="focus_tel=true"
                    @blur="focus_tel=false"
                    placeholder="Cellphone number"
                >
            </div>
            <div class="get-code">
                <div class="btn" :class="{disabled:!canGetCode}" @click="getCode">{{codeDuring>0?`${codeDuring}s`:'Get Code'}}</div>
            </div>
        </div>
        <div class="error" v-show="error_tel">{{error_tel}}</div>
    </div>
</template>
<script>
import qs from 'qs'
export default {
    props: {
        prefix: {
            type: String,
            required: true
        },
        title: {
            type: String,
            default: 'Enter cellphone number'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        tel(nv, ov) {
            this.error_tel = ''
        }
    },
    mounted() {
        let _this = this
        this.timer = setInterval(() => {
            _this.codeDuring--
        }, 1000)
    },
    data() {
        return {
            tel: '',
            focus_tel: false,
            error_tel: '',
            codeDuring: 0,
            waiting_res: false
        }
    },
    computed: {
        canGetCode() {
            return this.tel.length >= 6 && this.codeDuring <= 0
        }
    },
    methods: {
        setTel(tel) {
            this.tel = tel
        },
        getCode() {
            if (!this.canGetCode || this.waiting_res) return false
            this.waiting_res = true
            let accountNo = JSON.parse(localStorage.getItem('wallet_account')).accountNo
            this.$axios.post(`/mobilewallet/uc/v2/accounts/${accountNo}/verify-code?phone=${this.prefix + this.tel}&`).then(res => {
                this.waiting_res = false
                if (res.data.code == 0) {
                    this.$emit('canNext')
                    this.codeDuring = 60
                } else {
                    this.error_tel = 'Please confirm you have entered the right number.'
                }
            })
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
}
</script>
<style lang="less" scoped>
.title {
    line-height: 2rem;
    height: 2rem;
    font-size: 1rem;
    margin-bottom: 0.5rem;
}
.input-tel {
    display: -webkit-box;
    display: flex;
    padding-bottom: 5px;
    position: relative;
    .prefix {
        max-width: 3.5rem;
        line-height: 2rem;
        height: 2rem;
        -webkit-box-flex: 1;
        flex: 1;
        margin-right: 0.3rem;
    }
    .number {
        -webkit-box-flex: 5;
        flex: 5;
        input {
            width: 100%;
            border: none;
            display: block;
            height: 2rem;
            line-height: 2rem;
            outline: none;
            padding-left: 0.5rem;
            border-bottom: #dddddd solid 1px;
            &::-webkit-input-placeholder {
                font-size: 0.9rem;
            }
            &.focus {
                border-bottom: #0087eb solid 1px;
            }
            &.input-error {
                border-bottom: red solid 1px;
            }
        }
    }
}
.error {
    font-size: 0.5rem;
    color: red;
}
.get-code {
    position: relative;
    flex: 2;
    .btn {
        max-width: 10rem;
        margin-left: 0.3rem;
        background: #0087eb;
        color: white;
        font-size: 0.8rem;
        text-align: center;
        height: 2rem;
        line-height: 2rem;
        border-radius: 2px;
        cursor: pointer;
        &.disabled {
            background: #eeeeee;
            color: #aaaaaa;
        }
    }
    .error_code {
        position: absolute;
        bottom: -1.4rem;
        font-size: 0.5rem;
        color: red;
    }
}
</style>
