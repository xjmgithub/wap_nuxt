let axios = require('axios')
let crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const https = require('https')

const oauth = OAuth({
    consumer: { key: 'JdwbwCJH1XF4kspuF3Qoz03PI', secret: 'zc3RWN8Jp58CowGZm8wjxstMQHspDxpC9EVcmHdW82gZnVpIfN' },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
    }
})

export default function(req, res, next) {
    let oauth_data = {
        url: 'https://api.twitter.com/oauth/request_token',
        method: 'POST'
    }

    axios({
        url: oauth_data.url,
        method: oauth_data.method,
        headers: oauth.toHeader(oauth.authorize(oauth_data)),
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    })
        .then(resFromTwitter => {
            let data = resFromTwitter.data.split('&')
            let json = {}
            data.forEach(item => {
                let s = item.split('=')
                json[s[0]] = s[1]
            })
            res.end(
                JSON.stringify({
                    code: 0,
                    message: '',
                    data: json
                })
            )
        })
        .catch(err => {
            res.end(JSON.stringify({
                code: 101,
                message: 'request token from twitter error!',
                data: null
            }))
        })
}
