<template>
    <div class="toast-loading" :style="{display:style}">
        <p>
            <img src="~assets/img/Spinner-1s-200px.gif">
            <span>{{$store.state.lang.invoke_loading_notice}}</span>
        </p>
    </div>
</template>
<script>
export default {
    data() {
        return {
            style: 'none'
        }
    },
    methods: {
        toggle(flag) {
            if (flag) {
                this.style = 'block'
                this.$store.commit('SHOW_SHADOW_LAYER')
            } else {
                this.style = 'none'
                this.$store.commit('HIDE_SHADOW_LAYER')
            }
        }
    }
}
</script>
<style lang="less" scoped>
.toast-loading {
    position: fixed;
    left: 0;
    top: 40%;
    width: 100%;
    color: #fff;
    z-index: 9999;
    text-align: center;
    z-index: 1001;
    p {
        display: inline-block;
        padding: 0.6rem 1rem 0.6rem 0.5rem;
        background: rgba(0, 0, 0, 0.65);
        border-radius: 3px;
        width: 65%;
        line-height: 1.3rem;
        img {
            width: 2rem;
        }
        span {
            width: 80%;
            float: right;
            text-align: left;
        }
    }
}
</style>
