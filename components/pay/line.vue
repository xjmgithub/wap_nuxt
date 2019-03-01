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
    height:1px;
    width: 100%;
    position: relative;
    // border:1px solid #eeeeee;
    .arrows {
       width: .8rem;
       height:.8rem;
       border-bottom: 2px solid #eeeeee;
       border-right:  2px solid #eeeeee;
       position: absolute;
       top:0;
       left:50%;
       margin-top:-.45rem;
       background-color: #ffffff;
       transform: rotate(45deg);
    }
}
</style>
