import crypto from 'crypto'
import axios from 'axios'
import redis from 'redis'
import env from '../../env.js'

const client = redis.createClient({
    host: env.redisHost,
    port: env.redisPort
})

export default function(req, res, next) {
    const keyStr =
        req.connection.remoteAddress +
        req.headers['x-forwarded-for'].split(',')[0] +
        req.headers['user-agent'] +
        (req.headers['accept-language'] || '')

    const newDevice = crypto
        .createHash('md5')
        .update(keyStr)
        .digest('hex')
    client.get('wap:vote:' + newDevice, (err, reply) => {
        if (err) {
            res.end(
                JSON.stringify({
                    code: 500,
                    message: 'cache error',
                    data: ''
                })
            )
            return
        }
        console.log('wap:vote:' + newDevice, reply)
        if (reply) {
            res.end(
                JSON.stringify({
                    code: 200,
                    message: 'success',
                    data: reply
                })
            )
        } else {
            axios
                .get(`${env.apiURL}voting/v1/token`, {
                    headers: {
                        token:
                            'eyJhbGciOiJIUzUxMiJ9.eyJhcHAiOjEsInVpZCI6MTIzNSwiY2NvZGUiOiJUWiIsInJvbGUiOjIsImRldiI6ImFuZG9yaWRfNERBQ0ZBQzYtNUM5OS00NUY0LUI0NzEtQjNDRTY1MEIwRUNDIiwiY3JlYXRlZCI6MTUyNDczNDI4MTAyNiwiZXhwIjoxODQwMDk0MjgxLCJjaWQiOjN9.hl9TS3duu8A0dUKas2UhKZewGEda2K-3fppPRuIgOxsM0F4dB0EqlocifN53Xawqn0AhUgpriwdglZkHxaVzQA'
                    }
                })
                .then(res1 => {
                    client.set('wap:vote:' + newDevice, res1.data.data, 'EX', 60 * 60 * 24 * 7)
                    res.end(
                        JSON.stringify({
                            code: 200,
                            message: 'success',
                            data: res1.data.data
                        })
                    )
                })
                .catch(err => {
                    res.end(
                        JSON.stringify({
                            code: 204,
                            message: err,
                            data: err
                        })
                    )
                })
        }
    })
}
