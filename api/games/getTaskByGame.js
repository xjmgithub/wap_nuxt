// 获取游戏任务列表

import qs from 'qs'
import dayjs from 'dayjs'
import { runSql } from '../../functions/mysql.js'
import { getUserMe } from './func'

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const gameId = query.gameId || 1
    const token = req.headers.token
    let start = dayjs()
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
    let end = dayjs()
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')

    getUserMe(token, user => {
        if (!user||user.roleName == 'ANONYMOUS') {
            res.statusCode = 401
            res.end('Unauthorized')
            return false
        }
        runSql(res, `SELECT * FROM games_task WHERE fk_game=${gameId}`, taskList => {
            // 处理是否领取任务奖励
            if (taskList.length > 0) {
                let tag = 0
                taskList.forEach((item, index) => {
                    // 自定义周期任务
                    if (item.settlement_cycle == 1) {
                        start = item.start_time
                        end = item.end_time
                    }
                    runSql(
                        res,
                        `SELECT * FROM games_task_log 
                        WHERE user_id=${user.id} AND fk_task=${item.id} AND create_time>'${start}' AND create_time<'${end}'`,
                        doneTask => {
                            // 任务完成状态
                            if (doneTask.length > 0) {
                                item.overTask = true
                            } else {
                                item.overTask = false
                            }

                            // 任务进度
                            runSql(
                                res,
                                `SELECT SUM(weight) as process FROM games_action 
                                WHERE user_id=${user.id} AND fk_task=${item.id} AND create_time>'${start}' AND create_time<'${end}'`,
                                taskProcess => {
                                    tag++
                                    item.process = taskProcess[0].process || 0
                                    item.process = item.process > item.threshold ? item.threshold : item.process
                                    if (tag >= taskList.length) {
                                        res.end(
                                            JSON.stringify({
                                                code: 200,
                                                message: 'success',
                                                data: taskList
                                            })
                                        )
                                    }
                                }
                            )
                        }
                    )
                })
            }
        })
    })
}
