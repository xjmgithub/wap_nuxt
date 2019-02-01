<template>
    <div class="dialog" :style="{display:style,'margin-left':offsetLeft,'margin-top':offsetTop}">
        <div class="dialog-body">
            <div class="pop-default">
                <p>
                    <span v-html="msg"/>
                </p>
            </div>
        </div>
        <div class="dialog-footer">
            <div class="btn" @click="sure">{{yes}}</div>
            <div class="btn" @click="close">{{no}}</div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            msg: '',
            yes: 'YES',
            no: 'NO',
            style: 'none',
            callback: '',
            cancel: '',
            offsetLeft: 0,
            offsetTop: 0
        }
    },
    methods: {
        close() {
            this.style = 'none'
            this.$store.commit('HIDE_SHADOW_LAYER')
            if (this.cancel) {
                this.cancel()
            }
        },
        sure() {
            this.style = 'none'
            this.$store.commit('HIDE_SHADOW_LAYER')
            if (this.callback) {
                this.callback()
            }
        },
        show(msg, callback, cancel, yes, no) {
            let _this = this
            if (yes) this.yes = yes
            if (no) this.no = no
            this.msg = msg
            this.style = 'block'
            this.$store.commit('SHOW_SHADOW_LAYER')
            this.$nextTick(() => {
                let dialog = _this.$el
                let dh = dialog.offsetHeight,
                    dw = dialog.offsetWidth
                _this.offsetLeft = -dw / 2 + 'px'
                _this.offsetTop = -dh / 2 + 'px'
            })
            if (callback) {
                this.callback = callback
            } else {
                this.callback = ''
            }
            if (cancel) {
                this.cancel = cancel
            } else {
                this.cancel = ''
            }
        }
    }
}
</script>
<style lang="less" scoped>
.dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    background: white;
    border-radius: 2px;
    overflow: hidden;
    zoom: 1;
    z-index: 1001;
    width: 17rem;
    padding: 1.2rem;
    .pop-default {
        line-height: 1.4rem;
        padding: 0.8rem 0;
        min-height: 4.5rem;
    }
    .dialog-footer .btn {
        width: auto;
        float: right;
        color: #0087eb;
        font-weight: bold;
        margin-left: 1.5rem;
    }
}
</style>
