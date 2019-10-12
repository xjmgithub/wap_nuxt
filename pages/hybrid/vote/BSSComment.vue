<template>
    <div ref="page" class="wrapper">
        <div class="container">
            <img src="~assets/img/vote/BSSRegister/bg-comment-img.png" alt="bg-img" />
            <div class="tab-box">
                <div class="tab">
                    <div class="rules" @click="showRule">
                        <p>
                            SHERIA
                            <br />ZA KINA
                        </p>
                        <img src="~assets/img/vote/BSSRegister/ic-rule.png" alt="ic-rule" />
                    </div>
                    <div class="share" @click="toShare('upshare')">
                        <p>SHIRIKI</p>
                        <img src="~assets/img/vote/BSSRegister/ic-share.png" alt="ic-share" />
                    </div>
                </div>
            </div>
            <img src="~assets/img/vote/BSSRegister/bg-comment-rule.png" alt class="ic-green" />
            <img class="text text-one" src="~assets/img/vote/BSSRegister/text4.png" alt />
            <div v-if="isEnd" class="register-end">
                <img src="~assets/img/vote/BSSRegister/ic-end.png" alt />
                <p>SAMAHANI, USAJILI UMEKWISHA</p>
            </div>
            <div v-else class="register-normal">
                <img src="~assets/img/vote/BSSRegister/bg-form-top.png" alt class="form-img" />
                <div v-if="!isEnd" class="registration">
                    <div>
                        <span>
                            JINA
                            <sup class="required">*</sup>
                        </span>
                        <input v-model="name" type="text" :class="{'error-line':name_error}" @input="name_error=false" />
                    </div>
                    <div>
                        <span>
                            JINSIA
                            <sup class="required">*</sup>
                        </span>
                        <select v-model="gender" required :class="{'error-line':gender_error}" @change="gender_error=false">
                            <option value disabled selected class="normal">Tafadhali chagua</option>
                            <option value="male">Kiume</option>
                            <option value="female">Kike</option>
                        </select>
                    </div>
                    <div class="birth-box clearfix">
                        <span>
                            SIKU YA KUZALIWA
                            <sup class="required">*</sup>
                        </span>
                        <select v-model="month" required class="birth" :class="{'error-line':birth_error}" @change="getDay">
                            <option value disabled selected class="normal">Mwezi</option>
                            <option v-for="(item,index) in monthList" :key="index" :value="item">{{item}}</option>
                        </select>
                        <select v-model="year" required class="birth" :class="{'error-line':birth_error}" @change="getMouth">
                            <option value disabled selected class="normal">Mwaka</option>
                            <option v-for="(item,index) in yearList" :key="index" :value="item">{{item}}</option>
                        </select>
                        <select v-model="day" required class="birth" :class="{'error-line':birth_error}" @change="birth_error=false">
                            <option value disabled selected class="normal">Siku</option>
                            <option v-for="(item,index) in dayList" :key="index" :value="item">{{item}}</option>
                        </select>
                    </div>
                    <div>
                        <span>
                            NAMBARI YA SIMU
                            <sup class="required">*</sup>
                        </span>
                        <input v-model="number" type="text" :class="{'error-line':number_error}" @input="number_error=false" />
                    </div>
                    <p v-show="number_error" class="error">Tafadhali ingiza namba ya simu halali</p>
                    <div>
                        <span>
                            MAKAZI YA SASA
                            <sup class="required">*</sup>
                        </span>
                        <select v-model="city" required :class="{'error-line':city_error}" @change="city_error=false">
                            <option value disabled selected class="normal">Tafadhali chagua</option>
                            <option v-for="(item,index) in cityList" :key="index" :value="item">{{item}}</option>
                        </select>
                    </div>
                    <div>
                        <span>
                            KAZI
                            <sup class="required">*</sup>
                        </span>
                        <select v-model="profession" required :class="{'error-line':profession_error}" @change="profession_error=false">
                            <option value disabled selected class="normal">Tafadhali chagua</option>
                            <option v-for="(item,index) in professionList" :key="index" :value="item">{{item}}</option>
                        </select>
                    </div>
                    <div class="submit-btn" :class="{'disabled':!isFinish}" @click="submit()">WASILISHA</div>
                </div>
                <img src="~assets/img/vote/BSSRegister/bg-form-bottom.png" alt class="form-img" />
            </div>
            <div class="share-box">
                <img src="~assets/img/vote/BSSRegister/img-share.png" alt @click="toShare('midshare')" />
            </div>
            <img class="text" src="~assets/img/vote/BSSRegister/text5.png" alt />
            <div class="past-programme">
                <img src="~assets/img/vote/BSSRegister/bg-orange.png" alt />
                <ul class="clearfix">
                    <li v-for="(item,index) in clipsListNew" :key="index">
                        <div @click="toPlayer(item)">
                            <img class="url" :src="cdnPic(item.cover)" />
                        </div>
                        <p class="title">{{item.description}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div v-show="show_rules" class="rules-box">
            <img src="~assets/img/vote/BSSRegister/bg-rule.png" alt />
            <div class="rule-text">
                <p>Je unatamani kuja Studio na kuwa mmoja kati ya majaji wa hadhara? Unataka kuamua mshiriki gani aondoke au abaki?</p>
                <p>Bonyeza usajili wa majaji wa hadhara ili uweze kushiriki.</p>
                <br>
                <p>1. Usajili wa majaji wa hadhara utaanza tarehe 13 Oktoba 2019 mpaka December 8,2019</p>
                <p>2. Taratibu za kushiriki majaji wa hadhara:</p>
                <p>Jaza na ingiza taarifa zako muhimu. Tutachagua washiriki 30 waliobahatika kujiunga na mpango huu kuanzia mchuano wa makundi mpaka fainali.</p>
                <p>*kama utabahatika kushiriki,muwakilishi wa huduma kwa wateja atawasiliana nawe kuchukua taarifa za mwisho za usajili.</p>
                <br>
                <p>Utakua na haki ya kuamua nani atakua Star anayefuata wa Bongo Star Search.</p>
                <p>Ungana nasi kwa nafasi 30 tu kwa kila mchuano wa makundi.</p>
            </div>
            <div class="share-btn" @click="toShare('rule')">SHIRIKI</div>
            <img src="~assets/img/vote/BSSRegister/ic-close.png" alt @click="closeRule" />
        </div>
        <div v-show="show_success" class="success-box">
            <img src="~assets/img/vote/BSSRegister/ic-success.png" alt />
            <div class="success-text">
                <p>USAJILI UMEFANIKIWA!</p>
                <p>Asante kwa kushiriki, tutawachagua washindi wenye bahati kwa ajili ya kurekodi studio. Kama ukiwa ni mmoja wa washindi utajulishwa kwa njia ya simu siku maalumu kipindi kitakaporekodiwa.</p>
            </div>
            <div class="share-btn" @click="closeSuccessPage('submit')">SHIRIKI SASA</div>
            <img src="~assets/img/vote/BSSRegister/ic-close.png" alt @click="closeSuccessPage('close')" />
        </div>
        <div v-show="show_rules||show_success" class="shadow-box" @click="closeRule"></div>
        <mShare />
    </div>
</template>
<script>
import { Base64 } from 'js-base64'
import mShare from '~/components/web/share.vue'
import { cdnPicSrc } from '~/functions/utils'
import { invokeByIframe, downApk, playVodinApp, shareInvite } from '~/functions/app'
export default {
    layout: 'base',
    components: {
        mShare
    },
    data() {
        return {
            appType: this.$store.state.appType || 0,
            name: '',
            gender: '',
            yearList: [],
            monthList: [],
            dayList: [],
            year: '',
            month: '',
            day: '',
            birthday: '',
            number: '',
            city: '',
            cityList: ['Dodoma', 'Dar es salaam', 'Mwanza', 'Arusha', 'Zanzibar', 'Moshi', 'Mbeya', 'Bagamoyo', 'Iringa', 'Mengineyo'],
            profession: '',
            professionList: [
                'Mauzo / Masoko',
                'Uhasibu / Utawala',
                'Mradi / Ubora',
                'IT / Mtandao / Telcom',
                'Mali isiyohamishika / ujenzi',
                'Fedha',
                'Ununuzi / Usafirishaji',
                'Uzalishaji / Utengenezaji',
                'Vyombo vya habari / Sanaa / Ubunifu',
                'Mshauri / kisheria / elimu',
                'Sekta ya Huduma',
                'Nishati / Mazingira',
                'Kilimo',
                'Utafiti wa kisayansi',
                'Kazi ya muda / Mafunzo ya kazi / Nyingine'
            ],
            repeatSub: true,

            name_error: false,
            gender_error: false,
            birth_error: false,
            number_error: false,
            profession_error: false,
            city_error: false,
            canSubmit: false,

            enroll_id: 2,
            vote_id: 16,
            clipsList: [],
            clipsListNew: [],
            loaded: false,
            show_rules: false,
            show_success: false,
            isEnd: false,

            title: 'Bongo Star Search 2019 Public Judge',
            shareTitle: 'Uso kwa uso na Bongo Star!',
            shareText: 'Jisajili kuwa mtoaji wa alama ya ndiyo au hapana,  na utapata nafasi ya kushiriki kwenye shoo!',
            imgUrl: 'http://cdn.startimestv.com/banner/BSSbanner-share.jpeg',
            content: 'Jisajili kuwa mtoaji wa alama ya ndiyo au hapana,  na utapata nafasi ya kushiriki kwenye shoo!'
        }
    },
    computed: {
        // 校验是否填写完整
        isFinish() {
            // name
            if (!this.name.replace(/\s/g, '')) return false
            // gender
            if (!this.gender.replace(/\s/g, '')) return false
            // birthday
            if (typeof this.year == 'string' || typeof this.month == 'string' || typeof this.day == 'string') return false
            // phone
            if (!this.number.replace(/\s/g, '')) return false
            // profession
            if (!this.profession.replace(/\s/g, '')) return false
            // city
            if (!this.city.replace(/\s/g, '')) return false
            return true
        },
        platform() {
            if (this.appType == 1) {
                return 'Android'
            } else if (this.appType == 2) {
                return 'iOS'
            } else {
                return 'web'
            }
        }
    },
    asyncData({ app: { $axios }, store }) {
        return {
            serverTime: new Date().getTime()
        }
    },
    mounted() {
        this.mSendEvLog('page_show', '', '')
        this.getRegisterInfo()
        this.getYear()
        this.getVideoMsg()
    },
    methods: {
        showRule() {
            this.show_rules = true
            // 页面静止
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
        },
        closeRule() {
            this.show_rules = false
            // 页面静止
            document.body.style.overflow = 'auto'
            document.body.style.position = 'static'
        },
        cdnPic(src) {
            return cdnPicSrc.call(this, src)
        },
        // 埋点方法
        mSendEvLog(action, label, value) {
            this.sendEvLog({
                category: 'form_BSSAudReg_' + this.platform,
                action: action,
                label: label,
                value: value
            })
            console.log(action, label, value)
        },
        // 调出分享弹层(app/web)
        toShare(label) {
            if (label == 'rule') this.closeRule()
            this.mSendEvLog('share_click', label, '')
            if (this.appType >= 1) {
                shareInvite(
                    `${window.location.href}?utm_source=REGISTER&utm_medium=BSS&utm_campaign=${this.platform}`,
                    this.shareTitle,
                    this.shareText,
                    this.imgUrl
                )
            } else {
                this.$store.commit('SET_SHARE_STATE', true)
            }
        },
        callOrDownApp() {
            // 唤醒App
            invokeByIframe.call(this, 'com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.href, () => {
                // 下载App
                this.$confirm(
                    'Pakua Startimes ON app na shiriki BSS2019',
                    () => {
                        this.mSendEvLog('downloadpopup_clickok', '', '')
                        downApk.call(this)
                    },
                    () => {
                        this.mSendEvLog('downloadpopup_clicknot', '', '')
                    },
                    'PAKUA',
                    'FUTA'
                )
            })
        },
        // 播放视频方法
        toPlayer(advisor) {
            this.mSendEvLog('video_click', advisor.id, '')
            if (this.appType == 0) {
                this.callOrDownApp()
                return
            }
            if (advisor.link_vod_code) {
                playVodinApp.call(this, this.appType, advisor.link_vod_code)
            }
        },
        // 获取报名活动信息
        getRegisterInfo() {
            this.$axios
                .get(`/voting/enroll/v1/info?enroll_id=${this.enroll_id}`)
                .then(res => {
                    if (res.data.code === 200) {
                        this.startTime = new Date(res.data.data.end_time.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime()
                        this.endTime = new Date(res.data.data.end_time.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime()
                        if (this.serverTime >= this.endTime) {
                            this.isEnd = true
                        }
                    } else {
                        this.$alert('ERROR TO GET RegisterInfo')
                    }
                })
                .catch(err => {
                    this.$alert(err)
                })
        },
        // 获取生日年份
        getYear() {
            for (let i = 0; i < 100; i++) {
                const y = new Date().getFullYear() - i
                this.yearList.push(y)
            }
        },
        // 获取生日月份
        getMouth() {
            this.birth_error = false
            // this.month = []
            this.monthList = []
            for (let i = 1; i < 13; i++) {
                this.monthList.push(i)
            }
        },
        // 获取生日日期
        getDay() {
            this.birth_error = false
            this.dayList = []
            this.month = parseInt(this.month, 10)
            const day = new Date(this.year, this.month, 0).getDate()
            for (let i = 1; i <= day; i++) {
                this.dayList.push(i)
            }
        },
        // 校验是否符合要求
        checkForm() {
            this.canSubmit = true
            if (!this.isFinish) {
                this.canSubmit = false
            }
            // name
            if (!this.name.replace(/\s/g, '') || this.name.length > 100) {
                this.canSubmit = false
                this.name_error = true
            }
            // gender
            if (!this.gender.replace(/\s/g, '')) {
                this.canSubmit = false
                this.gender_error = true
            }

            // birthday
            if (typeof this.year == 'string' || typeof this.month == 'string' || typeof this.day == 'string') {
                this.canSubmit = false
                this.birth_error = true
            } else {
                this.birthday =
                    this.year +
                    '-' +
                    (this.month.toString().length <= 1 ? '0' + this.month : this.month) +
                    '-' +
                    (this.day.toString().length <= 1 ? '0' + this.day : this.day)
                if (new Date() < new Date(this.birthday)) {
                    this.canSubmit = false
                    this.birth_error = true
                }
            }

            // phone
            if (!this.number.replace(/\s/g, '') || !/^[0-9,+]\d{8,}$/.test(this.number)) {
                this.canSubmit = false
                this.number_error = true
            }
            // profession
            if (!this.profession.replace(/\s/g, '')) {
                this.canSubmit = false
                this.profession_error = true
            }
            // city
            if (!this.city.replace(/\s/g, '')) {
                this.canSubmit = false
                this.city_error = true
            }
        },

        // 提交表单
        submit() {
            this.checkForm()
            if (!this.canSubmit) {
                this.mSendEvLog('submit_click', '', '2')
            }
            if (this.canSubmit && this.repeatSub) {
                this.repeatSub = false
                const options = {
                    fk_enroll: this.enroll_id,
                    name: this.name,
                    sex: this.gender == 'male' ? 1 : 2,
                    birthday: this.birthday,
                    phone: this.number,
                    address: this.city,
                    profession: this.profession
                }
                this.$axios
                    .post('voting/enroll/v1/register', options)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.mSendEvLog('submit_click', '', '1')
                            this.show_success = true
                        } else {
                            // 服务器返回不为200时
                            this.mSendEvLog('submit_click', '', '3')
                            this.$alert(res.data.data)
                            this.repeatSub = true
                        }
                    })
                    .catch(err => {
                        // 异常情况
                        this.mSendEvLog('submit_click', '', '0')
                        this.$alert(err)
                        this.repeatSub = true
                    })
            }
        },
        closeSuccessPage(lable) {
            if (lable == 'submit') {
                this.toShare(lable)
            }
            this.name = ''
            this.gender = ''
            this.yearList = []
            this.monthList = []
            this.dayList = []
            this.year = ''
            this.month = ''
            this.day = ''
            this.birthday = ''
            this.number = ''
            this.profession = ''
            this.city = ''
            this.getYear()
            this.show_success = false
            this.repeatSub = true
        },
        getVideoMsg() {
            // 获取投票单元数据
            this.$axios.get(`/voting/v1/program?vote_id=${this.vote_id}`).then(res => {
                if (res.data.code === 0) {
                    this.clipsList = res.data.data
                    this.clipsList.forEach(item => {
                        if (item.name.substr(0, 1) == 'b') {
                            this.clipsListNew.push(item)
                        }
                    })
                    this.clipsListNew.forEach(item => {
                        this.mSendEvLog('video_show', item.id, '')
                    })
                }
            })
        }
    },

    head() {
        return {
            title: this.title,
            meta: [
                { name: 'description', property: 'description', content: this.content },
                { name: 'og:description', property: 'og:description', content: this.content },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: this.imgUrl
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: this.shareTitle },
                {
                    name: 'al:android:url',
                    property: 'al:android:url',
                    content:
                        'starvideo://platformapi/webtoapp?channel=facebook&target=' +
                        Base64.encode(
                            `com.star.mobile.video.activity.BrowserActivity?loadUrl=http://m.startimestv.com/hybrid/vote/BSSComment`.replace(
                                /&/g,
                                '**'
                            )
                        )
                },
                { name: 'al:android:app_name', property: 'al:android:app_name', content: 'StarTimes' },
                { name: 'al:android:package', property: 'al:android:package', content: 'com.star.mobile.video' },
                { name: 'al:web:url', property: 'al:web:url', content: 'http://m.startimestv.com' }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/vote/normal.less';
.wrapper {
    background-image: url('~assets/img/vote/BSSRegister/bg-yellow.jpg');
    background-size: contain;
    background-repeat: repeat-y;
    font-size: 0.9rem;
    letter-spacing: -0.03rem;
    position: static;
    .container {
        > img {
            display: block;
            margin: 0 auto;
            padding-top: 0.5rem;
            width: 95%;
            height: auto;
            &.ic-green {
                width: 90%;
                padding-top: 0;
                position: relative;
                top: -0.3rem;
            }
        }
        .tab-box {
            width: 100%;
            height: 2.2rem;
            position: relative;
            z-index: 1;
            .tab {
                width: 100%;
                position: absolute;
                color: #fff;
                top: -1rem;
                left: 0;
                height: 4rem;
                // line-height: 3.8rem;
                .rules {
                    width: 7rem;
                    float: left;
                    background: url('~assets/img/vote/BSSRegister/bg-ruleb.png') no-repeat;
                    background-size: 7rem 4rem;
                    text-align: left;
                    padding-left: 0.5rem;
                    position: relative;
                    line-height: 4rem;
                    p {
                        display: block;
                        height: 4rem;
                        padding: 1rem 0 1.2rem;
                        line-height: 0.9rem;
                    }
                    img {
                        width: 1rem;
                        height: auto;
                        position: absolute;
                        left: 4.1rem;
                        top: 1.2rem;
                    }
                }
                .share {
                    width: 7rem;
                    float: right;
                    background: url('~assets/img/vote/BSSRegister/bg-shareb.png') no-repeat;
                    background-size: 7rem 4rem;
                    text-align: right;
                    padding-right: 0.5rem;
                    position: relative;
                    line-height: 3.8rem;
                }
                img {
                    width: 1rem;
                    height: auto;
                    position: absolute;
                    right: 4.1rem;
                    top: 1.5rem;
                }
            }
        }
        .text {
            width: 100%;
            display: block;
            &.text-one {
                padding-top: 1rem;
            }
        }
        .register-normal {
            > img {
                display: block;
                margin: 0 auto;
                &.form-img {
                    &:first-child {
                        padding-top: 0.5rem;
                        position: relative;
                        top: 2px;
                    }
                    &:last-child {
                        padding-bottom: 0.5rem;
                        position: relative;
                        top: -2px;
                    }
                    width: 90%;
                }
            }
            .registration {
                width: 90%;
                margin: 0 auto;
                padding: 0.5rem 5% 2rem;
                color: #36ad5e;
                background-color: #fff;
                .error {
                    color: #ff336e;
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                }
                div {
                    margin: 0 auto;
                    position: relative;
                    span,
                    input,
                    select {
                        width: 100%;
                        height: 2rem;
                        text-align: left;
                        line-height: 2rem;
                        margin: 0 auto;
                    }
                    span {
                        display: block;
                        .required {
                            color: #ff336e;
                            position: relative;
                            top: 0.2rem;
                        }
                    }
                    input,
                    select {
                        line-height: 2rem;
                        border: 1px solid transparent;
                        background-color: #f2f0f1;
                        padding: 0 0.6rem;
                        color: #666;
                        outline: none;
                        border-radius: 0.2rem;
                        &.error-line {
                            border: 1px solid #ff336e;
                            background-image: url('~assets/img/vote/BSSRegister/ic-error.png');
                            background-size: 0.8rem 0.8rem;
                            background-position: 98% 0.5rem;
                        }
                    }
                    select {
                        background-image: url('~assets/img/vote/ic-select.png');
                        background-size: 0.7rem 0.4rem;
                        background-position: 98% 0.8rem;
                        appearance: none;
                        -webkit-apperance: none;
                        -moz-appearance: none;
                        .normal {
                            display: none;
                        }
                        &:invalid {
                            color: #bcbcbc;
                        }
                    }
                    &.birth-box {
                        height: 4rem;
                        position: relative;
                        .birth {
                            width: 30%;
                            position: absolute;
                            background-position: 93% 0.8rem;
                            &.error-line {
                                background-position: 93% 0.5rem;
                            }
                            &:first-child {
                                left: 0;
                            }
                            &:nth-child(2) {
                                left: 0;
                                right: 0;
                            }
                            &:last-child {
                                right: 0;
                            }
                        }
                    }
                }
                .submit-btn {
                    width: 14rem;
                    border-radius: 0.2rem;
                    color: #ffffff;
                    text-align: center;
                    margin: 0 auto;
                    height: 2.2rem;
                    line-height: 2.2rem;
                    margin-top: 2.5rem;
                    font-size: 1rem;
                    background: url('~assets/img/vote/BSSRegister/bg-btn.png') no-repeat;
                    background-size: contain;
                    &.disabled {
                        background: #d1d1d1;
                    }
                }
            }
        }
        .register-end {
            width: 90%;
            height: 11.5rem;
            border-radius: 0.2rem;
            text-align: center;
            background-color: #fff;
            color: #8f8f8f;
            font-size: 1rem;
            margin: 1rem auto;
            padding: 2rem 0;
            img {
                width: 4.5rem;
                height: 4.5rem;
                margin: 0 auto 2rem;
            }
        }
        .share-box {
            > img {
                display: block;
                width: 90%;
                margin: 0 auto 0.5rem;
            }
        }
        .past-programme {
            margin: 1rem auto 0;
            width: 90%;
            padding-bottom: 1rem;
            img {
                width: 100%;
                display: block;
            }
            ul {
                width: 100%;
                background-color: #e98005;
                border-radius: 0.2rem;
                padding: 1rem 3% 0.5rem;
                li {
                    float: left;
                    width: 48.5%;
                    &:nth-child(2n) {
                        float: right;
                    }
                    div {
                        position: relative;
                        width: 100%;
                        .url {
                            width: 100%;
                            height: 100%;
                            border-radius: 0.3rem;
                            position: absolute;
                            top: 0;
                        }
                        &:before {
                            content: '';
                            display: inline-block;
                            padding-bottom: 62%;
                            width: 0.1px;
                            vertical-align: middle;
                        }
                    }
                    .title {
                        margin: 0.5rem 0;
                        width: 100%;
                        height: 2rem;
                        line-height: 1rem;
                        color: #fff;
                        font-size: 0.75rem;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                    }
                }
            }
        }
    }
    .rules-box {
        width: 17rem;
        height: 26rem;
        position: fixed;
        overflow: hidden;
        top: 50%;
        left: 50%;
        margin-left: -8.5rem;
        margin-top: -13rem;
        z-index: 999;
        img {
            &:first-child {
                width: 100%;
                display: block;
            }
            &:last-child {
                width: 10%;
                display: block;
                margin: 1.5rem auto 0;
            }
        }
        .rule-text {
            width: 15rem;
            height: 14.5rem;
            color: #1b9145;
            position: absolute;
            left: 1rem;
            top: 4rem;
            padding: 0.5rem;
            overflow-x: hidden;
            overflow-y: scroll;
            // div {
            //     &::-webkit-scrollbar {
            //         display: none;
            //     }
            // }
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .share-btn {
            width: 8rem;
            height: 1.8rem;
            text-align: center;
            line-height: 1.8rem;
            color: #fff;
            background-image: url('~assets/img/vote/BSSRegister/btn-success.png');
            background-size: 8rem 1.8rem;
            position: absolute;
            left: 4.5rem;
            top: 19.2rem;
            border-radius: 0.2rem;
        }
    }
    .success-box {
        width: 80%;
        height: 16rem;
        background-color: #fff;
        position: fixed;
        top: 50%;
        left: 10%;
        margin-top: -10rem;
        z-index: 999;
        text-align: center;
        border-radius: 0.2rem;
        img {
            &:first-child {
                width: 4rem;
                margin: 1.5rem auto 0.5rem;
                display: block;
            }
            &:last-child {
                width: 10%;
                display: block;
                margin: 2.5rem auto 0;
            }
        }
        .success-text {
            width: 100%;
            height: 8rem;
            color: #1b9145;
            // background-color:red;
            padding: 0.5rem;
            margin: 0 auto;
            p {
                &:first-child {
                    font-size: 1.2rem;
                    color: #333;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                }
                &:last-child {
                    color: #666;
                }
            }
        }
        .share-btn {
            width: 60%;
            margin: 0 auto;
            height: 2rem;
            line-height: 2rem;
            border-radius: 0.2rem;
            background-color: #ff892a;
            color: #fff;
        }
    }
    .shadow-box {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0.5;
        background-color: #000;
        z-index: 998;
    }
    .alert {
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: #8150fc;
        border-radius: 2px;
        overflow: hidden;
        zoom: 1;
        z-index: 1001;
        width: 17rem;
        height: 10rem;
        margin-top: -5rem;
        margin-left: -8.5rem;
        padding: 1.5rem 1.2rem 1rem;
        color: #fff;
        font-size: 1rem;
        text-align: center;
        .alert-default {
            line-height: 1.3rem;
            padding-bottom: 0.5rem;
            height: 5.5rem;
        }
        .alert-footer .btn {
            width: auto;
            height: 2rem;
            line-height: 2rem;
            text-align: center;
            border-radius: 1rem;
            font-size: 0.9rem;
            &.sure {
                float: right;
                color: #965500;
                background-color: #f0c846;
                margin-right: 0.5rem;
            }
            &.close {
                float: left;
                color: #d7d4fe;
                background-color: #a099fd;
                margin-left: 0.5rem;
            }
        }
    }
    .vote-toast {
        position: fixed;
        left: 50%;
        top: 50%;
        margin-left: -7.5rem;
        margin-top: -1.7rem;
        font-size: 0.9rem;
        background: rgba(0, 0, 0, 0.65);
        padding: 0.6rem 1.5rem;
        border-radius: 3px;
        width: 15rem;
        height: 3.4rem;
        color: #fff;
        z-index: 9999;
    }
}
</style>
