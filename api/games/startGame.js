// 开始游戏
// token
// gameId

// 如果当前用户coins大于50则消耗50coins
// 如果小于50则视为非法
// 添加一条玩过游戏的game_action

import qs from 'qs'
import dayjs from 'dayjs'
import { runSql } from '../../functions/mysql.js'
import { getUserMe, delCoins } from './func'

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const goals = query.goals
    const gameId = query.gameId || 1
    const token = req.headers.token
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const nowTime = dayjs()
    const today = dayjs().format('YYY-MM-DD')
    const tomorrow = dayjs()

    getUserMe(token, (userId, countryId, avatar, coins) => {
        if (coins < 50) {
            res.end(
                JSON.stringify({
                    code: 101,
                    message: 'you have not enough money',
                    data: ''
                })
            )
        } else {
            delCoins(token, userId, 50, 'Shot Game-Start Game', delResult => {
                const coinsActionid = delResult.data.data.id
                const resText = JSON.stringify(delResult.data).substr(0, 800)
                runSql(
                    res,
                    `INSERT INTO coins_log (type,coins,user_id,instructions,state,fk_game,coins_action_id,res_text,create_time) VALUES (2,50,${userId},'Shot Game-Start Game',1,${gameId},${coinsActionid},'${resText}','${now}')`,
                    () => {
                        res.end(
                            JSON.stringify({
                                code: 200,
                                message: 'success',
                                data: {
                                    operatorCoins: delResult.data.data.operatorCoins,
                                    beforeCoins: delResult.data.data.beforeCoins,
                                    afterCoins: delResult.data.data.afterCoins
                                }
                            })
                        )
                    }
                )
            })
        }
    })
}
