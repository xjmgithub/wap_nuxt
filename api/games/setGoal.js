// 加球接口
// 查询 当前用户最近一次games_action记录
// 如果 当前时间减去上一次操作记录时间小于12.5s视为不合法请求
// 在games_action中插入一条记录

import qs from 'qs'
import axios from 'axios'
// import redis from 'redis'
import { runSql } from '../../functions/mysql.js'
import { getCookieFromReq } from './func'
import env from '../../env.js'
// const client = redis.createClient(6379, 'test1-mysql-redis')
// client.on('error', function(err) {
//     console.log('Error ' + err)
// })

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const goals = query.goal
    const gameId = query.gameId || 1
    const _COOKIE = getCookieFromReq(req.headers)
    // client.set('color', 'red', redis.print)
    // client.get('color', function(err, value) {
    //     if (err) throw err
    //     console.log('Got: ' + value)
    //     client.quit()
    // })

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
                token: _COOKIE.token || ''
            }
        })
        .then(function(res1) {
            if (res1.status === 200) {
                const userId = res.data.data.id
                runSql(
                    res,
                    `SELECT create_time FROM games_action WHERE user_id="${userId}" AND fk_game="${gameId}" AND action_name="goals" ORDER BY create_time limit 1`,
                    (error, lastTime) => {
                        if (error) {
                            res.end(
                                JSON.stringify({
                                    code: 104,
                                    message: 'search error',
                                    data: error
                                })
                            )
                        } else if (lastTime) {
                            console.log(lastTime)
                        } else {
                            console.log(123)
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
            res.statusCode = 401
            res.end('Unauthorized')
        })
}
