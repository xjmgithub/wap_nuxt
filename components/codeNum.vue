<template>
    <div class="code-box" >
        <div class="code-input">
            <div class="input-item" :class="{error:errorState}" v-html="N0"/> 
            <div v-show="length>=2" class="input-item" :class="{error:errorState}" v-html="N1"/>
            <div v-show="length>=3" class="input-item" :class="{error:errorState}" v-html="N2"/>
            <div v-show="length>=4" class="input-item" :class="{error:errorState}" v-html="N3"/>
        </div>
        <input v-model="vscode" :maxlength="length" type="tel" class="hidden-input" >
    </div>
</template>
<script>
export default {
    props: {
        length: {
            type: Number, // max length 4
            default: 4
        },
        errorState: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            vscode: '',
            focus_code: false
        }
    },
    computed: {
        N0() {
            return this.vscode.substr(0, 1) || ''
        },
        N1() {
            return this.vscode.substr(1, 1) || ''
        },
        N2() {
            return this.vscode.substr(2, 1) || ''
        },
        N3() {
            return this.vscode.substr(3, 1) || ''
        },
    },
    watch: {
        vscode(nv, ov) {
            this.$emit('vscode',this.vscode)
        },
        // errorstate(nv, ov) {
        //     this.errorState = this.errorstate;
        // }
    },
}
</script>
<style lang="less" scoped>
.code-box {
    position: relative;
    .code-input {
        width: 100%;
        display: flex;
        height: 2.2rem;
        .input-item {
            flex: 1;
            margin-right: 0.7rem;
            border-bottom: 1px solid #ddd;
            height: 2.2rem;
            line-height: 2.2rem;
            background: #fff;
            text-align: center;
            color: #333333;
            &:last-child {
                margin-right: 0;
            }
            &.error {
                border-bottom: 1px solid red;
            }
        }
    }
    .hidden-input {
        color: transparent;
        width: 100%;
        height: 50%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
    }
}
</style>
