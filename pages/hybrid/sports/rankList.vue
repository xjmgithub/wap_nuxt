<template>
    <div class="wrapper">
        <div v-for="(item,index) in rankList" :key="index" class="group">
            <div class="group-name">{{item.groupName}}</div>
            <table>
                <thead>
                    <tr>
                        <td>Team</td>
                        <td>P</td>
                        <td>W</td>
                        <td>D</td>
                        <td>L</td>
                        <td>GD</td>
                        <td>Pts</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(c_item,c_index) in item.teamRankings" :key="c_index" class="team">
                        <td>
                            <img :src="cdnPicSrc(c_item.team.logoUrl)" />
                            <span>{{c_item.team.displayName}}</span>
                        </td>
                        <td>{{c_item.played}}</td>
                        <td>{{c_item.won}}</td>
                        <td>{{c_item.draw}}</td>
                        <td>{{c_item.lost}}</td>
                        <td>{{c_item.goalDiff}}</td>
                        <td>{{c_item.points}}</td>
                    </tr>
                </tbody>
            </table>
            <div v-if="index<7" class="line"></div>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'base',
    data() {
        return {
            rankList: [],
            league_id: this.$route.query.league_id,
        }
    },
    mounted() {
        this.$axios
            .get(`/sports/soccer/v1/ranking/group_stage?league_id=${this.league_id}`)
            .then(res => {
                this.rankList = res.data
            })
            .catch(err => {
                this.$alert(err)
            })
    },
    head() {
        return {
            title: 'Ranking List'
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    color: #333;
    font-size: 0.9rem;
    padding: 0.5rem 0;
    .group {
        width: 100%;
        padding: 0 4%;
        margin: 0 auto;
        line-height: 1.8rem;
        .group-name {
            height: 1.8rem;
            font-weight: 600;
            text-align: left;
        }
        table {
            width: 100%;
            thead,
            tbody {
                tr {
                    width: 100%;
                    height: 1.8rem;
                    td {
                        // border: 1px solid black;
                        width: 9%;
                        text-align: center;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        &:first-child {
                            text-align: left;
                            width: 36%;
                            img {
                                width: 20%;
                                height: auto;
                            }
                            span {
                                width: 24%;
                            }
                        }
                    }
                }
            }
            thead {
                font-weight: 600;
            }
        }
        .line {
            width: 100%;
            height: 1px;
            margin: 0.5rem auto;
            background-color: #ddd;
        }
    }
}
</style>
