<template>
    <div id="game">
        <canvas id="canvas" class="ani_hack" width="1360" height="640"/>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {}
    },
    mounted() {
        /* eslint-disable */
        const game = new window.CMain({
            shot_indicator_spd: 1000,
            decrease_shot_indicator_spd: 100
        })
        window.sizeHandler()

        $(game).on('game_start', function(evt) {
            // alert('game_start')
        })
        $(game).on('save_score', function(evt, a) {
            alert(a)
        })
        $(game).on('level_end', function(evt, goal, score) {
            alert(score)
            alert(goal)
        })
        $(game).on('goal', function(evt, goal, score) {
            // alert(score)
            // alert(goal)
        })
    },
    head() {
        return {
            title: 'Hello Mr. Right',
            script: [{ src: '/res_nuxt/jquery-3.4.1.min.js' }, { src: '/res_nuxt/createjs-2014.12.12.min.js' }, { src: '/res_nuxt/main.js' }]
        }
    }
}
</script>
<style>
#game {
    width: 100vw;
    height: 100vh;
}
#canvas {
    width: 1920px;
    height: 1080px;

    position: fixed;
}

canvas {
    image-rendering: optimizeSpeed;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    -ms-interpolation-mode: nearest-neighbor;
    -ms-touch-action: none;
}

.ani_hack {
    -webkit-perspective: 1000;
    -webkit-backface-visibility: hidden;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    outline: none;
    -webkit-tap-highlight-color: transparent; /* mobile webkit */
}
</style>
