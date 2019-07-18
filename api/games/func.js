import axios from 'axios'
import env from '../../env.js'
import qs from 'qs'

export const getCookieFromReq = function(headers) {
    if (headers && headers.cookie) {
        const _COOKIE = {}
        headers.cookie.split(';').forEach(Cookie => {
            const parts = Cookie.split('=')
            _COOKIE[parts[0].trim()] = (parts[1] || '').trim()
        })
        return _COOKIE
    } else {
        return {}
    }
}

export const getUserMe = function(token, callback) {
    return axios
        .get(`${env.apiURL}cms/users/me`, {
            headers: {
                token: token || ''
            }
        })
        .then(res => {
            const userId = res.data.id
            const countryId = res.data.areaID
            const userAvatar = res.data.head
            callback && callback(userId, countryId, userAvatar)
        })
}

export const addCoins = function(token, userId, coins, des, callback) {
    if (!token || !userId || isNaN(coins) || coins <= 0 || !des) {
        callback && callback()
        return
    }

    axios({
        url: `/promotion-service/coins/add`,
        method: 'post',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            token: token
        },
        data: qs.stringify({
            userId: userId,
            coins: coins,
            description: des
        })
    }).then(res => {
        callback && callback(res)
    })
}
export const delCoins = function(token, userId, coins, des, callback) {
    if (!token || !userId || isNaN(coins) || coins <= 0 || !des) {
        callback && callback()
        return
    }

    axios({
        url: `/promotion-service/coins/sub`,
        method: 'post',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            token: token
        },
        data: qs.stringify({
            userId: userId,
            coins: coins,
            description: des
        })
    }).then(res => {
        callback && callback(res)
    })
}
