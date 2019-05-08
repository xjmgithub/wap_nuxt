import CallApp from 'callapp-lib'
import { Base64 } from 'js-base64'
import localforage from 'localforage'
import dayjs from 'dayjs'

export const setCookie = (name, value, time) => {
    if (!name) {
        return false
    }
    let now = new Date().getTime()
    if (time) {
        now = now + time
    } else {
        now = now + 1000 * 60 * 60 * 24 * 7
    }

    const expires = '; expires=' + new Date(now).toUTCString()

    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + expires + '; domain=;path=/'
    return true
}

export const getCookie = name => {
    const value = document.cookie.replace(
        // eslint-disable-next-line no-useless-escape
        new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(name).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'),
        '$1'
    )
    return decodeURIComponent(value) || null
}

export const delCookie = name => {
    document.cookie = name + '=; Max-Age=-99999999;'
}

export const updateWalletAccount = (v, callback) => {
    v.$axios.get('/mobilewallet/v1/accounts/me').then(res => {
        if (res.data) {
            localStorage.setItem('wallet_account', JSON.stringify(res.data))
        }
        if (callback) callback(res.data)
    })
}

export const updateWalletConf = (v, account, callback) => {
    v.$axios.get(`/mobilewallet/v1/accounts/${account}/prop-details`).then(res => {
        localStorage.setItem('wallet_config', JSON.stringify(res.data))
        if (callback) callback(res.data)
    })
}

export const toNativePage = page => {
    if (page.indexOf('com.star.mobile.video') >= 0) {
        // TODO toAppPage 参数确定
        window.getChannelId && window.getChannelId.toAppPage(3, page, '')
    } else {
        window.location.href = page
    }
}

export const getQuery = name => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    const r = window.location.search.substr(1).match(reg)
    if (r !== null) return decodeURIComponent(r[2])
    return null
}

export const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

export const shareInvite = (link, shareTitle, shareContent, shareImg, channel) => {
    if (link.indexOf('?') > 0) {
        link += '&utm_source=startimes_app&utm_medium=share&utm_campaign=' + channel
    } else {
        link += '?utm_source=startimes_app&utm_medium=share&utm_campaign=' + channel
    }
    if (window.getChannelId && window.getChannelId.showCustorm) {
        const content = '【' + shareTitle + '】' + shareContent + ' ' + link
        window.getChannelId.showCustorm(content, link, link, link, link, link, link, shareImg || '', channel)
    }
}

export const initGoogleLogin = (elm, callback) => {
    // google sign in
    // https://developers.google.com/identity/sign-in/web/build-button
    // !!! need element is mounted
    const script = document.createElement('script')
    const host = window.location.host
    let clientId

    // credentials generate from https://developers.google.com/identity/sign-in/web/sign-in
    if (host.indexOf('localhost') >= 0) {
        clientId = '461626275431-dlisbhgbpdnb7044lmtr73jrdpcf8uo6.apps.googleusercontent.com'
    } else if (host.indexOf('qa') >= 0) {
        clientId = '461626275431-ta9fp4nqgn6ubs1cuksc5ruuq9vd80c1.apps.googleusercontent.com'
    } else if (host.indexOf('dev') >= 0) {
        clientId = '461626275431-clalb6djdkk80if7ajo7maatoviom3c6.apps.googleusercontent.com'
    } else if (host.indexOf('staging') >= 0) {
        clientId = '461626275431-h61qm78g5df8vt6jrirdvsms1c2dvm8v.apps.googleusercontent.com'
    } else {
        clientId = '461626275431-hqm5jvacsn8i5m2tu5md1rqdbqrlsbt2.apps.googleusercontent.com'
    }

    script.src = 'https://apis.google.com/js/platform.js'

    script.onload = function() {
        // eslint-disable-next-line no-undef
        gapi.load('auth2', function() {
            // eslint-disable-next-line no-undef
            const auth2 = gapi.auth2.init({
                clientId: clientId,
                cookiepolicy: 'single_host_origin'
            })
            auth2.attachClickHandler(
                elm,
                {},
                function(googleUser) {
                    // parse user info
                    // https://developers.google.com/identity/sign-in/web/people
                    const profile = googleUser.getBasicProfile()
                    callback(profile.getId(), profile.getName())
                },
                function(error) {
                    console.log(JSON.stringify(error, undefined, 2))
                }
            )
        })
    }
    if (!window.gapi) {
        document.getElementsByTagName('head')[0].appendChild(script)
    }
}

export const downloadApk = app => {
    app.$axios
        .get('/cms/public/app')
        .then(res => {
            let url = res.data.apkUrl
            if (url) {
                if (url.indexOf('google') > 0) {
                    url = url.replace('google', 'officialWap')
                }

                window.location.href = url
            } else {
                this.$alert('Download error.Please retry.')
            }
        })
        .catch(() => {
            this.$alert('Download error.Please retry.')
        })
}

export const login = (v, opt) => {
    v.$axios.post('/ums/v3/user/login', opt).then(res => {
        res.data.code !== 0 && v.$alert(res.data.message)
        const token = res.data.data.token
        v.$axios
            .get('/cms/users/me', {
                headers: {
                    token: token
                }
            })
            .then(res => {
                res.status !== 200 && v.$alert(res.data.message)

                const user = res.data
                v.$store.commit('SET_TOKEN', token)
                v.$store.commit('SET_USER', user)

                setCookie('token', token)
                localStorage.setItem('user', JSON.stringify(user))
                const pre = sessionStorage.getItem('login_prefer') || ''
                if (pre) {
                    window.location.href = pre
                } else {
                    v.$router.replace('/browser')
                }
            })
            .catch(() => {
                v.$alert('Get user info error.')
            })
    })
}

export const formatAmount = num => {
    if (!isNaN(num)) {
        const arr = num.toString().split('.')
        if (arr[1]) {
            return arr[0].toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,') + '.' + arr[1]
        } else {
            return arr[0].toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,') + '.00'
        }
    } else {
        return ''
    }
}
export const formatTime = val => {
    if (val < 3600) {
        const min = Math.floor(val / 60) < 10 ? '0' + Math.floor(val / 60) : Math.floor(val / 60)
        const sec = Math.floor(val % 60) < 10 ? '0' + Math.floor(val % 60) : Math.floor(val % 60)
        return min + ':' + sec
    } else if (val >= 3600) {
        const hour = Math.floor(val / 3600) < 10 ? '0' + Math.floor(val / 3600) : Math.floor(val / 3600)
        const min = Math.floor((val % 3600) / 60) < 10 ? '0' + Math.floor((val % 3600) / 60) : Math.floor((val % 3600) / 60)
        const sec = Math.floor(val % 60) < 10 ? '0' + Math.floor(val % 60) : Math.floor(val % 60)
        return hour + ':' + min + ':' + sec
    }
}
// client 端使用
export const parseUA = (isApp, appversion) => {
    let dstr = ''
    if (isApp === 1 || isApp === 2) {
        const system = isApp === 1 ? 'android' : 'ios'
        dstr = 'APP(' + system + ',' + appversion + ')'
        dstr += ';H5(' + system
        if (isApp === 1) {
            const s = navigator.userAgent.indexOf('Android')
            if (s > 0) {
                dstr += '_' + navigator.userAgent.substr(s + 8).split(';')[0]
            }
        } else {
            const s = navigator.userAgent.indexOf('iPhone OS')
            if (s > 0) {
                dstr += '_' + navigator.userAgent.substr(s + 10).split(' ')[0]
            }
        }
        dstr += ', Chrome'
        const b = navigator.userAgent.indexOf('Version')
        const c = navigator.userAgent.indexOf('Chrome')
        if (b > 0) {
            const s = navigator.userAgent
                .substr(b)
                .split(' ')[1]
                .split('/')[1]
            if (s) {
                dstr += '_' + s
            }
        } else if (c > 0) {
            const s = navigator.userAgent
                .substr(c)
                .split(' ')[0]
                .split('/')[1]
            if (s) {
                dstr += '_' + s
            }
        }
        dstr += ')'
    } else {
        let plat = 'others'
        if (navigator.userAgent.indexOf('Android') > 0) {
            plat = 'android'
        } else if (navigator.userAgent.indexOf('iPhone') > 0) {
            plat = 'ios'
        }
        dstr = 'H5(' + plat + ', MQQBrowser'
        const b = navigator.userAgent.indexOf('Version')
        const c = navigator.userAgent.indexOf('Chrome')
        if (b > 0) {
            const s = navigator.userAgent
                .substr(b)
                .split(' ')[1]
                .split('/')[1]
            if (s) {
                dstr += '_' + s
            }
        } else if (c > 0) {
            const s = navigator.userAgent
                .substr(c)
                .split(' ')[0]
                .split('/')[1]
            if (s) {
                dstr += '_' + s
            }
        }
        dstr += ')'
    }
    return dstr
}
export const getFaqBlockLogLabel = function() {
    return (
        (this.$store.state.country.id || '') +
        '_' +
        (this.$store.state.user.id || '') +
        '_' +
        ((this.order && this.order.order_type) || '') +
        '_' +
        ((this.order && this.order.order_no) || '') +
        '_' +
        (this.$store.state.user.smartCartCount ? 1 : 0) +
        '_' +
        (this.$store.state.user.activationInfo && this.$store.state.user.activationInfo.ottStatus ? 1 : 0)
    )
}

export const getFaqLogLabel = function() {
    return (
        (this.$store.state.country.id || '') +
        '_' +
        (this.$store.state.user.id || '') +
        '_' +
        (this.$store.state.user.smartCartCount ? 1 : 0) +
        '_' +
        (this.$store.state.user.activationInfo && this.$store.state.user.activationInfo.ottStatus ? 1 : 0)
    )
}

export const getFaqAnswerLabel = function(question) {
    return (
        (this.$store.state.country.id || '') +
        '_' +
        (this.$store.state.user.id || '') +
        '_' +
        (question || '') +
        '_' +
        (this.$store.state.user.smartCartCount ? 1 : 0) +
        '_' +
        (this.$store.state.user.activationInfo && this.$store.state.user.activationInfo.ottStatus ? 1 : 0)
    )
}

export const downApp = function() {
    let scheme = 'starvideo'
    let failback = ''
    const _this = this
    const ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('iphone') >= 0 || ua.indexOf('ipad') >= 0) {
        scheme = 'startimes'
        failback = 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'
    }
    const callLib = new CallApp({
        scheme: {
            protocol: scheme
        }
    })
    callLib.open({
        path: 'platformapi/webtoapp',
        callback() {
            if (failback) {
                window.location.href = failback
            } else {
                _this.$axios.get('/cms/public/app').then(res => {
                    _this.sendEvLog({
                        category: document.title,
                        action: 'install_activated',
                        label: UAType() + '_2',
                        value: 1
                    })
                    let url = res.data.apkUrl
                    if (url) {
                        if (url.indexOf('google') > 0) {
                            url = url.replace('google', 'officialWap')
                        }
                        window.location.href = url
                    }
                    
                })
            }
        }
    })
}

export const shareFacebook = function() {
    // eslint-disable-next-line no-undef
    FB.ui({
        method: 'share',
        display: 'popup',
        href: window.location.href
    })
}
export const toAppStore = function(page) {
    const ua = navigator.userAgent.toLowerCase()
    const _this = this

    let source = ''
    let scheme = 'starvideo'
    let appType = 1
    let path = 'platformapi/webtoapp'
    if (page) {
        path = path + '?target=' + Base64.encode(page.replace(/&/g, '**'))
    }

    if (ua.indexOf('iphone') >= 0 || ua.indexOf('ipad') >= 0) {
        scheme = 'startimes'
        appType = 2
        // path = '?player?vod='+ page
    }

    const callLib = new CallApp({
        scheme: {
            protocol: scheme
        }
    })

    callLib.open({
        path: path,
        callback() {
            if (location.href.indexOf('referrer') > 0) {
                source = location.search
            } else if (location.href.indexOf('utm_source') > 0) {
                source = '&referrer=' + encodeURIComponent(location.search.substr(1))
            } else {
                source = '&' + location.search.substr(1)
            }

            _this.sendEvLog({
                category: _this.vote_name,
                action: 'downloadpopup_show',
                label: '',
                Value: 1
            })

            _this.$confirm(
                appType == 1 ? _this.$store.state.lang.mrright_download_android : _this.$store.state.lang.mrright_download_ios,
                () => {
                    _this.sendEvLog({
                        category: _this.vote_name,
                        action: 'downloadpopup_click',
                        label: 'go',
                        Value: 1
                    })
                    window.location.href =
                        appType == 1
                            ? 'market://details?id=com.star.mobile.video' + source
                            : 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'
                },
                () => {
                    _this.sendEvLog({
                        category: _this.vote_name,
                        action: 'downloadpopup_click',
                        label: 'not now',
                        Value: 1
                    })
                },
                _this.$store.state.lang.mrright_go,
                _this.$store.state.lang.mrright_not_now
            )
        }
    })
}

export const playVodinApp = function(appType, vod) {
    if (appType == 1) {
        window.getChannelId && window.getChannelId.toAppPage(3, 'com.star.mobile.video.player.PlayerVodActivity?vodId=' + vod, '')
    } else if (appType == 2) {
        window.location.href = 'startimes://player?vodId=' + vod
    } else {
        downApp()
    }
}

export const animateCSS = function(element, animationName, callback) {
    const node = element

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)
        node.removeEventListener('webkitAnimationEnd', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
    node.addEventListener('webkitAnimationEnd', handleAnimationEnd)
    node.classList.add('animated', animationName)
}

export const cdnPicSrc = function(src) {
    if (src) {
        const app = (this.$store && this.$store.state.appType) || 0
        if (app <= 0 || (window && window.indexedDB)) {
            return src.replace('http:', 'https:')
        } else {
            return src
        }
    } else {
        return ''
    }
}

export const cacheDateUpdate = function(callback) {
    localforage
        .getItem('dbtime')
        .then(val => {
            if (val) {
                if (val != dayjs(this.serverTime).format('YYYY-MM-DD')) {
                    // DELETE CACHE
                    localforage.clear().then(() => {
                        localforage.setItem('dbtime', dayjs(this.serverTime).format('YYYY-MM-DD'))
                        callback && callback()
                    })
                } else {
                    callback && callback()
                }
            } else {
                localforage.setItem('dbtime', dayjs(this.serverTime).format('YYYY-MM-DD'))
                callback && callback()
            }
        })
        .catch(err => {
            this.$alert(err)
        })
}

export const initDB = function() {
    localforage.config({
        driver: [localforage.WEBSQL, localforage.LOCALSTORAGE], // indexDB在android4.4上保存不全
        name: 'StarTimes'
    })
}

export const normalToAppStore = function(page, pos) {
    const ua = navigator.userAgent.toLowerCase()
    const _this = this

    let scheme = 'starvideo'
    let appType = 1
    let path = 'platformapi/webtoapp'
    if (page) {
        path = path + '?target=' + Base64.encode(page.replace(/&/g, '**'))
    }

    if (ua.indexOf('iphone') >= 0 || ua.indexOf('ipad') >= 0) {
        scheme = 'startimes'
        appType = 2
    }

    const callLib = new CallApp({
        scheme: {
            protocol: scheme
        }
    })

    callLib.open({
        path: path,
        callback() {
            if (appType == 2) {
                window.location.href = 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'
            } else {
                _this.$axios.get('/cms/public/app').then(res => {
                    _this.sendEvLog({
                        category: document.title,
                        action: 'install_activated',
                        label: UAType() + '_' + (pos || 1),
                        value: 1
                    })
                    let url = res.data.apkUrl
                    if (url) {
                        if (url.indexOf('google') > 0) {
                            url = url.replace('google', 'officialWap')
                        }
                        window.location.href = url
                    }
                })
            }
        }
    })
}

export const UAType = function() {
    const ua = navigator.userAgent
    return ua.includes('iPhone') || ua.includes('iPad') ? 2 : 1
}
