<template>
    <div class="email-cont">
        <div class="input-email" :class="{focus:focus_email,error:error_email}">
            <div class="number">
                <input
                    type="email"
                    v-model="email"
                    @focus="focus_email=true"
                    @blur="focus_email=false"
                    placeholder="Enter your email address"
                >
            </div>
            <div class="error" v-show="error_email">{{error_email}}</div>
        </div>
        <div class="get-code">
            <div
                class="btn"
                :class="{disabled:!canGetCode}"
                @click="getCode"
            >{{codeDuring>0?`${codeDuring}s`:'Get Code'}}</div>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
export default {
    props: {
        type: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            email: '',
            focus_email: false,
            error_email: '',
            codeDuring: 0
        }
    },
    watch: {
        email(nv, ov) {
            this.error_email = ''
        }
    },
    mounted() {
        let _this = this
        this.timer = setInterval(() => {
            _this.codeDuring--
        }, 1000)
    },
    computed: {
        canGetCode() {
            let reg_email = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/
            return reg_email.test(this.email) && this.codeDuring <= 0
        }
    },
    methods: {
        getCode() {
            if (!this.canGetCode) return false
            this.$axios
                .get(`/ums/v1/register/password/change?email=${this.email}`, {
                    headers: {
                        token: this.$store.state.token
                    }
                })
                .then(res => {
                    if (res.data.code == 0) {
                        this.codeDuring = 60
                    } else {
                        this.error_email = 'Please confirm you have entered the right email.'
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
.email-cont {
    padding-top: 2.5rem;
}
.input-email {
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
        -webkit-box-flex: 1;
        flex: 1;
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
                font-size: 0.5rem;
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
.get-code {
    display: flex;
    margin: 1.5rem 0;
    position: relative;
    input {
        display: block;
        flex: 2.6;
        border: none;
        border-bottom: #dddddd solid 1px;
        &.focus {
            border-bottom: #0087eb solid 1px;
        }
        &.error {
            border-bottom: red solid 1px;
        }
        &::-webkit-input-placeholder {
            font-size: 0.5rem;
        }
        outline: none;
        margin-right: 0.5rem;
    }

    .btn {
        flex: 1;
        max-width: 10rem;
        background: #0087eb;
        color: white;
        font-size: 0.8rem;
        text-align: center;
        height: 2rem;
        line-height: 2rem;
        cursor: pointer;
        &.disabled {
            background: #dddddd;
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