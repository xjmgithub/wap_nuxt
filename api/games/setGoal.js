// 加球接口
// token 获取用户信息
// goals
// gameId
// goals 如果goals>5非法请求，如果goals是NaN或小于等于0 非法
// 查询 当前用户最近一次games_action记录
// 如果 当前时间减去上一次操作记录时间小于12.5s视为不合法请求
// 在games_action中插入一条记录

import qs from 'qs'
import axios from 'axios'
// import redis from 'redis'
// import { runSql } from '../../functions/mysql.js'
import { getCookieFromReq } from './func'
// const client = redis.createClient(6379, 'test1-mysql-redis')
// client.on('error', function(err) {
//     console.log('Error ' + err)
// })

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const goals = query.goal
    const _COOKIE = getCookieFromReq(req.headers)
    // client.set('color', 'red', redis.print)
    // client.get('color', function(err, value) {
    //     if (err) throw err
    //     console.log('Got: ' + value)
    //     client.quit()
    // })

    axios
        .get('/cms/users/me', {
            headers: {
                token: _COOKIE.token || ''
            }
        })
        .then(res1 => {
            if (res1.status === 200) {
                console.log(123, goals)
            } else {
                res.send(401)
            }
        })
        .catch(() => {
            res.end(401)
        })
}
