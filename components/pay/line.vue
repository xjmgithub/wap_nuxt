<template>
    <div class="line"> 
        <div class="arrows" /> 
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
    background-color: #eeeeee;
    margin-bottom:0.8rem;
    .arrows {
       width: .8rem;
       height:.8rem;
       border-bottom: 1px solid #eeeeee;
       border-right:  1px solid #eeeeee;
       position: absolute;
       top:0;
       left:50%;
       margin-top:-.35rem;
       background-color: #ffffff;
       transform: rotate(45deg);
    }
}
</style>
