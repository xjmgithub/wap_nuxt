<template>
    <div class="card-input">
        <div class="contains clearfix">
            <input
                class="card"
                type="tel"
                maxlength="13"
                v-model="cardNum"
                :class="{error:error}"
                :placeholder="LANG.please_input_smartcard"
                ref="input"
                @input="changeNum"
                @focus="typing"
                @blur="inputOver"
            >
            <span v-show="cardState" class="card_state" :class="cardState == 'VALID' ? 'program-state-valid' : 'program-state'">
                <span v-if="cardState=='PUNISH_STOP'">{{LANG.dormant}}</span>
                <span v-if="cardState=='PAUSE'">{{LANG.link_suspend}}</span>
                <span v-if="cardState=='VALID'&&stopDays">{{LANG.dvb_acitve_to}} {{stopDays | formatStopDays}}</span>
                <span v-if="cardState=='VALID'&&!stopDays">{{LANG.active_}}</span>
            </span>
            <span class="error-card" :class="{showError:error}">{{LANG.h5_input_card_wrong}}</span>
            <p class="count">
                <span>{{cardLength}}</span> /
                <span>11</span>
            </p>
            <div class="operate">
                <img @click="clearVal" v-show="oriCardNum!=''" src="~assets/img/dvb/delete.png">
            </div>
            <ul class="history" v-show="showList">
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
        let initCard = this.list[0] || ''
        return {
            cardNum: this.formatCard(initCard),
            showList: false,
            error: false,
            cardLength: initCard.length
        }
    },
    computed: {
        oriCardNum() {
            let reg = /^[0-9]*$/
            let tmp = this.cardNum.replace(/\s/g, '')
            return reg.test(tmp) ? tmp : ''
        },
        LANG() {
            return this.$store.state.lang
        },
        newUser() {
            return this.list.length
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
            this.cardState = ''
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
    filters: {
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
