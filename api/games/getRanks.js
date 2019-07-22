// 获取排名
// token
// gameId
// 页面打开时调用标志tag

// 查询games表得到游戏活动的开始和结束时间
// 查询fk_game的create_time>开始时间create_time<结束时间的数据
// 根据国家分组，根据用户id分组，算goals
// 批量查询用户信息接口
// 如果tag 为true 则插入一条登录事件日志到games_action

import qs from 'qs'
import { runSql } from '../../functions/mysql.js'
import { getUserMe, getMyCoins } from './func'

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const cycle = query.cycle || 0
    let gameId = query.gameId || 1
    const token = req.headers.token

    if (cycle > 0) {
        runSql(
            res,
            `SELECT id FROM games WHERE end_time<(SELECT start_time FROM games WHERE id="${gameId}") ORDER BY end_time DESC LIMIT 1`,
            lastGame => {
                if (lastGame.length > 0) {
                    gameId = lastGame[0].id
                    getRanksByUser(gameId)
                } else {
                    res.end(
                        JSON.stringify({
                            code: 102,
                            message: 'there is no data!',
                            data: ''
                        })
                    )
                }
            }
        )
    } else {
        getRanksByUser(gameId)
    }

    function getRanksByUser(gameId) {
        runSql(
            res,
            `SELECT user_id,user_name,user_avatar,SUM(weight) AS goals FROM (SELECT * FROM games_action WHERE fk_game=${gameId} AND action_name="goals" ORDER BY id DESC) AS N GROUP BY user_id`,
            rankList => {
                if (rankList.length > 0) {
                    getUserMe(token, userId => {
                        // TODO 如果是登录用户会添加一个action 今天登录的标志

                        getMyCoins(token, userId, coins => {
                            res.end(
                                JSON.stringify({
                                    code: 200,
                                    message: 'success',
                                    data: {
                                        myCoins: coins,
                                        list: rankList
                                    }
                                })
                            )
                        })
                    })
                } else {
                    res.end(
                        JSON.stringify({
                            code: 204,
                            message: 'there is no result!',
                            data: ''
                        })
                    )
                }
            }
        )
    }
}
