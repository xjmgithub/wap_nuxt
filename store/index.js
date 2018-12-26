import crypto from 'crypto'
import versionMap from '~/functions/appversion.js'
import LANG from '~/languages/'
import { preload, preload6, lookup } from '~/functions/geoip.js'
import tokenMap from '~/functions/token.json'
import countryArr from '~/functions/countrys.json'
import { getRandomInt } from '~/functions/utils.js'

let countryMap = new Object()
countryArr.forEach(item => {
    countryMap[item.country] = item
})

export const state = () => ({
    deviceId: '',
    token: '',
    appType: 0, // 0 others 1 android_app 2 ios_app
    appVersion: '-1',
    appVersionCode: '-1',
    gaClientId: '',
    lang: {},
    shadowStatus: false,
    payToken: '',
    user: null,
    txNo: '',
    country: {},
    selectCompId: 0,
    netType: 0,
    carrier: '',
    phoneModel: '',
    intervalTimer: null,
    rankList:[]
})

export const mutations = {
    SET_LANG: function(state, lang) {
        state.lang = lang
    },
    SET_DEVICE: function(state, deviceId) {
        state.deviceId = deviceId
    },
    SET_TOKEN: function(state, token) {
        state.token = token
    },
    SET_APPTYPE: function(state, type) {
        state.appType = type
    },
    SET_GA_CLIENT: function(state, id) {
        state.gaClientId = id
    },
    SET_APP_VERSION: function(state, v) {
        state.appVersion = v
    },
    SET_APP_VERSION_CODE: function(state, v) {
        state.appVersionCode = v
    },
    SHOW_SHADOW_LAYER: function(state) {
        state.shadowStatus = true
    },
    HIDE_SHADOW_LAYER: function(state) {
        state.shadowStatus = false
    },
    SET_PAYTOKEN: function(state, token) {
        state.payToken = token
    },
    SET_USER: function(state, user) {
        state.user = user
    },
    SET_PAYTOKEN: function(state, payToken) {
        state.payToken = payToken
    },
    SET_TXNO: function(state, txNo) {
        state.txNo = txNo
    },
    SET_AREA_INFO: function(state, conf) {
        state.country = conf
    },
    ADD_SELECT_COMP: function(state, val) {
        state.selectCompId = val
    },
    SET_NET_TYPE: function(state, val) {
        state.netType = val
    },
    SET_CARRIER: function(state, val) {
        state.carrier = val
    },
    SET_PHONE_MODEL: function(state, val) {
        state.phoneModel = val
    },
    SET_TIMER: function(state, val) {
        state.intervalTimer = val
    },
    SET_RANKLIST: function(state, val) {
        let [...arr] = val
        state.rankList = arr
    }
}

export const actions = {
    async nuxtServerInit({ commit }, { req, res, query }) {
        let _COOKIE = {}
        req.headers.cookie &&
            req.headers.cookie.split(';').forEach(Cookie => {
                var parts = Cookie.split('=')
                _COOKIE[parts[0].trim()] = (parts[1] || '').trim()
            })

        // set language
        let language = req.headers['lncode'] || req.headers['accept-language']
        if (language.indexOf('fr') >= 0) {
            commit('SET_LANG', LANG.fy)
        } else if (language.indexOf('sw') >= 0) {
            commit('SET_LANG', LANG.sy)
        } else if (language.indexOf('pt') >= 0) {
            commit('SET_LANG', LANG.py)
        } else {
            commit('SET_LANG', LANG.en)
        }

        // set deviceId plugins to set cookie
        if (req.headers['deviceid']) {
            commit('SET_DEVICE', req.headers['deviceid'])
        } else {
            if (_COOKIE['deviceId']) {
                commit('SET_DEVICE', _COOKIE['deviceId'])
            } else {
                let md5 = crypto.createHash('md5')
                let str =
                    req.connection['remoteAddress'] +
                    req.connection['remotePort'] +
                    req.headers['user-agent'] +
                    req.headers['accept-encoding'] +
                    req.headers['accept-language']
                let result = md5.update(str).digest('hex')
                commit('SET_DEVICE', result)
            }
        }

        if (req.headers['client'] == 'android') {
            commit('SET_APPTYPE', 1)
        } else if (req.headers['client'] == 'ios') {
            commit('SET_APPTYPE', 2)
        } else {
            commit('SET_APPTYPE', 0)
        }

        if (req.headers['cid']) {
            commit('SET_GA_CLIENT', req.headers['cid'])
        }

        if (req.headers['versioncode']) {
            commit('SET_APP_VERSION_CODE', req.headers['versioncode'])
        } else {
            commit('SET_APP_VERSION_CODE', -99)
        }

        if (req.headers['versionname']) {
            commit('SET_APP_VERSION', req.headers['versionname'])
        } else {
            if (req.headers['versioncode'] && versionMap[req.headers['versioncode']]) {
                commit('SET_APP_VERSION', versionMap[req.headers['versioncode']])
            }
        }

        if (req.headers['network']) {
            commit('SET_NET_TYPE', req.headers['network'])
        }

        if (req.headers['x_carrier']) {
            commit('SET_CARRIER', req.headers['x_carrier'])
        }

        if (req.headers['phonemodel']) {
            commit('SET_PHONE_MODEL', req.headers['phonemodel'])
        }

        preload()
        preload6()
        let country = 'NG'
        if (query.sarea) {
            country = query.sarea.toUpperCase()
        } else {
            let ip = req.headers['x-forwarded-for']
            let geo = lookup(ip)
            if (geo) {
                country = geo.country
            }
        }

        if (!countryMap[country]) {
            country = 'NG'
        }

        if (req.headers['token']) {
            commit('SET_TOKEN', req.headers['token'])
        } else {
            if (_COOKIE['token']) {
                commit('SET_TOKEN', _COOKIE['token'])
            } else {
                commit('SET_TOKEN', tokenMap[country])
            }
        }
        await this.$axios
            .get('/cms/users/me', {
                headers: {
                    token: this.state.token
                }
            })
            .then(res => {
                if (res.status == 200) {
                    commit('SET_USER', res.data)
                    countryArr.forEach(item => {
                        if (item.id == res.data.areaID) {
                            country = item.country
                        }
                    })
                } else {
                    commit('SET_USER', { id: getRandomInt(1000000000, 2000000000) })
                }
            })
            .catch(error => {
                commit('SET_USER', { id: getRandomInt(1000000000, 2000000000) })
            })

        commit('SET_AREA_INFO', countryMap[country])
    }
}
