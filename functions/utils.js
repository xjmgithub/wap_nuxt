export const setCookie = (name, value, end, path, domain, secure) => {
    if (!name) {
        return false
    }
    let expires = ''
    if (end) {
        switch (end.constructor) {
            case Number:
                expires =
                    end === Infinity
                        ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
                        : '; max-age=' + end
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
        new RegExp(
            '(?:(?:^|.*;)\\s*' +
                encodeURIComponent(name).replace(/[\-\.\+\*]/g, '\\$&') +
                '\\s*\\=\\s*([^;]*).*$)|^.*$'
        ),
        '$1'
    )
    return decodeURIComponent(value) || null
}

export const delCookie = name => {
    document.cookie = name + '=; Max-Age=-99999999;'
}

export const initUser = (token, id, obj) => {
    // browser surport server unsurport
    if (!token || !id || !obj) return false
    setCookie('token', token)
    setCookie('userid', id)
    window.localStorage.setItem('user', JSON.stringify(obj))
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
    v.$axios
        .get(`/mobilewallet/v1/accounts/${account}/prop-details`)
        .then(res => {
            localStorage.setItem('wallet_config', JSON.stringify(res.data))
            if (callback) callback(res.data)
        })
}

export const toNativePage = (page) => {
    if (page.indexOf('com.star.mobile.video')>=0) {
        // TODO toAppPage 参数确定
        window.getChannelId && window.getChannelId.toAppPage(3, page, '')
    } else {
        window.location.href = page
    }
}
