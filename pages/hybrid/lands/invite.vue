<template>
    <div class="wrapper">
        <img class="st_logo" src="~assets/img/landpage/pic_freevip.png">
        <div class="words">
            <div class="tip">If you are new user, you can get 5000 coins after downloading app!</div>
            <div class="rules" @click="showRules">Activity Rules</div>
        </div>
        <nuxt-link to="/hybrid/account/register">
            <div class="get-now">GET NOW!</div>
        </nuxt-link>
        <div v-show="showRulesPage" class="rules-page">
            <div class="title">
                Activity Rules
                <div class="explain">Invited Friends to get rewards. More friends you invited, more rewards you will get.</div>
            </div>
            <div class="section">
                <span>1</span>
                <p>Tell your friends to download StarTimes ON app,<font color="#008BE9">you will get 100 coins</font></p>
            </div>
            <div class="section">
                <span>2</span>
                <p>Ask your friends to register and fill in your invitation code,<font color="#008BE9">you will get free VIP 1 day.</font></p>
            </div>
            <div class="got-it" @click="showRulesPage=false">GOT IT</div>
        </div>
        <shadowLayer v-show="showRulesPage" />
    </div>
</template>
<script>
import shadowLayer from '~/components/shadow-layer'
export default {
    layout: 'base',
    components: {
        shadowLayer,
    },
    data() {

        return {
            utm_str: this.$route.query.referrer || JSON.stringify(this.$route.query).replace(/"/g,'').replace('{','').replace('}','').replace(/,/g,'&').replace(/:/g,'=').replace('t_sr','utm_source').replace('t_md','utm_medium').replace('t_tm','utm_term').replace('t_ct','utm_content').replace('t_cn','utm_campaign'),
            // utm_str: this.$route.query.referrer || JSON.stringify(this.$route.query).replace([/"{}/g],'').replace(/,/g,'&').replace(/:/g,'=').replace('t_sr','utm_source').replace('t_md','utm_medium').replace('t_tm','utm_term').replace('t_ct','utm_content').replace('t_cn','utm_campaign'),
            showRulesPage: false,
        }
    },
    mounted() {
        // http://localhost:3000/hybrid/lands/invite?referrer=utm_source%3Dstartimes_app%26utm_medium%3Dshare%26utm_term%3Drunning%26utm_content%3Dlogolink%26utm_campaign%3Dtell_friends

        // http://localhost:3000/hybrid/lands/invite?utm_source=startimes_app&utm_medium=share&utm_term=running&utm_content=logolink&utm_campaign=tell_friends

        // http://localhost:3000/hybrid/lands/invite?t_sr=startimes_app&t_md=share&t_tm=running&t_ct=logolink&t_cn=tell_friends

        console.log(this.utm_str) // utm_source=startimes_app&utm_medium=share&utm_term=running&utm_content=logolink&utm_campaign=tell_friends

        sessionStorage.setItem("utm_str", this.utm_str)
        
    },
    methods: {
        showRules() {
            this.showRulesPage = true;
        }
    },
    head() {
        return {
            title: 'Login'
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to top, #954AB1 25%, #5C2479 75%);
    padding-top: 5%;
    padding-bottom: 21%;
    font-family: Roboto;
    font-weight: 600;
    position: relative;
    // position: fixed;
    top: 0;
    left: 0;
    .st_logo {
        display: block;
        width: 100%;
        height: auto;
        margin: 0 auto;
    }
    .words {
        div {
            width: 100%;
            text-align: center;
            &.tip {
                padding: 0 0.8rem;
                font-size: 1rem;
                color: #F2D884;
                line-height: 1.2rem;
                margin-top: -5.5rem;
            }
            &.rules {
                margin-top: 1.5rem;
                font-size: 1rem;
                color: #ffffff;
                text-decoration: underline;
            }
        }
    }
    .get-now {
        width: 80%;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
        color: #5C2479;
        font-weight: 900;
        background-color: #FFBE19;
        margin: 2rem 10%;
        border-radius: 1.3rem;
    }
    .rules-page {
        width: 17.5rem;
        height: 22rem;
        border-radius: 0.2rem;
        background-color: #FFFFFF;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -11rem;
        margin-left: -8.75rem;
        z-index: 1000;
        padding: 1.5rem;
        div {
            line-height: 1.3rem;
            font-weight: 400;
            &.title {
                font-size: 1.8rem;
                font-weight: 800;
                .explain {
                    font-size: 0.9rem;
                    color: rgba(0, 0, 0, 54%);
                    margin-top: 1.3rem;
                }
            }
            &.section {
                margin-top: 1rem;
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
                    background: #008BE9;
                    // padding-top: 0.2rem;
                }
                p {
                    padding-left: 1.5rem;
                }
            }
            &.got-it {
                margin-top: 0.5rem;
                float: right;
                width: 4.6rem;
                height: 2.3rem;
                text-align: center;
                line-height: 2.3rem;
                font-size: 1rem;
                font-weight: 700;
                color: #008BE9;
            }
        }
    }
}
</style>
