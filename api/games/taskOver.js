// 完成任务兑换金币

import qs from 'qs'
import dayjs from 'dayjs'
import { runSql } from '../../functions/mysql.js'
import { getUserMe, addCoins } from './func'

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const taskId = query.taskId
    const token = req.headers.token
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    let start = dayjs()
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
    let end = dayjs()
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')

    if (!taskId || isNaN(taskId)) {
        res.end(
            JSON.stringify({
                code: 101,
                message: 'taskId is invalid',
                data: ''
            })
        )
        return false
    }

    getUserMe(token, user => {
        if (!user) {
            res.statusCode = 401
            res.end('Unauthorized')
            return false
        }
        runSql(res, `SELECT * FROM games_task WHERE id=${taskId}`, task => {
            if (task.length > 0) {
                const item = task[0]
                // 自定义周期任务
                if (item.settlement_cycle == 1) {
                    start = item.start_time
                    end = item.end_time
                }
                // 查看是否已经完成了任务
                runSql(
                    res,
                    `SELECT * FROM games_task_log 
                    WHERE user_id=${user.id} AND fk_task=${taskId} AND create_time>'${start}' AND create_time<'${end}' LIMIT 1`,
                    haveDone => {
                        if (haveDone.length > 0) {
                            res.end(
                                JSON.stringify({
                                    code: 104,
                                    message: 'You have done this task',
                                    data: ''
                                })
                            )
                        } else {
                            // 查询任务进度
                            runSql(
                                res,
                                `SELECT SUM(weight) as process FROM games_action 
                                WHERE user_id=${user.id} AND fk_task=${taskId} AND create_time>'${start}' AND create_time<'${end}'`,
                                process => {
                                    if (process[0].process >= item.threshold) {
                                        // 完成任务

                                        runSql(
                                            res,
                                            `INSERT INTO games_task_log 
                                            (user_id,fk_task,create_time) VALUES 
                                            (${user.id},${taskId},'${now}')`,
                                            result => {
                                                addCoins(token, user.id, item.award, `Shot Games-${item.label}`, addResult => {
                                                    const resText = JSON.stringify(addResult.data).substr(0, 800)
                                                    if (addResult && addResult.data.code == 0) {
                                                        const coinsActionid = addResult.data.data.id
                                                        const resText = JSON.stringify(addResult.data).substr(0, 800)
                                                        runSql(
                                                            res,
                                                            `INSERT INTO coins_log 
                                                            (type,coins,user_id,instructions,state,fk_game,coins_action_id,res_text,create_time) VALUES 
                                                            (1,${item.award},${user.id},'Shot Games-${item.label}',1,${
                                                                item.fk_game
                                                            },${coinsActionid},'${resText}','${now}')`,
                                                            () => {
                                                                if (result) {
                                                                    res.end(
                                                                        JSON.stringify({
                                                                            code: 200,
                                                                            message: 'success',
                                                                            data: result
                                                                        })
                                                                    )
                                                                }
                                                            }
                                                        )
                                                    } else {
                                                        // 兑换积分失败
                                                        runSql(
                                                            res,
                                                            `INSERT INTO coins_log 
                                                            (type,coins,user_id,instructions,state,fk_game,coins_action_id,res_text,create_time) VALUES 
                                                            (1,${item.award},${user.id},'Shot Games-${item.label}',1,${
                                                                item.fk_game
                                                            },'',${resText},'${now}')`,
                                                            () => {
                                                                res.end(
                                                                    JSON.stringify({
                                                                        code: 102,
                                                                        message: 'get coins error',
                                                                        data: ''
                                                                    })
                                                                )
                                                            }
                                                        )
                                                    }
                                                })
                                            }
                                        )
                                    } else {
                                        // 没有达到任务完成条件
                                        res.end(
                                            JSON.stringify({
                                                code: 103,
                                                message: 'Did not reach the task conditions',
                                                data: {
                                                    taskId: taskId,
                                                    process: process[0].process || 0,
                                                    threshold: item.threshold
                                                }
                                            })
                                        )
                                    }
                                }
                            )
                        }
                    }
                )
            }
        })
    })
}
