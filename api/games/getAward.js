// 获得奖励

// headers token
// goals
// gameId

// 调取用户信息接口，获得用户信息，校验合法性
// 获取当前用户当天获得的coins列表 type==1 coins_log
// 求列表总和，求最近一次的时间
// 如果当前时间减最后一次时间的diff < goals*2 *1000,不合法请求
// 第一关限制1个，第2，3关2个，4关后3个
// 进60球的最小时间是(Math.ceil((60-1-2*2)/3) + 3) *5 * 2.5 = 275
// 进30球的   (Math.ceil((30-1-2*2)/3) + 3) *5 * 2.5 = 150
// 进10球的   (Math.ceil((10-1-2*2)/3) + 3) *5 * 2.5 = 62.5

// 计算应该加的coins
// >60 800
// >30 400
// >10 100
// if  sum >= 30000 则视为不合法
// addCoins + sum > 30000     则将奖励重置成 30000 - sum

// 做加操作 可公共出来
// 发起加操作的请求 之后创建coins_log 记录

// 返回给前端的当前的coins

import qs from 'qs'
import dayjs from 'dayjs'
import { runSql } from '../../functions/mysql.js'
import { getUserMe, addCoins } from './func'

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
        .add(1, 'days')
        .format('YYY-MM-DD')
    let award = 0

    if (isNaN(goals) || goals > 100 || goals < 10) {
        res.end(
            JSON.stringify({
                code: 101,
                message: 'the goal is invalid',
                data: ''
            })
        )
        return false
    } else if (goals >= 60) {
        award = 800
    } else if (goals >= 30) {
        award = 400
    } else if (goals >= 10) {
        award = 100
    }

    getUserMe(token, (user, countryId, userAvatar) => {
        const taskId = 2
        runSql(
            res,
            `SELECT id,coins,create_time FROM coins_log WHERE user_id=${user} AND TYPE=1 AND state!=2 AND fk_game=${gameId} AND create_time>'${today}' AND create_time<'${tomorrow}' ORDER BY create_time DESC`,
            result => {
                if (result.length > 0) {
                    // shang
                    const start = dayjs(result[0].create_time)
                    if (nowTime - start < 1000 * 2.5 * goals) {
                        res.end(
                            JSON.stringify({
                                code: 105,
                                message: 'unvalid goals',
                                data: ''
                            })
                        )
                        return false
                    } else {
                        let sum = 0
                        result.forEach(item => {
                            sum += item.coins
                        })
                        if (sum >= 30000) {
                            res.end(
                                JSON.stringify({
                                    code: 106,
                                    message: 'the coins you got today reached the max value ',
                                    data: ''
                                })
                            )
                            return false
                        } else if (sum + award > 30000) {
                            award = 30000 - sum
                        }
                    }
                }

                addCoins(token, user, award, `Shot Games-${goals} goals`, addResult => {
                    const resText = JSON.stringify(addResult.data).substr(0, 800)
                    if (addResult && addResult.data.code == 0) {
                        const coinsActionid = addResult.data.data.id
                        const resText = JSON.stringify(addResult.data).substr(0, 800)
                        runSql(
                            res,
                            `INSERT INTO coins_log (type,coins,user_id,instructions,state,fk_game,coins_action_id,res_text,create_time) VALUES (1,${award},${user},'Shot Games-${goals} goals',1,${gameId},${coinsActionid},'${resText}','${now}')`,
                            () => {
                                runSql(
                                    res,
                                    `INSERT INTO games_action (action_name,user_id,country_id,user_avatar,fk_game,fk_task,weight,description,create_time) VALUES ('getAward',${user},${countryId},'${userAvatar}',${gameId},${taskId},${award},'get coins', '${now}')`
                                )

                                res.end(
                                    JSON.stringify({
                                        code: 200,
                                        message: 'success',
                                        data: {
                                            operatorCoins: addResult.data.data.operatorCoins,
                                            beforeCoins: addResult.data.data.beforeCoins,
                                            afterCoins: addResult.data.data.afterCoins
                                        }
                                    })
                                )
                            }
                        )
                    } else {
                        // 兑换积分失败
                        runSql(
                            res,
                            `INSERT INTO coins_log (type,coins,user_id,instructions,state,fk_game,coins_action_id,res_text,create_time) VALUES (1,${award},${user},'Shot Games-${goals} goals',1,${gameId},'',${resText},'${now}')`,
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
    })
}
