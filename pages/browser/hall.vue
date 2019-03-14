<template>
    <div class="wrapper">
        <div class="hall">
            <ul v-if="hallList">
                <li v-for="(item,i) in hallList " :key="i">
                    <p>{{item.name}}</p>
                    <p v-if="i==0"><a :href="'tel:'+item.phone">{{item.phone.split(',')[0]}}</a> {{item.phone.split(',')[1]}}</p>
                    <p v-else><a :href="'tel:'+item.phone">{{item.phone}}</a></p>
                    <p v-if="i==0"><a :href="'tel:'+item.phone1">{{item.phone1.split(',')[0]}}</a> {{item.phone1.split(',')[1]}}</p>
                    <p v-else>{{item.address}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
           hallList:[] ,
           country: this.$store.state.country,
        }
    },
    mounted() {
        const id = this.$route.query.regionId
        const national = this.country.phoneNumber.split('@')
        const nationalLine = {
            name:'National Service Hotline',
            phone:national[0],
            phone1:national[1]
        } 
        this.$axios.get(`/cms/areas/callcenter?regionId=${id}`).then(res => {
           this.hallList = res.data
           this.hallList.unshift(nationalLine)
        })
    }
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
                margin-bottom:.7rem; 
            }
            a{
                color:#0087EB;
                text-decoration: underline;
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
