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
    const quizId = query.quizId

    if (quizId) {
        connection.query(`SELECT * FROM quiz_match_question WHERE fk_match="${quizId}"`, function(error, results) {
            if (error) {
                res.end(
                    JSON.stringify({
                        code: 104,
                        message: 'search error',
                        data: error
                    })
                )
            } else {
                console.log(results)

                res.end(JSON.stringify({
                    code: 200,
                    message: '123',
                    data: ''
                }))
            }
        })
    } else {
        res.end(
            JSON.stringify({
                code: 102,
                message: 'query quizId is null',
                data: null
            })
        )
    }
}
