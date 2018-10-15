<template>
  <div>
    <div id="wrapper">
    <div class="order-msg">
        <div class="top" v-if="serviceData.order_info">
            <p class="time">{{serviceData.order_info.order_create_time | formatDate }}</p>
            <div class="order-type clearfix">
                <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
                <div class="right">
                <p class="order-name">{{serviceData.order_info.order_type }}<span>{{serviceData.order_info.order_amount }}</span></p>
                <p class="order-status">{{serviceData.order_info.card_no }}<span>{{serviceData.order_info.order_status }}</span></p>
                </div>
            </div>
        </div>
        <div class="gap"></div>
        <div class="bottom clearfix">
            <p class="clearfix">Questions <img src="~assets/img/faq/ic_categary_copy41.png" alt=""></p>
            <ul>
                <li v-for="(item,index) in serviceData.questions" :key="index">{{item.content}}</li>
            </ul>
            <div class="btn">COMPLAIN</div>
        </div>
        <div class="gap"></div>
        <div class="more">
            MORE ORDERS
        </div>
    </div>
    <div class="service">
      <nav id="nav">
        <a :class="{on:serviceIndex == 1}" @click="serviceIndex = 1"><img src="~assets/img/faq/ic_categary_copy42.png" alt=""></a>
        <a :class="{on:serviceIndex == 2}" @click="serviceIndex = 2"><img src="~assets/img/faq/ic_categary_copy2.png" alt=""></a>
        <a :class="{on:serviceIndex == 3}" @click="serviceIndex = 3"><img src="~assets/img/faq/ic_categary_copy21.png" alt=""></a>
        <a :class="{on:serviceIndex == 4}" @click="serviceIndex = 4"><img src="~assets/img/faq/ic_categary_copy4.png" alt=""></a>
        <a :class="{on:serviceIndex == 5}" @click="serviceIndex = 5"><img src="~assets/img/faq/ic_tv1.png" alt=""></a>
      </nav>
      <div class="questions"  ref="list">
        <ul v-show="serviceIndex == 1">
          <li>Certain channels are not playing but display loading, what do…</li>
          <li>Paid successfully, why I still can not view the premium chann…</li>
          <li>How can I link if I am a StarTimes decoder user?</li>
          <li>What are the accepted payment methods for payment?</li>
          <li>What are StarTimes App live TV channels?</li>
          <li>What should I do if the player tells me the video can’t be play…</li>
          <li>How to subscribe StarTimes ON?</li>
          <li>Can I download the videos to watch them offline?</li>
          <li>Who can get the free online video streaming service?</li>
        </ul>
        <div v-show="serviceIndex == 2" >2</div>
        <div v-show="serviceIndex == 3" >3</div>
        <div v-show="serviceIndex == 4" >4</div>
        <div v-show="serviceIndex == 5" >5</div>
      </div>
    </div>
    
  </div>
    <div class="costomer">
      <button class="btn">
        COSTOMER SERVICE
      </button>
    </div>
  </div>
  
</template>
<script>
let moment = require("moment/moment.js");
export default {
  layout: "base",
  data: function() {
    return {
      serviceIndex: 1,
      serviceData:{},
      entranceId: this.$route.query.entrance_id || '',
    };
  },
  filters:{
    formatDate(date){
      return moment(date).format('D MMM YYYY HH-mm:ss')
    }
  },
  mounted(){
    this.$axios.get(`/ocs/v1/service?entranceId=${this.entranceId}`,{
      }).then(res => {
            if (res.data) {
              this.serviceData = res.data.data
            }
        })
  },
  head() {
    return {
      title: "Online Service"
    };
  }
};
</script>
<style lang="less">
body {
  background: #fff;
}

#wrapper {
  padding: 0.5rem;
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

.order-msg {
  box-shadow: 0px 1px 3px 1px #dddddd;
  border-radius: 5px;
  .top {
    padding: 0 0.5rem;
    p.time {
      width: 100%;
      color: #aaaaaa;
      font-size: 0.8rem;
      border-bottom: 1px solid #eeeeee;
      padding: 0.2rem 0;
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
  .gap {
    background-color: #f2f2f2;
    height: 4px;
    width: 100%;
  }
  .bottom {
    padding: 0.7rem 0.5rem;
    p {
      font-size: 0.9rem;
      color: #333333;
      img {
        float: right;
        width: 1.5rem;
        height: 1.5rem;
      }
    }
    li {
      color: #333333;
      font-size: 0.8rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .btn {
      color: #0087eb;
      font-size: 0.8rem;
      margin-top: 0.7rem;
      float: right;
      font-weight: bold;
    }
  }
  .more {
    color: #0087eb;
    font-size: 0.8rem;
    font-weight: bold;
    text-align: center;
    padding: 0.7rem 0;
  }
}
.service {
  margin-top: 1rem;
  #nav {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    padding-bottom: 0.7rem;
    a {
      border-bottom: 3px solid #eeeeee;
      width: 20%;
      display: inline-block;
      padding-bottom: 0.7rem;
      &.on {
        border-bottom: 3px solid #0087eb;
      }
      img {
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }
  .questions {
    margin-bottom: 4.5rem;
    li {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0.5rem 0;
      color: #333333;
      font-size: 0.8rem;
      & + li {
        border-top: 1px solid #eeeeee;
      }
    }
  }
}
.costomer {
  width: 100%;
  text-align: center;
  color: #0087eb;
  border-top: 1px solid #eeeeee;
  margin-top: 1.5rem;
  padding: 1rem 0;
  position: fixed;
  bottom: 0;
  background: #fff;
  height: 4.25rem;
  button {
    margin: 0 auto;
    border: 1px solid #0087eb;
    border-radius: 2px;
    background: #fff;
    padding: 0.3rem;
    font-weight: bold;
    width: 60%;
  }
}
</style>