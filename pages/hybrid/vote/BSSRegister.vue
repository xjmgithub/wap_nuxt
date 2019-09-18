<template>
    <div ref="page" class="wrapper">
        <div class="container">
            <img src="~assets/img/vote/BSSRegister/bg-img.jpg" alt="bg-img" />
            <div class="tab-box">
                <div class="tab">
                    <div class="rules" @click="show_rules=true">
                        <p>RULES</p>
                        <img src="~assets/img/vote/BSSRegister/ic-rule.png" alt="ic-rule" />
                    </div>
                    <div class="share" @click="toShare('upshare')">
                        <p>SHARE</p>
                        <img src="~assets/img/vote/BSSRegister/ic-share.png" alt="ic-share" />
                    </div>
                </div>
            </div>
            <div class="registration">
                <h4>Registration</h4>
                <div>
                    <span>
                        Name
                        <sup class="required">*</sup>
                    </span>
                    <input v-model="name" type="text" />
                </div>
                <p v-show="name.length>100" class="error">Please enter less than 100 characters.</p>
                <div>
                    <span>
                        Sex
                        <sup class="required">*</sup>
                    </span>
                    <select v-model="gender" required>
                        <option value disabled selected class="normal">Please Select</option>
                        <option value="male">male</option>
                        <option value="female">female</option>
                    </select>
                </div>
                <div>
                    <span>
                        Birthday
                        <sup class="required">*</sup>
                    </span>
                    <select v-model="formData.year" class="birth" @change="getMouth">
                        <option value disabled selected class="normal">year</option>
                        <option v-for="item in year" :key="item" :value="item">{{item}}</option>
                    </select>
                    <select v-model="formData.month" class="birth" @change="getDay">
                        <option value disabled selected class="normal">mouth</option>
                        <option v-for="item in month" :key="item" :value="item">{{item}}</option>
                    </select>
                    <select v-model="formData.day" class="birth">
                        <option value disabled selected class="normal">day</option>
                        <option v-for="item in day" :key="item" :value="item">{{item}}</option>
                    </select>
                </div>
                <div>
                    <span>
                        Contact Number
                        <sup class="required">*</sup>
                    </span>
                    <input v-model="number" type="text" :class="{'unvalid':validNum==false}" @blur="checkPhone" @input="validNum=null" />
                </div>
                <p v-show="validNum==false&&number.length" class="error">Please enter a valid phone number</p>
                <div>
                    <span>
                        Your City
                        <sup class="required">*</sup>
                    </span>
                    <select v-model="city" required>
                        <option value disabled selected class="normal">Please Select</option>
                        <option v-for="(item,index) in cityList" :key="index" :value="item">{{item}}</option>
                    </select>
                </div>
                <div>
                    <span>
                        Profession
                        <sup class="required">*</sup>
                    </span>
                    <select v-model="profession" required>
                        <option value disabled selected class="normal">Please Select</option>
                        <option v-for="(item,index) in professionList" :key="index" :value="item">{{item}}</option>
                    </select>
                </div>
                <div>
                    <span>
                        Link
                        <sup class="required">*</sup>
                    </span>
                    <input v-model="link" type="text" />
                </div>
                <div @click="showUploadWay">如何获得链接？</div>

                <div class="disabled" :class="{'submit':canSubmit&&validNum}" @click="submit()">SUBMIT</div>
            </div>
            <div v-if="isEnd" class="endMsg">活动已结束</div>
            <div class="ad"></div>
            <div class="past-programme">
                <ul class="clearfix">
                    <li v-for="(item,index) in clipsList" :key="index">
                        <div @click="toPlayer(item)">
                            <img class="url" :src="cdnPic(item.cover)" />
                            <img src="~assets/img/vote/ic_play_small_white.png" class="player" />
                        </div>
                        <span class="title">{{item.description||item.name}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div v-show="show_howToUpload" class="uploadWay"></div>
        <div v-show="show_howToUpload" class="shadow-box" @click="show_howToUpload=false"></div>
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
            const page = this.$refs.page
            page.scrollIntoView()
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
    background-color: #2f0081;
    font-size: 0.9rem;
    letter-spacing: -0.03rem;
    position: static;
    .container {
        > img {
            width: 100%;
            height: auto;
        }
        .tab-box {
            width: 100%;
            height: auto;
            position: relative;
            .tab {
                width: 100%;
                position: absolute;
                color: #fff;
                top: -3.6rem;
                left: 0;
                height: 3rem;
                line-height: 3rem;
                .rules {
                    width: 6rem;
                    float: left;
                    background: url('~assets/img/vote/BSSRegister/btn-rules.png') no-repeat;
                    background-size: 6rem 3rem;
                    text-align: left;
                    padding-left: 0.5rem;
                    position: relative;
                    img {
                        width: 1rem;
                        height: auto;
                        position: absolute;
                        left: 3.8rem;
                        top: 0.9rem;
                    }
                }
                .share {
                    width: 6rem;
                    float: right;
                    background: url('~assets/img/vote/BSSRegister/btn-share.png') no-repeat;
                    background-size: 6rem 3rem;
                    text-align: right;
                    padding-right: 0.5rem;
                    position: relative;
                }
                img {
                    width: 1rem;
                    height: auto;
                    position: absolute;
                    right: 3.8rem;
                    top: 1.2rem;
                }
            }
        }
        .registration {
            padding: 1.5rem 5%;
            color: #999999;
            background: #eeeeee url('~assets/img/vote/regist_btm.png') no-repeat bottom;
            background-size: contain;
            .error {
                // margin-left: 38%;
                color: #ff0066;
                font-size: 0.8rem;
                font-weight: bold;
            }
            h4 {
                color: #666666;
                text-align: center;
                font-weight: bold;
                margin-top: 0;
                width: 100%;
                background: url('~assets/img/vote/line_d.png') no-repeat center;
                background-size: contain;
            }
            div {
                font-weight: bold;
                font-size: 0.8rem;
                margin: 0.8rem 0;
                position: relative;
                span,input,select {
                    width: 100%;
                    height: 2rem;
                    // line-height: 2rem;
                    // display: block;
                    text-align: left;
                    margin: 0 auto;
                }
                span {
                    // width: 80%;
                    // height: 2rem;
                    display: block;
                    // text-align: left;
                    // margin-right: 3%;
                    .required {
                        color: red;
                    }
                }
                input,
                select {
                    // width: 80%;
                    // height: 2rem;
                    line-height: 2rem;
                    border-radius: 0.5rem;
                    border: 1px solid #d1d1d1;
                    background: #eeeeee;
                    padding: 0 0.5rem;
                    color: #00cccc;
                    font-size: 0.8rem;
                    outline: none;
                    &.unvalid {
                        color: #ff0066;
                    }
                }
                select {
                    background: transparent url('~assets/img/vote/ic_menuarrow_def_g.png') no-repeat 96% center;
                    appearance: none;
                    -webkit-apperance: none;
                    -moz-appearance: none;
                    padding-right: 6%;
                    background-size: 6%;
                    .normal {
                        display: none;
                    }
                    &.birth {
                        width: 30%;
                        margin-right: 4.2%;
                        background-size: 20%;
                        &:last-child {
                            margin-right: 0;
                        }
                    }
                    &:invalid {
                        color: #aaaaaa;
                    }
                }
            }
            .disabled {
                width: 80%;
                border-radius: 0.5rem;
                background: #d1d1d1;
                color: #ffffff;
                text-align: center;
                margin: 0 auto;
                height: 2.5rem;
                line-height: 2.5rem;
                margin-top: 1rem;
                font-size: 0.95rem;
                &.submit {
                    background: #00cccc;
                }
            }
        }
        .past-programme {
            padding: 0 2.5%;
            margin-bottom: 1rem;
            p {
                margin: 1rem 0;
                height: 1rem;
                line-height: 1rem;
                color: #f93874;
                font-weight: bold;
            }
            li {
                list-style: none;
                float: left;
                width: 48%;
                line-height: 1.1rem;
                color: #000;
                margin-bottom: 0.3rem;
                &:nth-child(2n) {
                    float: right;
                }
                div {
                    position: relative;
                    width: 100%;
                    &:before {
                        content: '';
                        display: inline-block;
                        padding-bottom: 56%;
                        width: 0.1px;
                        vertical-align: middle;
                    }
                    .player {
                        position: absolute;
                        bottom: 5px;
                        right: 5px;
                        width: 1.5rem;
                    }
                    .url {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                    }
                }
                span {
                    font-size: 0.88rem;
                    &.title {
                        display: -webkit-box;
                        overflow: hidden;
                        height: 3.6rem;
                        padding-top: 0.4rem;
                        -webkit-line-clamp: 3;
                        /* autoprefixer: off */
                        -webkit-box-orient: vertical;
                    }
                }
            }
        }
    }
    .uploadWay {
        width: 17rem;
        height: 40rem;
        background-color: #8150fc;
        position: absolute;
        overflow: hidden;
        left: 50%;
        top: 5rem;
        margin-left: -8.5rem;
        z-index: 999;
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
