<template>
    <div id="wrapper">
        <div class="order-msg">
            <p class="time">9 Dec 2018 19:34:35</p>
            <div class="order-type clearfix">
                <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt="">
                <div class="right">
                    <p class="order-name">DVB Recharge<span>￥980 </span></p>
                    <p class="order-status">Card No. 0213 9030 831<span>Successful</span></p>
                </div>
            </div>
        </div>
        <div class="problem">
            <p>Your Problem</p>
            <input type="text" placeholder="Please select the problem you need to solve">
            <p>Your Problem</p>
            <textarea name="" id="" cols="35" rows="5" placeholder="To rapidly help solve the problem,please show us the screenshots of your payment"></textarea>
        </div>
        <div class="gap"></div>
        <div class="personal">
            <p>Personal Information</p>
           <ul>
               <li><p class="p-name">Account <span>*</span></p><p class="p-value">Huangj@startimes.con.cn</p></li>
               <li><p class="p-name"> Country <span>*</span></p><p class="p-value">Nigeria</p></li>
               <li><p class="p-name">Telecom Info</p><p class="p-value">Safricon 4G</p></li>
               <li><p class="p-name">Device <span>*</span></p><p class="p-value">Tecno N2.0</p></li>
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
  export default {
    layout: 'base',
    head() {
      return {
        title: 'Complain'
      }
    }
  }
</script>
<style lang="less">
body {
    background: #fff;
}
.wrapper{
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
.gap{
    background-color: #F2F2F2;
    height:4px;
    width:100%;
}
.order-msg{
    box-shadow:0px 1px 3px 1px #dddddd;
    border-radius: 5px;
    padding:0.5rem;
    width:95%;
    margin:.5rem 2.5% 0 2.5%;
    .time{
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
.problem{
    padding:0.5rem;
    p{
        margin: .6rem 0 .3rem 0;
        color:#212121;
        font-weight: bold;
        font-size: .9rem;
    }
    input{
        border:1px solid #DDDDDD;
        width:100%;
        font-size:.8rem; 
        padding:.3rem;
    }
    textarea{
        font-size:.8rem; 
        border:1px solid #DDDDDD;
        width:100%;
        padding:.3rem;
    }
}
.personal{
    width:95%;
    margin:0 2.5%;
    &>p{
        margin: .6rem 0 .3rem 0;
        color:#212121;
        font-weight: bold;
        font-size: .9rem;
    }
    ul{
        box-shadow:0px 1px 3px 1px #dddddd;
        padding:0.5rem 0.8rem;
        border-radius: 5px;
        li{
            padding:.5rem 0;
            p{
                display:inline-block;
                color:#212121;
                font-size: .8rem;
                &.p-name{
                    width:30%;
                    border-right:1px solid #eeeeee;
                    span{
                        color:#0087e0;
                    }
                }
                &.p-value{
                    font-weight:bold;
                    margin-left:1.5rem;
                }
            }
            &+li{
                border-top:1px solid #eeeeee;
            }
        } 
    }
}
.submit{
  width:100%;
  text-align: center;
  color:#0087EB;
  border-top:1px solid #eeeeee;
  margin-top:1.5rem;
  padding:1rem 0;
  button{
    margin:0 auto;
    border:1px solid #0087EB;
    border-radius: 2px;
    background: #FFF;
    padding:.3rem;
    font-weight:bold;
    width:60%;
  }
}
</style>