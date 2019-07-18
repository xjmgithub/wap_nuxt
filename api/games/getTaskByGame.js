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
        runSql(res, `SELECT * FROM games_task WHERE fk_game=${gameId}`, taskList => {})
    })
}
