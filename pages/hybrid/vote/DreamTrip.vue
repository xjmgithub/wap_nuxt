<template>
    <div class="wrapper">
        <div class="container">
            <img src="~assets/img/vote/DreamTrip/bg_banner.png" alt="bg-img" class="bg-img" />
            <div class="tab">
                <img src="~assets/img/vote/DreamTrip/btn_share.png" alt class="share-btn" @click="toShare" />
                <ul v-show="pageListReady.length>0">
                    <li
                        v-for="(item,i) in pageListReady"
                        :key="i"
                        class="lis"
                        :class="i==index?'active':(i<currentPage?'pre':'')"
                        @click="tabClick(i)"
                    >
                        <p class="ep">{{item.group_name}}</p>
                        <p class="time">{{item.start_time.substr(0, 10)}}</p>
                    </li>
                </ul>
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
                    <div v-show="picked&&appType>0" class="progress" :class="{'show-in':show_in}">
                        <div class="bar l"></div>
                        <div class="bar r"></div>
                        <div class="left">{{leftNum}}%</div>
                        <div class="right">{{rightNum}}%</div>
                        <span class="icon-y"></span>
                        <span class="icon-b"></span>
                        <span class="add-one l" :class="{'l-show':l_show}">+1</span>
                        <span class="add-one r" :class="{'r-show':r_show}">+1</span>
                    </div>
                </div>
                <img class="cloud2" src="~assets/img/vote/DreamTrip/img_clound2.png" alt />
                <img class="cloud3" src="~assets/img/vote/DreamTrip/img_clound3.png" alt />
            </div>
            <div id="comment" class="comment">
                <div class="comment-box">
                    <ul v-show="commentListReady.length>0" id="ulList">
                        <li v-for="(item,key) in commentListReady" :id="key" :key="key" class="barrage">
                            <img :src="cdnPic(item.avatar)" alt />
                            <p>{{item.content}}</p>
                        </li>
                    </ul>
                </div>
                <div class="send-box">
                    <textarea v-model="commentText" type="text" placeholder="Share your feelings..." maxlength="100" @focus="inputFocus" />
                    <div class="btn" @click="sendComment">{{disabled?`${during}s`:`SEND`}}</div>
                </div>
            </div>
            <img src="~assets/img/vote/DreamTrip/img_share.png" class="img-share" alt @click="toShare" />
            <div class="bg-bottom">
                <img class="bg-img" src="~assets/img/vote/DreamTrip/bg_down.png" alt />
                <div class="bottom-item">
                    <div class="video" @click="toPlayer(videoCode,'topic')">
                        <div class="div">
                            <img :src="cdnPic(videoSrc)" alt />
                        </div>
                        <img src="~assets/img/vote/DreamTrip/btn-play.png" alt class="play" />
                        <div class="title">{{videoTitle}}</div>
                    </div>
                    <div class="video" @click="toPlayer(filmCode,'fulleps')">
                        <div class="div">
                            <img :src="cdnPic(filmSrc)" alt />
                        </div>
                        <img src="~assets/img/vote/DreamTrip/btn-play.png" alt class="play" />
                        <div class="title">{{filmTitle}}</div>
                    </div>
                    <div class="video" @click="toPlayer(highLightCode,'highlight')">
                        <div class="div">
                            <img :src="cdnPic(highLightSrc)" alt />
                        </div>
                        <img src="~assets/img/vote/DreamTrip/btn-play.png" alt class="play" />
                        <div class="title">{{highLightTitle}}</div>
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
            appType: this.$store.state.appType || 0,
            // appType: 1,
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
            show_in: false,
            l_show: false,
            r_show: false,
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
            minSp: 0.6,
            maxSp: 1,
            space: -20, // 两行弹幕的间隔
            time: null, // 弹幕滚动定时器
            commentText: '', // 发送的内容
            loaded_page: false,
            loaded_comment: false,
            number: 20, // 每次请求的弹幕数量
            last_id: 0, // 上一次请求的最后一条弹幕id
            timeNum: 0, // 记录已在当前页面上成功调用获取弹幕接口的次数
            canClickTab: true,
            vote_id: 17,
            filmSrc: '',
            filmCode: '',
            filmTitle: '',
            highLightSrc: '',
            highLightCode: '',
            highLightTitle: '',
            topic: '',
            videoSrc: '',
            videoCode: '',
            videoTitle: '',
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
                    e.preventDefault()
                    // this.sendComment()
                    return false
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
                    this.filmSrc = item.cover
                    this.filmCode = item.link_vod_code
                    this.filmTitle = item.description
                    this.mSendEvLog('video_show', 'fulleps', this.index + 1)
                } else if (item.name == 'b' + (this.index + 1)) {
                    // highLight
                    this.highLightSrc = item.cover
                    this.highLightCode = item.link_vod_code
                    this.highLightTitle = item.description
                    this.mSendEvLog('video_show', 'highlight', this.index + 1)
                } else if (item.name == 'c' + (this.index + 1)) {
                    // 话题
                    this.topic = item.cover
                } else if (item.name == 'd' + (this.index + 1)) {
                    // 相关视频
                    this.videoSrc = item.cover
                    this.videoCode = item.link_vod_code
                    this.videoTitle = item.description
                    this.mSendEvLog('video_show', 'topic', this.index + 1)
                } else if (item.name == 'e' + (this.index + 1)) {
                    // 分享文案
                    this.imgUrl = item.cover
                    this.shareText = item.description
                    this.content = this.shareText
                }
            })

            // pageList数据
            // 投票状态
            if(this.pageList[this.index].ticket_num > 0) {
                this.picked = false
                this.show_in = true
            } else {
                this.picked = true
                this.show_in = false
            }
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
            if (this.canClickTab) {
                this.canClickTab = false
                if (i < this.currentPage) {
                    if (this.index != i) {
                        this.index = i
                        this.mSendEvLog('tab_click', '', this.index + 1)
                        this.show_in = false
                        this.l_show = false
                        this.r_show = false
                        const addOnes = document.getElementsByClassName('add-one')
                        addOnes[0].style.visibility = 'hidden'
                        addOnes[1].style.visibility = 'hidden'
                        this.timeNum = 0
                        this.last_id = 0
                        this.count = 0
                        for (let j = 0; j < this.number * 2; j++) {
                            this.getDom(j).style.right = 2000 + 'px'
                        }
                        if (this.loaded_comment) {
                            setTimeout(() => {
                                for (let j = 0; j < this.number * 2; j++) {
                                    this.getDom(j).style.right = -2000 + 'px'
                                }
                                this.getCommentList()
                                this.canClickTab = true
                            }, 1000)
                        }
                        this.initPage(this.index)
                    } else {
                        this.canClickTab = true
                    }
                } else {
                    this.tipShow('Stay tuned!')
                    this.canClickTab = true
                }
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
        toPlayer(code, label) {
            this.mSendEvLog('video_click', label, this.index + 1)
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
                        this.$alert('Get source list error! ' + res.data.message)
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
                        if (this.index != this.currentPage - 1) {
                            this.index = this.currentPage - 1
                        }
                    } else {
                        this.pageList = []
                        this.$alert('Get page list error! ' + res.data.message)
                    }
                    let flag = true
                    for (let i = 0; i < this.pageList.length; i++) {
                        if (i <= this.index) {
                            if (!this.pageList[i].candidates.length) {
                                flag = false
                                break
                            }
                        }
                    }
                    if (flag) {
                        this.loaded_page = true
                        this.getSource()
                        this.getCommentList()
                    } else {
                        this.$alert('Get candidates list error!')
                    }
                })
                .catch(err => {
                    this.pageList = []
                    this.$alert('Get page list error!! ' + err)
                })
        },
        getCommentList() {
            this.$axios
                .get(`/voting/v1/comments?comment_activity_id=${this.index + 1}&last_id=${this.last_id}&num_per_page=${this.number}`)
                .then(res => {
                    if (res.data.code === 0) {
                        this.timeNum++
                        this.last_id = res.data.data[res.data.data.length - 1].id
                        if (this.timeNum == 1) {
                            res.data.data.forEach((item, index) => {
                                this.commentList[index] = item
                                this.commentList[index + this.number] = item
                            })
                        } else if (this.timeNum % 2 == 0) {
                            res.data.data.forEach((item, index) => {
                                this.commentList[index + this.number] = item
                            })
                        } else {
                            res.data.data.forEach((item, index) => {
                                this.commentList[index] = item
                            })
                        }
                    } else {
                        this.commentList = []
                        this.$alert('Get comment list error! ' + res.data.message)
                    }
                    this.loaded_comment = true
                    this.$nextTick(() => {
                        this.initComment()
                    })
                })
                .catch(err => {
                    this.commentList = []
                    this.$alert('Get comment list error!! ' + err)
                })
        },
        initComment() {
            for (let i = 0; i < this.commentList.length; i++) {
                const commentItem = document.getElementById(i)
                const img = commentItem.getElementsByTagName('img')[0]
                const p = commentItem.getElementsByTagName('p')[0]
                img.src = this.commentList[i].avatar || 'http://cdn.startimestv.com/banner/DD_user_icon.png'
                p.innerText = this.commentList[i].content
                const commentWidth = p.offsetWidth + 35
                commentItem.style.width = commentWidth + 15 + 'px'
            }
            // let s = this.getDom(this.count).offsetWidth / (this.speed * 3) + 0.3
            let s = this.getDom(this.count).offsetWidth / this.speed
            if (s < this.minSp) s = this.minSp
            else if (s > this.maxSp) s = this.maxSp
            this.animate(this.getDom(this.count), -this.getDom(this.count).offsetWidth, s)
        },
        animate(dom, num, speed) {
            let flag = true
            const time = setInterval(() => {
                if (parseInt(dom.style.right) >= 2000) {
                    clearInterval(time)
                    return true
                }
                if (num > this.space && flag) {
                    flag = false
                    // console.log(this.count + ' has finished ')
                    this.count++
                    if (this.timeNum % 2 != 0 ? this.count >= this.number : this.count >= this.number * 2) {
                        if (this.timeNum != 0 && this.timeNum % 2 == 0) {
                            this.count = 0
                        }
                        this.getCommentList()
                        return true
                    }
                    // let s = this.getDom(this.count).offsetWidth / (this.speed * 3) + 0.3
                    let s = this.getDom(this.count).offsetWidth / this.speed
                    if (s < this.minSp) s = this.minSp
                    else if (s > this.maxSp) s = this.maxSp
                    this.animate(this.getDom(this.count), -this.getDom(this.count).offsetWidth, s)
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
                        this.mSendEvLog('pick_click', local == 'left' ? 'A' : 'B', this.index + 1)
                        this.pageList[this.index].candidates[num].ballot_num++
                        this.pageList[this.index].ticket_num = 0
                        // 动画
                        this.allNum++
                        local == 'left' ? this.leftNumVal++ : this.rightNumVal++
                        this.leftNum = parseInt((this.leftNumVal / this.allNum) * 100)
                        this.rightNum = 100 - this.leftNum
                        const domLeft = document.getElementsByClassName('bar')[0]
                        const domRight = document.getElementsByClassName('bar')[1]
                        const addOnes = document.getElementsByClassName('add-one')
                        if (local == 'left') {
                            addOnes[0].style.visibility = 'visible'
                            this.l_show = true
                            setTimeout(() => {
                                addOnes[0].style.visibility = 'hidden'
                            }, 2000)
                        } else {
                            addOnes[1].style.visibility = 'visible'
                            this.r_show = true
                            setTimeout(() => {
                                addOnes[1].style.visibility = 'hidden'
                            }, 2000)
                        }

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
                        this.show_in = true
                        if (local == 'left') {
                            this.show_l = true
                        } else if (local == 'right') {
                            this.show_r = true
                        }
                        this.canVote = true
                    } else {
                        this.$alert('Pick error! ' + res.data.message)
                        this.canVote = true
                    }
                })
                .catch(err => {
                    this.$alert('Pick error!! ' + err)
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
                    this.$alert('Your comment contains inappropriate contents. Please remove the words that may cause offence.', () => {}, 'GOT IT')
                    this.disabled = false
                    return
                }
            }
            // 调用发送评论接口
            this.$axios({
                url: '/voting/v1/comment',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    comment_activity_id: this.index + 1,
                    content: this.commentText
                })
            })
                .then(res => {
                    if (res.data.code === 0) {
                        this.mSendEvLog('send_click', this.commentText, this.index + 1)
                        const during = this.during
                        const item = document.createElement('span')
                        const img = document.createElement('img')
                        const p = document.createElement('p')
                        img.src = this.$store.state.user.head || 'http://cdn.startimestv.com/banner/DD_user_icon.png'
                        p.innerText = this.commentText
                        p.style.display = 'inline-block'
                        p.style.color = '#fff'
                        p.style.marginLeft = 10 + 'px'
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
                        item.style.width = itemWidth + 25 + 'px'
                        const lineNum = this.count >= 2 ? this.count - 2 : this.count + this.commentList.length - 2
                        item.style.top = (lineNum % 4) * this.lineSpace + 13.5 + 'px'
                        let sp = itemWidth / this.speed
                        if (sp < this.minSp) sp = this.minSp
                        else if (sp > this.maxSp) sp = this.maxSp
                        let num = -itemWidth
                        const time = setInterval(() => {
                            if (num <= this.pageWidth + 20) {
                                item.style.right = num + 'px'
                                num += sp
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
                    } else {
                        this.$alert('Send comment error! ' + res.data.message)
                    }
                })
                .catch(err => {
                    this.$alert('Send comment error!! ' + err)
                })
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
        opacity: 0.2;
        transform: scale(5);
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
            &.img-share {
                width: 90%;
                padding: 1rem 0 0.5rem;
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
                    &.pre {
                        .ep,
                        .time {
                            color: #fff;
                        }
                    }
                }
            }
        }
        .topic {
            width: 100%;
            position: relative;
            .title {
                width: 90%;
                margin: 1rem 5% 1rem;
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
                        border-radius: 0.25rem;
                        overflow: hidden;
                        img {
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top: 0;
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
                        width: 85%;
                        margin-left: 8.5%;
                        &:first-child {
                            padding-top: 0.5rem;
                            margin-left: 5.5%;
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
                    &.show-in {
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
                            visibility: hidden;
                            &.l {
                                left: 10%;
                                color: #ff6b31;
                                opacity: 0;
                                &.l-show {
                                    animation: add_one 2s;
                                }
                            }
                            &.r {
                                right: 10%;
                                color: #ff6b31;
                                opacity: 0;
                                &.r-show {
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
                        &:nth-child(4n) {
                            top: 120px;
                        }
                        &:nth-child(4n-1) {
                            top: 80px;
                        }
                        &:nth-child(4n-2) {
                            top: 40px;
                        }
                        &:nth-child(4n-3) {
                            top: 0px;
                        }
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
                            margin-left: 6px;
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
                    resize: none;
                }
                .btn {
                    display: block;
                    width: 25%;
                    margin-left: 72%;
                    height: 2.5rem;
                    line-height: 2.5rem;
                    color: #fff;
                    font-size: 1rem;
                    font-weight: bold;
                    text-align: center;
                }
            }
        }
        .bg-bottom {
            width: 100%;
            margin: 1rem auto 0;
            position: relative;
            .bg-img {
                width: 100%;
                position: absolute;
                bottom: -11rem;
                z-index: 0;
            }
            .bottom-item {
                position: relative;
                z-index: 1;
                width: 100%;
                .video {
                    margin: 1rem auto 0;
                    width: 80%;
                    position: relative;
                    .div {
                        position: relative;
                        width: 100%;
                        background-color: #2b495e;
                        border-radius: 0.3rem;
                        overflow: hidden;
                        img {
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top: 0;
                        }
                        &:before {
                            content: '';
                            display: inline-block;
                            padding-bottom: 57%;
                            width: 0;
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
