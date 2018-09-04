<template>
  <div id="wrapper">
    <loading v-show="loadStatus"></loading>
    <div class="lists" id="lists">
      <div class="show-time">{{nowTime}}</div>
      <div class="left-service">
        <img class="service-header" src="~/assets/img/faq/img_avator_st.png" />
        <div class="context-container">
          Wecome to StarTimes Online Service.
        </div>
      </div>
      <div v-for="(item,index) in list" :key="index">
        <div class="left-service" v-if="item.type==1">
          <img class="service-header" src="~/assets/img/faq/img_avator_st.png" />
          <div class="context-container" v-if="item.content.thema">
            <div v-html="item.content.content"></div>
          </div>
          <div class="context-container" v-else>
            <div class="context-title">You may ask:</div>
            <ul v-if="item.content.contents">
              <li v-for="(li,key) in item.content.contents" @click="askThis(li,item.content.type)" :key="key">{{li.name}}</li>
            </ul>
          </div>
        </div>
        <div class="left-service right-user" v-if="item.type==2">
          <img class="service-header" :src="userHead" />
          <div class="context-container">
            {{item.content}}
          </div>
        </div>
      </div>
    </div>
    <div class="ft-wraper" v-if="liveChatBtn||leaveMsgBtn">
      <div class="ft-cont" v-if="leaveMsgBtn">
        <div class="ft-btn"><span>{{$store.state.lang.leave_msg_btn}}</span></div>
      </div>
      <div class="ft-cont" v-if="leaveMsgBtn">
        <div class="ft-btn">
          <span>{{$store.state.lang.live_chat_btn}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import loading from '~/components/loading'
  export default {
    layout: 'base',
    data() {

      let now = new Date()
      let h = now.getHours()
      let m = now.getMinutes()
      m = m < 10 ? (`0${m}`) : m

      return {
        userHead: '',
        userName: '',
        userId: '',
        areaId: this.$store.state.country.id,
        loginStatus: false,
        country: this.$store.state.country.short,
        entranceId: this.$route.query.entrance_id || '',
        configId: this.$route.query.config_id || '',
        catelogId: 183,   // others,
        liveChatBtn: true,
        leaveMsgBtn: true,
        nowTime: `${this.$store.state.lang.today} ${h}:${m}`,
        list: [],
        loadStatus: true
      }
    },
    mounted() {
      if (window.getChannelId && window.getChannelId.isBackCoutly) {
        window.getChannelId.isBackCoutly(false)
      }
    },
    created() {

      this.$axios.setHeader('token', this.$store.state.token)
      // 获取用户头像
      this.$axios.get('/cms/users/me')
        .then(res => {
          let user = res.data
          this.userHead = user.head || '~/assets/img/faq/1-02.png'
          this.userName = user.nickName
          this.userId = user.head
          this.loginStatus = user.type
        })

      // 获取按钮状态
      this.$axios.get(`/ocs/v1/faqs/faqConfigByAreaId?areaId=${this.areaId}&entranceId=${this.entranceId}`)
        .then(res => {
          if (res.data.code == 200) {
            let conf = res.data.data.shortcuts_codes
            if (conf.indexOf('1') >= 0) {
              this.liveChatBtn = true
            }
            if (conf.indexOf('2') >= 0) {
              this.leaveMsgBtn = true
            }
          }
        })

      // 获取问题目录
      if (this.$route.query.all) {
        this.catelogId = 0
      } else {
        this.$axios.get(`/ocs/v1/faqs/directory/${this.areaId}`)
          .then(res => {
            if (res.data && res.data.code == 200) {
              this.catelogId = res.data.data
            }
          })
      }


      // TODO 获取新留言状态

      this.getQuestion()

    },

    methods: {
      getQuestion(id) {
        let catelog = id || this.catelogId
        this.$axios.get(`/ocs/v1/faqs/category/${catelog}?config_id=${this.configId}`)
          .then(res => {
            this.loadStatus = false
            this.list.push({
              type: 1,
              content: res.data.data
            })
          })
      },
      getAnswer(id) {
        this.$axios.get(`/ocs/v1/faqs/answer/${id}`)
          .then(res => {
            this.list.push({
              type: 1,
              content: res.data.data
            })
          })
      },
      askThis(item, type) {
        this.list.push({
          type: 2,
          content: item.name
        })
        if (!type) { // 有子问题
          this.getQuestion(item.id)
        } else {    // 无子问题
          this.getAnswer(item.id)
        }
      }
    },
    components: {
      loading
    },
    head() {
      return {
        title: 'Online Service',
        meta: [
          { name: 'format-detection', content: 'email=no' },
          { name: 'format-detection', content: 'telephone=no' }
        ]
      }
    }
  }
</script>
<style lang="less">
  @import '../../assets/less/faq/index.less';
</style>