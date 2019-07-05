// 加球接口
// token 获取用户信息
// goals
// goals 如果goals>5非法请求，如果goals是NaN或小于等于0 非法
// 查询 当前用户最近一次games_action记录
// 如果 当前时间减去上一次操作记录时间小于12.5s视为不合法请求
// 在games_action中插入一条记录

import qs from 'qs'
import { runSql } from '../../functions/mysql.js'

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const goals = query.goal
    console.log(goals, runSql)
}
