<template>
    <nuxt-link class="link-to-download" to="/hybrid/lands">
        <div class="download">
            <div class="max-width">
                {{$store.state.lang.officialwebsitemobile_downloadpromo}}
            </div>
            <span>{{$store.state.lang.officialwebsitemobile_go}} &gt;</span>
        </div>
    </nuxt-link>
</template>
<style lang="less" scoped>
.link-to-download {
    .download {
        padding: 0.6rem 0.8rem;
        background-color: #ffbe19;
        font-weight: bold;
        color: #333333;
        overflow: hidden;
        zoom: 1;
        top: 3.45rem;
        position: fixed;
        width: 100%;
        z-index: 999;
        div {
            width: auto;
            float: left;
        }
        span {
            color: #0087eb;
            float: right;
        }
    }
}
</style>

