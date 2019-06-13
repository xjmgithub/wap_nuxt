import qs from 'qs'
import dayjs from 'dayjs'
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
    const userId = query.userId
    const questionId = query.questionId
    const answerId = query.answerId

    if (userId && quizId && questionId && answerId) {
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
        connection.query(
            `INSERT INTO quiz_match_result (user_id,fk_match,fk_question,fk_answer,create_time) VALUES (${userId}, ${quizId},${questionId},${answerId},"${now}")`,
            function(error, results) {
                if (error) {
                    res.end(
                        JSON.stringify({
                            code: 103,
                            message: 'error',
                            data: error
                        })
                    )
                } else {
                    res.end(
                        JSON.stringify({
                            code: 200,
                            message: 'success',
                            data: results.insertId
                        })
                    )
                }
            }
        )
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
