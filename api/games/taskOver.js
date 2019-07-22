// 完成任务兑换金币
// token
// task_id
// gameId

// 查询如果任务已经做完了则非法
// 如果合法则判断任务完成得必要条件是否达到
// 如果达到了条件，则插入数据到games_task_log

import qs from 'qs'
import dayjs from 'dayjs'
import { runSql } from '../../functions/mysql.js'
import { getUserMe } from './func'

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const taskId = query.taskId
    const token = req.headers.token
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

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

    getUserMe(token, userId => {
        runSql(res, `SELECT * FROM games_task WHERE id=${taskId}`, task => {
            if (task.length > 0) {
                const item = task[0]
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
                    `SELECT SUM(weight) as process FROM games_action WHERE user_id=${userId} AND fk_task=${taskId} AND create_time>'${start}' AND create_time<'${end}'`,
                    process => {
                        if (process[0].process >= item.threshold) {
                            runSql(res, `INSERT INTO games_task_log (user_id,fk_task,create_time) VALUES (${userId},${taskId},'${now}')`, result => {
                                if (result) {
                                    res.end(
                                        JSON.stringify({
                                            code: 200,
                                            message: 'success',
                                            data: result
                                        })
                                    )
                                }
                            })
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
        })
    })
}
