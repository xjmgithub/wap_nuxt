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
