// 开始游戏

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
    const taskId = 2 // 3 Games Played
    const today = dayjs().format('YYYY-MM-DD')
    const tomorrow = dayjs()
        .add(1, 'days')
        .format('YYYY-MM-DD')

    getUserMe(token, user => {
        if (!user) {
            res.statusCode = 401
            res.end('Unauthorized')
            return false
        }

        runSql(
            res,
            `SELECT * FROM games_action WHERE user_id="9152882" AND action_name="startGame" AND create_time>'${today}' AND create_time<'${tomorrow}' LIMIT 1`,
            dailyPlayed => {
                if (dailyPlayed.length > 0) {
                    // 已经玩过了
                    // 金币不足
                    if (user.coins < 50) {
                        res.end(
                            JSON.stringify({
                                code: 101,
                                message: 'you have not enough money',
                                data: ''
                            })
                        )
                    } else {
                        // 减少coins 50
                        delCoins(token, user.id, 50, 'Shot Game-Start Game', delResult => {
                            const coinsActionid = delResult.data.data.id
                            const resText = JSON.stringify(delResult.data).substr(0, 800)
                            // 添加coins 操作记录
                            runSql(
                                res,
                                `INSERT INTO coins_log 
                                (type,coins,user_id,instructions,state,fk_game,coins_action_id,res_text,create_time) VALUES 
                                (2,50,${user.id},'Shot Game-Start Game',1,${gameId},${coinsActionid},'${resText}','${now}')`,
                                () => {
                                    // 添加action 行为记录 startGame
                                    runSql(
                                        res,
                                        `INSERT INTO games_action 
                                        (action_name,user_id,user_name,country_id,user_avatar,fk_game,fk_task,weight,description,create_time) VALUES 
                                        ('startGame',${user.id},'${user.nickName || user.userName}',${user.areaID},'${
                                            user.head
                                        }',${gameId},${taskId},1,'startGame', '${now}')`
                                    )

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
                } else {
                    runSql(
                        res,
                        `INSERT INTO games_action 
                        (action_name,user_id,user_name,country_id,user_avatar,fk_game,fk_task,weight,description,create_time) VALUES 
                        ('startGame',${user.id},'${user.nickName || user.userName}',${user.areaID},'${
                            user.head
                        }',${gameId},${taskId},1,'startGame', '${now}')`
                    )
                    res.end(
                        JSON.stringify({
                            code: 200,
                            message: 'success',
                            data: {
                                operatorCoins: 0,
                                beforeCoins: user.coins,
                                afterCoins: user.coins
                            }
                        })
                    )
                }
            }
        )
    })
}
