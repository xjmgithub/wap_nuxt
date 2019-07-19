// 获取游戏任务进度
// token
// gameId

// 查询 game_task 并查询game_action 对应任务做的进度
// 查询 game_task_log 查询各个任务的状态

import qs from 'qs'
import dayjs from 'dayjs'
import { runSql } from '../../functions/mysql.js'
import { getUserMe, delCoins } from './func'

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const gameId = query.gameId || 1
    const token = req.headers.token
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    getUserMe(token, userId => {
        runSql(res, `SELECT * FROM games_task WHERE fk_game=${gameId}`, taskList => {
            // 处理是否领取任务奖励
            if (taskList.length > 0) {
                taskList.forEach(item => {
                    let start = ''
                    let end = ''
                    if (item.settlement_cycle == 1) {
                        // 自定义周期任务
                        start = item.start_time
                        end = item.end_time
                    } else {
                        // 每日任务
                        start = dayjs()
                            .startOf('day')
                            .format('YYYY-MM-DD HH:mm:ss')
                        end = dayjs()
                            .endOf('day')
                            .format('YYYY-MM-DD HH:mm:ss')
                    }
                    runSql(
                        res,
                        `SELECT * FROM games_task_log WHERE user_id=${userId} AND fk_task=${
                            item.id
                        } AND create_time>'${start}' AND create_time<'${end}'`,
                        doneTask => {
                            if (doneTask.length > 0) {
                                item.overTask = true // 任务已经完成
                            } else {
                                item.overTask = false
                            }

                            // 查看任务完成情况
                            console.log(
                                `SELECT SUM(weight) as process FROM games_action WHERE user_id=${userId} AND fk_task=${
                                    item.id
                                } AND create_time>'${start}' AND create_time<'${end}'`
                            )
                            runSql(
                                res,
                                `SELECT SUM(weight) as process FROM games_action WHERE user_id=${userId} AND fk_task=${
                                    item.id
                                } AND create_time>'${start}' AND create_time<'${end}'`,
                                taskProcess => {
                                    item.process = taskProcess[0].process || 0
                                    res.end(
                                        JSON.stringify({
                                            code: 200,
                                            message: 'success',
                                            data: taskList
                                        })
                                    )
                                }
                            )
                        }
                    )
                })
            }
        })
    })
}
