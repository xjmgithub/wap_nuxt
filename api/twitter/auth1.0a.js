/* 
** oauth1.0a的认证过程参考了开源项目
** https://github.com/ddo/oauth-1.0a
**/

const crypto = require('crypto')

exports.getNonce = function() {
    const word_characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''

    for (let i = 0; i < 32; i++) {
        result += word_characters[parseInt(Math.random() * word_characters.length, 10)]
    }

    return result
}

exports.getSignature = function(request_data, oauth_data, oauth_secret) {
    const baseString =
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
    const base_string_data = sortObject(percentEncodeData(oauth_data))

    let data_str = ''

    // base_string_data to string
    for (let i = 0; i < base_string_data.length; i++) {
        const key = base_string_data[i].key
        const value = base_string_data[i].value
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
                }
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
    const result = {}

    for (const key in data) {
        let value = data[key]
        // check if the value is an array
        if (value && Array.isArray(value)) {
            const newValue = []
            // percentEncode every value
            value.forEach(
                function(val) {
                    newValue.push(percentEncode(val))
                }
            )
            value = newValue
        } else {
            value = percentEncode(value)
        }
        result[percentEncode(key)] = value
    }

    return result
}

exports.toHeader = function(oauth_data) {
    const sorted = sortObject(oauth_data)

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
    const keys = Object.keys(data)
    const result = []

    keys.sort()

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        result.push({
            key: key,
            value: data[key]
        })
    }

    return result
}
