<template>
  <div>
    <div id="wrapper">
      <div v-for="(item,index) in serviceList" :key="index">
        <div class="order-msg">
            <div class="top">
                <p class="time">{{item.order_info.order_create_time | formatDate }}</p>
                <div class="order-type clearfix">
                    <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
                    <div class="right">
                    <p class="order-name">{{item.order_info.order_type }}<span>{{item.order_info.order_amount }}</span></p>
                    <p class="order-status">{{item.order_info.card_no }}<span>{{item.order_info.order_status }}</span></p>
                    </div>
                </div>
            </div>
            <div class="gap"></div>
            <div class="bottom clearfix">
                <p class="clearfix">Questions <img src="~assets/img/faq/ic_categary_copy41.png" alt=""></p>
                <ul>
                  <li v-for="(q,index) in item.questions" :key="index">{{q.content}} </li>
                </ul>
                 <div class="btn" v-for="(item,index) in item.service_components" :key="index">
                    {{item.presentation_name}}
              </div>
            </div>
        </div>
        <div class="line">&nbsp;</div>
      </div>
  </div>
  </div>
  
</template>
<script>
let moment = require("moment/moment.js");
  export default {
    layout: 'base',
    data:function(){
      return {
        serviceIndex:1,
        entranceId: this.$route.query.entrance_id || '',
        serviceList:[],
      }
    },
    filters:{
      formatDate(date){
        return moment(date).format('D MMM YYYY HH-mm:ss')
      }
    },
    mounted(){
      this.$axios.get(`/ocs/v1/service-list?entranceId=${this.entranceId}`,{
        }).then(res => {
            if (res.data) {
              this.serviceList = res.data.data
            }
        })
    },
    head() {
      return {
        title: 'More Orders'
      }
    }
  }
</script>
<style lang="less" scoped>
body {
    background: #fff;
}

#wrapper{
    padding:0.5rem;
    font-family: 'DINPro', Roboto, Arial, Helvetica, Sans-serif
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

.order-msg{
  box-shadow:0px 1px 3px 1px #dddddd;
  border-radius: 5px;
  .top{
    padding:0 0.5rem;
     p.time{
      width:100%;
      color:#AAAAAA;
      font-size:.8rem;
      border-bottom:1px solid #EEEEEE;
      padding:.2rem 0;
    }
  }
  .order-type{
      padding:.7em 0;
      img{
        width:2.5rem;
        height:2.5rem;
        float:left;
      }
      .right{
        margin-left: 3rem;
      }
      .order-name{
        span{
          font-weight:bold;
          float:right;
        }
      }
      .order-status{
        font-size:.9rem;
        color:#999999;
        span{
          color:#00CC33;
          float:right;
        }
      }
  }
  .bottom{
    padding:.7rem 0.5rem;
    p{
      font-size:.9rem;
      color:#333333;
      img{
        float:right;
        width:1.5rem;
        height:1.5rem;
      }
    }
    li{
      color:#333333;
      font-size:.8rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap; 
    }
    .btn{
      color:#0087EB;
      font-size:.8rem;
      margin-top:.7rem;
      float:right;
      font-weight:bold;
      margin-left: 0.7rem;

    }
  }
}
.gap{
background-color: #F2F2F2;
height:4px;
width:100%;
}
 .line{
    width:95%;
    margin:0 auto;
    height: 0.7rem;
    border-bottom: 1px solid #eee;
  }
</style>