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
    const userId = query.userId

    if (quizId) {
        connection.query(`SELECT * FROM quiz_match_question WHERE fk_match="${quizId}"`, function(error, questionList) {
            if (error) {
                res.end(
                    JSON.stringify({
                        code: 104,
                        message: 'search error',
                        data: error
                    })
                )
            } else {
                const questionIds = []
                const now = new Date()
                questionList.forEach(item => {
                    if (now < new Date(item.start_time)) {
                        item.state = 'unstart'
                    } else if (now > new Date(item.end_time)) {
                        if (item.result) {
                            item.state = 'ended'
                        } else {
                            item.state = 'closed'
                        }
                    } else {
                        item.state = 'progress'
                    }
                    questionIds.push(item.id)
                })
                connection.query(`SELECT * FROM quiz_match_answer WHERE fk_question in (${questionIds.toString()})`, function(error, anwsers) {
                    if (error) {
                        res.end(
                            JSON.stringify({
                                code: 104,
                                message: 'search error',
                                data: error
                            })
                        )
                    } else {
                        const answerIds = []
                        anwsers.forEach(anwser => {
                            answerIds.push(anwser.id)
                        })

                        connection.query(
                            `SELECT fk_answer,count(*) as num FROM quiz_match_result WHERE fk_answer in (${answerIds.toString()}) group by fk_answer`,
                            function(error, nums) {
                                if (error) {
                                    res.end(
                                        JSON.stringify({
                                            code: 104,
                                            message: 'search error',
                                            data: error
                                        })
                                    )
                                } else {
                                    connection.query(`SELECT * FROM quiz_match_result WHERE user_id=${userId} AND fk_match=${quizId}`, function(
                                        error,
                                        user
                                    ) {
                                        if (error) {
                                            res.end(
                                                JSON.stringify({
                                                    code: 104,
                                                    message: 'search error',
                                                    data: error
                                                })
                                            )
                                        } else {
                                            const numObj = {}
                                            const userObj = {}
                                            nums.forEach(item => {
                                                numObj[item.fk_answer] = item.num
                                            })

                                            user.forEach(item => {
                                                userObj[item.fk_question] = item.fk_answer
                                            })

                                            anwsers.forEach(item => {
                                                item.count = numObj[item.id] || 0
                                            })

                                            questionList.forEach(item => {
                                                const arr = []
                                                anwsers.forEach(anwser => {
                                                    if (anwser.fk_question == item.id) {
                                                        arr.push(anwser)
                                                    }
                                                })
                                                item.guess = userObj[item.id] || ''
                                                item.anwsers = arr
                                            })

                                            res.end(
                                                JSON.stringify({
                                                    code: 200,
                                                    message: 'success',
                                                    data: questionList
                                                })
                                            )
                                        }
                                    })
                                }
                            }
                        )
                    }
                })
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
