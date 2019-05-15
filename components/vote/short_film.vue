<template>
    <div id="show-film">
        <ul>
            <li v-for="(item,index) in dataList" :key="index" data-id="item.id" class="clearfix">
                <div class="left" @click="vodDetail(item)">
                    <img :src="cdnPicSrc(item.icon)" class="icon">
                    <span :class="{first:index==0,second:index==1,third:index==2,normal:index>2}">No {{index+1}}</span>
                </div>
                <div class="right">
                    <p class="film-name" @click="vodDetail(item)">{{item.name}}</p>
                    <p class="film-author" @click="vodDetail(item)">{{item.brief}}</p>
                    <p class="film-des" @click="vodDetail(item)">{{item.description}}</p>
                    <span class="votes" @click="vodDetail(item)">{{item.ballot_num | formatVotes}}</span>
                    <span v-if="item.user_ballot_num>0" class="vote-btn" @click.prevent="handleViceVote(item)">VOTED</span>
                    <span v-else class="vote-btn" @click.prevent="handleViceVote(item)">VOTE</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    filters: {
        formatVotes(val) {
            if (val < 10000) {
                // 1w
                return val.toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,')
            } else if (val >= 10000 && val < 1000000) {
                // 1w-100w (K)
                const x = (val / 1000).toFixed(1) % 1000
                return x == 0 ? '1.0M' : x + 'K'
            } else if (val >= 1000000) {
                // 100w (M)
                return (val / 1000000).toFixed(1) + 'M'
            }
        }
    },
    props: {
        dataList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    methods: {
        handleViceVote(item) {
            this.$emit('onVote', item)
        },
        vodDetail(item) {
            this.$emit('toPlay', item)
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
