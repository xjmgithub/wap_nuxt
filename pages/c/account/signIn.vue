<template>
    <div id="wrapper">
        <div class="tab">
            <div v-show="type==1" @click="changetype(0)">
                <img class="gray" src="~/assets/img/users/ic_telephone_def_g.png" />
                <a href="#" class="sign-way">Use phone number sign in</a>
            </div>
            <div  v-show="type==0" @click="changetype(1)">
                <img class="gray" src="~/assets/img/users/ic_email_def_gray.png" />
                <a href="#" class="sign-way">Use Email sign in</a>
            </div>
        </div>
        <div v-show="type==0" class="by_tel">
            <div class="country_choose" @click="countryDialogStatus=true">
                <img :src="areaInfo.nationalFlag" />
                <span>{{areaInfo.name}}</span>
            </div>
             <div class="img-box">
                <img src="~/assets/img/users/ic_user_def_w.png" alt="">
                <input type="tel" v-model="phoneNum" placeholder="Phone Number" />
            </div>
            <div class="img-box">
                <img src="~/assets/img/users/ic_lockr_def_w.png" alt="">
                <input type="password" v-model="password" placeholder="Password" />
            </div>
        </div>
        <div v-show="type==1" class="by_email">
             <div class="img-box">
                <img src="~/assets/img/users/ic_user_def_w.png" alt="">
                <input type="email" v-model="email" placeholder="E-mail" />
            </div>
            <div class="img-box">
                <img src="~/assets/img/users/ic_lockr_def_w.png" alt="">
                <input type="password" v-model="password" placeholder="Password" />
            </div>
        </div>
        <div class="next-btn">SIGN IN</div>
        <div class="forgot-pwd"><a href="#">Forgot password?</a></div>
        <div class="country-choose-dialog" v-show="countryDialogStatus">
            <div class="dialog-title">Country List</div>
            <ul>
                <li v-for="(item,index) in countrys" :key="index" @click="chooseCountry(item)">
                    <img :src="item.nationalFlag" />
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
        <shadow-layer v-show="countryDialogStatus" @click="countryDialogStatus=false"></shadow-layer>
    </div>
</template>
<script>
import shadowLayer from "~/components/shadow-layer";
export default {
  layout: "base",
  async asyncData({ app, store, redirect }) {
    app.$axios.setHeader("token", store.state.token);
    let res = await app.$axios.get("/cms/vup/v2/areas?versionCode=5300");
    let countrys = {};
    res.data.forEach((item, index) => {
      countrys[item.id] = item;
    });
    return {
      countrys: countrys
    };
  },
  data() {
    return {
      type: 0,
      country: this.$store.state.country,
      countryDialogStatus: false,
      phoneNum: "",
      password: "",
      email: ""
    };
  },
  computed: {
    areaInfo() {
      return this.countrys[this.country.id];
    }
  },
  methods: {
    changetype(type) {
      this.type = type;
      this.password = "";
    },
    chooseCountry(country) {
      this.country = {
        id: country.id,
        short: country.country
      };
      this.countryDialogStatus = false;
    }
  },
  components: {
    shadowLayer
  },
  head() {
    return {
      title: "Sign In",
      meta: [
        { name: "format-detection", content: "email=no" },
        { name: "format-detection", content: "telephone=no" }
      ]
    };
  }
};
</script>
<style lang="less" scoped>
#wrapper {
  font-family: "Roboto";
  padding: 1rem 0.8rem;

  .tab {
    div {
      padding-top: 1rem;
      text-align: right;
      img {
        height: 1.2rem;
        margin-right: 0.5rem;
      }
      .sign-way {
        color: #0087eb;
        font-size: 0.9rem;
        text-decoration: underline;
      }
    }
  }
  .by_tel,
  .by_email {
    height: 15rem;
    input{
        border:none;
        outline: none;
        border-bottom:1px solid #DDDDDD;
        height:1.5rem;
        padding-bottom:.5rem;
        margin-bottom:2rem;
        width:85%;
        font-size: 1rem;
    }
    .img-box {
        img{
            width: 1.4rem;
            height: 1.4rem;
            margin-right:.5rem;
            vertical-align: middle;
        }
    }
  }
  .by_tel {
    .country_choose {
      line-height: 4rem;
      height:4rem;
      img {
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 0.5rem;
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
      }
    }
  }
  .by_email {
    padding-top: 4rem;
  }
  .next-btn {
    width: 80%;
    background: #0087eb;
    color: white;
    text-align: center;
    height: 2.25rem;
    line-height: 2.25rem;
    font-size: 0.9rem;
    margin: 0 auto;
    &.disabled {
      background: #dddddd;
      color: #aaaaaa;
    }
  }
  .forgot-pwd{
      text-align: center;
      margin-top:1rem;
      a{
        color:#0087eb;
        font-size: .9rem;
        text-decoration: underline
      }
      
  }
  .country-choose-dialog {
    width: 18rem;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1000;
    height: 25rem;
    margin-top: -12.5rem;
    margin-left: -9rem;
    background: white;
    padding: 1rem;
    .dialog-title {
      height: 2rem;
    }
    ul {
      display: block;
      height: 21rem;
      overflow: auto;
      li {
        display: block;
        width: 8rem;
        float: left;
        height: 2.5rem;
        line-height: 2.5rem;
        img {
          width: 1.3rem;
          height: 1.3rem;
          margin-top: 0.6rem;
          margin-right: 0.3rem;
          float: left;
        }
        span {
          width: 6.4rem;
          overflow: hidden;
          height: 2.5rem;
          display: block;
          float: left;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.8rem;
        }
      }
    }
  }
}
</style>