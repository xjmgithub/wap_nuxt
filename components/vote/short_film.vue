<template>
    <div id="show-film">
        <ul>
            <li v-for="(item,index) in filmList" :key="index" data-id="item.id" class="clearfix">
                <div class="left">
                    <!-- <img :src="item.icon.replace('http:','https:')" class="icon"> -->
                    <img src="~assets/img/vote/sfilm.png" class="icon">
                    <span :class="{first:index==0,second:index==1,third:index==2,normal:index>2}">No {{index+1}}</span>
                </div>
                <div class="right">
                    <p class="film-name">{{item.filmName}}</p>
                    <p class="film-author">{{item.filmAuthor}}</p>
                    <p class="film-des">{{item.des}}</p>
                    <span class="votes">{{item.votes | formatVotes}}</span>
                    <span class="vote-btn">VOTE</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    filters: {
        formatVotes(val) {
            if (val <= 100000) {
                return val.toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,')
            } else if (val > 100000 && val <= 1000000) {
                const x = Math.floor(val / 10000)
                const y = Math.round(Math.floor(val % 10000) / 100)
                return x + '.' + y + ' w'
            }
        }
    },
    props: {
        tabMsg: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            isLogin: this.$store.state.user.type || false,
            app: this.$store.state.appType,
            filmList: [
                {
                    filmName: 'Boda Boda thieves',
                    filmAuthor: 'James Tayler&Donal Mugisha',
                    des:
                        "takes up the responsibility of manning the family 'boda boda' to provide for the family takes up the responsibility of manning the fam…..qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiop",
                    votes: 1123123
                },
                {
                    filmName: 'Boda Boda thieves',
                    filmAuthor: 'James Tayler&Donal Mugisha',
                    des: "takes up the responsibility of manning the family 'boda boda' to provide for…..",
                    votes: 234563
                },
                {
                    filmName: 'Boda Boda thieves',
                    filmAuthor: 'James Tayler&Donal Mugisha',
                    des: "takes up the responsibility of manning the family 'boda boda' to provide for…..",
                    votes: 34525
                }
            ]
        }
    },
    mounted() {
        // this.getFilmList()
    },
    methods: {
        handleViceVote(film) {},
        handleInvite() {},
        getFilmList() {
            this.$axios.get(`/voting/v1/candidates-show?vote_id=${this.tabMsg.vote_id}`).then(res => {
                // this.$nuxt.$loading.finish()
                if (res.data.code === 0) {
                    this.filmList = res.data.data
                }
            })
        }
    }
}
</script>
<style lang="less">
#show-film {
    ul {
        padding: 0.5rem 0.8rem;
        li {
            margin-bottom: 1rem;
            .left {
                float: left;
                width: 33%;
                border: 1px solid #b99942;
                border-radius: 2px;
                position: relative;
                img {
                    width: 100%;
                    display: block;
                }
                span {
                    font-size: 0.7rem;
                    color: #ffffff;
                    font-weight: bold;
                    position: absolute;
                    border-radius: 2px;
                    padding: 0 0.3rem;
                    height: 1rem;
                    line-height: 1rem;
                    left: -1px;
                    top: 0;
                    margin-top: -0.5rem;
                    &.first {
                        background: linear-gradient(180deg, rgba(241, 209, 85, 1), rgba(222, 165, 43, 1));
                    }
                    &.second {
                        background: linear-gradient(180deg, rgba(198, 198, 198, 1), rgba(149, 149, 149, 1));
                    }
                    &.third {
                        background: linear-gradient(180deg, rgba(214, 178, 113, 1), rgba(173, 123, 62, 1));
                    }
                    &.normal {
                        background: rgba(199, 168, 103, 1);
                    }
                }
            }
            .right {
                float: right;
                width: 65%;
                p {
                    color: #f6d36d;
                    &.film-name {
                        font-size: 0.8rem;
                        font-weight: bold;
                        margin-bottom: 0.2rem;
                    }
                    &.film-author {
                        font-size: 0.7rem;
                        margin-bottom: 0.5rem;
                    }
                    &.film-des {
                        font-size: 0.7rem;
                        margin-bottom: 0.5rem;
                        color: rgba(246, 211, 109, 0.4);
                        display: -webkit-box;
                        overflow: hidden;
                        height: 3.3rem;
                        -webkit-line-clamp: 4;
                        word-break: break-all;
                        /* autoprefixer: off */
                        -webkit-box-orient: vertical;
                    }
                }
                span {
                    color: #ffffff;
                    vertical-align: middle;
                    &.votes {
                        font-size: 0.8rem;
                    }
                    &.vote-btn {
                        float: right;
                        padding: 0.2rem 0.5rem;
                        background: #c7a867;
                        border-radius: 4px;
                        font-size: 0.8rem;
                    }
                }
            }
        }
    }
}
</style>
