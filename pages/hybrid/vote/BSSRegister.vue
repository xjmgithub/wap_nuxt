<template>
    <div class="wrapper">
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
            <div @click="howToUploadShow">如何获得链接？</div>
            
            <div class="disabled" :class="{'submit':canSubmit&&validNum}" @click="submit()">SUBMIT</div>
        </div>
        <div class="ad"></div>
        <div class="past-programme">
            <ul class="clearfix">
                <li v-for="(item,index) in clipsList" :key="index">
                    <div @click="toPlayer(item.link_vod_code,'video_click',item.name||item.description,10)">
                        <img class="url" :src="cdnPic(item.cover)" />
                        <img src="~assets/img/vote/ic_play_small_white.png" class="player" />
                    </div>
                    <span class="title">{{item.description||item.name}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
import { cdnPicSrc } from '~/functions/utils'
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
            vote_id: 14,
            clipsList: [],
            loaded: false,
            howToUploadShow: false,
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
        // 获取报名活动信息
        getRegisterInfo() {
            this.currentTime = Date.parse(this.serverTime)
            this.$axios
                .get(`/voting/enroll/v1/info?enroll_id=${this.enroll_id}`)
                .then(res => {
                    if (res.data.code === 200) {
                        this.startTime = new Date(res.data.data.start_time).getTime()
                        this.endTime = new Date(res.data.data.end_time).getTime()
                        if (this.currentTime < this.startTime) {
                            this.$alert('活动未开始', () => {}, 'GOT IT')
                        } else if (this.currentTime >= this.endTime) {
                            this.$alert('活动已结束', () => {}, 'GOT IT')
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
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
            margin-left: 38%;
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
            span {
                width: 35%;
                display: inline-block;
                text-align: right;
                margin-right: 3%;
                .required {
                    color: red;
                }
            }
            input,
            select {
                width: 55%;
                height: 2rem;
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
                background-size: 11%;
                .normal {
                    display: none;
                }
                &.birth {
                    width: 17%;
                    margin-right: 2%;
                    background-size: 35%;
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
</style>
