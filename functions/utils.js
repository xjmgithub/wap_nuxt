import CallApp from 'callapp-lib'

export const setCookie = (name, value, end, path, domain, secure) => {
    if (!name) {
        return false
    }
    let expires = ''
    if (end) {
        switch (end.constructor) {
            case Number:
                expires = end === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + end
                break
            case String:
                expires = '; expires=' + end
                break
            case Date:
                expires = '; expires=' + end.toUTCString()
                break
        }
    }
    document.cookie =
        encodeURIComponent(name) +
        '=' +
        encodeURIComponent(value) +
        expires +
        (domain ? '; domain=' + domain : '') +
        (path ? '; path=' + path : ';path=/') +
        (secure ? '; secure' : '')
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

export const shareInvite = (link, shareTitle, shareContent, tabName, voteName) => {
    const shareLink = '' // TODO 图片地址
    if (link.indexOf('?') > 0) {
        link += '&utm_source=startimes_app&utm_medium=share&utm_campaign=' + voteName + '_' + tabName
    } else {
        link += '?utm_source=startimes_app&utm_medium=share&utm_campaign=' + voteName + '_' + tabName
    }
    if (window.getChannelId && window.getChannelId.showCustorm) {
        const content = '【' + shareTitle + '】' + shareContent + link
        window.getChannelId.showCustorm(content, link, link, link, link, link, link, shareLink, voteName)
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

export const initFacebookLogin = () => {
    // eslint-disable-next-line no-undef
    FB.init({
        appId: '159785064477978',
        xfbml: true,
        cookie: true,
        version: 'v3.1'
    })
    // eslint-disable-next-line no-undef
    FB.AppEvents.logPageView()
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
