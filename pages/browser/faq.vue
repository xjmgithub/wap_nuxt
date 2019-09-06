<template>
    <div>
        <div class="country">
            <p class="title">FAQ</p>
            <table v-show="haveGotMsg">
                <tr v-for="(item,index) in arr" :key="index">
                    <td>
                        <div class="item-title" v-html="item.title"></div>
                        <div class="item-con" v-html="HTMLDecode(item.con.replace(/#f97e00/g,'#0087eb'))"></div>
                    </td>
                </tr>
            </table>
            <div id="div"></div>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'default',
    data() {
        return {
            haveGotMsg: false,
            arr: []
        }
    },
    computed: {
        country() {
            return this.$store.state.country
        }
    },
    mounted() {
        const url = '/hybrid/api/app/getFaq?areaID=' + this.country.id
        const that = this
        this.$nextTick(()=>{
            this.$nuxt.$loading.start()
        })
        this.$axios.get(url).then(res => {
            this.$nuxt.$loading.finish()
            Object.values(res.data.data).forEach(val => {
                that.arr.push(val)
            })
            that.haveGotMsg = true
        })
    },
    methods: {
        HTMLDecode(input) {
            let converter = document.createElement('div')
            converter.innerHTML = input
            const output = converter.innerText
            converter = null
            return output
        }
    },
    head() {
        return {
            title: 'FAQ'
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.country {
    .title {
        font-size: 1.1rem;
        font-weight: bold;
        padding-top: 1rem;
    }
    table {
        tr {
            list-style: none;
            padding: 1rem 0 1rem;
            td {
                padding: 0.5rem 0 0.5rem;
                .item-title {
                    width: 100%;
                    font-size: 0.9rem;
                    line-height: 1rem;
                    padding: 0.7rem 0.5rem;
                    color: #0087eb;
                    background-color: #eee;
                }
                .item-con {
                    width: 100%;
                    font-size: 0.8rem;
                    line-height: 1rem;
                    padding: 0.5rem;
                    border: 1px solid #eee;
                    // span {
                    //     b {
                    //         color: #0087eb;
                    //     }
                    // }
                }
            }
        }
    }
}
</style>
