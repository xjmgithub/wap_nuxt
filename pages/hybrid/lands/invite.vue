<template>
    <div class="wrapper">
        <div class="img-box">
            <img src="~assets/img/landpage/pic_freevip.png" />
        </div>
        <div class="page-bom">
            <div class="words">
                <div class="tip">{{$store.state.lang.reward_tips}}</div>
                <div class="rules" @click="showRules">{{$store.state.lang.activity_rules}}</div>
            </div>
            <div class="get-now" @click="getNow">{{$store.state.lang.get_now}}</div>
        </div>
        <div v-show="showRulesPage" class="rules-page">
            <div class="title">
                {{$store.state.lang.activity_rules}}
            </div>
            <div class="sections">
                <div class="section">
                    <span>1</span>
                    <p>
                        {{$store.state.lang.activity_rules_1}}
                    </p>
                </div>
                <div class="section">
                    <span>2</span>
                    <p>
                        {{$store.state.lang.activity_rules_2}}
                    </p>
                </div>
                <div class="section">
                    <span>3</span>
                    <p>
                        {{$store.state.lang.activity_rules_3}}
                    </p>
                </div>
                <div class="section">
                    <span>4</span>
                    <p>
                        {{$store.state.lang.activity_rules_4}}
                    </p>
                </div>
            </div>
            <div class="got-it" @click="showRulesPage=false">{{$store.state.lang.got_it}}</div>
        </div>
        <shadowLayer v-show="showRulesPage" />
    </div>
</template>
<script>
import shadowLayer from '~/components/shadow-layer'
export default {
    layout: 'base',
    components: {
        shadowLayer
    },
    data() {
        return {
            utm_str: '',
            showRulesPage: false,
            invite_code: this.$route.query.inviteCode || ''
        }
    },
    mounted() {
        this.sendEvLog({
            category: 'tell_friends',
            action: 'lands_show',
            label: this.invite_code,
            value: 1
        })
        if (this.$route.query.referrer) {
            this.utm_str = this.$route.query.referrer
        } else {
            const obj = this.$route.query
            Object.keys(obj).forEach(key => {
                if (key != 'inviteCode') {
                    this.utm_str = this.utm_str + key + '=' + obj[key] + '&'
                }
            })
            this.utm_str = this.utm_str
                .substr(0, this.utm_str.length - 1)
                .replace('t_sr', 'utm_source')
                .replace('t_md', 'utm_medium')
                .replace('t_tm', 'utm_term')
                .replace('t_ct', 'utm_content')
                .replace('t_cn', 'utm_campaign')
        }
        sessionStorage.setItem('utm_str', this.utm_str)
        sessionStorage.setItem('login_prefer', '/hybrid/account/toGooglePlay')
        sessionStorage.setItem('register_prefer', '/hybrid/account/toGooglePlay')
        if (this.invite_code) {
            sessionStorage.setItem('invite_code', this.invite_code)
        }
    },
    methods: {
        getNow() {
            this.sendEvLog({
                category: 'tell_friends',
                action: 'get_it_btn_click',
                label: this.invite_code,
                value: 1
            })
            this.$router.push(`/hybrid/account/register`)
        },
        showRules() {
            this.showRulesPage = true
            this.sendEvLog({
                category: 'tell_friends',
                action: 'activity_rules_show',
                label: this.invite_code,
                value: 1
            })
        }
    },
}
</script>
<style lang="less" scoped>
.wrapper {
    width: 100%;
    background-image: linear-gradient(to top, #954ab1 25%, #5c2479 75%);
    font-weight: 600;
    min-height: 100%;
    max-height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    .img-box {
        width: 100%;
        min-height: 6rem;
        img {
            display: block;
            width: 100%;
        }
    }
    .page-bom {
        margin-top: -25%;
        .words {
            text-align: center;
            .tip {
                padding: 0 0.8rem;
                color: #f2d884;
                line-height: 1.2rem;
            }
            .rules {
                margin-top: 1rem;
                color: #ffffff;
                text-decoration: underline;
            }
        }
        .get-now {
            width: 80%;
            height: 2.4rem;
            line-height: 2.4rem;
            text-align: center;
            color: #5c2479;
            font-weight: 700;
            background-color: #ffbe19;
            margin: 1rem auto;
            border-radius: 1.3rem;
        }
    }

    .rules-page {
        width: 17.5rem;
        height: 25rem;
        overflow: hidden;
        border-radius: 0.2rem;
        background-color: #ffffff;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -13rem;
        margin-left: -8.75rem;
        z-index: 1000;
        padding: 1.5rem 1rem;
        div {
            line-height: 1.2rem;
            font-weight: 400;
            &.title {
                line-height: 1.6rem;
                font-size: 1.4rem;
                font-weight: 700;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            &.sections {
                position: relative;
                top: 1rem;
                width: 15rem;
                height: 18rem;
                overflow-x: hidden;
                &::-webkit-scrollbar {
                    display: none;
                }
                .section {
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    color: rgba(0, 0, 0, 54%);
                    position: relative;
                    span {
                        position: absolute;
                        top: 0.2rem;
                        left: 0;
                        display: block;
                        width: 1rem;
                        height: 1rem;
                        line-height: 1rem;
                        text-align: center;
                        color: #ffffff;
                        font-size: 0.6rem;
                        border-radius: 50%;
                        background: #008be9;
                    }
                    p {
                        padding-left: 1.5rem;
                    }
                }
            }
            &.got-it {
                padding-top: 1rem;
                width: 100%;
                height: 2rem;
                text-align: right;
                line-height: 2rem;
                font-size: 1rem;
                font-weight: 700;
                color: #008be9;
            }
        }
    }
}
</style>
