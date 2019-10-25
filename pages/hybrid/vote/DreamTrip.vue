<template>
    <div class="wrapper">
        <div class="container">
            <img src="~assets/img/vote/DreamTrip/bg_banner.png" alt="bg-img" class="bg-img" />
            <div class="tab">
                <img src="~assets/img/vote/DreamTrip/btn_share.png" alt class="share-btn" @click="toShare" />
                <ul v-show="pageListReady.length>0">
                    <li v-for="(item,i) in pageListReady" :key="i" class="lis" :class="i==index?'active':''" @click="tabClick(i)">
                        <p class="ep">{{item.group_name}}</p>
                        <p class="time">{{item.start_time.substr(0, 10)}}</p>
                    </li>
                </ul>
            </div>
            <div class="video-btn">
                <img class="film" src="~assets/img/vote/DreamTrip/btn_full.png" alt @click="toPlayer(filmCode,'show')" />
                <img class="cloud" src="~assets/img/vote/DreamTrip/img_clound1.png" alt />
                <img class="high-light" src="~assets/img/vote/DreamTrip/btn_highlight.png" alt @click="toPlayer(highLightCode,'highlight')" />
            </div>
            <div class="topic">
                <img class="title" :src="cdnPic(topic)" alt />
                <div class="pick-box">
                    <div class="left">
                        <div>
                            <img v-if="pageListReady[index]" :src="cdnPic(pageListReady[index].candidates[0].icon)" alt />
                        </div>
                    </div>
                    <div class="middle">
                        <img src="~assets/img/vote/DreamTrip/img-vs.png" alt />
                        <p>{{allNum}}</p>
                        <img src="~assets/img/vote/DreamTrip/text1.png" alt />
                    </div>
                    <div class="right">
                        <div>
                            <img v-if="pageListReady[index]" :src="cdnPic(pageListReady[index].candidates[1].icon)" alt />
                        </div>
                    </div>
                    <div v-show="!picked||appType==0" class="pick">
                        <div v-if="pageListReady[index]" class="btn" @click="handlePick('left',pageListReady[index].candidates)">PICK</div>
                        <div v-if="pageListReady[index]" class="btn" @click="handlePick('right',pageListReady[index].candidates)">PICK</div>
                    </div>
                    <div v-show="picked&&appType>0" class="progress" :class="pick_click">
                        <div class="bar l"></div>
                        <div class="bar r"></div>
                        <div class="left">{{leftNum}}%</div>
                        <div class="right">{{rightNum}}%</div>
                        <span class="icon-y"></span>
                        <span class="icon-b"></span>
                        <span class="add-one l" :class="l_click">+1</span>
                        <span class="add-one r" :class="r_click">+1</span>
                    </div>
                </div>
                <img class="cloud2" src="~assets/img/vote/DreamTrip/img_clound2.png" alt />
                <img class="cloud3" src="~assets/img/vote/DreamTrip/img_clound3.png" alt />
            </div>
            <div id="comment" class="comment">
                <div class="comment-box">
                    <ul v-show="commentListReady.length>0">
                        <li v-for="(item,key) in commentListReady" :id="key" :key="key" class="barrage">
                            <img :src="cdnPic(item.user_icon)" alt />
                            <p>{{item.comment}}</p>
                        </li>
                    </ul>
                </div>
                <div class="send-box">
                    <textarea v-model="commentText" type="text" placeholder="What do you think?" maxlength="100" @focus="inputFocus" />
                    <div class="btn" @click="sendComment">{{disabled?`${during}s`:`SEND`}}</div>
                </div>
            </div>
            <div class="bg-bottom">
                <img class="bg-img" src="~assets/img/vote/DreamTrip/bg_down.png" alt />
                <div class="bottom-item">
                    <img src="~assets/img/vote/DreamTrip/img_share.png" alt @click="toShare" />
                    <div class="video" @click="toPlayer(videoCode,'',videoId)">
                        <div class="div">
                            <img :src="cdnPic(videoSrc)" alt />
                        </div>
                        <img src="~assets/img/vote/DreamTrip/btn-play.png" alt class="play" />
                        <div class="title">{{videoTitle}}</div>
                    </div>
                </div>
            </div>
        </div>
        <mShare />
        <div v-show="tip" class="vote-toast">{{tip}}</div>
    </div>
</template>
<script>
import qs from 'qs'
import { Base64 } from 'js-base64'
import { cdnPicSrc } from '~/functions/utils'
import { callApp, downApk, playVodinApp, shareInvite } from '~/functions/app'
import mShare from '~/components/web/share.vue'
export default {
    layout: 'base',
    components: {
        mShare
    },
    data() {
        return {
            // appType: this.$store.state.appType || 0,
            appType: 1,
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
            pick_click: {
                show_in: false
            },
            r_click: {
                r_show: false
            },
            l_click: {
                l_show: false
            },
            timeList: [],
            currentPage: 1, // 当前所在期数
            pageList: [],
            leftNum: 0,
            rightNum: 0,
            leftNumVal: 0,
            rightNumVal: 0,
            allNum: 0,
            picked: false, // 是否已经投票
            canVote: true, // 防多pick
            lineSpace: 40,
            pageWidth: 0, // 页面可视区域宽度
            count: 0, // 当前完全滚入屏幕的弹幕下标
            speed: 200, // 弹幕速度，越大越慢
            space: -60, // 两行弹幕的间隔
            time: null, // 弹幕滚动定时器
            commentText: '', // 发送的内容
            loaded_page: false,
            loaded_comment: false,
            vote_id: 17,
            filmCode: '',
            highLightCode: '',
            topic: '',
            videoSrc: '',
            videoCode: '',
            videoTitle: '',
            videoId: '',
            tip: '',

            title: 'Dream Destination',
            imgUrl: '',
            shareTitle: 'Dream Destination',
            shareText: '',
            content: ''
        }
    },
    computed: {
        commentListReady() {
            if (this.loaded_comment) {
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
    watch: {
        picked() {
            if (this.show_l) {
                this.l_click = {
                    l_show: true,
                    r_show: false
                }
                this.pick_click = {
                    show_in: true
                }
            } else if (this.show_r) {
                this.r_click = {
                    l_show: false,
                    r_show: true
                }
                this.pick_click = {
                    show_in: true
                }
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
        this.nowarp()
    },
    methods: {
        nowarp() {
            const textdom = document.getElementsByTagName('textarea')[0]
            textdom.addEventListener('keydown', e => {
                if (e.keyCode == 13) {
                    this.sendComment()
                    e.preventDefault()
                }
            })
        },
        initPage(i) {
            // tab
            const tabBox = document.querySelector('.tab ul')
            const item = document.getElementsByClassName('lis')[i]
            const offsetLeft = item.offsetLeft
            const scrollX = tabBox.scrollLeft
            const clientX = tabBox.clientWidth
            const childClientX = item.clientWidth
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
            // source资源
            this.sourceList.forEach(item => {
                if (item.name == 'a' + (this.index + 1)) {
                    // 正片
                    this.filmCode = item.link_vod_code
                } else if (item.name == 'b' + (this.index + 1)) {
                    // highLight
                    this.highLightCode = item.link_vod_code
                } else if (item.name == 'c' + (this.index + 1)) {
                    // 话题
                    this.topic = item.cover
                } else if (item.name == 'd' + (this.index + 1)) {
                    // 相关视频
                    this.videoSrc = item.cover
                    this.videoCode = item.link_vod_code
                    this.videoTitle = item.description
                    this.videoId = item.id
                    this.mSendEvLog('video_show', item.id, 1)
                } else if (item.name == 'e' + (this.index + 1)) {
                    // 分享文案
                    this.imgUrl = item.cover
                    this.shareText = item.description
                    this.content = this.shareText
                }
            })

            // pageList数据
            // 投票状态
            this.pageList[this.index].ticket_num > 0 ? (this.picked = false) : (this.picked = true)
            // 参与人数 百分比
            this.allNum = this.pageList[this.index].candidates[0].ballot_num + this.pageList[this.index].candidates[1].ballot_num
            this.leftNumVal = this.pageList[this.index].candidates[0].ballot_num
            this.rightNumVal = this.pageList[this.index].candidates[1].ballot_num
            this.leftNum = parseInt((this.leftNumVal / this.allNum) * 100)
            this.rightNum = 100 - this.leftNum
            const domLeft = document.getElementsByClassName('bar')[0]
            const domRight = document.getElementsByClassName('bar')[1]
            domLeft.style.width = 0.9 * this.leftNum + '%'
            domRight.style.width = 0.9 * this.rightNum + '%'
            if (this.leftNum == 100) {
                domLeft.style.borderRadius = '0.4rem'
            } else if (this.rightNum == 100) {
                domRight.style.borderRadius = '0.4rem'
            } else {
                domLeft.style.borderRadius = '0.4rem 0 0 0.4rem'
                domRight.style.borderRadius = '0 0.4rem 0.4rem 0'
            }
        },
        tabClick(i) {
            if (i < this.currentPage) {
                this.mSendEvLog('tab_click', '', 1)
                this.index = i
                this.initPage(this.index)
            } else {
                this.tipShow('Stay tuned!')
            }
        },
        inputFocus() {
            document.getElementById('comment').scrollIntoView()
        },
        getIndexToIns(arr, num) {
            const index = arr.sort((a, b) => a - b).findIndex(currentPage => num <= currentPage)
            return index <= 0 ? 1 : index
        },
        getDom(id) {
            return document.getElementById(id)
        },
        cdnPic(src) {
            return cdnPicSrc.call(this, src)
        },
        mSendEvLog(action, label, value) {
            this.sendEvLog({
                category: 'vote_DreamDestination_' + this.platform,
                action: action,
                label: label,
                value: value
            })
            console.log('vote_DreamDestination_' + this.platform, action, label, value)
        },
        callOrDownApp() {
            // 唤醒App
            callApp.call(this, 'com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.href, () => {
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
        toPlayer(code, label1, label2) {
            label1 ? this.mSendEvLog('button_click', label1, 1) : this.mSendEvLog('video_click', label2, 1)
            if (this.appType == 0) {
                this.callOrDownApp()
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
            this.$axios
                .get(`/voting/v1/program?vote_id=${this.vote_id}`)
                .then(res => {
                    if (res.data.code === 0) {
                        this.sourceList = res.data.data
                        this.initPage(this.index)
                    } else {
                        this.$alert('Get source list error!')
                    }
                })
                .catch(err => {
                    this.$alert('Get source list error!! ' + err)
                })
        },
        // 获取期数，播出时间，票数，状态，投票单元
        getPagelist() {
            this.$axios
                .get(`/voting/v3/candidates-show?vote_id=${this.vote_id}`)
                .then(res => {
                    if (res.data.code === 0) {
                        this.pageList = res.data.data
                        this.pageList.forEach((item, index) => {
                            this.timeList.push(new Date(item.start_time.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime())
                        })
                        this.currentPage = this.getIndexToIns(this.timeList, this.serverTime)
                        // console.log('currentPage: '+this.currentPage)
                        this.index = this.currentPage - 1
                    } else {
                        this.pageList = []
                        this.$alert('Get page list error!')
                    }
                    this.loaded_page = true
                    this.getSource()
                    this.getCommentList()
                })
                .catch(err => {
                    this.pageList = []
                    this.$alert('Get page list error!! ' + err)
                })
        },
        getCommentList() {
            this.commentList = [
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/53270_adf0ecfc-d6e1-46c1-9a72-389cfbf0a857.png',
                    comment: "I'm coming!",
                    index: 1
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/71986_198e59a9-798c-468e-85d1-a1b3579ca44b.png',
                    comment: 'Good topic! ',
                    index: 2
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/209914_5dd6bd59-d6c0-435f-86d8-5609cbb53036.png',
                    comment: 'I have no money to over spend',
                    index: 3
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/282681_d98028f5-f992-4e98-b9e5-b23c14cf1f22.png',
                    comment: 'My bf snores loudly!!! Frustrating!',
                    index: 4
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/9b97f6ea-82c8-448a-a3d9-0481c9d6b1de.png',
                    comment: 'Finding a like-minded friend to travel together is too difficult',
                    index: 5
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/325175_86155557-637c-46d4-b42c-faa00e337463.png',
                    comment: 'hahahhaha',
                    index: 6
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/331990_bf80ffad-c297-4772-839e-98ac541a72d1.png',
                    comment: 'Coming',
                    index: 7
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/363179_6fc66c2b-eedd-475f-819e-0c51aad63d35.png',
                    comment: 'My friend eat too much. ',
                    index: 8
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/527595_67d6c87a-4aaa-4c95-869a-c23008794322.png',
                    comment: 'If someone is insufferable, why travel with him/her?',
                    index: 9
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/7a409fd4-3772-43a9-b37e-3b79a8b6a692.png',
                    comment: 'Lol snore',
                    index: 10
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/9366d275-a8ca-4dbb-a803-11ae1ea036a9.png',
                    comment: 'Once I travelled with my friend, she took selfies all the way...',
                    index: 11
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/528768_590fb865-865c-4b38-9f64-a2e1af37f0e1.png',
                    comment: 'hahh',
                    index: 12
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/448233_09e30309-25ab-4259-b025-dd8ad0cc6b53.png',
                    comment: 'I hate planning...',
                    index: 13
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/448364_487cb204-9de9-4d98-b388-5a1ee493203f.png',
                    comment: 'My friend borrowed money from me, and never payed it back',
                    index: 14
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/527192_44e27dd1-553c-4532-b019-74ac2ad98460.png',
                    comment: 'Tired',
                    index: 15
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/493723_8e049223-ef81-4354-b67f-b42295535522.png',
                    comment: 'Never go out with a penny pinching person!',
                    index: 16
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/456623_93ab7c23-c038-4e63-b01f-3ac1fc0d5c7c.png',
                    comment: 'what!',
                    index: 17
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/523066_6c370679-fb08-43a6-ab4b-a1ff116b51a3.png',
                    comment: 'Some say that the best way to test friendship is to have a trip together.',
                    index: 18
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/457981_65e64b8d-c7c0-4dc9-9a64-3b8805884ab0.png',
                    comment: 'so interesting here!',
                    index: 19
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/458061_56a33dc5-7bd7-4933-bfe0-36be4fef1e0b.png',
                    comment: "I can't bear old-fashioned people",
                    index: 20
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/458610_9e9891d7-eae9-488d-a960-c2016fe8eb72.png',
                    comment: 'just try it',
                    index: 21
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/464726_073aa80e-395c-4b11-aa9f-2d7aad72ae3e.png',
                    comment: "I'm Roger's big fan!",
                    index: 22
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/465929_6265bcbb-bdca-4a80-a993-9a157cab1e7d.png',
                    comment: 'motion sickness ',
                    index: 23
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/466167_34d77c68-ac3b-4f5c-9df0-2fc1af5e272a.png',
                    comment: 'overnice',
                    index: 24
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/526176_7a37f9cf-9886-447a-9ba1-3ea6b6aff161.png',
                    comment: '??',
                    index: 25
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/527409_ac436c74-14c2-49ba-930a-eb071cc76205.png',
                    comment: 'My wallet forbids me to go out with lavish spending people.',
                    index: 26
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/467431_cb5dcc9d-3f5b-41f2-ba1a-d2ba871a498b.png',
                    comment: 'I can comment now?',
                    index: 27
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/467960_b6a1edb3-5d51-49f0-a654-976ec5618e3e.png',
                    comment: 'Love your app!',
                    index: 28
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/522592_871c71fe-6b2c-4bab-9bea-976eb0873789.png',
                    comment: 'Eat too much, hahahaha',
                    index: 29
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/472119_4794c5be-aa2d-4e36-be4e-a86ca06cab2b.png',
                    comment: 'My hometown is so beautiful.',
                    index: 30
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/524390_e0347734-86ff-453a-8d37-feb0c9d3596b.png',
                    comment: 'lol',
                    index: 31
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/474141_7d806bec-2ad2-4651-bbc3-6e225a65583f.png',
                    comment: 'Ah!Roger!!',
                    index: 32
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/477066_6ecdac50-ddf9-478c-b0e3-a72d3898f2a4.png',
                    comment: "Haha, let's chat!",
                    index: 33
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/523953_0816bd14-5738-4a17-8306-2d2ee1c78d32.png',
                    comment: 'Never go out with a bad-tempered person',
                    index: 34
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/481803_b2cc82e0-1c85-4e88-89d2-8029cae7ccc3.png',
                    comment: 'I hate Both!',
                    index: 35
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/527192_44e27dd1-553c-4532-b019-74ac2ad98460.png',
                    comment: 'how to',
                    index: 36
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/467960_b6a1edb3-5d51-49f0-a654-976ec5618e3e.png',
                    comment: 'Chipukeezy!!!',
                    index: 37
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/485587_1a9968e6-7cb5-4a72-bd22-4fc92f63d431.png',
                    comment: 'Who can fund me a trip',
                    index: 38
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/485973_775054e4-9588-4b96-8012-98b47db0eba2.png',
                    comment: 'lol',
                    index: 39
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/522206_655cfea6-34df-4d41-84b2-8ac0dd211aa9.png',
                    comment: 'My bf snores loudly!!! Frustrating!',
                    index: 40
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/489795_9e2f806d-ac26-430e-862f-7fa459e86942.png',
                    comment: 'hahahahaha',
                    index: 41
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/490954_a112acc1-5b58-4825-bad7-b1c426e29dbe.png',
                    comment: 'Talking all the way.',
                    index: 42
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/491759_ed663056-ed20-457f-ab7b-fe6c096d722e.png',
                    comment: "Chipukeezy, you're the best!",
                    index: 43
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/282681_d98028f5-f992-4e98-b9e5-b23c14cf1f22.png',
                    comment: "I won't travel with girls",
                    index: 44
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/493723_8e049223-ef81-4354-b67f-b42295535522.png',
                    comment: "It's a nightmare when you get injured while travelling",
                    index: 45
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/495888_a096feb4-f638-4074-9d63-e31ff3f3b2c9.png',
                    comment: 'this is fun',
                    index: 46
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/48dd862e-7234-4907-9b66-e615cab55cc1.png',
                    comment: "Can't wait to watch episode 2!",
                    index: 47
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/499861_e3f55a90-07fa-4ac7-b32f-56db4aed8786.png',
                    comment: "I've never travelled. ",
                    index: 48
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/500151_5fcf20a2-6abf-4468-b06c-7d7db120e5e1.png',
                    comment: 'Lol',
                    index: 49
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/521940_9fa6a2d8-26c3-4a44-8b8e-9ad3213b30ec.png',
                    comment: "Tanzania, it's my hometown!",
                    index: 50
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/529293_c52c0fa5-5335-4f3d-b92e-047ac95d0d3d.png',
                    comment: 'I often quarrel with my bf while travelling...I think tolerance is important.',
                    index: 51
                },
                {
                    user_icon: 'http://cdn.startimestv.com/head/upload/529707_49c902b3-9a7a-4d5b-8832-fcbb5f34a804.png',
                    comment: 'i like africa',
                    index: 52
                }
            ]
            this.loaded_comment = true
            this.$nextTick(() => {
                this.initComment()
            })
        },
        initComment() {
            for (let i = 0; i < this.commentList.length; i++) {
                const commentItem = document.getElementById(i)
                const commentWidth = commentItem.offsetWidth
                commentItem.style.width = commentWidth + 15 + 'px'
                commentItem.style.top = '0px'
            }
            this.animate(this.getDom(this.count), -this.getDom(this.count).offsetWidth, this.getDom(this.count).offsetWidth / (this.speed * 3) + 0.3) // 除数越大越慢
        },
        animate(dom, num, speed) {
            let flag = true
            const time = setInterval(() => {
                if (num > this.space && flag) {
                    flag = false
                    // console.log(this.count + ' has finished ')
                    this.count++
                    if (this.count > this.commentList.length - 1) {
                        console.log('finished all')
                        this.count = 0
                    }
                    this.getDom(this.count).style.top = (this.count % 4) * this.lineSpace + 'px'
                    this.animate(
                        this.getDom(this.count),
                        -this.getDom(this.count).offsetWidth,
                        this.getDom(this.count).offsetWidth / (this.speed * 3) + 0.3
                    )
                }
                if (num <= this.pageWidth + 20) {
                    dom.style.right = num + 'px'
                    num += speed
                } else {
                    clearInterval(time)
                }
            }, 5)
        },
        handlePick(local, advisorList) {
            if (!this.canVote) {
                return
            }
            this.canVote = false
            // web引导下载
            if (this.appType == 0) {
                this.callOrDownApp()
                this.commentText = ''
                this.canVote = true
                return
            }
            let num = 0
            local == 'left' ? (num = 0) : (num = 1)
            // 投票接口
            this.$axios({
                url: '/voting/v1/ballot',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    candidate_id: advisorList[num].id,
                    vote_id: this.vote_id
                })
            })
                .then(res => {
                    if (res.data.code === 0) {
                        this.mSendEvLog('pick_click', local == 'left' ? 'A' : 'B', 1)
                        this.pageList[this.index].candidates[num].ballot_num++
                        this.pageList[this.index].ticket_num = 0
                        // 动画
                        this.allNum++
                        local == 'left' ? this.leftNumVal++ : this.rightNumVal++
                        this.leftNum = parseInt((this.leftNumVal / this.allNum) * 100)
                        this.rightNum = 100 - this.leftNum
                        const domLeft = document.getElementsByClassName('bar')[0]
                        const domRight = document.getElementsByClassName('bar')[1]
                        // domLeft.style.width = 0.9 * this.leftNum + '%'
                        // domRight.style.width = 0.9 * this.rightNum + '%'
                        let w = 0
                        if (local == 'left') {
                            domLeft.style.width = 0
                            domRight.style.width = 90 + '%'
                            const t = setInterval(() => {
                                if (w == this.leftNum) {
                                    clearInterval(t)
                                    domLeft.style.width = 0.9 * this.leftNum + '%'
                                    domRight.style.width = 0.9 * this.rightNum + '%'
                                } else {
                                    domLeft.style.width = 0.9 * w + '%'
                                    domRight.style.width = 0.9 * (100 - w) + '%'
                                    w = w + 1
                                    if (this.leftNum == 100) {
                                        domLeft.style.borderRadius = '0.4rem'
                                    } else if (this.rightNum == 100) {
                                        domRight.style.borderRadius = '0.4rem'
                                    } else {
                                        domLeft.style.borderRadius = '0.4rem 0 0 0.4rem'
                                        domRight.style.borderRadius = '0 0.4rem 0.4rem 0'
                                    }
                                }
                            }, (100 - this.leftNum) / 5)
                        } else {
                            domLeft.style.width = 90 + '%'
                            domRight.style.width = 0
                            const t = setInterval(() => {
                                if (w == this.rightNum) {
                                    clearInterval(t)
                                    domLeft.style.width = 0.9 * this.leftNum + '%'
                                    domRight.style.width = 0.9 * this.rightNum + '%'
                                } else {
                                    domLeft.style.width = 0.9 * (100 - w) + '%'
                                    domRight.style.width = 0.9 * w + '%'
                                    w = w + 1
                                    if (this.leftNum == 100) {
                                        domLeft.style.borderRadius = '0.4rem'
                                    } else if (this.rightNum == 100) {
                                        domRight.style.borderRadius = '0.4rem'
                                    } else {
                                        domLeft.style.borderRadius = '0.4rem 0 0 0.4rem'
                                        domRight.style.borderRadius = '0 0.4rem 0.4rem 0'
                                    }
                                }
                            }, (100 - this.rightNum) / 5)
                        }

                        this.picked = true
                        this.pick_click = true
                        if (local == 'left') {
                            this.show_l = true
                        } else if (local == 'right') {
                            this.show_r = true
                        }
                        this.canVote = true
                    } else {
                        this.$alert('Pick err! ' + res.data.message)
                        this.canVote = true
                    }
                })
                .catch(err => {
                    this.$alert('Pick err!!' + err)
                    this.canVote = true
                })
        },
        sendComment() {
            // 防多点
            if (this.disabled) {
                return
            }
            this.disabled = true
            // web引导下载
            if (this.appType == 0) {
                this.callOrDownApp()
                this.commentText = ''
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
            if (this.commentText.toLowerCase().match(/[a-zA-Z]+/gi)) {
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
            }
            // 调用发送评论接口
            // then 成功回调里
            this.mSendEvLog('send_click', this.commentText, 1)
            const during = this.during
            const item = document.createElement('span')
            const img = document.createElement('img')
            const p = document.createElement('p')
            img.src = this.$store.state.user.head || 'http://cdn.startimestv.com/banner/DD_user_icon.png'
            p.innerText = this.commentText
            p.style.display = 'inline-block'
            p.style.color = '#fff'
            p.style.marginLeft = 3 + 'px'
            p.style.whiteSpace = 'nowrap'
            img.style.display = 'inline-block'
            img.style.width = '28px'
            img.style.height = '28px'
            img.style.backgroundColor = '#bfbfbf'
            img.style.borderRadius = '14px'
            img.style.position = 'relative'
            img.style.top = '-1px'
            img.style.left = '1.8px'
            item.appendChild(img)
            item.appendChild(p)
            document.getElementsByClassName('comment')[0].appendChild(item)
            const itemWidth = p.offsetWidth + 28
            item.style.backgroundColor = '#09659d'
            item.style.borderRadius = 15 + 'px'
            item.style.height = 30 + 'px'
            item.style.lineHeight = 30 + 'px'
            item.style.position = 'absolute'
            item.style.right = -2000 + 'px'
            item.style.width = itemWidth + 20 + 'px'
            let lineNum
            if (this.count >= 2) {
                lineNum = this.count - 2
            } else {
                lineNum = this.count + this.commentList.length - 2
            }
            item.style.top = (lineNum % 4) * this.lineSpace + 13.5 + 'px'
            let num = -itemWidth
            const time = setInterval(() => {
                if (num <= this.pageWidth + 20) {
                    item.style.right = num + 'px'
                    num += itemWidth / (this.speed * 4) + 0.3
                } else {
                    clearInterval(time)
                }
            }, 4)
            // console.log('call' + lineNum)
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
        },
        // toast方法
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
                            `com.star.mobile.video.activity.BrowserActivity?loadUrl=http://m.startimestv.com/hybrid/vote/DreamTrip`.replace(
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
@import '~assets/less/vote/index.less';
@keyframes go_in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
@keyframes add_one {
    0% {
        opacity: 1;
        transform: scale(0);
    }
    100% {
        opacity: 0;
        transform: scale(4);
    }
}
.wrapper {
    background-color: #3cb3ff;
    background-repeat: repeat-y;
    font-size: 0.9rem;
    position: static;
    .container {
        > img {
            display: block;
            margin: 0 auto;
            padding-top: 0.5rem;
            width: 95%;
            height: auto;
            &.bg-img {
                padding-top: 0;
                width: 100%;
            }
        }
        .tab {
            position: relative;
            .share-btn {
                position: absolute;
                right: 0;
                top: -3.5rem;
                height: 2rem;
            }
            ul {
                width: 100%;
                height: 3rem;
                padding-top: 0.3rem;
                margin-top: 0.3rem;
                display: block;
                white-space: nowrap;
                overflow: hidden;
                overflow-x: auto;
                font-size: 0;
                background-color: #006bb5;
                position: relative;
                li {
                    width: 6rem;
                    height: 3rem;
                    display: inline-block;
                    text-align: center;
                    line-height: 1.2rem;
                    font-size: 1rem;
                    position: relative;
                    .ep {
                        color: #d9d9d9;
                        font-weight: bold;
                    }
                    .time {
                        color: #b1b1b1;
                        font-size: 0.75rem;
                    }
                    &.active {
                        .ep,
                        .time {
                            color: #fff;
                        }
                        &::after {
                            content: '';
                            display: block;
                            width: 3rem;
                            height: 0.2rem;
                            background: #ffbe01;
                            position: absolute;
                            left: 1.5rem;
                            bottom: 0.3rem;
                        }
                    }
                }
            }
        }
        .video-btn {
            margin-top: 1rem;
            position: relative;
            width: 100%;
            height: 1.7rem;
            img {
                position: absolute;
                bottom: 0;
                height: 1.7rem;
                &.film {
                    left: 0;
                }
                &.cloud {
                    height: 1.2rem;
                    left: 8rem;
                }
                &.high-light {
                    right: 0;
                }
            }
        }
        .topic {
            width: 100%;
            position: relative;
            .title {
                width: 90%;
                margin: 1rem 5% 0.5rem;
            }
            .pick-box {
                font-size: 0;
                width: 100%;
                .left,
                .right {
                    font-size: 0.9rem;
                    width: 41%;
                    position: relative;
                    overflow: hidden;
                    display: inline-block;
                    div {
                        position: relative;
                        width: 100%;
                        background-color: #2b495e;
                        img {
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top: 0;
                            border: 0.2rem solid #51b7ff;
                        }
                        &:before {
                            content: '';
                            display: inline-block;
                            padding-bottom: 100%;
                            width: 0.1px;
                            vertical-align: middle;
                        }
                    }
                }
                .middle {
                    vertical-align: top;
                    display: inline-block;
                    font-size: 0.75rem;
                    width: 18%;
                    height: 100%;
                    position: relative;
                    z-index: 3;
                    img {
                        width: 95%;
                        margin-left: 2.5%;
                        &:first-child {
                            padding-top: 0.5rem;
                        }
                    }
                    p {
                        width: 95%;
                        text-align: center;
                        margin-left: 2.5%;
                        color: #efd153;
                        padding-top: 0.5rem;
                        white-space: nowrap;
                        overflow: visible;
                    }
                }
                .left {
                    padding-left: 5%;
                }
                .right {
                    padding-right: 5%;
                }
                .pick {
                    width: 90%;
                    margin-left: 5%;
                    margin-top: 1.5rem;
                    position: relative;
                    overflow: hidden;
                    display: inline-block;
                    padding-bottom: 1rem;
                    z-index: 3;
                    div {
                        display: inline-block;
                        font-size: 0.9rem;
                        width: 30%;
                        height: 1.6rem;
                        background-color: #ffcc38;
                        border-radius: 1rem;
                        text-align: center;
                        line-height: 1.6rem;
                        color: #fff;
                        font-weight: bold;
                        &:first-child {
                            margin-left: 5%;
                        }
                        &:last-child {
                            margin-left: 30%;
                        }
                    }
                }
                .progress {
                    width: 90%;
                    margin-left: 5%;
                    margin-top: 1rem;
                    position: relative;
                    padding-bottom: 0.4rem;
                    &.show_in {
                        animation: go_in 0.5s;
                    }
                    .bar {
                        display: inline-block;
                        height: 0.8rem;
                        background-size: 0.8rem 0.8rem;
                        background-repeat: repeat;
                        margin-bottom: 0.9rem;
                        &.l {
                            width: 45%;
                            margin-left: 5%;
                            border-radius: 0.4rem 0 0 0.4rem;
                            background-image: repeating-linear-gradient(135deg, #e9cf4b 0%, #e9cf4b 25%, #fdf39a 25%, #fdf39a 50%);
                        }
                        &.r {
                            width: 45%;
                            border-radius: 0 0.4rem 0.4rem 0;
                            background-image: repeating-linear-gradient(135deg, #5d9ca1 0%, #5d9ca1 25%, #77c3e2 25%, #77c3e2 50%);
                        }
                    }
                    .left,
                    .right {
                        font-size: 0.75rem;
                        display: inline-block;
                        width: 30%;
                        height: 1rem;
                        color: #fff;
                        font-weight: bold;
                        position: relative;
                        z-index: 3;
                    }
                    .left {
                        text-align: left;
                        color: #ffe2aa;
                    }
                    .right {
                        margin-left: 40%;
                        text-align: right;
                        color: #0964a0;
                    }
                    span {
                        display: block;
                        width: 0.6rem;
                        height: 0.35rem;
                        position: absolute;
                        top: 1.1rem;
                        background-size: 0.6rem 0.35rem;
                        &.icon-y {
                            left: 7%;
                            background-image: url('~assets/img/vote/DreamTrip/ic-yellow.png');
                        }
                        &.icon-b {
                            right: 7%;
                            background-image: url('~assets/img/vote/DreamTrip/ic-blue.png');
                        }
                        &.add-one {
                            font-size: 0.75rem;
                            width: 1rem;
                            height: 1rem;
                            position: absolute;
                            top: -1.3rem;
                            font-weight: bold;
                            &.l {
                                left: 10%;
                                color: #ff6b31;
                                opacity: 0;
                                &.l_show {
                                    animation: add_one 2s;
                                }
                            }
                            &.r {
                                right: 10%;
                                color: #ff6b31;
                                opacity: 0;
                                &.r_show {
                                    animation: add_one 2s;
                                }
                            }
                        }
                    }
                }
            }
            .cloud2,
            .cloud3 {
                position: absolute;
                z-index: 2;
                &.cloud3 {
                    left: 0;
                    bottom: 0.7rem;
                    width: 4.5rem;
                }
                &.cloud2 {
                    right: 0;
                    bottom: -2rem;
                    width: 3.2rem;
                }
            }
        }
        .comment {
            position: relative;
            overflow: hidden;
            .comment-box {
                width: 90%;
                height: 200px;
                margin: 0 auto;
                background-image: url('~assets/img/vote/DreamTrip/bg_barrage.png');
                background-size: 100% 200px;
                ul {
                    position: relative;
                    top: 13.5px;
                    .barrage {
                        background-color: #09659d;
                        border-radius: 15px;
                        height: 30px;
                        line-height: 30px;
                        position: absolute;
                        right: -2000px;
                        img {
                            display: inline-block;
                            width: 28px;
                            height: 28px;
                            background-color: #bfbfbf;
                            border-radius: 14px;
                            position: relative;
                            top: -1px;
                            left: 1.8px;
                        }
                        p {
                            display: inline-block;
                            white-space: nowrap;
                            color: #fff;
                        }
                    }
                }
            }
            .send-box {
                width: 90%;
                margin: 0.5rem 5%;
                height: 2.5rem;
                background-image: url('~assets/img/vote/DreamTrip/bg-send.png');
                background-size: 100% 2.5rem;
                border-radius: 1.25rem;
                position: relative;
                textarea {
                    border: none;
                    outline: none;
                    display: block;
                    width: 70%;
                    height: 1.8rem;
                    line-height: 1.8rem;
                    -webkit-border-radius: 0.9rem;
                    -moz-border-radius: 0.9rem;
                    -ms-border-radius: 0.9rem;
                    -o-border-radius: 0.9rem;
                    border-radius: 0.9rem;
                    padding: 0 0.5rem;
                    margin: 0;
                    color: #666;
                    position: absolute;
                    left: 2%;
                    top: 0.35rem;
                    white-space: nowrap;
                    overflow: hidden;
                    overflow-x: auto;
                }
                .btn {
                    display: block;
                    width: 25%;
                    margin-left: 72%;
                    height: 2.5rem;
                    line-height: 2.5rem;
                    color: #fff;
                    font-size: 1rem;
                    text-align: center;
                }
            }
        }
        .bg-bottom {
            width: 100%;
            margin: 1.5rem auto 0;
            position: relative;
            .bg-img {
                width: 100%;
                position: absolute;
                z-index: 0;
            }
            .bottom-item {
                position: relative;
                z-index: 1;
                width: 100%;
                > img {
                    width: 90%;
                    margin-left: 5%;
                }
                .video {
                    margin: 2rem auto 0;
                    width: 80%;
                    position: relative;
                    .div {
                        position: relative;
                        width: 100%;
                        background-color: #2b495e;
                        border-radius: 0.2rem;
                        img {
                            border: 3px solid #075e99;
                            border-radius: 0.2rem;
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top: 0;
                        }
                        &:before {
                            content: '';
                            display: inline-block;
                            padding-bottom: 57%;
                            width: 0.1px;
                            vertical-align: middle;
                        }
                    }
                    > img.play {
                        display: block;
                        width: 2rem;
                        height: 2rem;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        margin-left: -1.1rem;
                        margin-top: -2.3rem;
                    }
                    .title {
                        height: 2.4rem;
                        line-height: 1.2rem;
                        margin-top: 0.5rem;
                        font-size: 1rem;
                        color: #fff;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                }
            }
        }
    }
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
    .vote-toast {
        position: fixed;
        left: 50%;
        top: 50%;
        margin-left: -4rem;
        margin-top: -0.75rem;
        font-size: 1rem;
        background: rgba(0, 0, 0, 0.65);
        border-radius: 3px;
        width: 8rem;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        color: #fff;
        z-index: 9999;
    }
}
</style>
