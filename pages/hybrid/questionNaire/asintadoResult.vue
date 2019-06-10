<template>
    <div id="result">
        <div class="character">
            <div class="guide">
                <p v-show="sharePin" class="title">Who Am I In These Series?</p>
                <div class="logo">I AM...</div>
                <nuxt-link v-show="!sharePin" :to="`/hybrid/questionNaire/asintado`">
                    <span class="try">TRY AGAIN</span>
                </nuxt-link>
                <div v-show="sharePin" class="share">
                    <img src="~assets/img/naire/ic_facebook_def.png" @click="shareWithFacebook">
                    <img src="~assets/img/naire/ic_Twitter_def.png" @click="shareWithTwitter">
                    <img src="~assets/img/naire/ic_copylink_def.png" @click="copyLink">
                </div>
            </div>
            <div class="atlas clearfix">
                <div v-for="(item,index) in result" :key="index" :class="{'asintado':item.fk_episode==1,'other':item.fk_episode!=1}">
                    <p class="name">{{item.name}}</p>
                    <p :class="{'episode':!sharePin}">{{item.fk_episode | getFkName}}</p>
                    <img :src="item.avatar">
                    <span v-show="sharePin" class="short">{{item.short_des}}</span>
                </div>
            </div>
        </div>
        <div class="container">
            <div v-show="!sharePin" class="des">
                <p>My Charactersitics:</p>
                <span>{{rolePercent}}</span>
                <span v-for="(item,index) in result" :key="index">{{item.long_des}}</span>
            </div>
            <div v-show="!sharePin&&appType!=2" class="share" @click="toShare()">
                <img src="~assets/img/naire/ic_share_def_g.png"> SHARE TO MY FRIENDS
            </div>
            <nuxt-link v-show="sharePin" :to="`/hybrid/questionNaire/asintado`">
                <div class="play">KNOW WHO AM I IN ASTINTADO</div>
            </nuxt-link>
            <div v-show="sharePin" class="line"/>
        </div>
        <div v-show="sharePin" class="asintado">
            <div class="introduction">
                <img src="~assets/img/naire/poster.png">
                <div>
                    <b>Asintado</b>( transl. Sharpshooter) is a 2018 Philippine action drama television series starring Julia Montes, Shaina Magdayao, Paulo Avelino and Aljur Abrenica
                </div>
            </div>
            <div class="comments">
                <p>Comments</p>
                <ul>
                    <li @click="toVideo('vod')">
                        <img src="~assets/img/naire/boy.png">
                        <div>
                            <img src="~assets/img/faq/Triangle.png">From Wildflower to Asintado, interesting series from Startimes ON.
                        </div>
                    </li>
                    <li @click="toVideo('vod')">
                        <img src="~assets/img/naire/girl.png">
                        <div>
                            <img src="~assets/img/faq/Triangle.png">Very very interest can't miss it for anything.
                        </div>
                    </li>
                    <li @click="toVideo('vod')">
                        <img src="~assets/img/naire/girl.png">
                        <div>
                            <img src="~assets/img/faq/Triangle.png">Great! I watch Asintado with my phone on StarTimes ON app!
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-show="programList.length>0" class="clips">
            <p>Highlights</p>
            <ul class="clearfix">
                <li v-for="(item,index) in programList" :key="index" @click="toVideo(item.link_vod_code)">
                    <div>
                        <img v-if="item.link_url" :src="cdnPic(item.link_url)">
                        <img v-else src="~assets/img/web/def.png">
                        <span class="show-time">{{item | formatShowTime}}</span>
                    </div>
                    <p class="title">{{item.description||item.name}}</p>
                </li>
            </ul>
        </div>
        <mShare :share-url="shareUrl"/>
    </div>
</template>
<script>
import mShare from '~/components/web/share.vue'
import { shareInvite, callApp, callMarket, shareByFacebook, shareByTwitter, copyClipboard, cdnPicSrc } from '~/functions/utils'
export default {
    layout: 'base',
    filters: {
        formatShowTime(item) {
            return item.time
        },
        getFkName(code) {
            return code == 1 ? 'Asintado' : code == 2 ? 'GOT' : code == 3 ? 'Avengers' : ''
        }
    },
    components: {
        mShare
    },
    data() {
        return {
            appType: this.$store.state.appType || 0,
            programList: [],
            ikey: this.$route.query.ikey,
            sharePin: this.$route.query.pin,
            shareUrl: process.client ? `${location.href}&pin=${this.$store.state.user.id}&utm_source=charplay` : ''
        }
    },
    async asyncData({ app: { $axios }, store, route }) {
        $axios.setHeader('token', store.state.token)
        try {
            const { data } = await $axios.get(`/hybrid/api/episode/result?ikey=${route.query.ikey}`)
            const result = Object(data)
            let asin, got, aven
            result.forEach(ele => {
                if (ele.fk_episode == 1) {
                    asin = ele.percent + '% ' + ele.name
                } else if (ele.fk_episode == 2) {
                    got = ele.percent + '% ' + ele.name
                } else {
                    aven = ele.percent + '% ' + ele.name
                }
            })

            return {
                result: data,
                rolePercent: `You're ${asin}, ${got}, ${aven}.`
            }
        } catch (e) {
            return {
                result: [],
                rolePercent: ''
            }
        }
    },
    mounted() {
        this.getVideoList()
    },
    methods: {
        cdnPic(src) {
            return cdnPicSrc.call(this, src)
        },
        getVideoList() {
            this.$axios.get(`/voting/v1/program?vote_id=11`).then(res => {
                if (res.data.code === 0) {
                    this.programList = res.data.data
                }
            })
        },
        toVideo(vod) {
            if (vod && this.appType > 0) {
                if (this.appType == 1) {
                    window.getChannelId && window.getChannelId.toAppPage(3, 'com.star.mobile.video.player.PlayerVodActivity?vodId=' + vod, '')
                } else if (this.appType == 2) {
                    window.location.href = 'startimes://player?vodId=' + vod
                }
            } else if (this.appType <= 0) {
                this.loadConfirm()
            }
        },
        loadConfirm() {
            callApp.call(this, `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin + window.location.pathname}`, () => {
                this.$confirm(
                    'Download StarTimes ON Now!',
                    () => {
                        callMarket.call(this)
                    },
                    () => {},
                    'Download Now',
                    'CANCEL'
                )
            })
        },
        toShare() {
            if (this.appType > 0) {
                shareInvite(
                    `${window.location.href}&pin=${this.$store.state.user.id}&utm_source=charplay`,
                    'Characteristic Test',
                    `I got ${this.result[0].name}, ${this.result[1].name} and ${this.result[2].name}!`,
                    ''
                )
            } else {
                this.$store.commit('SET_SHARE_STATE', true)
            }
        },
        shareWithFacebook() {
            shareByFacebook.call(this, window.location.href)
        },
        copyLink() {
            copyClipboard.call(this, window.location.href)
        },
        shareWithTwitter() {
            shareByTwitter.call(this, 'Characteristic Test', window.location.href)
        }
    },
    head() {
        return {
            title: 'Characteristic Test Result',
            meta: [
                {
                    name: 'description',
                    property: 'description',
                    content: `I got ${this.result[0].name}, ${this.result[1].name} and ${this.result[2].name}!`
                },
                {
                    name: 'og:description',
                    property: 'og:description',
                    content: `I got ${this.result[0].name}, ${this.result[1].name} and ${this.result[2].name}!`
                },
                {
                    name: 'og:image',
                    property: 'og:image',
                    content: ''
                },
                { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:title', property: 'og:title', content: 'Characteristic Test' }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
#result {
    background: linear-gradient(180deg, rgba(85, 85, 85, 1) 0%, rgba(201, 183, 166, 1) 100%);
    min-height: 100vh;
    width: 100%;
    padding-bottom: 2rem;
    .character {
        width: 100%;
        padding-top: 0.8rem;
        background: url('~assets/img/naire/background4.png') no-repeat center -10px;
        background-size: cover;
        .guide {
            line-height: 2.5rem;
            .title {
                color: #ffffff;
                font-size: 1.5rem;
                text-align: center;
                text-shadow: 0px 3px 4px rgba(0, 0, 0, 1);
                // background: linear-gradient(to bottom, #b7b7b7 0%, #eeeeee 52%, #d8d8d8 100%);
                // background-clip: text;
                // -webkit-text-fill-color: transparent;
                font-weight: bold;
            }
            .logo {
                color: #ffffff;
                background: url('~assets/img/naire/group.png') no-repeat;
                background-size: contain;
                width: 25%;
                text-align: center;
                height: 2.5rem;
                line-height: 2.5rem;
                font-weight: bold;
                display: inline-block;
                box-shadow: -11px 3px 10px rgba(0, 0, 0, 0.5);
            }
            .try {
                float: right;
                color: #ffffff;
                font-weight: bold;
                text-decoration: underline;
                margin-right: 1rem;
            }
            .share {
                float: right;
                img {
                    width: 2.5rem;
                    margin-right: 0.5rem;
                }
            }
        }
        .atlas {
            text-align: center;
            background: url('~assets/img/naire/triangle.png') no-repeat center 59%;
            background-size: 65%;
            margin-top: 0.2rem;
            p {
                color: #ffffff;
                text-shadow: 0px 3px 4px rgba(0, 0, 0, 0.5);
                // background: linear-gradient(180deg, #b7b7b7 0%, #eeeeee 52%, #d8d8d8 100%);
                // -webkit-background-clip: text;
                // -webkit-text-fill-color: transparent;
                font-size: 1rem;
                &.name {
                    font-weight: bold;
                }
                &.episode {
                    background: linear-gradient(360deg, #ffbc13 0%, #fff5db 100%);
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    color: #c09017;
                }
            }
            .short {
                font-weight: bold;
                font-size: 1.25rem;
                background: linear-gradient(360deg, #dfa71a 0%, #ffe49f 71%, #edd59a 100%);
                background-clip: text;
                -webkit-text-fill-color: transparent;
                display: block;
            }
            .asintado {
                width: 50%;
                margin: 0 auto;
            }
            .other {
                width: 50%;
                float: left;
            }
            img {
                width: 60%;
            }
        }
    }
    .container {
        width: 95%;
        margin: 0 2.5%;
        text-align: center;
        .des {
            text-align: left;
            padding: 1rem 0.5rem 0;
            margin-bottom: 1rem;
            p {
                background: linear-gradient(360deg, rgba(191, 143, 22, 1) 0%, rgba(237, 213, 154, 1) 100%);
                background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 0.5rem;
                font-weight: bold;
                font-size: 1.2rem;
            }
            span {
                color: #ffffff;
                line-height: 1.35rem;
            }
        }
        .share,
        .play {
            display: inline-block;
            padding: 0 1.5rem;
            color: #63428a;
            font-size: 0.95rem;
            vertical-align: middle;
            background: linear-gradient(180deg, rgba(235, 202, 77, 1) 0%, rgba(235, 200, 112, 1) 34%, rgba(188, 147, 43, 1) 100%);
            border-radius: 20px;
            font-weight: bold;
            margin: 1rem 0;
            height: 2.5rem;
            line-height: 2.5rem;
            box-shadow: 0 3px 4px rgba(0, 0, 0, 0.5);
            img {
                width: 1.5rem;
            }
        }
        .play {
            margin: 2rem 0;
        }
        .line {
            width: 90%;
            height: 2px;
            margin: 0 auto 1.5rem;
            background: linear-gradient(
                270deg,
                rgba(131, 86, 23, 0) 0%,
                rgba(218, 178, 79, 1) 13%,
                rgba(224, 201, 158, 1) 29%,
                rgba(157, 98, 13, 1) 52%,
                rgba(175, 110, 16, 1) 72%,
                rgba(234, 170, 33, 0.63) 91%,
                rgba(143, 107, 32, 0) 100%
            );
        }
    }
    .asintado {
        width: 95%;
        margin: 0 2.5%;
        font-size: 0.8rem;
        color: #ffffff;
        .introduction {
            img {
                width: 40%;
            }
            div {
                display: inline-block;
                width: 55%;
                margin-left: 1%;
                vertical-align: top;
                line-height: 1.2rem;
            }
        }
        .comments {
            margin: 0.8rem 0;
            p {
                font-size: 1rem;
                font-weight: bold;
            }
            li {
                width: 95%;
                padding: 0.3rem;
                margin: 0.3rem auto;
                & > img {
                    width: 15%;
                }
                div {
                    display: inline-block;
                    margin-left: 5%;
                    position: relative;
                    background: #ffffff;
                    color: #666666;
                    border-radius: 16px;
                    width: 75%;
                    padding: 0.6rem 0.8rem;
                    vertical-align: middle;
                    img {
                        position: absolute;
                        width: 0.6rem;
                        top: 52%;
                        left: -0.4rem;
                        margin-top: -0.4rem;
                    }
                }
            }
        }
    }
    .clips {
        padding: 0 3% 1rem;
        background: #ffffff;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
        border-radius: 13px;
        width: 95%;
        margin: 0 2.5%;
        & > p {
            color: #333333;
            font-weight: bold;
            padding: 0.5rem 0;
        }
        li {
            list-style: none;
            float: left;
            width: 48%;
            line-height: 1.1rem;
            position: relative;
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
                .show-time {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    padding: 0 0.2rem;
                    background: rgba(0, 0, 0, 0.6);
                    color: #ffffff;
                    font-size: 0.8rem;
                }
                img {
                    width: 100%;
                    position: absolute;
                    height: 100%;
                }
            }
            .title {
                font-size: 0.95rem;
                color: #666666;
                display: -webkit-box;
                overflow: hidden;
                height: 2.6rem;
                padding-top: 0.4rem;
                -webkit-line-clamp: 2;
                /* autoprefixer: off */
                -webkit-box-orient: vertical;
            }
        }
    }
    .clearfix:after {
        display: block;
        visibility: hidden;
        clear: both;
        height: 0;
        content: '';
    }
    .clearfix {
        zoom: 1;
    }
}
</style>
