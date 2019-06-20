import DB from '../db.js'
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: DB.host,
    user: DB.user,
    password: DB.password,
    database: 'wap'
})

export const runSql = (res, cmd, callback) => {
    connection.query(cmd, function(error, item) {
        if (error) {
            res.end(
                JSON.stringify({
                    code: 191,
                    message: 'error',
                    data: error
                })
            )
        } else {
            callback && callback(item)
        }
    })
}
