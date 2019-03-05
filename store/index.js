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
    appType: 0, // 0 others 1 android 2 ios
    deviceId: '',
    lang: {},
    langType: 'en',
    gaClientId: '',
    appVersionCode: '-1',
    appVersion: '-1',
    netType: 0,
    carrier: '',
    appInitTime: new Date().getTime(),
    token: '',
    gtoken: '', // 匿名token，用于网关验证
    user: null,
    country: {},
    txNo: '',
    shadowStatus: false,
    payToken: '',
    selectCompId: 0,
    phoneModel: '',
    intervalTimer: null,
    rankList: [],
    serverTime: new Date(),
    navState: false,
    needLoginAlert: false
})

export const mutations = {
    SET_APPTYPE: function(state, type) {
        switch (type) {
            case 'android':
                state.appType = 1
                break
            case 'ios':
                state.appType = 2
                break
            default:
                state.appType = 0
        }
    },
    SET_DEVICE: function(state, deviceId) {
        state.deviceId = deviceId || ''
    },
    SET_LANG: function(state, lang='en') {
        state.langType = lang
        if (lang.indexOf('fr') >= 0) {
            state.lang = LANG.fy
        } else if (lang.indexOf('sw') >= 0) {
            state.lang = LANG.sy
        } else if (lang.indexOf('pt') >= 0) {
            state.lang = LANG.py
        } else {
            state.lang = LANG.en
        }
    },
    SET_GA_CLIENT: function(state, id) {
        state.gaClientId = id || ''
    },
    SET_APP_VERSION_CODE: function(state, v) {
        state.appVersionCode = v || -99
    },
    SET_APP_VERSION: function(state, v) {
        state.appVersion = v || 'unknown'
    },
    SET_NET_TYPE: function(state, val) {
        state.netType = val || 0
    },
    SET_CARRIER: function(state, val) {
        state.carrier = val || ''
    },
    SET_PHONE_MODEL: function(state, val) {
        state.phoneModel = val || ''
    },
    SET_INIT_TIME: function(state, val) {
        state.appInitTime = val || new Date().getTime()
    },
    SET_TOKEN: function(state, token) {
        state.token = token
    },
    SET_GTOKEN: function(state, token) {
        state.gtoken = token
    },
    SET_USER: function(state, user) {
        state.user = user
    },
    SET_AREA_INFO: function(state, conf) {
        state.country = conf
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
    SET_TXNO: function(state, txNo) {
        state.txNo = txNo
    },
    ADD_SELECT_COMP: function(state, val) {
        state.selectCompId = val
    },
    SET_TIMER: function(state, val) {
        state.intervalTimer = val
    },
    SET_RANKLIST: function(state, val) {
        let [...arr] = val
        state.rankList = arr
    },
    SET_SERVER_TIME: function(state, val) {
        state.serverTime = val
    },
    SET_NAV_STATE: function(state, val) {
        state.navState = val
    },
    SET_NEED_LOGIN: function(state, val) {
        state.needLoginAlert = val
    }
}

export const actions = {
    async nuxtServerInit({ commit, state }, { req, res, query }) {
        let _COOKIE = {}
        let _HEADER = req.headers

        _HEADER.cookie &&
            _HEADER.cookie.split(';').forEach(Cookie => {
                let parts = Cookie.split('=')
                _COOKIE[parts[0].trim()] = (parts[1] || '').trim()
            })

        let language = _HEADER['lncode'] || _COOKIE['lang'] || _HEADER['accept-language']

        let str =
            req.connection['remoteAddress'] +
            req.connection['remotePort'] +
            _HEADER['user-agent'] +
            _HEADER['accept-encoding'] +
            _HEADER['accept-language']
        let newDevice = crypto
            .createHash('md5')
            .update(str)
            .digest('hex')

        // com.star.mobile.video/src/com/star/mobile/video/activity/BrowserActivity.java
        commit('SET_APPTYPE', _HEADER['client'])
        commit('SET_DEVICE', _HEADER['deviceid'] || _COOKIE['deviceId'] || newDevice)
        commit('SET_LANG', language)
        commit('SET_GA_CLIENT', _HEADER['cid'])
        commit('SET_APP_VERSION_CODE', _HEADER['versioncode'])
        commit('SET_NET_TYPE', _HEADER['network'])
        commit('SET_CARRIER', _HEADER['operator'])
        commit('SET_PHONE_MODEL', _HEADER['phonemodel'])
        commit('SET_INIT_TIME', _HEADER['startTime'])
        commit('SET_APP_VERSION', _HEADER['versionname'] || (_HEADER['versioncode'] && versionMap[_HEADER['versioncode']]))

        // TODO 是否可以只加载一次
        preload()
        preload6()
        let country = 'NG'
        let ip = _HEADER['x-forwarded-for']
        let geo = lookup(ip)
        if (_COOKIE['country']) {
            country = _COOKIE['country']
        } else {
            if (geo) {
                country = countryMap[geo.country] ? geo.country : 'NG'
            }
        }

        const getMe = async token => {
            await this.$axios
                .get('/cms/users/me', {
                    headers: {
                        token: token
                    }
                })
                .then(res => {
                    if (res.status == 200) {
                        commit('SET_USER', res.data)
                    } else {
                        commit('SET_USER', { id: getRandomInt(1000000000, 2000000000) })
                    }
                })
                .catch(error => {
                    commit('SET_USER', { id: getRandomInt(1000000000, 2000000000) })
                })
        }

        if (_HEADER['token']) {
            commit('SET_TOKEN', _HEADER['token'])
            commit('SET_GTOKEN', _HEADER['token'])
        } else {
            if (_COOKIE['token']) {
                commit('SET_TOKEN', _COOKIE['token'])
            } else {
                commit('SET_TOKEN', tokenMap[country])
            }
            if (_COOKIE['gtoken']) {
                commit('SET_GTOKEN', _COOKIE['gtoken'])
            } else {
                commit('SET_GTOKEN', tokenMap[country])
            }
        }

        await getMe(state.token)
        if (state.user.countryCode&&countryMap[state.user.countryCode]) {
            commit('SET_AREA_INFO', countryMap[state.user.countryCode])
        } else {
            if(countryMap[country]){
                commit('SET_AREA_INFO', countryMap[country])
            }else{
                commit('SET_AREA_INFO', countryMap['NG'])
            }
        }
    }
}
