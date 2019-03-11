<template>
    <div class="card-input">
        <div class="contains clearfix">
            <input
                ref="input"
                v-model="cardNum"
                :class="{error:error}"
                :placeholder="LANG.please_input_smartcard"
                @input="changeNum"
                @focus="typing"
                @blur="inputOver"
                class="card"
                type="tel"
                maxlength="13"
            >
            <span v-show="!error" :class="cardState === 'VALID' ? 'program-state-valid' : 'program-state'" class="card_state">
                <span>{{cardStateDes}}</span>
            </span>
            <span :class="{showError:error}" class="error-card">{{LANG.h5_input_card_wrong}}</span>
            <p class="count">
                <span>{{cardLength}}</span> /
                <span>11</span>
            </p>
            <div class="operate">
                <img @click="clearVal" v-show="oriCardNum!=''" src="~assets/img/dvb/delete.png">
            </div>
            <ul v-show="showList" class="history">
                <li v-for="(item,index) in list" @click="choose(index)" :key="index">{{ formatCard(item) }}</li>
            </ul>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
    props: {
        cardState: {
            type: String,
            default: ''
        },
        stopDays: {
            type: String,
            default: ''
        },
        list: {
            type: Array,
            default: () => []
        }
    },
    data() {
        const initCard = this.list[0] || ''
        return {
            cardNum: this.formatCard(initCard),
            showList: false,
            error: false,
            cardLength: initCard.length
        }
    },
    computed: {
        oriCardNum() {
            const reg = /^[0-9]*$/
            const tmp = this.cardNum.replace(/\s/g, '')
            return reg.test(tmp) ? tmp : ''
        },
        cardStateDes() {
            if (this.oriCardNum.length < 11) return ''
            switch (this.cardState) {
                case 'VALID':
                    return this.stopDays ? this.LANG.dvb_acitve_to + this.formatStopDays(this.stopDays) : this.LANG.active_
                case 'PUNISH_STOP':
                    return this.LANG.dormant
                case 'PAUSE':
                    return this.LANG.link_suspend
                default:
                    return ''
            }
        },
        LANG() {
            return this.$store.state.lang
        },
        newUser() {
            return this.list.length
        }
    },
    watch: {
        oriCardNum(val, oldVal) {
            this.cardLength = val.length
            this.error = false

            if (val.length <= 0) {
                this.showList = true
            } else {
                this.showList = false
            }

            if (val.length >= 11) this.inputOver()
        }
    },
    mounted() {
        if (this.oriCardNum.length > 0) {
            this.inputOver()
        }
    },
    methods: {
        inputOver() {
            this.$emit('endInput', this.oriCardNum)
        },
        changeNum() {
            this.cardNum = this.formatCard(this.oriCardNum)
        },
        formatCard(str) {
            return str.replace(/(^\d{3}\B|\d{4}\B)/g, '$1 ')
        },
        clearVal() {
            this.cardNum = ''
        },
        typing() {
            this.$emit('typing')
        },
        choose(index) {
            this.cardNum = this.formatCard(this.list[index])
            this.inputOver()
        },
        showError() {
            this.error = true
        },
        focusInput() {
            this.$nextTick(function() {
                document.querySelector('input.card').focus()
            })
        },
        formatStopDays(str) {
            return dayjs(str).format('MMM DD YYYY') || ''
        }
    }
}
</script>
<style lang="less" scoped>
.card-input {
    padding-top: 2rem;
    .contains {
        position: relative;
    }
    input {
        &.card {
            width: 100%;
            outline-style: none;
            border: none;
            border-bottom: 2px solid #dddddd;
            font-size: 1.3rem;
            padding-bottom: 1.2rem;
            margin-bottom: 0.3rem;
            background-color: transparent;
            font-weight: bold;
            &.error {
                border-bottom: 2px solid red;
            }
        }
        &::-webkit-input-placeholder {
            font-size: 0.95rem;
            color: #bdbdbd;
            font-weight: normal;
        }
    }
    .card_state {
        font-size: 0.8rem;
        font-weight: bold;
        position: absolute;
        top: 1.7rem;
        left: 0;
        &.program-state-valid {
            color: #008be9;
        }
        &.program-state {
            color: #f00;
        }
    }
    .error-card {
        color: red;
        font-size: 0.9rem;
        display: none;
        &.showError {
            display: block;
        }
    }
    .count {
        color: #9b9b9b;
        float: right;
        font-size: 0.9rem;
    }
    .operate {
        position: absolute;
        width: 1.6rem;
        right: 0;
        top: 0;
        img {
            width: 100%;
        }
    }
    .history {
        padding: 0;
        margin: 0;
        width: 100%;
        position: absolute;
        background: white;
        z-index: 100;
        box-shadow: 0px 2px 2px #909090;
        padding-left: 0.3rem;
        top: 2.8rem;
        li {
            list-style: none;
            padding: 0.4rem 0;
            font-size: 1.1rem;
        }
    }
}
</style>
