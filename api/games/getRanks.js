// 获取排名

import qs from 'qs'
import dayjs from 'dayjs'
import { runSql } from '../../functions/mysql.js'
import { getUserMe } from './func'

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))

    const gameId = query.gameId || 1
    const token = req.headers.token
    const taskId = 1 // daily playing
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const start = dayjs()
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
    const end = dayjs()
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')

    let preGameId = ''

    // 获取上一期游戏id
    runSql(
        res,
        `SELECT id FROM games 
        WHERE end_time<(SELECT start_time FROM games WHERE id="${gameId}") 
        ORDER BY end_time DESC LIMIT 1`,
        lastGame => {
            if (lastGame.length > 0) {
                preGameId = lastGame[0].id
                getRanksByUser(gameId)
            } else {
                getRanksByUser(gameId)
            }
        }
    )

    function getRanksByUser(gameId) {
        // 获取排行列表
        runSql(
            res,
            `SELECT user_id,user_name,user_avatar,SUM(weight) AS goals 
            FROM (SELECT * FROM games_action WHERE fk_game=${gameId} AND action_name="goals" ORDER BY id DESC) AS N 
            GROUP BY user_id`,
            rankList => {
                getUserMe(token, user => {
                    if (user && user.roleName !== 'ANONYMOUS') {
                        // 是否登录过查询
                        runSql(
                            res,
                            `SELECT * FROM games_action 
                            WHERE action_name="login" AND create_time>'${start}' AND create_time<'${end}' 
                            LIMIT 1`,
                            haveLoged => {
                                // 登录记录
                                runSql(
                                    res,
                                    `INSERT INTO games_action 
                                    (action_name,user_id,user_name,country_id,user_avatar,fk_game,fk_task,weight,description,create_time) VALUES 
                                    ('login',${user.id},'${user.userName}',${user.areaID},'${user.head}',${gameId},${taskId},1,'login', '${now}')`
                                )

                                res.end(
                                    JSON.stringify({
                                        code: 200,
                                        message: 'success',
                                        data: {
                                            myCoins: user.coins || 0,
                                            list: rankList.length > 0 ? rankList : [],
                                            preGameId: preGameId || '',
                                            DailyPlayed: haveLoged.length > 0
                                        }
                                    })
                                )
                            }
                        )
                    } else {
                        res.end(
                            JSON.stringify({
                                code: 200,
                                message: 'success',
                                data: {
                                    myCoins: 0,
                                    list: rankList.length > 0 ? rankList : [],
                                    preGameId: preGameId || '',
                                    DailyPlayed: false
                                }
                            })
                        )
                    }
                })
            }
        )
    }
}
