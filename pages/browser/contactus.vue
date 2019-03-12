<template>
    <div class="wrapper wide">
        <download class="clearfix"/>
        <div class="hall">
            <h3>
                <div class="dot">‧</div>
                <div>Business Hall</div>
            </h3>
            <ul class="hallList">
                <li v-for="(item,i) in hallList " :key="i" @click="toHallDetail(item.id)">
                    {{item.name}}
                    <img src="~assets/img/web/ic_categary1.png" alt>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import download from '~/components/web/download'
export default {
    components: {
        download
    },
    data() {
        return {
            hallList: []
        }
    },
    mounted() {
        this.$axios.get(`cms/areas/region`).then(res => {
            this.hallList = res.data
        })
    },
    methods: {
        toHallDetail(id) {
            this.$router.push(`/browser/hall?regionId=${id}`)
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.hall {
    width: 100%;
    padding: 0 0.8rem;
    h3 {
        margin: 0.4rem 0;
        color: #333333;
        font-weight: bold;
        div {
            margin-right: 0.3rem;
            font-size: 1.1rem;
            line-height: 2.5rem;
            &.dot {
                font-size: 2.5rem;
                height: 1rem;
                line-height: 2.3rem;
                float: left;
            }
        }
    }
    .hallList {
        li {
            list-style: none;
            padding: 1rem 0 1rem 1rem;
            font-size: 1.1rem;
            border-bottom: 1px solid #d8d8d8;
            color: #0087eb;
            text-decoration: underline;
            img {
                width: 1.5rem;
                height: 1.5rem;
                float: right;
            }
        }
    }
}
</style>
