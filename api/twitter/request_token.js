/* oauth1.0a的认证过程参考了开源项目 */

const axios = require('axios')
const crypto = require('crypto')
const https = require('https')

const oauth_secret = 'zc3RWN8Jp58CowGZm8wjxstMQHspDxpC9EVcmHdW82gZnVpIfN'

const request_data = {
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'POST'
}

function getNonce() {
    let word_characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''

    for (let i = 0; i < 32; i++) {
        result += word_characters[parseInt(Math.random() * word_characters.length, 10)]
    }

    return result
}

function getSignature(oauth_data) {
    let baseString =
        request_data.method.toUpperCase() + '&' + percentEncode(request_data.url.split('?')[0]) + '&' + percentEncode(getParameterString(oauth_data))
    return crypto
        .createHmac('sha1', percentEncode(oauth_secret) + '&')
        .update(baseString)
        .digest('base64')
}

function percentEncode(str) {
    return encodeURIComponent(str)
        .replace(/\!/g, '%21')
        .replace(/\*/g, '%2A')
        .replace(/\'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
}

function getParameterString(oauth_data) {
    let base_string_data = sortObject(percentEncodeData(oauth_data))

    let data_str = ''

    //base_string_data to string
    for (let i = 0; i < base_string_data.length; i++) {
        let key = base_string_data[i].key
        let value = base_string_data[i].value
        // check if the value is an array
        // this means that this key has multiple values
        if (value && Array.isArray(value)) {
            // sort the array first
            value.sort()

            let valString = ''
            // serialize all values for this key: e.g. formkey=formvalue1&formkey=formvalue2
            value.forEach(
                function(item, i) {
                    valString += key + '=' + item
                    if (i < value.length) {
                        valString += '&'
                    }
                }.bind(this)
            )
            data_str += valString
        } else {
            data_str += key + '=' + value + '&'
        }
    }

    data_str = data_str.substr(0, data_str.length - 1)
    return data_str
}

function percentEncodeData(data) {
    let result = {}

    for (let key in data) {
        let value = data[key]
        // check if the value is an array
        if (value && Array.isArray(value)) {
            let newValue = []
            // percentEncode every value
            value.forEach(
                function(val) {
                    newValue.push(percentEncode(val))
                }.bind(this)
            )
            value = newValue
        } else {
            value = percentEncode(value)
        }
        result[percentEncode(key)] = value
    }

    return result
}

function toHeader(oauth_data) {
    let sorted = sortObject(oauth_data)

    let header_value = 'OAuth '

    for (let i = 0; i < sorted.length; i++) {
        if (sorted[i].key.indexOf('oauth_') !== 0) continue

        header_value += percentEncode(sorted[i].key) + '="' + percentEncode(sorted[i].value) + '", '
    }
    return {
        Authorization: header_value.substr(0, header_value.length - 2)
    }
}

function sortObject(data) {
    let keys = Object.keys(data)
    let result = []

    keys.sort()

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        result.push({
            key: key,
            value: data[key]
        })
    }

    return result
}

export default function(req, res, next) {
    let oauth_data = {
        oauth_consumer_key: 'JdwbwCJH1XF4kspuF3Qoz03PI',
        oauth_nonce: getNonce(),
        oauth_callback: 'http://localhost:3000/hybrid/account/login',
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: parseInt(new Date().getTime() / 1000, 10),
        oauth_version: '1.0'
    }
    oauth_data.oauth_signature = getSignature(oauth_data)
    axios({
        url: request_data.url,
        method: request_data.method,
        headers: toHeader(oauth_data),
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
            res.end(
                JSON.stringify({
                    code: 101,
                    message: 'request token from twitter error!',
                    data: null
                })
            )
        })
}
