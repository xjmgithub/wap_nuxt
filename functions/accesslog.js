// 服务器访问日志 access log
export default function(req, res) {
    let str = ''
    const _COOKIE = {}
    const _HEADER = req.headers
    _HEADER.cookie &&
        _HEADER.cookie.split(';').forEach(Cookie => {
            const parts = Cookie.split('=')
            _COOKIE[parts[0].trim()] = (parts[1] || '').trim()
        })
    const start = new Date()

    const resend = res.end.bind(res)
    res.end = function() {
        const ret = resend.apply(res, arguments)
        const end = new Date()

        str += ' ' + (_HEADER['x-real-ip'] || req.connection.remoteAddress || '-') // remote_addr
        str += ' ' + req.method // request method
        str += ' ' + encode(req.url) // request url
        str += ' ' + (req.connection.encrypted ? 'HTTPS' : 'HTTP') // protocol
        str += ' ' + req.httpVersion // HTTP1.0 / HTTP1.1
        str += ' ' + res.statusCode // response statuscode
        str += ' ' + encode(_HEADER.referer || '-') // referer
        str += ' ' + (_COOKIE.deviceId || '-') // deviceid
        str += ' ' + (_COOKIE.country || '-') // country
        str += ' ' + (_COOKIE.token || '-') // token
        str += ' ' + (_COOKIE.gtoken || '-') // gtoken
        str += ' ' + (_COOKIE.lang || '-') // lang
        str += ' ' + encode(_HEADER['user-agent'] || '-') // user-agent
        str += ' ' + encode(req.headers['x-forwarded-for'] || req.connection.remoteAddress || '-') // x-forwarded
        str += ' ' + (end - start) // response time

        console.log(str) // 可以指定特定的日志文件
        return ret
    }
}

function encode(s) {
    return s.replace(/\\/g, '\\x5C').replace(/"/, '\\x22')
}
