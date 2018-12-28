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

export const shareInvite = (link, shareTitle, shareContent, tabName,voteName) => {
    let shareLink = '' //TODO 图片地址
    if (link.indexOf('?') > 0) {
        link += '&utm_source=startimes_app&utm_medium=share&utm_campaign='+ voteName +'_'+ tabName
    } else {
        link += '?utm_source=startimes_app&utm_medium=share&utm_campaign='+ voteName +'_'+ tabName
    }
    if (window.getChannelId && window.getChannelId.showCustorm) {
        let content = '【' + shareTitle + '】' + shareContent + link
        window.getChannelId.showCustorm(content, link, link, link, link, link, link, shareLink, voteName)
    }
}
