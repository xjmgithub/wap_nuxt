import qs from 'qs'
import axios from 'axios'
import env from '../../env.js'
import {getRandomInt} from '../../functions/utils'
export default function(req, res, next) {
    let data = ''
    req.on('data', function(d) {
        data += d
    })
    req.on('end', function() {
        const formType = req.headers['content-type'] && req.headers['content-type'].indexOf('json') >= 0
        const getBodyData = getPostData(data, formType)
        const voteId = getBodyData.vote_id || 12
        const userId = getBodyData.user_id
        const ticketsNum = getRandomInt(1,6)
        console.log(ticketsNum)
        axios
            .get(`${env.apiURL}voting/v1/token`, {
                headers: {
                    token:
                        'eyJhbGciOiJIUzUxMiJ9.eyJhcHAiOjEsInVpZCI6MTIzNSwiY2NvZGUiOiJUWiIsInJvbGUiOjIsImRldiI6ImFuZG9yaWRfNERBQ0ZBQzYtNUM5OS00NUY0LUI0NzEtQjNDRTY1MEIwRUNDIiwiY3JlYXRlZCI6MTUyNDczNDI4MTAyNiwiZXhwIjoxODQwMDk0MjgxLCJjaWQiOjN9.hl9TS3duu8A0dUKas2UhKZewGEda2K-3fppPRuIgOxsM0F4dB0EqlocifN53Xawqn0AhUgpriwdglZkHxaVzQA'
                }
            })
            .then(res1 => {
                axios({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        token:
                            'eyJhbGciOiJIUzUxMiJ9.eyJhcHAiOjEsInVpZCI6MTIzNSwiY2NvZGUiOiJUWiIsInJvbGUiOjIsImRldiI6ImFuZG9yaWRfNERBQ0ZBQzYtNUM5OS00NUY0LUI0NzEtQjNDRTY1MEIwRUNDIiwiY3JlYXRlZCI6MTUyNDczNDI4MTAyNiwiZXhwIjoxODQwMDk0MjgxLCJjaWQiOjN9.hl9TS3duu8A0dUKas2UhKZewGEda2K-3fppPRuIgOxsM0F4dB0EqlocifN53Xawqn0AhUgpriwdglZkHxaVzQA',
                        'X-Secret': res1.data.data
                    },
                    data: qs.stringify({
                        vote_id: voteId,
                        target: userId,
                        action: `LOTTERY_${ticketsNum}`
                    }),
                    url: `${env.apiURL}voting/v1/ticket`
                })
                    .then(res2 => {
                        res.end(
                            JSON.stringify({
                                code: '200',
                                message: 'success',
                                data: ticketsNum
                            })
                        )
                    })
                    .catch(err => {
                        res.end(
                            JSON.stringify({
                                code: '121',
                                message: err
                            })
                        )
                    })
            })
            .catch(err => {
                res.end(
                    JSON.stringify({
                        code: '121',
                        message: err
                    })
                )
            })
    })
}

function getPostData(data, isjson) {
    if (isjson) {
        return JSON.parse(data)
    } else {
        return qs.parse(data)
    }
}
