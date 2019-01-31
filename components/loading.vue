<template>
    <div class="lds-ring" v-if="loading">
        <div/>
        <div/>
        <div/>
        <div/>
    </div>
</template>
<script>
export default {
    data: () => ({
        loading: true
    }),
    methods: {
        start() {
            this.loading = true
        },
        finish() {
            this.loading = false
        }
    }
}
</script>
<style scoped>
.lds-ring {
    display: block;
    width: 4rem;
    height: 4rem;
    position: relative;
    left: 50%;
    top: 50%;
    position: absolute;
    z-index:1001;
    margin-left: -2rem;
    margin-top: -2rem;
}
.lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 4rem;
    height: 4rem;
    margin: 0;
    border: 0.4rem solid #0087eb;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #0087eb transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
    -webkit-animation-delay: -0.45s;
    animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
    -webkit-animation-delay: -0.15s;
    animation-delay: -0.15s;
}
@keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>

