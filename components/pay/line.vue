<template>
    <div class="line"> 
        <div class="arrows"/> 
    </div>
</template>
<script>
export default {
   
}
</script>
<style lang="less" scoped>
.line {
    height:2px;
    width: 100%;
    position: relative;
    background-color: #eeeeee;
    .arrows {
       width: .8rem;
       height:.8rem;
       border-bottom: 2px solid #eeeeee;
       border-right:  2px solid #eeeeee;
       position: absolute;
       top:0;
       left:50%;
       margin-top:-.3rem;
       background-color: #ffffff;
       transform: rotate(45deg);
    }
}
</style>
