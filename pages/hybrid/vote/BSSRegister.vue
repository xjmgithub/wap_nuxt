<template>
    <div ref="page" class="wrapper">
        <div class="container">
            <img src="~assets/img/vote/BSSRegister/bg-img.png" alt="bg-img" />
            <div class="tab-box">
                <div class="tab">
                    <div class="rules" @click="show_rules=true">
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
            <img class="text" src="~assets/img/vote/BSSRegister/text-one.png" alt />
            <img src="~assets/img/vote/BSSRegister/bg-form-top.png" alt class="form-img" />
            <img src="~assets/img/vote/BSSRegister/rule-img.png" alt class="form-img rule-img" />
            <div class="registration">
                <div>
                    <span>
                        JINA
                        <sup class="required">*</sup>
                    </span>
                    <input v-model="name" type="text" />
                </div>
                <p v-show="name.length>100" class="error">Please enter less than 100 characters.</p>
                <div>
                    <span>
                        JINSIA
                        <sup class="required">*</sup>
                    </span>
                    <select v-model="gender" required>
                        <option value="male">male</option>
                        <option value="female">female</option>
                    </select>
                </div>
                <div class="birth-box clearfix">
                    <span>
                        SIKU YA KUZALIWA
                        <sup class="required">*</sup>
                    </span>
                    <select v-model="formData.month" class="birth" @change="getDay">
                        <option value disabled selected class="normal">Mwezi</option>
                        <option v-for="item in month" :key="item" :value="item">{{item}}</option>
                    </select>
                    <select v-model="formData.year" class="birth" @change="getMouth">
                        <option value disabled selected class="normal">Mwaka</option>
                        <option v-for="item in year" :key="item" :value="item">{{item}}</option>
                    </select>
                    <select v-model="formData.day" class="birth">
                        <option value disabled selected class="normal">Siku</option>
                        <option v-for="item in day" :key="item" :value="item">{{item}}</option>
                    </select>
                </div>
                <div>
                    <span>
                        NAMBARI YA SIMU
                        <sup class="required">*</sup>
                    </span>
                    <input v-model="number" type="text" :class="{'unvalid':validNum==false}" @blur="checkPhone" @input="validNum=null" />
                </div>
                <p v-show="validNum==false&&number.length" class="error">Please enter a valid phone number</p>
                <div>
                    <span>
                        MAKAZI YA SASA
                        <sup class="required">*</sup>
                    </span>
                    <select v-model="city" required>
                        <option value disabled selected class="normal">Tafadhali chagua</option>
                        <option v-for="(item,index) in cityList" :key="index" :value="item">{{item}}</option>
                    </select>
                </div>
                <div>
                    <span>
                        KAZI
                        <sup class="required">*</sup>
                    </span>
                    <select v-model="profession" required>
                        <option value disabled selected class="normal">Tafadhali chagua</option>
                        <option v-for="(item,index) in professionList" :key="index" :value="item">{{item}}</option>
                    </select>
                </div>
                <div>
                    <span>
                        LINK YA VIDEO
                        <sup class="required">*</sup>
                    </span>
                    <input v-model="link" type="text" placeholder="Links za video za Instagram au Youtube" />
                </div>
                <div class="link" @click="showUploadWay">JINSI YA KUPATA LINK YA VIDEO?</div>

                <div class="disabled" :class="{'submit':canSubmit&&validNum}" @click="submit()">WASILISHA</div>
            </div>
            <img src="~assets/img/vote/BSSRegister/bg-form-bottom.png" alt class="form-img" />
            <!-- <div v-if="isEnd" class="register-end">SAMAHANI, USAJILI UMEKWISHA</div> -->
            <div class="register-end">SAMAHANI, USAJILI UMEKWISHA</div>
            <div class="ad"></div>
            <img class="text" src="~assets/img/vote/BSSRegister/text-two.png" alt />
            <div class="share-box">
                <img src="~assets/img/vote/BSSRegister/share-rule-img.png" alt />
                <img src="~assets/img/vote/BSSRegister/img-share.png" alt />
            </div>
            <img class="text" src="~assets/img/vote/BSSRegister/text-three.png" alt />
            <div class="past-programme">
                <img src="~assets/img/vote/BSSRegister/bg-orange.png" alt />
                <ul class="clearfix">
                    <li v-for="(item,index) in clipsList" :key="index">
                        <div @click="toPlayer(item)">
                            <img class="url" :src="cdnPic(item.cover)" />
                        </div>
                        <p class="title">{{(item.description||item.name).toUpperCase()}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div v-show="show_howToUpload" class="uploadWay">
            <img src="~assets/img/vote/BSSRegister/alert-img.png" alt />
            <img src="~assets/img/vote/BSSRegister/ic-close.png" alt @click="show_howToUpload=false" />
        </div>
        <div v-show="show_howToUpload" class="shadow-box"></div>
        <div :style="{display:style}" class="alert">
            <div class="alert-body">
                <div class="alert-default">
                    <p>
                        <span v-html="msg" />
                    </p>
                </div>
            </div>
            <div class="alert-footer">
                <div class="btn sure" @click="sure" v-html="yes"></div>
                <div class="btn close" @click="close" v-html="no"></div>
            </div>
        </div>
        <div v-show="tip" class="vote-toast">{{tip}}</div>
    </div>
</template>
<script>
import qs from 'qs'
import { cdnPicSrc } from '~/functions/utils'
import { callApp, downApk, playVodinApp } from '~/functions/app'
export default {
    layout: 'base',
    components: {},
    data() {
        return {
            appType: this.$store.state.appType || 0,
            name: '',
            gender: '',
            year: [],
            month: [],
            day: [],
            formData: {
                year: '',
                month: '',
                day: ''
            },
            birthday: '',
            birthdayErr: false,
            number: '',
            validNum: null,
            city: '',
            cityList: ['Dodoma', 'Dar es salaam', 'Mwanza', 'Arusha', 'Zanzibar', 'Moshi', 'Mbeya', 'Bagamoyo', 'Iringa', 'Others '],
            profession: '',
            professionList: [
                'Sales/ Marketing',
                'Accounting/ Administration',
                'Project/ Quality',
                'IT/ Internet/ Telcom',
                'Real Estate/ Construction',
                'Finance',
                'Purchasing/ Transportation',
                'Production/Manufacturing',
                'Media/Arts/Design',
                'Consultant/Legal/Education',
                'Service Industry',
                'Engergy/Environment',
                'Agriculture',
                'Scientific Research',
                'Part-time/Intern/Other'
            ],
            link: '',
            repeatSub: true,
            enroll_id: 1,
            vote_id: 16,
            clipsList: [],
            loaded: false,
            show_howToUpload: false,
            isEnd: false,

            msg: '',
            style: 'none',
            callback: '',
            yes: '',
            no: '',
            tip: '',
            tip_timer: null
        }
    },
    computed: {
        canSubmit() {
            // TODO 确认表单填写完整
            if (!this.name.replace(/\s/g, '')) return false
            if (!this.gender.replace(/\s/g, '')) return false
            if (!this.profession.replace(/\s/g, '')) return false
            if (!this.city.replace(/\s/g, '')) return false
            if (!this.number.replace(/\s/g, '')) return false
            return true
        }
    },
    asyncData({ app: { $axios }, store }) {
        return {
            serverTime: new Date()
        }
    },
    created() {
        this.getRegisterInfo()
    },
    mounted() {
        this.getYear()
        this.getVideoMsg()
    },
    methods: {
        cdnPic(src) {
            return cdnPicSrc.call(this, src)
        },
        // 埋点方法
        mSendEvLog(action, label, value) {
            this.sendEvLog({
                category: 'vote_VoiceToFame_' + this.platform,
                action: action,
                label: label,
                value: value
            })
            console.log(action, label, value)
        },
        // 唤醒转入活动页或下载App
        callOrDownApp(label) {
            // 唤醒App
            callApp.call(this, 'com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.href, () => {
                // 下载App
                this.mSendEvLog('downloadpopup_show', label, '')
                this.show(
                    `<p style="padding-top: 1rem;">Download StarTimes ON app. Vote and win FREE VIP!</p>`,
                    () => {
                        this.mSendEvLog('downloadpopup_clickok', label, '')
                        downApk.call(this)
                    },
                    () => {
                        this.mSendEvLog('downloadpopup_clicknot', label, '')
                    },
                    `<p style="padding: 0 1rem">Download Now</p>`,
                    `<p style="padding: 0 1rem">Cancle</p>`
                )
            })
        },
        // 播放视频方法
        toPlayer(advisor) {
            this.mSendEvLog('votepic_click', advisor.name, '')
            if (this.appType == 0) {
                this.callOrDownApp('pic')
                return
            }
            if (advisor.link_vod_code) {
                playVodinApp.call(this, this.appType, advisor.link_vod_code)
            }
        },
        // 获取报名活动信息
        getRegisterInfo() {
            this.currentTime = Date.parse(this.serverTime)
            this.$axios
                .get(`/voting/enroll/v1/info?enroll_id=${this.enroll_id}`)
                .then(res => {
                    if (res.data.code === 200) {
                        this.startTime = new Date(res.data.data.start_time).getTime()
                        this.endTime = new Date(res.data.data.end_time).getTime()
                        if (this.currentTime >= this.endTime) {
                            this.isEnd = true
                        }
                    } else {
                        this.$alert('获取活动时间失败')
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
                this.year.push(y)
            }
        },
        // 获取生日月份
        getMouth() {
            for (let i = 1; i < 13; i++) {
                this.month.push(i)
            }
        },
        // 获取生日日期
        getDay() {
            this.day = []
            this.formData.month = parseInt(this.formData.month, 10)
            const day = new Date(this.formData.year, this.formData.month, 0).getDate()
            for (let i = 1; i <= day; i++) {
                this.day.push(i)
            }
        },
        showUploadWay() {
            // const page = this.$refs.page
            // page.scrollIntoView()
            window.scrollTo({
                top: '800',
                behavior: 'smooth'
            })
            this.show_howToUpload = true
        },
        // 校验电话
        checkPhone() {
            // TODO 电话号码校验正则
            const reg = /^[0-9+-]+$/
            if (reg.test(this.number) && this.number.replace(/[^0-9]/gi, '').length >= 9) {
                this.validNum = true
            } else {
                this.validNum = false
            }
        },
        // 提交表单
        submit() {
            if (typeof this.formData.year == 'string' || typeof this.formData.month == 'string' || typeof this.formData.day == 'string') {
                this.birthdayErr = true
                return
            }
            const birthday =
                this.formData.year +
                '-' +
                (this.formData.month.toString().length <= 1 ? '0' + this.formData.month : this.formData.month) +
                '-' +
                (this.formData.day.toString().length <= 1 ? '0' + this.formData.day : this.formData.day)
            console.log(birthday)

            if (new Date() < new Date(birthday)) {
                this.birthdayErr = true
                return
            }

            if (this.canSubmit && this.validNum && this.repeatSub) {
                this.repeatSub = false
                this.$axios({
                    url: '/hybrid/api/acitvity/regist',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify({
                        fk_enroll: 1,
                        name: this.name,
                        gender: this.gender,
                        birthday: this.birthday,
                        phone: this.number,
                        address: this.city,
                        profession: this.profession,
                        other_description: this.link
                    })
                })
                    .then(res => {
                        if (res.data.code === 200) {
                            // this.$router.replace(`/hybrid/vote/challenger_succ`)
                            console.log('success200')
                        } else {
                            this.$alert('please fill in the correct information and try again')
                        }
                        this.repeatSub = true
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log('false')
            }
        },
        getVideoMsg() {
            // 获取投票单元数据
            this.$axios.get(`/voting/v1/program?vote_id=${this.vote_id}`).then(res => {
                if (res.data.code === 0) {
                    this.clipsList = res.data.data
                    // this.clipsList.forEach(ele => {
                    //     this.mSendEvLog('video_show', ele.name || ele.description, 10)
                    // })
                }
            })
        },
        // 弹窗方法
        show(msg, callback, cancel, yes, no) {
            this.yes = ''
            this.no = ''
            if (yes) this.yes = yes
            if (no) this.no = no
            this.msg = msg
            this.style = 'block'
            this.$store.commit('SHOW_SHADOW_LAYER')
            if (callback) {
                this.callback = callback
            } else {
                this.callback = ''
            }
            if (cancel) {
                this.cancel = cancel
            } else {
                this.cancel = ''
            }
        },
        close() {
            this.style = 'none'
            this.$store.commit('HIDE_SHADOW_LAYER')
            if (this.cancel) {
                this.cancel()
            }
        },
        sure() {
            this.style = 'none'
            this.$store.commit('HIDE_SHADOW_LAYER')
            if (this.callback) this.callback()
        },
        tipShow(text, duration = 2000) {
            clearInterval(this.tip_timer)
            const _this = this
            this.tip = text
            this.tip_timer = setTimeout(() => {
                _this.tip = ''
            }, duration)
        }
    },

    head() {
        return {
            title: 'Bongo Star Search'
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/vote/normal.less';
.wrapper {
    background-image: url('~assets/img/vote/BSSRegister/bg-img-re.jpg');
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
            &.form-img {
                padding-top: 0;
                width: 90%;
            }
            &.rule-img {
                padding: 1.5rem 5% 0;
                background-color: #fff;
            }
        }
        .tab-box {
            width: 100%;
            height: 2.2rem;
            position: relative;
            &:after {
                content: '';
                width: 1rem;
                height: 1rem;
                background-color: red;
                display: block;
            }
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
                    background: url('~assets/img/vote/BSSRegister/btn-left.png') no-repeat;
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
                    background: url('~assets/img/vote/BSSRegister/btn-right.png') no-repeat;
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
        }
        .registration {
            width: 90%;
            margin: 0 auto;
            padding: 1rem 5% 2rem;
            color: #36ad5e;
            background-color: #fff;
            .error {
                color: #ff0066;
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
                        color: red;
                        position: relative;
                        top: 0.2rem;
                    }
                }
                input,
                select {
                    line-height: 2rem;
                    border: 0;
                    background-color: #f2f0f0;
                    padding: 0 0.6rem;
                    color: #bcbcbc;
                    outline: none;
                    &.unvalid {
                        color: #ff0066;
                    }
                }
                input {
                    &::-webkit-input-placeholder {
                        color: #898989;
                    }
                }
                select {
                    background-image: url('~assets/img/vote/ic-select.png');
                    background-size: 0.7rem 0.4rem;
                    background-position: 97% 0.8rem;
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
                        background-position: 89% 0.8rem;
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
            .link {
                color: #ff892a;
                text-align: right;
                font-size: 0.8rem;
                margin-top: 0.6rem;
            }
            .disabled {
                width: 14rem;
                border-radius: 0.2rem;
                background: #d1d1d1;
                color: #ffffff;
                text-align: center;
                margin: 0 auto;
                height: 2.2rem;
                line-height: 2.2rem;
                margin-top: 2rem;
                font-size: 1rem;
                &.submit {
                    background: url('~assets/img/vote/BSSRegister/bg-btn.png') no-repeat;
                    background-size: contain;
                }
            }
        }
        .register-end {
            width: 17rem;
            height: 3rem;
            line-height: 3rem;
            color: #fff;
            font-size: 1rem;
            margin: 0 auto;
        }
        .share-box {
            margin-top: 1rem;
            > img {
                display: block;
                width: 90%;
                margin: 1rem auto;
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
    .uploadWay {
        width: 80%;
        position: absolute;
        overflow: hidden;
        left: 10%;
        top: 820px;
        z-index: 999;
        img {
            &:first-child {
                width: 100%;
                display: block;
            }
            &:last-child {
                width: 10%;
                display: block;
                margin: 2.5rem auto;
            }
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
