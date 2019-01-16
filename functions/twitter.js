let axios = require('axios')
let crypto = require('crypto')
const OAuth = require('oauth-1.0a')
let timer = Math.floor(new Date().getTime() / 1000)

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

let oauth_data = {
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'POST'
}

console.log(oauth.toHeader(oauth.authorize(oauth_data)))

axios({
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'POST',
    headers: oauth.toHeader(oauth.authorize(oauth_data))
}).then(res => {
    console.log(res.data)
})
