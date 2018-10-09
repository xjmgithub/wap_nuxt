<template>
  <div>
    <div id="wrapper">
        <div class="order-msg">
            <div class="top">
                <p class="time">9 Dec 2018 19:34:35</p>
                <div class="order-type clearfix">
                    <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
                    <div class="right">
                    <p class="order-name">DVB Recharge<span>￥980 </span></p>
                    <p class="order-status">Card No. 0213 9030 831<span>Successful</span></p>
                    </div>
                </div>
            </div>
            <div class="gap"></div>
            <div class="bottom clearfix">
                <p class="clearfix">Questions <img src="~assets/img/faq/ic_categary_copy41.png" alt=""></p>
                <ul>
                    <li>1. Paid, But recharge can’t be finished.  </li>
                    <li>2. I’ve recharged, But I still can’t watch channels on TV.</li>
                    <li>3. I’ve recharged, But I still can’t watch channels in App.</li>
                </ul>
                <div class="btn">COMPLAIN</div>
            </div>
        </div>
        <div class="line">&nbsp;</div>
  </div>
  </div>
  
</template>
<script>
  export default {
    layout: 'base',
    data:function(){
      return {
        serviceIndex:1
      }
    },
    head() {
      return {
        title: 'More Orders'
      }
    }
  }
</script>
<style lang="less">
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