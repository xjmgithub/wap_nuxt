import axios from 'axios'
import qs from 'qs'
import env from '../../env.js'

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
        .get(`${env.apiURL}vup/v1/ums/users/me`, {
            headers: {
                token: token || ''
            }
        })
        .then(res => {
            callback && callback(res.data)
        })
        .catch(() => {
            callback && callback()
        })
}

export const addCoins = function(token, userId, coins, des, callback) {
    if (!token || !userId || isNaN(coins) || coins <= 0 || !des) {
        callback && callback()
        return
    }

    axios({
        url: `${env.apiURL}promotion-service/coins/add`,
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
        url: `${env.apiURL}promotion-service/coins/sub`,
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

export const getMyCoins = function(token, userId, callback) {
    if (!token || !userId) {
        callback && callback()
        return
    }
    axios({
        url: `${env.apiURL}promotion-service/v2/user/coins?userId=${userId}`,
        method: 'get',
        headers: {
            token: token
        }
    })
        .then(res => {
            callback && callback(res.data && res.data.coins)
        })
        .catch(err => {
            console.log(err)
            callback()
        })
}
