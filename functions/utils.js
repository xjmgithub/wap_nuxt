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
    let value = document.cookie.replace(
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
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) return decodeURIComponent(r[2])
    return null
}

export const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

export const shareInvite = (link, shareTitle, shareContent, tabName, voteName) => {
    let shareLink = '' //TODO 图片地址
    if (link.indexOf('?') > 0) {
        link += '&utm_source=startimes_app&utm_medium=share&utm_campaign=' + voteName + '_' + tabName
    } else {
        link += '?utm_source=startimes_app&utm_medium=share&utm_campaign=' + voteName + '_' + tabName
    }
    if (window.getChannelId && window.getChannelId.showCustorm) {
        let content = '【' + shareTitle + '】' + shareContent + link
        window.getChannelId.showCustorm(content, link, link, link, link, link, link, shareLink, voteName)
    }
}

export const initGoogleLogin = (elm, callback) => {
    // google sign in
    // https://developers.google.com/identity/sign-in/web/build-button
    // !!! need element is mounted
    let googleUser = {}
    let script = document.createElement('script')
    let host = window.location.host
    let client_id

    // credentials generate from https://developers.google.com/identity/sign-in/web/sign-in
    if (host.indexOf('localhost') >= 0) {
        client_id = '461626275431-dlisbhgbpdnb7044lmtr73jrdpcf8uo6.apps.googleusercontent.com'
    } else if (host.indexOf('qa') >= 0) {
        client_id = '461626275431-ta9fp4nqgn6ubs1cuksc5ruuq9vd80c1.apps.googleusercontent.com'
    } else if (host.indexOf('dev') >= 0) {
        client_id = '461626275431-clalb6djdkk80if7ajo7maatoviom3c6.apps.googleusercontent.com'
    } else if (host.indexOf('staging') >= 0) {
        client_id = '461626275431-h61qm78g5df8vt6jrirdvsms1c2dvm8v.apps.googleusercontent.com'
    } else {
        client_id = '461626275431-hqm5jvacsn8i5m2tu5md1rqdbqrlsbt2.apps.googleusercontent.com'
    }

    script.src = 'https://apis.google.com/js/platform.js'

    script.onload = function() {
        gapi.load('auth2', function() {
            var auth2 = gapi.auth2.init({
                client_id: client_id,
                cookiepolicy: 'single_host_origin'
            })
            auth2.attachClickHandler(
                elm,
                {},
                function(googleUser) {
                    // parse user info
                    // https://developers.google.com/identity/sign-in/web/people
                    let profile = googleUser.getBasicProfile()
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
    FB.init({
        appId: '159785064477978',
        xfbml: true,
        cookie: true,
        version: 'v3.1'
    })
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
        .catch(err => {
            this.$alert('Download error.Please retry.')
        })
}

export const login = (v, opt) => {
    v.$axios.post('/ums/v3/user/login', opt).then(res => {
        res.data.code != 0 && v.$alert(res.data.message)
        let token = res.data.data.token
        v.$axios
            .get('/cms/users/me', {
                headers: {
                    token: token
                }
            })
            .then(res => {
                res.status != 200 && v.$alert(res.data.message)

                let user = res.data
                v.$store.commit('SET_TOKEN', token)
                v.$store.commit('SET_USER', user)

                setCookie('token', token)
                localStorage.setItem('user', JSON.stringify(user))
                let pre = sessionStorage.getItem('login_prefer') || ''
                if (pre) {
                    window.location.href = pre
                } else {
                    v.$router.replace('/browser')
                }
            })
            .catch(error => {
                v.$alert('Get user info error.')
            })
    })
}

export const getFaqBlockLogLabel = ins => {
    return (
        (ins.$store.state.country.id || '') +
        '_' +
        (ins.$store.state.user.id || '') +
        '_' +
        ((ins.service && ins.service.order_info && ins.service.order_info.order_type) || '') +
        '_' +
        ((ins.service && ins.service.order_info && ins.service.order_info.id) || '') +
        '_' +
        (ins.$store.state.user.smartCartCount?1:0) +
        '_' +
        ((ins.$store.state.user.activationInfo && ins.$store.state.user.activationInfo.ottStatus)?1:0)
    )
}
