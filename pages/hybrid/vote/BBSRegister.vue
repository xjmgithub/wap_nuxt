<template>
    <div class="wrapper">
        <div class="registration">
            <h4>Registration</h4>
            <div>
                <span>
                    First Name
                    <sup class="required">*</sup>
                </span>
                <input v-model="firstName" type="text" />
            </div>
            <p v-show="firstName.length>100" class="error">Please enter less than 100 characters.</p>
            <div>
                <span>
                    Last Name
                    <sup class="required">*</sup>
                </span>
                <input v-model="lastName" type="text" />
            </div>
            <p v-show="lastName.length>100" class="error">Please enter less than 100 characters.</p>
            <div>
                <span>
                    Gender
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
                    Age
                    <sup class="required">*</sup>
                </span>
                <input v-model="age" type="number" />
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
                <input v-model="number" type="text" :class="{'unvalid':validNum==false}" @blur="checkout" @input="validNum=null" />
            </div>
            <p v-show="validNum==false&&number.length" class="error">Please enter a valid phone number</p>
            <div class="disabled" :class="{'submit':canSubmit&&validNum}" @click="submit()">SUBMIT</div>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    components: {},
    data() {
        return {
            appType: this.$store.state.appType || 0,
            firstName: '',
            lastName: '',
            gender: '',
            age: '',
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
            validNum: null
        }
    },
    computed: {
        canSubmit() {
            // TODO 确认表单填写完整
            if (!this.firstName.replace(/\s/g, '')) return false
            if (!this.lastName.replace(/\s/g, '')) return false
            if (!this.gender.replace(/\s/g, '')) return false
            if (!this.age.replace(/\s/g, '')) return false
            if (!this.profession.replace(/\s/g, '')) return false
            if (!this.city.replace(/\s/g, '')) return false
            if (!this.number.replace(/\s/g, '')) return false
            return true
        }
    },
    watch: {},
    mounted() {},
    methods: {},
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
        // background: #eeeeee url('~assets/img/vote/regist_btm.png') no-repeat bottom;
        background: #eeeeee;
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
            // background: url('~assets/img/vote/line_d.png') no-repeat center;
            background: #f00;
            background-size: contain;
        }
        div{
            font-weight:bold;
            font-size:0.8rem;
            margin: 0.8rem 0;
            span{
                width:35%;
                display:inline-block;
                text-align:right;
                margin-right:3%;
                .required{
                    color:red;
                }
            }
            input,
            select {
                width: 55%;
                height: 2rem;
                line-height: 2rem;
                border-radius: 20px;
                border: 1px solid #d1d1d1;
                background: #eeeeee;
                padding: 0 0.5rem;
                color: #00cccc;
                font-size: 0.8rem;
                font-weight: bold;
                outline: none;
                &.unvalid {
                    color: #ff0066;
                }
            }
            select {
                // background: transparent url('~assets/img/vote/ic_menuarrow_def_g.png') no-repeat 96% center;
                background: transparent;
                appearance: none;
                -webkit-apperance: none;
                -moz-appearance: none;
                padding-right: 6%;
                background-size: 11%;
                .normal {
                    display: none;
                }
                &:invalid {
                    color: #aaaaaa;
                }
            }
        }
        .disabled {
            width: 80%;
            border-radius: 20px;
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
