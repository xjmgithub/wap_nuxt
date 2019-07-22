// 加球接口
// 查询 当前用户最近一次games_action记录
// 如果 当前时间减去上一次操作记录时间小于12.5s视为不合法请求
// 在games_action中插入一条记录

import qs from 'qs'
import axios from 'axios'
import dayjs from 'dayjs'
// import redis from 'redis'
import { runSql } from '../../functions/mysql.js'
import env from '../../env.js'

// const client = redis.createClient(6379, 'test1-mysql-redis')
// client.on('error', function(err) {
//     console.log('Error ' + err)
// })
// client.set('color', 'red', redis.print)
// client.get('color', function(err, value) {
//     if (err) throw err
//     console.log('Got: ' + value)
//     client.quit()
// })

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const goals = query.goals
    const gameId = query.gameId || 1
    const token = req.headers.token
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
    axios
        .get(`${env.apiURL}cms/users/me`, {
            headers: {
                token: token || ''
            }
        })
        .then(function(res1) {
            if (res1.status === 200) {
                const userId = res1.data.id
                const userName = res1.data.nickName || res1.data.userName
                const countryId = res1.data.areaID
                const userAvatar = res1.data.head
                const taskId = 1

                // 进球的action 是goals
                const sql = `INSERT INTO games_action (action_name,user_id,user_name,country_id,user_avatar,fk_game,fk_task,weight,description,create_time) VALUES ('goals',${userId},'${userName}',${countryId},'${userAvatar}',${gameId},${taskId},${goals},'Goal', '${now}')`
                runSql(
                    res,
                    `SELECT create_time FROM games_action WHERE user_id="${userId}" AND fk_game="${gameId}" AND action_name="goals" ORDER BY create_time DESC limit 1`,
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
            } else {
                res.statusCode = 401
                res.end('Unauthorized')
            }
        })
        .catch(err => {
            console.log(err)
            res.statusCode = 500
            res.end('Unauthorized')
        })
}
