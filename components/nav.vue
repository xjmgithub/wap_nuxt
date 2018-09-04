<template>
    <div>
        <ul>
            <li v-for="(item,index) in list" :key="index">
                <a :href="item.link">{{item.title}}</a>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data () {
        return { list: {} }
    },
    created(){
        let _this = this
        let areaId = this.$store.state.country.id
        this.$axios.get(`http://pc.startimestv.com/home/home/recommendNavigationBar?areaID=${areaId}`)
        .then(res=>{
            if(res.status == 200){
                _this.list = res.data
            }
        })
    }
}
</script>
<style>
ul {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow: hidden;
    zoom: 1;
    background: #ff7a00;
}
ul li {
    display: block;
    width: 20%;
    float: left;
    text-align: center;
    height: 2rem;
    line-height: 2rem;
}
ul li a {
    color: white;
    text-decoration: none;
    font-size: 0.9rem;
}
</style>