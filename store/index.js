import crypto from 'crypto'
import versionMap from '~/functions/appversion.js'
import LANG from '~/languages/'

export const state = () => ({
    deviceId: '',
    token: '',
    appType: 0, // 0 others 1 android_app 2 ios_app
    appVersion: '-1',
    country: {},
    gaClientId: '',
    lang: {},
    shadowStatus: false,
    payToken:''
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
    SET_COUNTRY: function(state, obj) {
        state.country = obj
    },
    SET_GA_CLIENT: function(state, id) {
        state.gaClientId = id
    },
    SET_APP_VERSION: function(state, v) {
        state.appVersion = v
    },
    SHOW_SHADOW_LAYER: function(state) {
        state.shadowStatus = true
    },
    HIDE_SHADOW_LAYER: function(state) {
        state.shadowStatus = false
    },
    SET_PAYTOKEN: function(state,token){
        state.payToken = token
    }
}

export const actions = {
    // nuxtServerInit is called by Nuxt.js before server-rendering every page
    async nuxtServerInit({ commit }, { req, res }) {
        let _COOKIE = {}
        req.headers.cookie &&
            req.headers.cookie.split(';').forEach(Cookie => {
                var parts = Cookie.split('=')
                _COOKIE[parts[0].trim()] = (parts[1] || '').trim()
            })

        let language = req.headers['http_lncode'] || req.headers['accept-language']
        if (language.indexOf('fr') >= 0) {
            commit('SET_LANG', LANG.fy)
        } else if (language.indexOf('sw') >= 0) {
            commit('SET_LANG', LANG.sy)
        } else if (language.indexOf('pt') >= 0) {
            commit('SET_LANG', LANG.py)
        } else {
            commit('SET_LANG', LANG.en)
        }

        // set deviceId  TODO set cookie for deviceid
        if (req.headers['http_deviceid']) {
            commit('SET_DEVICE', req.headers['http_deviceid'])
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

        if (req.headers['http_token']) {
            commit('SET_TOKEN', req.headers['http_token'])
        } else {
            if (_COOKIE['token']) {
                commit('SET_TOKEN', _COOKIE['token'])
                commit('SET_COUNTRY', {
                    id: _COOKIE['countryId'],
                    short: _COOKIE['country']
                })
            } else {
                let res = await this.$axios.post('/ums/v1/user/login', {
                    // TODO mock ip
                    applicationId: 1,
                    deviceType: 1,
                    deviceId: 'A0001',
                    timeZoneId: 'Asia/Shanghai',
                    versionCode: '-99',
                    type: '-1'
                })
                if (res.data.code == 0) {
                    commit('SET_TOKEN', res.data.data.token)
                    commit('SET_COUNTRY', {
                        id: res.data.data.countryId,
                        short: res.data.data.country
                    })
                } else {
                    console.log(err)
                }
            }
        }

        // APP TYPE
        if (req.headers['http_client'] == 'android') {
            commit('SET_APPTYPE', 1)
        } else if (req.headers['http_client'] == 'ios') {
            commit('SET_APPTYPE', 2)
        } else {
            commit('SET_APPTYPE', 0)
        }

        if (req.headers['http_cid']) {
            commit('SET_GA_CLIENT', req.headers['http_cid'])
        }

        if (req.headers['http_versionname']) {
            commit('SET_APP_VERSION', req.headers['http_versionname'])
        } else {
            if (req.headers['http_versioncode'] && versionMap[req.headers['http_versioncode']]) {
                commit('SET_APP_VERSION', versionMap[req.headers['http_versioncode']])
            }
        }
    }
}
