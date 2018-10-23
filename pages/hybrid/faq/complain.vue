<template>
  <div id="wrapper">
    <div class="order-msg" v-if="serviceData.order_status">
      <p class="time">{{serviceData.order_create_time | formatDate }}
            <nuxt-link to="/hybrid/faq/chooseOrder">
                <img src="~assets/img/faq/ic_Setting_def_g.png" alt="">
            </nuxt-link>
      </p>
      <div class="order-type clearfix">
        <img src="~/assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
        <div class="right">
          <p class="order-name">{{serviceData.order_type }}
            <span>{{serviceData.order_amount }}</span>
          </p>
          <p class="order-status">{{serviceData.card_no }}
            <span>{{serviceData.order_status }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="choose-order" v-else>
      <nuxt-link to="/hybrid/faq/chooseOrder">
        <div>
          <img src="~/assets/img/faq/ic_add_def_g.png"> Choose An Order
        </div>
      </nuxt-link>

    </div>
    <div class="problem">
      <p>Your Problem</p>
      <select name="problem" id="problem" v-model="problemId">
        <option value='' disabled>Please select the problem you need to solve</option>
        <option value="problem1">You select the problem1</option>
        <option value="problem2">You select the problem2</option>
        <option value="problem3">You select the problem3</option>
        <option value="problem4">You select the problem4</option>
      </select>
      <select name="channel-type" id="channel-type" v-on:change="changeType_index($event)" v-model="indexId">
        <option value="Select Channel Type" disabled>Select Channel Type</option>
        <option :value="item.text" v-for="item in channel_type" :key="item.id">{{item.text}}</option>
      </select>
      <select name="channel-name" id="channel-name" v-model="indexId2">
        <option value="Select Channel Name" disabled>Select Channel Name</option>
        <option :value="item.text" v-for="item in channel_name" :key="item.id">{{item.text}}</option>
      </select>
      <p>Detail Description</p>
      <textarea name="" id="" cols="35" rows="5" placeholder="To rapidly help solve the problem,please show us the screenshots of your payment"></textarea>
    </div>
    <div class="gap"></div>
    <div class="personal">
      <p>Personal Information</p>
      <ul>
        <li>
          <p class="p-name">Account
            <span>*</span>
          </p>
          <p class="p-value">Huangj@startimes.con.cn</p>
        </li>
        <li>
          <p class="p-name">Country
            <span>*</span>
          </p>
          <p class="p-value">Nigeria</p>
        </li>
        <li>
          <p class="p-name">Telecom Info</p>
          <p class="p-value">Safricon 4G</p>
        </li>
        <li>
          <p class="p-name">Device
            <span>*</span>
          </p>
          <p class="p-value">Tecno N2.0</p>
        </li>
      </ul>
    </div>
    <div class="submit">
      <button class="btn">
        SUBMIT
      </button>
    </div>
  </div>
</template>
<script>
  var channel_type = [
    {
      text: "Channel Type A",
      ZY: [
        { text: "Channel Name A" },
        { text: "Channel Name B" },
        { text: "Channel Name C" }
      ]
    },
    {
      text: "Channel Type B",
      ZY: [
        { text: "Channel Name D" },
        { text: "Channel Name E" },
        { text: "Channel Name F" }
      ]
    }
  ];
  export default {
    layout: "base",
    data() {
      return {
        problemId: "",
        channel_type: channel_type,
        indexId: "Select Channel Type",
        indexId2: "Select Channel Name",
        indexNum: 0,
        serviceData: {}
      };
    },
    methods: {
      changeType_index(event) {
        this.indexNum = event.target.value;
        this.indexId2 = this.channel_name[0].text;
      }
    },
    computed: {
      channel_name: function () {
        for (var i = 0; i < this.channel_type.length; i++) {
          if (this.channel_type[i].text == this.indexNum) {
            return this.channel_type[i].ZY;
          }
        }
      }
    },
    mounted() {
      this.serviceData = JSON.parse(localStorage.getItem("orderMsg")) || {};
    },
    head() {
      return {
        title: "Complain"
      };
    }
  };
</script>
<style lang="less" scoped>
  body {
    background: #fff;
  }

  .wrapper {
    font-family: "DINPro", Roboto, Arial, Helvetica, Sans-serif;
  }

  .clearfix:after {
    display: block;
    visibility: hidden;
    clear: both;
    height: 0;
    content: "";
  }

  .clearfix {
    zoom: 1;
  }

  .gap {
    background-color: #f2f2f2;
    height: 4px;
    width: 100%;
  }

  .order-msg {
    box-shadow: 0px 1px 3px 1px #dddddd;
    border-radius: 2px;
    padding: 0.5rem;
    width: 95%;
    margin: 0.5rem 2.5% 0 2.5%;
    position: relative;
    .time {
      width: 100%;
      color: #aaaaaa;
      font-size: 0.8rem;
      border-bottom: 1px solid #eeeeee;
      padding: 0.2rem 0;
      img {
        position: absolute;
        display: block;
        width: 1.2rem;
        right: 0.4rem;
        top: 0.4rem;
      }
    }
  }

  .choose-order {
    box-shadow: 0px 1px 3px 1px #dddddd;
    padding: 1.3rem;
    width: 95%;
    margin: 0.5rem 2.5% 0 2.5%;
    border-radius: 2px;
    div {
      width: 100%;
      text-align: center;
      color: #212121;
      font-size: 0.85rem;
      font-weight: bold;
      img {
        vertical-align: sub;
        margin-right: 0.2rem;
        width: 0.9rem;
      }
    }
  }

  .order-type {
    padding: 0.7em 0;
    img {
      width: 2.5rem;
      height: 2.5rem;
      float: left;
    }
    .right {
      margin-left: 3rem;
    }
    .order-name {
      span {
        font-weight: bold;
        float: right;
      }
    }
    .order-status {
      font-size: 0.9rem;
      color: #999999;
      span {
        color: #00cc33;
        float: right;
      }
    }
  }

  .problem {
    padding: 0.5rem;
    p {
      margin: 0.6rem 0 0.3rem 0;
      color: #212121;
      font-weight: bold;
      font-size: 0.9rem;
    }
    select {
      border: 1px solid #dddddd;
      width: 100%;
      font-size: 0.8rem;
      padding: 0.3rem;
      margin-bottom: 0.3rem;
      border-radius: 4px;
    }
    textarea {
      font-size: 0.8rem;
      border: 1px solid #dddddd;
      width: 100%;
      padding: 0.3rem;
      border-radius: 2px;
    }
  }

  .personal {
    width: 95%;
    margin: 0 2.5% 4.5rem 2.5%;
    &>p {
      margin: 0.6rem 0 0.3rem 0;
      color: #212121;
      font-weight: bold;
      font-size: 0.9rem;
    }
    ul {
      box-shadow: 0px 1px 3px 1px #dddddd;
      padding: 0.5rem 0.8rem;
      border-radius: 5px;
      li {
        padding: 0.5rem 0;
        p {
          display: inline-block;
          color: #212121;
          font-size: 0.8rem;
          &.p-name {
            width: 30%;
            border-right: 1px solid #eeeeee;
            span {
              color: #0087e0;
            }
          }
          &.p-value {
            font-weight: bold;
            margin-left: 1.5rem;
          }
        }
        &+li {
          border-top: 1px solid #eeeeee;
        }
      }
    }
  }

  .submit {
    width: 100%;
    text-align: center;
    color: #0087eb;
    border-top: 1px solid #eeeeee;
    margin-top: 1.5rem;
    padding: 1rem 0;
    position: fixed;
    bottom: 0;
    height: 4.25rem;
    background: #fff;

    button {
      margin: 0 auto;
      border: 1px solid #0087eb;
      border-radius: 2px;
      background: #fff;
      padding: 0.3rem;
      font-weight: bold;
      width: 60%;
      outline: none;
    }
  }
</style>