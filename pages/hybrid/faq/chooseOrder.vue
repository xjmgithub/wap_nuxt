<template>
    <div id="wrapper">
        <div v-show="serviceList.length>0">
            <div class="orders" >
                <div class="order-msg" v-for="(item,index) in serviceList" :key="index">
                    <label>
                        <p class="time">{{item.order_info.order_create_time | formatDate }}
                            <input type="radio" name="order" :value="item" :checked="item.id == orderId" v-model="checkedValue" >
                            <i></i>
                        </p>
                        <div class="order-type clearfix">
                            <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
                            <div class="right">
                                <p class="order-name">{{item.order_info.order_type }}
                                    <span>{{item.order_info.order_amount }}</span>
                                </p>
                                <p class="order-status">{{item.order_info.card_no }}
                                    <span>{{item.order_info.order_status }}</span>
                                </p>
                            </div>
                        </div>
                    </label>
                </div>
            </div>
            <div class="ok">
                <nuxt-link to="/hybrid/faq/complain">
                    <button class="btn">
                        OK
                    </button>
                </nuxt-link>
            </div>
        </div>
        <div v-show="serviceList.length<=0" class="no-orders">
            <img src="~assets/img/faq/Group5.png" alt="">
            <p>No Orders.</p>
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
            entranceId: this.$route.query.entrance_id || "",
            serviceList: [],
            orderId:'',
            checkedValue:{},
            currentService:{}
        };
    },
    filters: {
        formatDate(date) {
        return moment(date).format("D MMM YYYY HH-mm:ss");
        }
    },
    mounted() {
        this.$axios
        .get(`/ocs/v1/service-list?entranceId=${this.entranceId}`, {})
        .then(res => {
            if (res.data) {
            this.serviceList = res.data.data;
            this.checkedValue = this.serviceList[0]
            }
        });
        this.currentService = JSON.parse(localStorage.getItem("orderMsg"))
    },
    watch:{
        checkedValue(val,oldVal){
            console.log(val)
            this.currentService = val.order_info
            localStorage.setItem("orderMsg",JSON.stringify(this.currentService))
        }
    },
    head() {
        return {
            title: "Orders"
        };
    }
    };
</script>
<style lang="less" scoped>
body{
     background: #fff ;
     height:100%;
}
#wrapper {
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
.orders {
  margin-bottom: 4.7rem;
  .order-msg {
    box-shadow: 0px 1px 3px 1px #dddddd;
    border-radius: 2px;
    padding: 0.5rem;
    margin: 0.5rem 2.5% 0.8rem 2.5%;
    width: 95%;
    position: relative;
    p.time {
      width: 100%;
      color: #aaaaaa;
      font-size: 0.8rem;
      border-bottom: 1px solid #eeeeee;
      padding: 0.2rem 0;
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
  }
}
.ok {
  width: 100%;
  text-align: center;
  color: #0087eb;
  border-top: 1px solid #eeeeee;
  padding: 1rem 0;
  background: #fff;
  height: 4.25rem;
  margin-top: 1.5rem;
  position: fixed;
  bottom: 0;
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
.time {
    input {
        position:absolute;
        cursor: pointer;
        left: -9999px;
        &:checked{
            &+i{
                border: 1px solid #008be9;
                &:after{
                    opacity: 1;

                }
            }
        } 
    }  
    i {
        display: block;
        position: absolute;
        top: .5rem;
        right: .5rem;
        width: 18px;
        height: 18px;
        outline: 0;
        border: 1px solid #bdbdbd;
        background: #ffffff;
        border-radius: 50%;
        &:after{
            position: absolute;
            content: "";
            top: 3px;
            left: 3px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #008be9;
            opacity: 0;
            transition: opacity 0.1s;
            -webkit-transition: opacity 0.1s;
        }
    }
} 
.no-orders{
    width:100%;
    height:1000px;
    background: #eeeeee;
    text-align: center;
    color:#000000;
    padding-top:6rem;
    overflow: hidden;
    p{
        margin-top:2rem;
        font-weight:bold;
    }
}
</style>