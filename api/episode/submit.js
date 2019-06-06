import qs from 'qs'
import DB from '../../db.js'
import { getRandomInt } from '../../functions/utils'

const mysql = require('mysql')
const connection = mysql.createConnection({
    host: DB.host,
    user: DB.user,
    password: DB.password,
    database: 'wap'
})

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const sex = query.sex || 0 // 默认男

    connection.query('SELECT id,name,long_des,short_des,sex,fk_episode,avatar FROM episode_role WHERE fk_episode IN (1,2,3)', function(
        error,
        results
    ) {
        if (error) {
            res.end(
                JSON.stringify({
                    code: 101,
                    message: 'sql error',
                    data: error
                })
            )
        }
        const key = Math.random()
            .toString(36)
            .substr(2)
            .toLocaleUpperCase()
        const percent = [getRandomInt(0, 50), getRandomInt(0, 50)]
        percent.push(100 - percent[0] - percent[1])
        percent.sort()
        const asintado = []
        const got = []
        const avengers = []

        if (results.length > 0) {
            results.forEach(item => {
                if (item.sex == sex) {
                    if (item.fk_episode == 1) {
                        asintado.push(item)
                    }
                    if (item.fk_episode == 2) {
                        got.push(item)
                    }
                    if (item.fk_episode == 3) {
                        avengers.push(item)
                    }
                }
            })
        }

        // 处理性别

        const result = [asintado[getRandomInt(0, asintado.length)], got[getRandomInt(0, got.length)], avengers[getRandomInt(0, avengers.length)]]

        result[0].percent = percent[2]
        result[1].percent = percent[1]
        result[2].percent = percent[0]

        const r = JSON.stringify(result).replace(/'/g, "\\'")

        connection.query(`INSERT INTO form_result (ikey,result) VALUES ("${key}", '${r}')`, function(error) {
            if (error) {
                res.end(
                    JSON.stringify({
                        code: 103,
                        message: 'success',
                        data: error
                    })
                )
            } else {
                res.end(
                    JSON.stringify({
                        code: 200,
                        message: 'success',
                        data: key
                    })
                )
            }
        })
    })
}
