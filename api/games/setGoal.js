// 加球接口

import qs from 'qs'
import dayjs from 'dayjs'
import { runSql } from '../../functions/mysql.js'
import { getUserMe } from './func'

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const goals = query.goals
    const gameId = query.gameId || 1
    const token = req.headers.token
    const taskId = 3
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const nowTime = dayjs()

    if (isNaN(goals) || goals > 5 || goals < 1) {
        res.end(
            JSON.stringify({
                code: 101,
                message: 'the goal is invalid',
                data: ''
            })
        )
        return false
    }

    // 游戏不再当前周期不可以踢球

    getUserMe(token, user => {
        if (!user) {
            res.statusCode = 401
            res.end('Unauthorized')
            return false
        }
        // 插入games_action goals
        const sql = `INSERT INTO games_action 
                    (action_name,user_id,user_name,country_id,user_avatar,fk_game,fk_task,weight,description,create_time) VALUES 
                    ('goals',${user.id},'${user.nickName||user.userName}',${user.areaID},'${user.head}',${gameId},${taskId},${goals},'Goal', '${now}')`

        // 查询上一次操作进球的时间
        runSql(
            res,
            `SELECT create_time FROM games_action 
            WHERE user_id="${user.id}" AND fk_game="${gameId}" AND action_name="goals" 
            ORDER BY create_time DESC LIMIT 1`,
            lastTime => {
                if (lastTime[0]) {
                    const start = dayjs(lastTime[0].create_time)
                    if (nowTime - start < 1000 * 12.5) {
                        res.end(
                            JSON.stringify({
                                code: 105,
                                message: 'unvalid goals',
                                data: ''
                            })
                        )
                    } else {
                        runSql(res, sql, function() {
                            res.end(
                                JSON.stringify({
                                    code: 200,
                                    message: 'success',
                                    data: ''
                                })
                            )
                        })
                    }
                } else {
                    runSql(res, sql, function() {
                        res.end(
                            JSON.stringify({
                                code: 200,
                                message: 'success',
                                data: ''
                            })
                        )
                    })
                }
            }
        )
    })
}
