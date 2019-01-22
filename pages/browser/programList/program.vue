<template>
    <div class="wrapper">
        <download class="clearfix"/>
        <div class="poster">
            <img :src="pPoster" alt>
            <span class="program-name">{{pName}}</span>
            <p>{{pDescription}}</p>
        </div>
        <div class="clips">
            <p>{{$store.state.lang.officialwebsitemobile_subprogramdetails_clips}}</p>
            <ul class="clearfix">
                <li v-for="(item,index) in subProgram" :key="index" @click="toSubProgramDetail(item)">
                    <img :src="item.poster.resources[0].url">
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import download from '~/components/web/download'
export default {
    layout: 'default',
    data() {
        return {
            pPoster: '',
            pId: '',
            pName: '',
            pDescription: '',
            subProgram: []
        }
    },
    mounted() {
        let msg = sessionStorage.getItem('program')
        if (msg) {
            let info = JSON.parse(msg)
            this.pPoster = info.poster
            this.pId = info.id
            this.pName = info.name
            this.pDescription = info.description
            this.getSubProgram()
        }
    },
    methods: {
        getSubProgram() {
            this.$axios.get(`/vup/v1/program/${this.pId}/sub-vods`).then(res => {
                let data = res.data.data
                if (data && data.length > 0) {
                    this.subProgram = data
                }
            })
        },
        toSubProgramDetail(item) {
            sessionStorage.setItem('subprogram', JSON.stringify(item))
            this.$router.push('/browser/programlist/subProgram')
        }
    },
    components: {
        download
    },
    head() {
        return {
            title: 'List'
        }
    }
}
</script>
<style lang="less" scoped>
@import '~assets/less/browser/index.less';
.wrapper {
    img {
        border-radius: 2px;
    }
    .poster {
        width: 94%;
        margin: 0.5rem auto;
        border-bottom: 1px solid #d8d8d8;
        padding-bottom: 0.5rem;
        img {
            width: 100%;
            height: 11rem;
            margin-bottom: 0.5rem;
        }
        .program-name {
            font-weight: bold;
            color: #333333;
            margin: 0.5rem 0;
            line-height: 2rem;
        }
        p {
            color: #666666;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            font-size: 0.9rem;
        }
    }
    .clips {
        width: 94%;
        margin: 0.5rem auto;
        p {
            color: #111111;
            margin: 0.5rem 0;
            font-weight: bold;
        }
        ul {
            li {
                list-style: none;
                float: left;
                width: 48%;
                line-height: 1.1rem;
                &:nth-child(2n) {
                    float: right;
                }
                img {
                    width: 100%;
                    display: block;
                    height: 5rem;
                }
                span {
                    font-size: 0.85rem;
                    color: #666666;
                }
            }
        }
    }
}
</style>
