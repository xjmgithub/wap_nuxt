const url = require('url')
const queryString = require('querystring')
const https = require('https')
const axios = require('axios')
const auth = require('./auth1.0a')
const oauth_secret = 'zc3RWN8Jp58CowGZm8wjxstMQHspDxpC9EVcmHdW82gZnVpIfN'
const request_data = {
    url: 'https://api.twitter.com/oauth/access_token',
    method: 'POST'
}

export default function(req, res, next) {
    const args = url.parse(req.url).query
    const query = queryString.parse(args)

    const oauth_data = {
        oauth_consumer_key: 'JdwbwCJH1XF4kspuF3Qoz03PI',
        oauth_nonce: auth.getNonce(),
        oauth_token: query.oauth_token,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_verifier: query.oauth_verifier,
        oauth_timestamp: parseInt(new Date().getTime() / 1000, 10),
        oauth_version: '1.0'
    }
    oauth_data.oauth_signature = auth.getSignature(request_data, oauth_data, oauth_secret)
    axios({
        url: request_data.url,
        method: request_data.method,
        headers: auth.toHeader(oauth_data),
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    })
        .then(resFromTwitter => {
            const data = resFromTwitter.data.split('&')
            const json = {}
            data.forEach(item => {
                const s = item.split('=')
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
            res.end(
                JSON.stringify({
                    code: 104,
                    message: 'access_token get error',
                    data: null
                })
            )
        })
}
