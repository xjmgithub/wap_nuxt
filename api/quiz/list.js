import qs from 'qs'
import DB from '../../db.js'

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
    const ikey = query.ikey

    // user id

    if (ikey) {
        connection.query(`SELECT * FROM form_result WHERE ikey="${ikey}"`, function(error, results) {
            if (error) {
                res.end(
                    JSON.stringify({
                        code: 104,
                        message: 'search error',
                        data: error
                    })
                )
            } else {
                res.end(results[0].result)
            }
        })
    } else {
        res.end(
            JSON.stringify({
                code: 102,
                message: 'query ikey is null',
                data: null
            })
        )
    }
}
