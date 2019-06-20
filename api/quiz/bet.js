import qs from 'qs'
import dayjs from 'dayjs'
import { runSql } from '../../functions/mysql.js'

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const quizId = query.quizId
    const userId = query.userId
    const questionId = query.questionId
    const answerId = query.answerId
    if (userId && quizId && questionId && answerId) {
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const nowTime = dayjs()
        runSql(res, `SELECT id FROM quiz_match_result WHERE user_id="${userId}" AND fk_match="${quizId}" AND fk_question="${questionId}"`, item => {
            if (item.length > 0) {
                res.end(
                    JSON.stringify({
                        code: 105,
                        message: 'you have guess this question',
                        data: ''
                    })
                )
            } else {
                runSql(res, `SELECT start_time,end_time FROM quiz_match_question WHERE id="${questionId}"`, question => {
                    if (dayjs(question[0].start_time) > nowTime) {
                        res.end(
                            JSON.stringify({
                                code: 104,
                                message: 'This bet not started',
                                data: ''
                            })
                        )
                        return
                    }
                    if (dayjs(question[0].end_time) < nowTime) {
                        res.end(
                            JSON.stringify({
                                code: 105,
                                message: 'This bet is closed.',
                                data: ''
                            })
                        )
                        return
                    }

                    runSql(
                        res,
                        `INSERT INTO quiz_match_result (user_id,fk_match,fk_question,fk_answer,create_time) VALUES (${userId}, ${quizId},${questionId},${answerId},"${now}")`,
                        results => {
                            res.end(
                                JSON.stringify({
                                    code: 200,
                                    message: 'success',
                                    data: results.insertId
                                })
                            )
                        }
                    )
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
