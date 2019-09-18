<template>
    <div class="wrapper">
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
                <select v-model="formData.year" class="birth" @change="getMouth" >
                    <option value disabled selected class="normal">year</option>
                    <option v-for="item in year" :key="item" :value="item">{{item}}</option>
                </select>
                <select v-model="formData.month" class="birth" @change="getDay">
                    <option value disabled selected class="normal">mouth</option>
                    <option v-for="item in month" :key="item" :value="item">{{item}}</option>
                </select>
                <select v-model="formData.day" class="birth" >
                    <option value disabled selected class="normal">day</option>
                    <option v-for="item in day" :key="item" :value="item">{{item}}</option>
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
                    Contact Number
                    <sup class="required">*</sup>
                </span>
                <input v-model="number" type="text" :class="{'unvalid':validNum==false}" @blur="checkPhone" @input="validNum=null" />
            </div>
            <p v-show="validNum==false&&number.length" class="error">Please enter a valid phone number</p>
            <div class="disabled" :class="{'submit':canSubmit&&validNum}" @click="submit()">SUBMIT</div>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
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
            city: '',
            cityList: ['Dodoma', 'Dar es salaam', 'Mwanza', 'Arusha', 'Zanzibar', 'Moshi', 'Mbeya', 'Bagamoyo', 'Iringa', 'Others '],
            number: '',
            validNum: null,
            birthdayErr: false,
            link: '',
            repeatSub: true
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
    watch: {},
    mounted() {
        this.getYear()
        // this.getMouth()
    },
    methods: {
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
            if(typeof(this.formData.year)=='string' || typeof(this.formData.month)=='string' || typeof(this.formData.day)=='string') {
                this.birthdayErr = true
                return
            } 
            const birthday = this.formData.year + '-' + (this.formData.month.toString().length <= 1 ? '0' + this.formData.month : this.formData.month) + '-' +(this.formData.day.toString().length <= 1 ? '0' + this.formData.day : this.formData.day)
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
                        "fk_enroll": 1,
                        "name": this.name,
                        "gender": this.gender,
                        "birthday": this.birthday,
                        "phone": this.number,
                        "address": this.city,
                        "profession": this.profession,
                        "other_description": this.link,
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
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                console.log('false')
            }
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
}
</style>
