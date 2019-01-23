<template>
    <div class="wrapper">
        <div v-show="!isDone && !isSucessed && initLoading">
            <div class="description">
                <p>Dear users of StarTimes ON, thanks for your participation in advance. Your feedback is important to us!</p>
                <p>This survey is purely intended to help improve the users’ experience with StarTimes ON; all information collected here will be protected and will never be shared with others.</p>
                <p>Thanks again!</p>
            </div>
            <div class="content">
                <div class="question">
                    <div v-for="(item, index) in naireList" :key="index">
                        <p :id="'question-'+index">{{item.question}}</p>
                        <RadioNaire :radio-list="item.answer" @pick="changeItem($event,index)"/>
                    </div>
                </div>
                <mButton @click="submit" :text="'SUBMIT'" class="submit"/>
            </div>
            <div class="loadlayer" v-show="loaded">
                <loading/>
            </div>
        </div>
        <div v-show="isDone && initLoading " class="done">
            <img src="~assets/img/naire/done.png" alt>
            <p>You have already submitted. Thank you again.</p>
            <mButton v-if="appType==1" @click="ok" :text="'OK'" class="ok"/>
        </div>
        <div v-show="isSucessed" class="success">
            <img src="~assets/img/naire/success.png" alt>
            <p>Thank you for your participation and have a nice day!</p>
            <mButton v-if="appType==1" @click="ok" :text="'OK'" class="ok"/>
        </div>
    </div>
</template>
<script>
import RadioNaire from '~/components/radioNaire'
import mButton from '~/components/button'
import loading from '~/components/loading'
import qs from 'qs'

export default {
    layout: 'base',
    data() {
        return {
            appType: this.$store.state.appType,
            naireList: [
                {
                    question: '1. Your Gender please?',
                    answer: [
                        {
                            code: 'A',
                            value: 'A. Male',
                            name: 'gender'
                        },
                        {
                            code: 'B',
                            value: 'B. Female',
                            name: 'gender'
                        }
                    ]
                },
                {
                    question: '2. Your Age please?',
                    answer: [
                        {
                            code: 'A',
                            value: 'A. <18',
                            name: 'age'
                        },
                        {
                            code: 'B',
                            value: 'B. 18-24',
                            name: 'age'
                        },
                        {
                            code: 'C',
                            value: 'C. 25-29',
                            name: 'age'
                        },
                        {
                            code: 'D',
                            value: 'D. 30-34',
                            name: 'age'
                        },
                        {
                            code: 'E',
                            value: 'E. 35-44',
                            name: 'age'
                        },
                        {
                            code: 'F',
                            value: 'F. >45',
                            name: 'age'
                        }
                    ]
                },
                {
                    question: '3. How did you learn about StarTimes ON?',
                    answer: [
                        {
                            code: 'A',
                            value: 'A. Google Search',
                            name: 'download'
                        },
                        {
                            code: 'B',
                            value: 'B. GooglePlay',
                            name: 'download'
                        },
                        {
                            code: 'C',
                            value: 'C. TV Ads.',
                            name: 'download'
                        },
                        {
                            code: 'D',
                            value: 'D. Recommendation from friends',
                            name: 'download'
                        },
                        {
                            code: 'E',
                            value: 'E. StarTimes Facebook Homepage',
                            name: 'download'
                        },
                        {
                            code: 'F',
                            value: 'F. Others',
                            name: 'download'
                        }
                    ]
                },
                {
                    question: '4. How do you like our video contents?',
                    answer: [
                        {
                            code: 'A',
                            value: 'A. Very much',
                            name: 'contents'
                        },
                        {
                            code: 'B',
                            value: 'B. Just so so',
                            name: 'contents'
                        },
                        {
                            code: 'C',
                            value: 'C. Not at all',
                            name: 'contents'
                        },
                        {
                            code: 'D',
                            value: 'D. I don’t know',
                            name: 'contents'
                        }
                    ]
                },
                {
                    question: '5. Have you ever paid in the App?',
                    answer: [
                        {
                            code: 'A',
                            value: 'A. Yes, I have',
                            name: 'paid'
                        },
                        {
                            code: 'B',
                            value: 'B. No, never',
                            name: 'paid'
                        },
                        {
                            code: 'C',
                            value: 'C. I don’t know there is some content I need pay to watch in this App',
                            name: 'paid'
                        }
                    ]
                },
                {
                    question: '6. How do you rate the interaction experience of this App?',
                    answer: [
                        {
                            code: 'A',
                            value: 'A. Very good',
                            name: 'interaction'
                        },
                        {
                            code: 'B',
                            value: 'B. Good',
                            name: 'interaction'
                        },
                        {
                            code: 'C',
                            value: 'C. Just OK',
                            name: 'interaction'
                        },
                        {
                            code: 'D',
                            value: 'D. Bad',
                            name: 'interaction'
                        },
                        {
                            code: 'E',
                            value: 'E. Very Bad',
                            name: 'interaction'
                        }
                    ]
                },
                {
                    question: '7. How do you like this App generally?',
                    answer: [
                        {
                            code: 'A',
                            value: 'A. Very much',
                            name: 'like'
                        },
                        {
                            code: 'B',
                            value: 'B. Just so so',
                            name: 'like'
                        },
                        {
                            code: 'C',
                            value: 'C. Not at all',
                            name: 'like'
                        },
                        {
                            code: 'D',
                            value: 'D. I don’t know',
                            name: 'like'
                        }
                    ]
                },
                {
                    question: '8. Will you recommend this App to your friends?',
                    answer: [
                        {
                            code: 'A',
                            value: 'A. Definitely',
                            name: 'recommend'
                        },
                        {
                            code: 'B',
                            value: 'B. Maybe',
                            name: 'recommend'
                        },
                        {
                            code: 'C',
                            value: 'C. No Way!',
                            name: 'recommend'
                        }
                    ]
                }
            ],
            loaded: false,
            isDone: false,
            isSucessed: false,
            initLoading: false,
            openTime: '',
            answers1: '',
            answers2: '',
            answers3: '',
            answers4: '',
            answers5: '',
            answers6: '',
            answers7: '',
            answers8: ''
        }
    },
    mounted() {
        this.sendEvLog({
            category: 'questionnaire',
            action: 'init',
            label: 6,
            value: 1
        })

        this.openTime = new Date().getTime()
        let s = navigator.userAgent.indexOf('Android')
        let w = navigator.userAgent.substr(s + 8).split(';')[0]
        let tag = 1
        history.pushState({}, 'Survey', '#')
        window.addEventListener('popstate', () => {
            let submitTime = new Date().getTime()
            if ('' + w < '4.5' && tag) {
                tag = 0
                return false
            }
            if (!this.isSucessed && !this.isDone) {
                let timediff = submitTime - this.openTime
                this.sendEvLog({
                    category: 'questionnaire',
                    action: 'back',
                    label: 6,
                    value: 0,
                    timediff: timediff,
                    answers1: this.answers1,
                    answers2: this.answers2,
                    answers3: this.answers3,
                    answers4: this.answers4,
                    answers5: this.answers5,
                    answers6: this.answers6,
                    answers7: this.answers7,
                    answers8: this.answers8
                })
            }
            window.getChannelId && window.getChannelId.finish()
        })
        this.$axios({
            url: `/voting/v1/questionnaire/has_submitted?questionnaire_id=6`,
            method: 'get',
            data: {}
        })
            .then(res => {
                if (res.data.code == 0) {
                    this.isDone = res.data.data
                    this.initLoading = true
                    this.sendEvLog({
                        category: 'questionnaire',
                        action: 'show',
                        label: 6,
                        value: res.data.data ? 1 : 0
                    })
                } else {
                    this.$alert(
                        'Load error,please try reload',
                        () => {
                            window.location.reload()
                        },
                        'RELOAD'
                    )
                    this.sendEvLog({
                        category: 'questionnaire',
                        action: 'error',
                        label: 6,
                        value: res.data.code
                    })
                }
            })
            .catch(err => {
                this.$alert(
                    'Load error,please try reload',
                    () => {
                        window.location.reload()
                    },
                    'RELOAD'
                )
                this.sendEvLog({
                    category: 'questionnaire',
                    action: 'error',
                    label: 6,
                    value: 'voting api error'
                })
            })
    },
    methods: {
        changeItem(data, index) {
            switch (index) {
                case 0:
                    this.answers1 = data
                    break
                case 1:
                    this.answers2 = data
                    break
                case 2:
                    this.answers3 = data
                    break
                case 3:
                    this.answers4 = data
                    break
                case 4:
                    this.answers5 = data
                    break
                case 5:
                    this.answers6 = data
                    break
                case 6:
                    this.answers7 = data
                    break
                case 7:
                    this.answers8 = data
                    break
            }
        },
        submit() {
            let canSubmit = true
            try {
                this.allAnswer.forEach((ele, index) => {
                    if (ele == '') {
                        canSubmit = false
                        this.$alert('Please answer all questions before you submit.', () => {
                            document.querySelector('#question-' + index).scrollIntoView(true)
                        })
                        throw new Error('EndIterative')
                    }
                })
            } catch (e) {
                if (e.message != 'EndIterative') throw e
            }
            if (!canSubmit) return
            this.loaded = true
            let submitTime = new Date().getTime()
            let timediff = submitTime - this.openTime
            this.$axios({
                url: `/voting/v1/questionnaire/submit_flag`,
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                timeout: 20000,
                data: qs.stringify({
                    questionnaire_id: 6
                })
            })
                .then(res => {
                    if (res.data.code == 0 && res.data.message == 'success') {
                        this.isSucessed = true
                        this.loaded = false
                    }
                    this.sendEvLog({
                        category: 'questionnaire',
                        action: 'submit',
                        label: 6,
                        value: this.isSucessed ? 1 : 0,
                        timediff: timediff,
                        answers1: this.answers1,
                        answers2: this.answers2,
                        answers3: this.answers3,
                        answers4: this.answers4,
                        answers5: this.answers5,
                        answers6: this.answers6,
                        answers7: this.answers7,
                        answers8: this.answers8
                    })
                })
                .catch(err => {
                    this.sendEvLog({
                        category: 'questionnaire',
                        action: 'submit',
                        label: 6,
                        value: 0,
                        timediff: timediff,
                        answers1: this.answers1,
                        answers2: this.answers2,
                        answers3: this.answers3,
                        answers4: this.answers4,
                        answers5: this.answers5,
                        answers6: this.answers6,
                        answers7: this.answers7,
                        answers8: this.answers8
                    })
                    this.$alert('Network  error!', () => {
                        this.loaded = false
                    })
                })
        },
        ok() {
            this.sendEvLog({
                category: 'questionnaire',
                action: 'back',
                label: 6,
                value: this.isDone || this.isSucessed ? 1 : 0
            })
            window.getChannelId && window.getChannelId.finish()
        }
    },
    computed: {
        allAnswer() {
            return [this.answers1, this.answers2, this.answers3, this.answers4, this.answers5, this.answers6, this.answers7, this.answers8]
        }
    },
    components: {
        RadioNaire,
        loading,
        mButton
    },
    head() {
        return {
            title: 'Survey'
        }
    }
}
</script>
<style lang="less" scoped>
.btnStyle {
    color: #0087eb;
    background-color: #fff;
    width: 80%;
    font-weight: bold;
    margin: 1.5rem auto 0;
}
.okPage {
    background-color: #1657d7;
    color: #fff;
    font-size: 1rem;
    text-align: center;
    min-height: 100%;
    width: 100%;
    padding-bottom: 2rem;
    border-top: 1px solid #1657d7;
    img {
        width: 80%;
        display: block;
        margin: 5rem auto 3rem;
    }
    p {
        width: 70%;
        margin: 0 auto 3rem;
        font-size: 1.1rem;
    }
    .ok {
        .btnStyle;
    }
}
.wrapper {
    height: 100%;
    margin: 0 auto;
    width: 100%;
    .description {
        text-align: left;
        padding: 1.5rem 1rem;
        background: url('~assets/img/naire/header_bg.png') no-repeat;
        background-color: #1657d7;
        background-size: 100%;
        color: #fff;
    }
    .content {
        padding: 0 1rem 1rem;
        background-color: #1657d7;
        .question {
            background-color: #fff;
            padding: 1rem;
            border-radius: 10px;
            p {
                color: #333333;
                margin-top: 0.8rem;
                font-weight: bold;
            }
            span {
                color: #666666;
                font-weight: normal;
            }
        }
        .submit {
            .btnStyle;
        }
    }
    .done {
        .okPage;
    }
    .success {
        .okPage;
    }
}
.loadlayer {
    background: rgba(10, 52, 82, 0.46);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
}
</style>

