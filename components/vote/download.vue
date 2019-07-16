<template>
    <div class="download" @click="down">
        <div>
            <img src="~assets/img/web/app_icon.png" />
            <div>
                <p>StarTimes ON App</p>
                <span>{{$store.state.lang.officialwebsitemobile_install_to_watch}}</span>
            </div>
            <span class="down">{{$store.state.lang.officialwebsitemobile_install}}</span>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        down() {
            this.$emit('onload')
        }
    }
}
</script>
<style lang="less" scoped>
.download {
    padding: 0.5rem 0.8rem;
    background-color: #b7b7b7;
    color: #333333;
    overflow: hidden;
    zoom: 1;
    top: 3.45rem;
    position: fixed;
    width: 100%;
    z-index: 999;
    height: 4rem;
    & > div {
        position: relative;
        img {
            width: 3rem;
        }
        div {
            font-weight: bold;
            width: 45%;
            font-size: 0.88rem;
            margin-left: 0.5rem;
            display: inline-block;
            vertical-align: middle;
            line-height: 1.3rem;
        }
        .down {
            background-color: #0087eb;
            width: 4.5rem;
            color: #ffffff;
            border-radius: 2px;
            height: 2rem;
            position: absolute;
            right: 0;
            top: 0.5rem;
            line-height: 2rem;
            text-align: center;
        }
    }
}
</style>
