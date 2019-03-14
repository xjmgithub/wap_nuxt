<template>
    <div class="wrapper">
        <div class="hall">
            <ul>
                <li v-for="(item,i) in hallList " :key="i">
                    <p>{{item.name}}</p>
                    <p><a :href="'tel:'+item.phone">{{item.phone}}</a></p>
                    <p>{{item.address}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
           hallList:[] 
        }
    },
    mounted() {
        const id = this.$route.query.regionId
        this.$axios.get(`/cms/areas/callcenter?regionId=${id}`).then(res => {
           this.hallList = res.data
        })
    },
}
</script>
<style  lang="less" scoped>
.hall{
    width: 100%;
    padding: 0 0.8rem;
    li{
        list-style: none;
        padding:1rem 0 1rem 1rem;
        font-size: 1.1rem;
        border-bottom: 1px solid #D8D8D8;
        font-size: .95rem;

        p{
            color:#333333;
            &:nth-child(1){
                font-size: 1.1rem;
                font-weight: bold;
                margin-bottom:1rem; 
            }
            &:nth-child(2){
                text-decoration: underline;
                margin-bottom:.7rem; 
                a{
                    color:#0087EB;
                }
            }
        }
        img{
            width: 1.5rem;
            height: 1.5rem;
            float: right;
        }
    }
}
</style>
