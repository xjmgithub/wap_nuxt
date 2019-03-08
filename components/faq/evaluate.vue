<template>
    <div class="evaluation">
        <p class="eval-title">
            Does this Custom-Service help you solve the problem?
        </p>
        <div class="eval-img">
            <span @click="setAgree(0)">
                <img v-if="agree" src="~assets/img/faq/ic_happy_sl_green.png">
                <img v-if="!agree" src="~assets/img/faq/ic_happy_def_g.png">
                YES
            </span>
            <span @click="setAgree(1)">
                <img v-if="disagree" src="~assets/img/faq/ic_disappoint_sl_red.png">
                <img v-if="!disagree" src="~assets/img/faq/ic_disappoint_def_g.png">
                NO
            </span>
        </div>
        <div class="gave-star">
            <p>Please evaluate for us? THX.</p>
            <template v-for="(item,index) in 5">
                <img :key="index" v-if="index<score" @click="starToBlue(index)" src="~assets/img/faq/ic_favoritez_blue_evl.png">
                <img :key="index" v-if="index>=score" @click="starToBlue(index)" src="~assets/img/faq/ic_favorite_def_evl.png">
            </template>
        </div>
        <mbutton :disabled="!canSubmit" v-show="!ended" @click="submit" />
    </div>
</template>
<script>
import mbutton from '~/components/button'
export default {
    components: {
        mbutton
    },
    props: {
        serviceRecord: {
            type: Number,
            require: true,
            default: 0
        }
    },
    data() {
        return {
            agree: false,
            disagree: false,
            score: 0,
            ended: false
        }
    },
    computed: {
        canSubmit() {
            return (this.agree || this.disagree) && this.score
        }
    },
    methods: {
        submit() {
            if (this.serviceRecord) {
                const type = this.agree ? 1 : 0
                this.$axios.post(`/css/v1/service/evaluation/${this.serviceRecord}?whether_to_solve=${type}&grade=${this.score}`).then(res => {
                    if (res.data.code === 200) {
                        this.ended = true
                    }
                })
            }
        },
        setAgree(type) {
            if (!this.ended) {
                if (type) {
                    this.disagree = true
                    this.agree = false
                } else {
                    this.agree = true
                    this.disagree = false
                }
            }
        },
        starToBlue(index) {
            if (!this.ended) {
                this.score = index + 1
            }
        }
    }
}
</script>
