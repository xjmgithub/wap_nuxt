<template>
    <div id="wrapper">
        <div v-show="loaded&&serviceList">
            <div class="orders">
                <div v-for="(item,index) in serviceList" :key="index" class="order-msg">
                    <label @click="check(item.id)">
                        <p class="time">
                            {{ item.order_create_time | formatDate }}
                            <input :checked="item.id==checkedId" type="radio" name="order">
                            <i/>
                        </p>
                        <div class="order-type clearfix">
                            <img src="~assets/img/faq/ic_RechargeOrder_def_b.png" alt>
                            <div class="right">
                                <p class="order-name">
                                    {{ item.order_type }}
                                    <span>{{ item.order_amount }}</span>
                                </p>
                                <p class="order-status">
                                    {{ item.card_no }}
                                    <span>{{ item.order_status }}</span>
                                </p>
                            </div>
                        </div>
                    </label>
                </div>
            </div>
            <div class="ok">
                <button class="btn" @click="submit">OK</button>
            </div>
        </div>
        <div v-show="loaded&&!serviceList" class="no-orders">
            <img src="~assets/img/faq/Group5.png" alt>
            <p>No Orders.</p>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
    layout: 'base',
    data: function() {
        return {
            entranceId: this.$route.query.entrance_id || '',
            serviceList: null,
            checkedId: null,
            loaded: false
        }
    },
    computed: {
        checked() {
            return this.serviceList[this.checkedId]
        }
    },
    filters: {
        formatDate(date) {
            return dayjs(date).format('D MMM YYYY HH-mm:ss')
        }
    },
    mounted() {
        let cachedOrder = sessionStorage.getItem('orderMsg')
        this.$axios
            .get(`/ocs/v1/service/module/moreOrder?entranceId=${this.entranceId}`, {
                headers: {
                    'x-clientType': 1,
                    'x-appVersion': '5300'
                }
            })
            .then(res => {
                if (res.data) {
                    let obj = {}
                    res.data.data.forEach((item, index) => {
                        obj[item.order_info.id] = item.order_info
                        if (index == 0) {
                            this.checkedId = item.order_info.id
                        }
                    })
                    this.serviceList = obj
                    if (cachedOrder) {
                        this.checkedId = JSON.parse(cachedOrder).id
                    }
                }
                this.loaded = true
            })
    },
    methods: {
        check(id) {
            this.checkedId = id
        },
        submit() {
            if (this.checkedId) {
                sessionStorage.setItem('orderMsg', JSON.stringify(this.checked))
                this.$router.push({
                    path: '/hybrid/faq/complain',
                    query: this.$route.query
                })
            }
        }
    },
    head() {
        return {
            title: 'Orders'
        }
    }
}
</script>
<style lang="less" scoped>
body {
    background: #fff;
    height: 100%;
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
        position: absolute;
        cursor: pointer;
        left: -9999px;
        &:checked {
            & + i {
                border: 1px solid #008be9;
                &:after {
                    opacity: 1;
                }
            }
        }
    }
    i {
        display: block;
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 18px;
        height: 18px;
        outline: 0;
        border: 1px solid #bdbdbd;
        background: #ffffff;
        border-radius: 50%;
        &:after {
            position: absolute;
            content: '';
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
.no-orders {
    width: 100%;
    height: 1000px;
    background: #eeeeee;
    text-align: center;
    color: #000000;
    padding-top: 6rem;
    overflow: hidden;
    p {
        margin-top: 2rem;
        font-weight: bold;
    }
}
</style>
