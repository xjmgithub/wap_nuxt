<template>
    <div class="wrapper">
        <div class="container">
            <img src="~assets/img/vote/BSSRegister/banner-vote.png" alt="bg-img" class="bg-img" />
            <div class="tab">
                <ul v-show="pageListReady.length>0">
                    <li v-for="(item,i) in pageListReady" :key="i" :class="i==index?'active':''">{{item.name}} {{item.start_time.replace(/-/g,'.').substr(0, 10)}}</li>
                </ul>
            </div>
            <div class="topic">
                <div class="film" @click="toPlayer(filmCode,'show')">Film</div>
                <div class="high-light" @click="toPlayer(highLightCode,'highlight')">High light</div>
                <div class="title">{{topic}}</div>
                <div class="pick-box">
                    <div class="left">
                        <img src="" alt="">
                        <div class="btn">PICK</div>
                    </div>
                    <div class="middle">
                        <div>OR</div>
                        <div>{{}} Participants</div>
                    </div>
                    <div class="right">
                        <img src="" alt="">
                        <div class="btn">PICK</div>
                    </div>
                </div>
            </div>
            <div class="comment">
                <ul v-show="commentListReady.length>0">
                    <li v-for="(item,key) in commentListReady" :id="key" :key="key" class="barrage">
                        <p>{{item.comment}}</p>
                    </li>
                </ul>
                <input v-model="commentText" type="text" placeholder="What do you think?" maxlength="100"/>
                <div class="btn" @click="sendComment">{{disabled?`${during}s`:`send`}}</div>
            </div>
            <img src="~assets/img/vote/BSSRegister/img-share.png" alt @click="toShare" />
            <div class="video">
                <img :src="videoSrc" alt @click="toPlayer(videoCode)" />
                <div class="title">{{videoTitle}}</div>
            </div>
        </div>
        <mShare />
    </div>
</template>
<script>
import { invokeByIframe, downApk, playVodinApp, shareInvite } from '~/functions/app'
import mShare from '~/components/web/share.vue'
export default {
    layout: 'base',
    components: {
        mShare
    },
    data() {
        return {
            appType: this.$store.state.appType || 0,
            isLogin: this.$store.state.user.roleName && this.$store.state.user.roleName.toUpperCase() !== 'ANONYMOUS',
            timer: null, // tab滚动定位定时器
            during: 5, // 发送弹幕后倒计时
            disabled: false, // send状态
            index: 0, // 当前所在的节目期数
            commentList: [],
            words: [
                'anal',
                'anus',
                'arse',
                'ass',
                'ballsack',
                'balls',
                'bastard',
                'bitch',
                'biatch',
                'bloody',
                'blowjob',
                'blow job',
                'bollock',
                'bollok',
                'boner',
                'boob',
                'bugger',
                'bum',
                'butt',
                'buttplug',
                'clitoris',
                'cock',
                'coon',
                'crap',
                'cunt',
                'damn',
                'dick',
                'dildo',
                'dyke',
                'fag',
                'feck',
                'fellate',
                'fellatio',
                'felching',
                'fuck',
                'f u c k',
                'fudgepacker',
                'fudge packer',
                'flange',
                'Goddamn',
                'God damn',
                'hell',
                'homo',
                'jerk',
                'jizz',
                'knobend',
                'knob end',
                'labia',
                'lmao',
                'lmfao',
                'muff',
                'nigger',
                'nigga',
                'omg',
                'penis',
                'piss',
                'poop',
                'prick',
                'pube',
                'pussy',
                'queer',
                'scrotum',
                'sex',
                'shit',
                's hit',
                'sh1t',
                'slut',
                'smegma',
                'spunk',
                'tit',
                'tosser',
                'turd',
                'twat',
                'vagina',
                'wank',
                'whore',
                'wtf'
            ],
            timeList: [],
            pageList: [],
            pageWidth: 0, // 页面可视区域宽度
            count: 0, // 当前完全滚入屏幕的弹幕下标
            speed: 500, // 弹幕速度，越大越慢
            space: 0, // 两行弹幕的间隔
            time: null, // 弹幕滚动定时器
            commentText: '', // 发送的内容
            loaded_page: false,
            loaded_comment: false,
            vote_id: 0,
            filmCode: '',
            highLightCode: '',
            topic: '',
            videoSrc: '',
            videoCode: '',
            videoTitle: '',

            title: 'Dream Destination',
            imgUrl: '',
            shareTitle: '',
            shareText: '',
            content: ''
        }
    },
    computed: {
        commentListReady() {
            if (this.loaded_comment) {
                console.log(this.commentList)
                return this.commentList
            } else {
                return []
            }
        },
        pageListReady() {
            if (this.loaded_page) {
                return this.pageList
            } else {
                return []
            }
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
        this.pageWidth = document.body.clientWidth
        this.getPagelist()
        this.getSource()
    },
    methods: {
        getDom(id) {
            return document.getElementById(id)
        },
        mSendEvLog(action, label, value) {
            this.sendEvLog({
                category: 'vote_DreamDestination_' + this.platform,
                action: action,
                label: label,
                value: value
            })
            console.log(action, label, value)
        },
        callOrDownApp() {
            // 唤醒App
            invokeByIframe.call(this, 'com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.href, () => {
                // 下载App
                this.$confirm(
                    'Download StarTimes ON app to watch the most-discussed Reality Show!',
                    () => {
                        this.mSendEvLog('downloadpopup_clickok', '', '')
                        downApk.call(this)
                    },
                    () => {
                        this.mSendEvLog('downloadpopup_clicknot', '', '')
                    },
                    'DOWNLOAD',
                    'CANCEL'
                )
            })
        },
        toPlayer(code, label) {
            label ? this.mSendEvLog('button_click', label, '') : this.mSendEvLog('video_click', '', '')
            if (this.appType == 0) {
                this.callOrDownApp('pic')
                return
            }
            if (code) {
                playVodinApp.call(this, this.appType, code)
            }
        },
        toShare() {
            this.mSendEvLog('share_click', '', '')
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
        // 获取正片，highLight，话题，相关视频，分享文案
        getSource() {
            this.vote_id = 17
            this.$axios
                .get(`/voting/v1/program?vote_id=${this.vote_id}`)
                .then(res => {
                    if (res.data.code === 0) {
                        this.sourceList = res.data.data
                        this.sourceList.forEach(item => {
                            if (item.name == 'a') {
                                // 正片
                                this.filmCode = item.link_vod_code
                            } else if (item.name == 'b') {
                                // highLight
                                this.highLightCode = item.link_vod_code
                            } else if (item.name == 'c') {
                                // 话题
                                this.topic = item.description
                            } else if (item.name == 'd') {
                                // 相关视频
                                this.videoSrc = item.cover
                                this.videoCode = item.link_vod_code
                                this.videoTitle = item.description
                            } else if (item.name == 'e') {
                                // 分享文案
                                this.imgUrl = item.cover
                                this.shareTitle = item.description.substring(item.description.indexOf('[') + 1, item.description.indexOf(']'))
                                this.shareText = item.description.substr(item.description.indexOf(']') + 1)
                                this.content = this.shareText
                            }
                        })
                    } else {
                        this.$alert('Get source list error!')
                    }
                })
                .catch(err => {
                    this.$alert('Get source list error! ' + err)
                })
        },
        // 获取期数，播出时间，票数，状态，投票单元
        getPagelist() {
            this.pageList = [
                {
                    name: 'EP1',
                    start_time: '2019-10-27T00:00:00',
                    end_time: '2019-11-02T23:59:59',
                    number: 3018,
                    left_count: 1,
                    list: [
                        {
                            ballot_num: 3700,
                            created_time: '2019-10-10T11:05:22',
                            icon: 'http://cdn.startimestv.com/banner/76358.jpg',
                            id: 681,
                            index: 42,
                            link_vod_code: '76358',
                            name: 'Gabriel jr',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:22',
                            user_ballot_num: 0
                        },
                        {
                            ballot_num: 3401,
                            created_time: '2019-10-10T11:05:21',
                            icon: 'http://cdn.startimestv.com/banner/76362.jpg',
                            id: 677,
                            index: 38,
                            link_vod_code: '76362',
                            name: 'Margaritha Patrick',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:21',
                            user_ballot_num: 0
                        }
                    ]
                },
                {
                    name: 'EP2',
                    start_time: '2019-11-03T00:00:00',
                    end_time: '2019-11-09T23:59:59',
                    number: 3434,
                    left_count: 1,
                    list: [
                        {
                            ballot_num: 3700,
                            created_time: '2019-10-10T11:05:22',
                            icon: 'http://cdn.startimestv.com/banner/76358.jpg',
                            id: 681,
                            index: 42,
                            link_vod_code: '76358',
                            name: 'Gabriel jr',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:22',
                            user_ballot_num: 0
                        },
                        {
                            ballot_num: 3401,
                            created_time: '2019-10-10T11:05:21',
                            icon: 'http://cdn.startimestv.com/banner/76362.jpg',
                            id: 677,
                            index: 38,
                            link_vod_code: '76362',
                            name: 'Margaritha Patrick',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:21',
                            user_ballot_num: 0
                        }
                    ]
                },
                {
                    name: 'EP3',
                    start_time: '2019-11-10T00:00:00',
                    end_time: '2019-11-16T23:59:59',
                    number: 9756,
                    left_count: 1,
                    list: [
                        {
                            ballot_num: 3700,
                            created_time: '2019-10-10T11:05:22',
                            icon: 'http://cdn.startimestv.com/banner/76358.jpg',
                            id: 681,
                            index: 42,
                            link_vod_code: '76358',
                            name: 'Gabriel jr',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:22',
                            user_ballot_num: 0
                        },
                        {
                            ballot_num: 3401,
                            created_time: '2019-10-10T11:05:21',
                            icon: 'http://cdn.startimestv.com/banner/76362.jpg',
                            id: 677,
                            index: 38,
                            link_vod_code: '76362',
                            name: 'Margaritha Patrick',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:21',
                            user_ballot_num: 0
                        }
                    ]
                },
                {
                    name: 'EP4',
                    start_time: '2019-11-17T00:00:00',
                    end_time: '2019-11-23T23:59:59',
                    number: 3456,
                    left_count: 1,
                    list: [
                        {
                            ballot_num: 3700,
                            created_time: '2019-10-10T11:05:22',
                            icon: 'http://cdn.startimestv.com/banner/76358.jpg',
                            id: 681,
                            index: 42,
                            link_vod_code: '76358',
                            name: 'Gabriel jr',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:22',
                            user_ballot_num: 0
                        },
                        {
                            ballot_num: 3401,
                            created_time: '2019-10-10T11:05:21',
                            icon: 'http://cdn.startimestv.com/banner/76362.jpg',
                            id: 677,
                            index: 38,
                            link_vod_code: '76362',
                            name: 'Margaritha Patrick',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:21',
                            user_ballot_num: 0
                        }
                    ]
                },
                {
                    name: 'EP5',
                    start_time: '2019-11-24T00:00:00',
                    end_time: '2019-11-30T23:59:59',
                    number: 7435,
                    left_count: 1,
                    list: [
                        {
                            ballot_num: 3700,
                            created_time: '2019-10-10T11:05:22',
                            icon: 'http://cdn.startimestv.com/banner/76358.jpg',
                            id: 681,
                            index: 42,
                            link_vod_code: '76358',
                            name: 'Gabriel jr',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:22',
                            user_ballot_num: 0
                        },
                        {
                            ballot_num: 3401,
                            created_time: '2019-10-10T11:05:21',
                            icon: 'http://cdn.startimestv.com/banner/76362.jpg',
                            id: 677,
                            index: 38,
                            link_vod_code: '76362',
                            name: 'Margaritha Patrick',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:21',
                            user_ballot_num: 0
                        }
                    ]
                },
                {
                    name: 'EP6',
                    start_time: '2019-12-01T00:00:00',
                    end_time: '2019-12-07T23:59:59',
                    number: 8321,
                    left_count: 1,
                    list: [
                        {
                            ballot_num: 3700,
                            created_time: '2019-10-10T11:05:22',
                            icon: 'http://cdn.startimestv.com/banner/76358.jpg',
                            id: 681,
                            index: 42,
                            link_vod_code: '76358',
                            name: 'Gabriel jr',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:22',
                            user_ballot_num: 0
                        },
                        {
                            ballot_num: 3401,
                            created_time: '2019-10-10T11:05:21',
                            icon: 'http://cdn.startimestv.com/banner/76362.jpg',
                            id: 677,
                            index: 38,
                            link_vod_code: '76362',
                            name: 'Margaritha Patrick',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:21',
                            user_ballot_num: 0
                        }
                    ]
                },
                {
                    name: 'EP7',
                    start_time: '2019-12-08T00:00:00',
                    end_time: '2019-12-14T23:59:59',
                    number: 1543,
                    left_count: 1,
                    list: [
                        {
                            ballot_num: 3700,
                            created_time: '2019-10-10T11:05:22',
                            icon: 'http://cdn.startimestv.com/banner/76358.jpg',
                            id: 681,
                            index: 42,
                            link_vod_code: '76358',
                            name: 'Gabriel jr',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:22',
                            user_ballot_num: 0
                        },
                        {
                            ballot_num: 3401,
                            created_time: '2019-10-10T11:05:21',
                            icon: 'http://cdn.startimestv.com/banner/76362.jpg',
                            id: 677,
                            index: 38,
                            link_vod_code: '76362',
                            name: 'Margaritha Patrick',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:21',
                            user_ballot_num: 0
                        }
                    ]
                },
                {
                    name: 'EP8',
                    start_time: '2019-12-15T00:00:00',
                    end_time: '2019-12-21T23:59:59',
                    number: 8877,
                    left_count: 1,
                    list: [
                        {
                            ballot_num: 3700,
                            created_time: '2019-10-10T11:05:22',
                            icon: 'http://cdn.startimestv.com/banner/76358.jpg',
                            id: 681,
                            index: 42,
                            link_vod_code: '76358',
                            name: 'Gabriel jr',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:22',
                            user_ballot_num: 0
                        },
                        {
                            ballot_num: 3401,
                            created_time: '2019-10-10T11:05:21',
                            icon: 'http://cdn.startimestv.com/banner/76362.jpg',
                            id: 677,
                            index: 38,
                            link_vod_code: '76362',
                            name: 'Margaritha Patrick',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:21',
                            user_ballot_num: 0
                        }
                    ]
                },
                {
                    name: 'EP9',
                    start_time: '2019-12-22T00:00:00',
                    end_time: '2019-12-28T23:59:59',
                    number: 8523,
                    left_count: 1,
                    list: [
                        {
                            ballot_num: 3700,
                            created_time: '2019-10-10T11:05:22',
                            icon: 'http://cdn.startimestv.com/banner/76358.jpg',
                            id: 681,
                            index: 42,
                            link_vod_code: '76358',
                            name: 'Gabriel jr',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:22',
                            user_ballot_num: 0
                        },
                        {
                            ballot_num: 3401,
                            created_time: '2019-10-10T11:05:21',
                            icon: 'http://cdn.startimestv.com/banner/76362.jpg',
                            id: 677,
                            index: 38,
                            link_vod_code: '76362',
                            name: 'Margaritha Patrick',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:21',
                            user_ballot_num: 0
                        }
                    ]
                },
                {
                    name: 'EP10',
                    start_time: '2019-12-29T00:00:00',
                    end_time: '2020-01-04T23:59:59',
                    number: 1538,
                    left_count: 1,
                    list: [
                        {
                            ballot_num: 3700,
                            created_time: '2019-10-10T11:05:22',
                            icon: 'http://cdn.startimestv.com/banner/76358.jpg',
                            id: 681,
                            index: 42,
                            link_vod_code: '76358',
                            name: 'Gabriel jr',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:22',
                            user_ballot_num: 0
                        },
                        {
                            ballot_num: 3401,
                            created_time: '2019-10-10T11:05:21',
                            icon: 'http://cdn.startimestv.com/banner/76362.jpg',
                            id: 677,
                            index: 38,
                            link_vod_code: '76362',
                            name: 'Margaritha Patrick',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:21',
                            user_ballot_num: 0
                        }
                    ]
                },
                {
                    name: 'EP11',
                    start_time: '2020-01-05T00:00:00',
                    end_time: '2020-01-11T23:59:59',
                    number: 4638,
                    left_count: 1,
                    list: [
                        {
                            ballot_num: 3700,
                            created_time: '2019-10-10T11:05:22',
                            icon: 'http://cdn.startimestv.com/banner/76358.jpg',
                            id: 681,
                            index: 42,
                            link_vod_code: '76358',
                            name: 'Gabriel jr',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:22',
                            user_ballot_num: 0
                        },
                        {
                            ballot_num: 3401,
                            created_time: '2019-10-10T11:05:21',
                            icon: 'http://cdn.startimestv.com/banner/76362.jpg',
                            id: 677,
                            index: 38,
                            link_vod_code: '76362',
                            name: 'Margaritha Patrick',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:21',
                            user_ballot_num: 0
                        }
                    ]
                },
                {
                    name: 'EP12',
                    start_time: '2020-01-12T00:00:00',
                    end_time: '2020-01-18T23:59:59',
                    number: 1878,
                    left_count: 1,
                    list: [
                        {
                            ballot_num: 3700,
                            created_time: '2019-10-10T11:05:22',
                            icon: 'http://cdn.startimestv.com/banner/76358.jpg',
                            id: 681,
                            index: 42,
                            link_vod_code: '76358',
                            name: 'Gabriel jr',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:22',
                            user_ballot_num: 0
                        },
                        {
                            ballot_num: 3401,
                            created_time: '2019-10-10T11:05:21',
                            icon: 'http://cdn.startimestv.com/banner/76362.jpg',
                            id: 677,
                            index: 38,
                            link_vod_code: '76362',
                            name: 'Margaritha Patrick',
                            show: true,
                            state: 2147483647,
                            updated_time: '2019-10-10T11:05:21',
                            user_ballot_num: 0
                        }
                    ]
                }
            ]
            this.loaded_page = true
            this.$nextTick(() => {
                this.initPage()
                this.getCommentList()
            })
        },
        getCommentList() {
            this.commentList = [
                {
                    user_icon: 'http://touxiang.com',
                    user_name: 'text3',
                    comment: 'commentone2',
                    index: 1
                },
                {
                    user_icon: 'http://touxiang.com',
                    user_name: 'text1',
                    comment: 'commentone1',
                    index: 2
                },
                {
                    user_icon: 'http://touxiang.com',
                    user_name: 'text1234567890',
                    comment: 'commentone1commentone1commentone1commentone1commentone1commentone1',
                    index: 3
                },
                {
                    user_icon: 'http://touxiang.com',
                    user_name: 'text4',
                    comment: 'commentone1234',
                    index: 4
                },
                {
                    user_icon: 'http://touxiang.com',
                    user_name: 'text123456789',
                    comment: 'commentone1commentone1commentone1',
                    index: 5
                },
                {
                    user_icon: 'http://touxiang.com',
                    user_name: 'text2',
                    comment: 'commentone12',
                    index: 6
                },

                {
                    user_icon: 'http://touxiang.com',
                    user_name: 'textte777',
                    comment: 'commentone1234567',
                    index: 7
                },
                {
                    user_icon: 'http://touxiang.com',
                    user_name: 'texttext5',
                    comment: 'commentone12345',
                    index: 8
                },
                {
                    user_icon: 'http://touxiang.com',
                    user_name: 'textteww88888',
                    comment: 'commentone12345678',
                    index: 9
                },
                {
                    user_icon: 'http://touxiang.com',
                    user_name: 'textt6',
                    comment: 'commentone123456',
                    index: 10
                },
                {
                    user_icon: 'http://touxiang.com',
                    user_name: 'textt6',
                    comment: 'commentone123456',
                    index: 11
                },
                {
                    user_icon: 'http://touxiang.com',
                    user_name: 'textt6',
                    comment: 'commentone123456',
                    index: 12
                }
            ]
            this.loaded_comment = true
            this.$nextTick(() => {
                this.initComment()
            })
        },
        initPage() {
            // tab
            const tabBox = document.querySelector('.tab ul')
            const liItems = document.querySelectorAll('.tab ul li')
            this.pageList.forEach((item,index)=>{
                this.timeList.push(new Date(item.start_time.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime())
            })
            console.log(this.timeList)
            for (let i = 0; i < liItems.length; i++) {
                liItems[i].onclick = () => {
                    this.index = i
                    const offsetLeft = liItems[this.index].offsetLeft
                    const scrollX = tabBox.scrollLeft
                    const clientX = tabBox.clientWidth
                    const childClientX = liItems[this.index].clientWidth
                    const speed = offsetLeft - scrollX + childClientX / 2 - clientX / 2
                    const s = speed / 30
                    const totalX = speed + scrollX
                    this.timer = setInterval(() => {
                        tabBox.scrollLeft += s
                        if (
                            tabBox.scrollLeft <= 0 ||
                            tabBox.scrollLeft >= tabBox.scrollWidth - clientX ||
                            (speed > 0 && tabBox.scrollLeft > totalX) ||
                            (speed < 0 && tabBox.scrollLeft < totalX)
                        ) {
                            clearInterval(this.timer)
                        }
                    }, 5)
                }
            }
        },
        initComment() {
            for (let i = 0; i < this.commentList.length; i++) {
                const commentItem = document.getElementById(i)
                const commentWidth = commentItem.offsetWidth
                commentItem.style.width = commentWidth + 15 + 'px'
                commentItem.style.top = '0px'
            }
            this.animate(this.getDom(this.count), -this.getDom(this.count).offsetWidth, this.getDom(this.count).offsetWidth / this.speed) // 除数越大越慢
        },
        animate(dom, num, speed) {
            let flag = true
            const time = setInterval(() => {
                if (num > this.space && flag) {
                    flag = false
                    console.log(this.count + ' has finished ')
                    this.count++
                    if (this.count > this.commentList.length - 1) {
                        console.log('finished all')
                        this.count = 0
                    }
                    this.getDom(this.count).style.top = (this.count % 4) * 25 + 'px'
                    this.animate(this.getDom(this.count), -this.getDom(this.count).offsetWidth, this.getDom(this.count).offsetWidth / this.speed)
                }
                if (num <= this.pageWidth + 20) {
                    dom.style.right = num + 'px'
                    num += speed
                } else {
                    clearInterval(time)
                }
            }, 4)
        },
        sendComment() {
            // 防多点
            if (this.disabled) {
                return
            }
            this.disabled = true
            // web引导下载
            if (this.appType == 0) {
                this.callOrDownApp('pic')
                this.disabled = false
                return
            }
            // 输入为空
            if (!this.commentText) {
                this.disabled = false
                return
            }
            // 屏蔽词
            let flag = false
            this.commentText
                .toLowerCase()
                .match(/[a-zA-Z]+/gi)
                .forEach((item, index) => {
                    if (this.words.indexOf(item) >= 0) flag = true
                })
            if (flag || /f u c k|fudge packer|God damn|knob end|knob end/g.test(this.commentText.toLowerCase())) {
                this.commentText = ''
                this.$alert('Your comment contains inappropriate contents. Please remove the words that may cause offence', () => {}, 'GOT IT')
                this.disabled = false
                return
            }
            // 调用发送评论接口
            // then 成功回调里
            const during = this.during
            const item = document.createElement('span')
            item.innerHTML = this.commentText
            document.getElementsByClassName('comment')[0].appendChild(item)
            const itemWidth = item.offsetWidth
            item.style.backgroundColor = 'greenyellow'
            item.style.height = 20 + 'px'
            item.style.position = 'absolute'
            item.style.right = -2000 + 'px'
            item.style.width = itemWidth + 15 + 'px'
            let lineNum
            if (this.count >= 2) {
                lineNum = this.count - 2
            } else {
                lineNum = this.count + this.commentList.length - 2
            }
            item.style.top = (lineNum % 4) * 25 + 'px'
            let num = -itemWidth
            const time = setInterval(() => {
                if (num <= this.pageWidth + 20) {
                    item.style.right = num + 'px'
                    num += itemWidth / this.speed
                } else {
                    clearInterval(time)
                }
            }, 4)
            console.log('call' + lineNum)
            const duringTime = setInterval(() => {
                this.during--
                if (this.during == 0) {
                    clearInterval(duringTime)
                    this.during = during
                    this.disabled = false
                }
            }, 1000)
            this.commentText = ''
            // 失败 TODO弹窗
        }
    },
    head() {
        return {
            title: 'test'
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/vote/index.less';
.wrapper {
    .container {
        > img {
            display: block;
            margin: 0 auto;
            padding-top: 0.5rem;
            width: 95%;
            height: auto;
        }
        .tab {
            ul {
                width: 100%;
                height: 35px;
                display: block;
                white-space: nowrap;
                overflow: hidden;
                overflow-x: auto;
                font-size: 0;
                li {
                    width: 120px;
                    height: 35px;
                    display: inline-block;
                    border: 1px solid red;
                    text-align: center;
                    line-height: 35px;
                    font-size: 1rem;
                    &.active {
                        background-color: lightsalmon;
                    }
                }
            }
        }
        .comment {
            position: relative;
            overflow: hidden;
            ul {
                background-color: lightpink;
                width: 100%;
                height: 120px;
                position: relative;
                overflow: hidden;
                .barrage {
                    background-color: #fff;
                    height: 20px;
                    position: absolute;
                    right: -2000px;
                    z-index: 2;
                }
            }
            input {
                outline: none;
                display: block;
                border: 1px solid black;
                width: 80%;
                height: 1.5rem;
                margin: 1rem auto 0;
            }
            .btn {
                width: 100px;
                height: 20px;
                margin: 10px auto;
                border: 1px solid red;
            }
        }
        .video {
            > img {
                width: 100%;
            }
        }
    }
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
}
</style>
