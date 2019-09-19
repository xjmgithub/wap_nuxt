<template>
    <div>
        <div class="title">{{title}}</div>
        <div class="input-tel">
            <div class="prefix">+{{prefix}}</div>
            <div class="number">
                <input v-model="tel" :disabled="disabled" :class="{focus:focus_tel,'input-error':error_tel}" type="tel" :placeholder="$store.state.lang.cellphone_number" @focus="focus_tel=true" @blur="focus_tel=false">
            </div>
            <div class="get-code">
                <div :class="{disabled:!canGetCode}" class="btn" @click="getCode">{{codeDuring>0?`${codeDuring}s`:$store.state.lang.get_code}}</div>
            </div>
        </div>
        <div v-show="error_tel" class="error">{{error_tel}}</div>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            tel: '',
            focus_tel: false,
            error_tel: '',
            codeDuring: 0,
            waiting_res: false,
            prefix: this.$store.state.country.phonePrefix
        }
    },
    computed: {
        canGetCode() {
            return this.tel.length >= 6 && this.codeDuring <= 0
        }
    },
    watch: {
        tel(nv, ov) {
            this.error_tel = ''
        }
    },
    mounted() {
        const _this = this
        this.timer = setInterval(() => {
            _this.codeDuring--
        }, 1000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
        getCode() {
            this.$emit('passCode')
            if (!this.canGetCode || this.waiting_res) return false
            this.waiting_res = true
            const accountNo = JSON.parse(sessionStorage.getItem('wallet')).accountNo
            this.$axios.post(`/mobilewallet/uc/v2/accounts/${accountNo}/verify-code?phone=${this.prefix + this.tel}`).then(res => {
                this.waiting_res = false
                if (res.data.code === 0) {
                    this.$emit('canNext')
                    this.codeDuring = 60
                } else {
                    this.error_tel = res.data.message
                }
            })
        },
        setTel(tel) {
            this.tel = tel
        }
    }
}
</script>
<style lang="less" scoped>
.title {
    line-height: 2.3rem;
    height: 2.3rem;
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
        line-height: 2.3rem;
        height: 2.3rem;
        -webkit-box-flex: 1;
        flex: 1;
        margin-right: 0.2rem;
    }
    .number {
        -webkit-box-flex: 5;
        flex: 5;
        input {
            width: 100%;
            border: none;
            display: block;
            height: 2.3rem;
            line-height: 2.3rem;
            outline: none;
            padding-left: 0.5rem;
            border-bottom: #dddddd solid 1px;
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
    font-size: 0.8rem;
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
        font-size: 0.9rem;
        text-align: center;
        height: 2.3rem;
        line-height: 2.3rem;
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
