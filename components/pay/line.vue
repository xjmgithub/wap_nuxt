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
    background-color: #e0e0e0;
    margin-bottom:0.8rem;
    .arrows {
       width: .8rem;
       height:.8rem;
       border-bottom: 1px solid #e0e0e0;
       border-right:  1px solid #e0e0e0;
       position: absolute;
       top:0;
       left:50%;
       margin-top:-.35rem;
       background-color: #ffffff;
       transform: rotate(45deg);
       margin-left: -.4rem;
    }
}
</style>
